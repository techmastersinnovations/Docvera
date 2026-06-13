from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.admin.models import AuditLog, Payout, SystemSettings
from apps.admin.permissions import IsAdminUser
from apps.doctors.models import Doctor


class AdminPagination(PageNumberPagination):
    page_size = 20


class DoctorManagementView(APIView, AdminPagination):
    permission_classes = [IsAdminUser]

    def get(self, request):
        queryset = Doctor.objects.all().order_by('-created_at')

        # Filtering logic
        specialization = request.query_params.get('specialization')
        if specialization:
            queryset = queryset.filter(specialization=specialization)

        status_param = request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        approval_status = request.query_params.get('approval_status')
        if approval_status:
            queryset = queryset.filter(approval_status=approval_status)

        results = self.paginate_queryset(queryset, request)

        # Import here to avoid circular imports
        from apps.doctors.serializers import DoctorSerializer
        serializer = DoctorSerializer(results, many=True)
        return self.get_paginated_response(serializer.data)


class DoctorActionView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, doctor_id):
        doctor = get_object_or_404(Doctor, user_id=doctor_id)
        action = request.data.get('action')  # APPROVE, REJECT, SUSPEND, ACTIVATE
        reason = request.data.get('reason', '')

        # Handle Advanced Doctor Management
        if action == 'APPROVE':
            doctor.approval_status = 'APPROVED'
            doctor.is_verified = True
        elif action == 'REJECT':
            doctor.approval_status = 'REJECTED'
            doctor.rejection_reason = reason
        elif action == 'SUSPEND':
            doctor.status = 'SUSPENDED'
            doctor.user.is_suspended = True
            doctor.user.save()
        elif action == 'ACTIVATE':
            doctor.status = 'ACTIVE'
            doctor.user.is_suspended = False
            doctor.user.save()
        else:
            return Response({"success": False, "error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        doctor.save()

        # Trigger Audit Log
        AuditLog.objects.create(
            admin_user=request.user,
            action=f"DOCTOR_{action}",
            target_object_id=doctor.user.id,
            details={"doctor_name": doctor.full_name, "reason": reason}
        )

        return Response({"success": True, "message": f"Doctor {action.lower()} processed successfully."})


class PayoutManagementView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        payouts = Payout.objects.all().order_by('-created_at')
        data = [{
            "id": str(p.id),
            "doctor_id": str(p.doctor.id),
            "amount": str(p.amount),
            "status": p.status,
            "created_at": p.created_at
        } for p in payouts]
        return Response({"success": True, "data": data})

    def post(self, request, payout_id):
        payout = get_object_or_404(Payout, id=payout_id)
        payout.status = 'PAID'
        payout.save()

        # Trigger Audit Log
        AuditLog.objects.create(
            admin_user=request.user,
            action="PAYOUT_PROCESSED",
            target_object_id=payout.id,
            details={"amount": str(payout.amount), "doctor_id": str(payout.doctor.id)}
        )

        return Response({"success": True, "message": "Payout marked as paid."})


class SystemSettingsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        settings = SystemSettings.objects.all().values('key', 'value', 'description')
        return Response({"success": True, "data": settings})

    def post(self, request):
        key = request.data.get('key')
        value = request.data.get('value')
        description = request.data.get('description', '')

        if not key or not value:
            return Response({"success": False, "error": "Key and value are required"},
                            status=status.HTTP_400_BAD_REQUEST)

        setting, created = SystemSettings.objects.update_or_create(
            key=key,
            defaults={'value': value, 'description': description}
        )

        # Trigger Audit Log
        AuditLog.objects.create(
            admin_user=request.user,
            action="SETTING_UPDATED",
            target_object_id=request.user.id,
            details={"key": key, "new_value": value}
        )

        return Response({"success": True, "message": "System settings updated."})