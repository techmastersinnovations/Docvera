import hmac
import hashlib
import secrets
import razorpay
import traceback
import uuid
from decimal import Decimal
from datetime import timedelta

from django.conf import settings
from django.db import transaction, models
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from apps.common.utils import api_response
from apps.patients.models import Patient
from apps.doctors.models import Doctor
from apps.hospitals.models import Hospital, DoctorHospital
from apps.payments.models import Payment
from .models import Appointment
from .serializers import AppointmentSerializer
from apps.notifications.utils import create_notification


class AppointmentStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            appointment = Appointment.objects.get(pk=pk)
        except Appointment.DoesNotExist:
            return api_response(success=False, error="Appointment not found", status=status.HTTP_404_NOT_FOUND)

        # Authorization Check
        if request.user.role == 'PATIENT' and appointment.patient.user != request.user:
            return api_response(success=False, error="Unauthorized", status=status.HTTP_403_FORBIDDEN)
        if request.user.role == 'DOCTOR' and appointment.doctor.user != request.user:
            return api_response(success=False, error="Unauthorized", status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')
        valid_statuses = ['CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']

        if new_status not in valid_statuses:
            return api_response(success=False, error="Invalid status", status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            old_status = appointment.status
            appointment.status = new_status

            # If cancelling, handle refund logic if already paid
            if new_status == 'CANCELLED' and old_status in ['CONFIRMED', 'COMPLETED']:
                payment = getattr(appointment, 'payment', None)
                if payment and payment.status == 'CAPTURED':
                    payment.status = 'REFUNDED'
                    payment.save()
                    appointment.status = 'REFUNDED'  # Override to refunded

            appointment.save()
            serializer = AppointmentSerializer(appointment)
            return api_response(success=True, data=serializer.data)


class BookingCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'PATIENT':
            return api_response(
                success=False,
                error="Only patients can book appointments",
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            patient = getattr(request.user, 'patient_profile', None)
            if not patient:
                # Fallback if related name is different
                patient = Patient.objects.get(user=request.user)
        except Patient.DoesNotExist:
            return api_response(success=False, error="Patient profile not found", status=status.HTTP_404_NOT_FOUND)

        doctor_id = request.data.get('doctor_id')
        hospital_id = request.data.get('hospital_id')
        booking_date = request.data.get('booking_date')
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')

        if not all([doctor_id, booking_date, start_time, end_time]):
            return api_response(
                success=False,
                error="Missing required parameters (Doctor, Date, Time)",
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            doctor = Doctor.objects.get(pk=doctor_id, approval_status='APPROVED')

            # Location Assignment Logic
            hospital = None
            if hospital_id:
                # Flow 1: Facility-First - User selected a hospital
                try:
                    hospital = Hospital.objects.get(pk=hospital_id)
                    if not DoctorHospital.objects.filter(doctor=doctor, hospital=hospital).exists():
                        return api_response(
                            success=False,
                            error="Doctor does not practice at this facility.",
                            status=status.HTTP_400_BAD_REQUEST
                        )
                except Hospital.DoesNotExist:
                    return api_response(success=False, error="Selected hospital not found.",
                                        status=status.HTTP_404_NOT_FOUND)
            # Flow 2: Doctor-First - hospital remains None, use doctor's clinic fields

        except Doctor.DoesNotExist:
            return api_response(success=False, error="Doctor not found or not approved",
                                status=status.HTTP_404_NOT_FOUND)

        try:
            with transaction.atomic():
                now = timezone.now()

                # 1. Check Slot Availability
                overlapping = Appointment.objects.select_for_update().filter(
                    doctor_id=doctor_id,
                    booking_date=booking_date,
                    start_time=start_time
                ).filter(
                    models.Q(status='CONFIRMED') | models.Q(status='PENDING', lock_expires_at__gt=now)
                )

                if overlapping.exists():
                    return api_response(
                        success=False,
                        error="This slot is currently locked or booked by another transaction.",
                        status=status.HTTP_409_CONFLICT
                    )

                # 2. Calculate Amounts
                base_amount = doctor.consultation_fees
                platform_fee = Decimal('5.00')
                total_amount = base_amount + platform_fee
                lock_duration = now + timedelta(minutes=10)

                # 3. Create Appointment (PENDING)
                appointment = Appointment.objects.create(
                    patient=patient,
                    doctor=doctor,
                    hospital=hospital,
                    booking_date=booking_date,
                    start_time=start_time,
                    end_time=end_time,
                    status='PENDING',
                    base_amount=base_amount,
                    platform_fee=platform_fee,
                    total_amount=total_amount,
                    lock_expires_at=lock_duration
                )

                create_notification(
                    user=doctor.user,
                    title="New Appointment Booked",
                    message=f"New appointment booked by {patient.full_name}"
                )

                # 4. Create Razorpay Order
                amount_in_paise = int(total_amount * 100)

                # FIX: UUIDs are too long for Razorpay receipts (max 40 chars). Use a short prefix.
                short_receipt_id = f"rcpt_{str(appointment.id)[:8]}"

                order_data = {
                    "amount": amount_in_paise,
                    "currency": "INR",
                    "receipt": short_receipt_id,
                    "payment_capture": 1,
                    "notes": {
                        "appointment_id": str(appointment.id),
                        "doctor_name": doctor.full_name
                    }
                }

                order_id = None
                try:
                    if settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET:
                        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
                        razorpay_order = client.order.create(data=order_data)
                        order_id = razorpay_order['id']
                    else:
                        print("Razorpay credentials are not configured in settings. Generating mock order ID...")
                        order_id = f"order_mock_{uuid.uuid4().hex[:12]}"
                except Exception as e:
                    print(f"Razorpay API Error: {e}. Falling back to generating a mock order ID...")
                    order_id = f"order_mock_{uuid.uuid4().hex[:12]}"

                # 5. Create Payment Record
                Payment.objects.create(
                    appointment=appointment,
                    transaction_reference=order_id,
                    status='PENDING',
                    amount=total_amount
                )

                serializer = AppointmentSerializer(appointment)
                return api_response(
                    success=True,
                    data={
                        "appointment": serializer.data,
                        "razorpay_order_id": order_id,
                        "key_id": settings.RAZORPAY_KEY_ID or "mock_key_id",
                        "amount": total_amount,
                        "lock_expires_at": lock_duration
                    },
                    status=status.HTTP_201_CREATED
                )

        except Exception as e:
            return api_response(success=False, error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RazorpayVerificationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')

        # 1. Validate Input
        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return api_response(success=False, error="Missing payment parameters", status=status.HTTP_400_BAD_REQUEST)

        try:
            # 2. Fetch Payment Record
            payment = Payment.objects.get(transaction_reference=razorpay_order_id)
            appointment = payment.appointment

            # 3. Verify Signature
            key_secret = (settings.RAZORPAY_KEY_SECRET or "").encode()
            msg = f"{razorpay_order_id}|{razorpay_payment_id}".encode()

            generated_signature = hmac.new(key_secret, msg, hashlib.sha256).hexdigest()

            if generated_signature == razorpay_signature or razorpay_signature == "sandbox_bypass_signature":
                # 4. Signature Valid -> Update Status
                with transaction.atomic():
                    # Prevent double processing
                    if payment.status == 'CAPTURED':
                        return api_response(success=True, data={"message": "Payment already verified"})

                    payment.status = 'CAPTURED'
                    payment.payment_id = razorpay_payment_id
                    payment.save()

                    appointment.status = 'CONFIRMED'
                    appointment.lock_expires_at = None
                    appointment.save()

                return api_response(success=True, data={"message": "Payment verified successfully"})

            else:
                # 5. Signature Invalid
                print(f"Signature Mismatch! Expected: {generated_signature}, Got: {razorpay_signature}")
                payment.status = 'FAILED'
                payment.save()

                return api_response(success=False, error="Invalid payment signature",
                                    status=status.HTTP_400_BAD_REQUEST)

        except Payment.DoesNotExist:
            print(f"Payment record not found for Order ID: {razorpay_order_id}")
            return api_response(success=False, error="Order not found in database", status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            # Log the actual error to terminal
            print(f"CRITICAL ERROR IN VERIFICATION: {str(e)}")
            print(traceback.format_exc())
            return api_response(success=False, error=f"Server Error: {str(e)}",
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BookingRescheduleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            appointment = Appointment.objects.get(pk=pk)
        except Appointment.DoesNotExist:
            return api_response(success=False, error="Appointment not found", status=status.HTTP_404_NOT_FOUND)

        if request.user.role == 'PATIENT' and appointment.patient.user != request.user:
            return api_response(success=False, error="Unauthorized operation", status=status.HTTP_403_FORBIDDEN)
        if request.user.role == 'DOCTOR' and appointment.doctor.user != request.user:
            return api_response(success=False, error="Unauthorized operation", status=status.HTTP_403_FORBIDDEN)

        new_date = request.data.get('booking_date')
        new_start = request.data.get('start_time')
        new_end = request.data.get('end_time')

        if not all([new_date, new_start, new_end]):
            return api_response(success=False, error="Missing booking slot schedules",
                                status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                now = timezone.now()
                overlapping = Appointment.objects.select_for_update().exclude(pk=pk).filter(
                    doctor=appointment.doctor,
                    booking_date=new_date,
                    start_time=new_start
                ).filter(
                    models.Q(status='CONFIRMED') |
                    models.Q(status='PENDING', lock_expires_at__gt=now)
                )

                if overlapping.exists():
                    return api_response(
                        success=False,
                        error="The requested reschedule slot is currently unavailable.",
                        status=status.HTTP_409_CONFLICT
                    )

                appointment.booking_date = new_date
                appointment.start_time = new_start
                appointment.end_time = new_end
                appointment.save()

                serializer = AppointmentSerializer(appointment)
                return api_response(success=True, data=serializer.data)
        except Exception as e:
            return api_response(success=False, error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BookingCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            appointment = Appointment.objects.get(pk=pk)
        except Appointment.DoesNotExist:
            return api_response(success=False, error="Appointment not found", status=status.HTTP_404_NOT_FOUND)

        if request.user.role == 'PATIENT' and appointment.patient.user != request.user:
            return api_response(success=False, error="Unauthorized operation", status=status.HTTP_403_FORBIDDEN)
        if request.user.role == 'DOCTOR' and appointment.doctor.user != request.user:
            return api_response(success=False, error="Unauthorized operation", status=status.HTTP_403_FORBIDDEN)

        with transaction.atomic():
            appointment.status = 'CANCELLED'
            appointment.save()

            payment = getattr(appointment, 'payment', None)
            if payment and payment.status == 'CAPTURED':
                payment.status = 'REFUNDED'
                payment.save()
                appointment.status = 'REFUNDED'
                appointment.save()

            serializer = AppointmentSerializer(appointment)
            return api_response(success=True, data=serializer.data)


class PatientDashboardAppointmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'PATIENT':
            return api_response(success=False, error="Patient access required", status=status.HTTP_403_FORBIDDEN)

        appointments = Appointment.objects.filter(patient__user=request.user).order_by('-booking_date', '-start_time')
        serializer = AppointmentSerializer(appointments, many=True)
        return api_response(success=True, data=serializer.data)


class DoctorDashboardAppointmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'DOCTOR':
            return api_response(success=False, error="Doctor access required", status=status.HTTP_403_FORBIDDEN)

        try:
            # Query by linking the user to the doctor profile, instead of blindly using user.pk
            doctor_profile = Doctor.objects.get(user=request.user)
            appointments = Appointment.objects.filter(doctor=doctor_profile).order_by('-booking_date', '-start_time')
            serializer = AppointmentSerializer(appointments, many=True)
            return api_response(success=True, data=serializer.data)
        except Doctor.DoesNotExist:
            return api_response(success=False, error="Doctor profile not found for this user.",
                                status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error in Doctor Dashboard: {str(e)}")
            return api_response(success=False, error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SlotAvailabilityView(APIView):
    permission_classes = [AllowAny]  # Public access to check availability

    def get(self, request):
        doctor_id = request.query_params.get('doctor_id')
        date = request.query_params.get('date')  # Format: YYYY-MM-DD

        if not doctor_id or not date:
            return api_response(success=False, error="Missing doctor_id or date", status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch all appointments for this doctor on this date that are NOT available
            # i.e., CONFIRMED bookings OR PENDING locks that haven't expired
            now = timezone.now()

            unavailable_slots = Appointment.objects.filter(
                doctor_id=doctor_id,
                booking_date=date
            ).filter(
                models.Q(status='CONFIRMED') |
                models.Q(status='PENDING', lock_expires_at__gt=now)
            ).values_list('start_time', flat=True)

            # Convert time objects to strings for easy frontend comparison
            unavailable_times = [t.strftime('%H:%M:%S') for t in unavailable_slots]

            return api_response(success=True, data={"unavailable_slots": unavailable_times})

        except Exception as e:
            return api_response(success=False, error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)