"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader, ArrowLeft, MapPin, Calendar, Clock, AlertCircle, CheckCircle2, IndianRupee } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

import BookingReceipt from "@/components/booking/BookingReceipt";
import Navbar from "@/components/Navbar";

function BookingDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const doctorId = searchParams.get("doctor_id") || "";
  const hospitalIdFromUrl = searchParams.get("hospital_id");

  const [doctor, setDoctor] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<any>(null);
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appointmentData, setAppointmentData] = useState<any | null>(null);
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login?next=/booking?doctor_id=" + doctorId);
      return;
    }

    const fetchDoctor = async () => {
      try {
        setDoctor(null);
        setError(null);
        if (!doctorId || doctorId.trim() === "") return;

        const response = await api.get(`/doctors/search/?id=${doctorId}`);
        if (response.data.success && response.data.data) {
          const data = response.data.data;
          const doctorsList = Array.isArray(data) ? data : [data];
          const matchedDoctor = doctorsList.find(
            (doc: any) => String(doc.id) === String(doctorId) || String(doc.user) === String(doctorId)
          );
          if (matchedDoctor) {
            setDoctor(matchedDoctor);
          } else {
            setError("Requested medical provider could not be found.");
          }
        } else {
          setError("Requested medical provider could not be found.");
        }
      } catch (err) {
        console.error("Failed to load doctor profile:", err);
        setError("Failed to load doctor details.");
      }
    };
    fetchDoctor();
  }, [doctorId, router]);

  useEffect(() => {
    if (bookingDate && doctorId) {
      const fetchUnavailableSlots = async () => {
        try {
          const response = await api.get("/appointments/slots/availability/", {
            params: { doctor_id: doctorId, date: bookingDate }
          });
          if (response.data.success) {
            setUnavailableSlots(response.data.data.unavailable_slots);
          }
        } catch (err) {
          console.error("Failed to fetch slot availability", err);
        }
      };
      fetchUnavailableSlots();
    } else {
      setUnavailableSlots([]);
    }
  }, [bookingDate, doctorId]);

  const generateSlotsForDate = (dateStr: string) => {
    if (!dateStr || !doctor?.availabilities) return [];
    const dateObj = new Date(dateStr);
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const dayName = days[dateObj.getDay()];
    const dayAvailability = doctor.availabilities.find((av: any) => av.day_of_week === dayName);
    if (!dayAvailability) return [];

    const slots = [];
    const duration = dayAvailability.slot_duration_minutes || 15;
    const [startH, startM] = dayAvailability.start_time.split(':').map(Number);
    const [endH, endM] = dayAvailability.end_time.split(':').map(Number);

    let currentTime = new Date();
    currentTime.setHours(startH, startM, 0, 0);
    let endTime = new Date();
    endTime.setHours(endH, endM, 0, 0);

    const isSelectedDateToday = dateStr === today;
    const now = new Date();

    while (currentTime < endTime) {
      const timeLabel = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const slotStartTimeStr = currentTime.toTimeString().split(' ')[0];
      const slotEndTime = new Date(currentTime.getTime() + duration * 60000);

      let isDisabled = false;
      if (isSelectedDateToday && currentTime <= now) isDisabled = true;
      if (unavailableSlots.includes(slotStartTimeStr)) isDisabled = true;

      slots.push({
        label: timeLabel,
        start: slotStartTimeStr,
        end: slotEndTime.toTimeString().split(' ')[0],
        disabled: isDisabled
      });
      currentTime = new Date(currentTime.getTime() + duration * 60000);
    }
    return slots;
  };

  const availableSlots = bookingDate ? generateSlotsForDate(bookingDate) : [];

  const consultationFee = parseFloat(doctor?.consultation_fees || 0);
  const platformFee = 5.00;
  const platformTax = platformFee * 0.18;
  const baseTotalBeforeGateway = consultationFee + platformFee + platformTax;
  const gatewayCommission = baseTotalBeforeGateway * 0.0236;
  const totalFee = baseTotalBeforeGateway + gatewayCommission;

  const openRazorpayCheckout = (orderId: string, keyId: string, amount: number) => {
    if (orderId && orderId.startsWith("order_mock_")) {
      console.log("Mock Razorpay Order detected. Bypassing checkout and simulating payment...");
      const mockPaymentId = "pay_mock_" + Math.random().toString(36).substring(2, 11);
      (async () => {
        try {
          const verifyRes = await api.post("/appointments/verify-payment/", {
            razorpay_order_id: orderId,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: "sandbox_bypass_signature",
          });
          if (verifyRes.data.success) {
            setSuccess(true);
          } else {
            alert("Payment verification failed!");
            setError("Payment verification failed.");
          }
        } catch (err) {
          console.error(err);
          setError("Error verifying payment.");
        }
      })();
      return;
    }

    const options = {
      key: keyId,
      amount: Math.round(amount * 100),
      currency: "INR",
      name: "Docvera Health",
      description: "Consultation Fee Payment",
      order_id: orderId,
      handler: async function (response: any) {
        try {
          const verifyRes = await api.post("/appointments/verify-payment/", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (verifyRes.data.success) {
            setSuccess(true);
          } else {
            alert("Payment verification failed!");
            setError("Payment verification failed.");
          }
        } catch (err) {
          console.error(err);
          setError("Error verifying payment.");
        }
      },
      prefill: {
        name: doctor?.full_name || "",
        email: "",
        contact: "",
      },
      theme: { color: "#002D62" },
      modal: {
        ondismiss: function () {
          setError("Payment cancelled by user.");
        }
      }
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handleAcquireLock = async () => {
    setError(null);
    if (!bookingDate) return setError("Please select a date.");
    if (!selectedTimeSlot) return setError("Please select a time slot.");

    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await api.post(
        "/appointments/book/",
        {
          doctor_id: doctor.user,
          hospital_id: hospitalIdFromUrl || null,
          booking_date: bookingDate,
          start_time: selectedTimeSlot.start,
          end_time: selectedTimeSlot.end,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const { appointment, razorpay_order_id, key_id, amount } = response.data.data;
        setAppointmentData(appointment);
        openRazorpayCheckout(razorpay_order_id, key_id, parseFloat(amount));
      } else {
        setError(response.data.error || "Failed to lock slot.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] text-text space-y-4">
        <Loader className="animate-spin h-8 w-8 text-primary" />
        <p className="text-sm font-medium text-text-secondary">Loading doctor details...</p>
      </div>
    );
  }

  const locationTitle = hospitalIdFromUrl ? "Selected Facility" : "Consultation Location";
  const locationName = hospitalIdFromUrl ? appointmentData?.hospital_name : doctor.clinic_name;

  return (
    <div className="min-h-screen bg-card py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {success ? (
              <BookingReceipt
                appointmentData={appointmentData}
                doctor={doctor}
                consultationFee={consultationFee}
                platformFee={platformFee}
                totalFee={totalFee}
              />
            ) : (
              <div className="card p-6 sm:p-8 space-y-6">
                <div className="border-b border-border pb-6 flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-text">Dr. {doctor.full_name}</h2>
                    <p className="text-text-secondary">{doctor.specialization} &bull; {doctor.experience_years} Years Exp.</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-full text-xs font-semibold text-primary shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                    Secure Booking
                  </div>
                </div>

                {error && (
                  <div className="bg-error/5 border border-error/10 text-error px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text uppercase">{locationTitle}</label>
                  <div className="card p-4 flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-text-secondary mt-0.5 shrink-0" />
                    <div>
                      <h3 className="text-text font-semibold">{locationName || "Loading..."}</h3>
                      {!hospitalIdFromUrl && (
                        <>
                          <p className="text-sm text-text-secondary mt-1">{doctor.clinic_address}</p>
                          <p className="text-xs text-text-secondary mt-1">{doctor.clinic_city}, {doctor.clinic_pin_code}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text uppercase">Select Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      min={today}
                      value={bookingDate}
                      onChange={(e) => { setBookingDate(e.target.value); setSelectedTimeSlot(null); setError(null); }}
                      className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-3 text-text outline-none transition-colors"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-text uppercase">Available Slots</label>
                  </div>
                  {!bookingDate ? (
                    <div className="p-8 border border-dashed border-border rounded-xl text-center bg-surface/50">
                      <Clock className="h-8 w-8 text-text-muted mx-auto mb-2" />
                      <p className="text-sm text-text-secondary">Select a date to view available times.</p>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-4 bg-surface border border-border rounded-xl text-center">
                      <p className="text-text-secondary text-sm">No slots available for this day.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {availableSlots.map((slot: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => !slot.disabled && setSelectedTimeSlot(slot)}
                          disabled={slot.disabled}
                          className={`py-3 rounded-xl border text-sm font-semibold transition-all relative ${
                            slot.disabled
                              ? "bg-surface border-border text-text-muted cursor-not-allowed"
                              : selectedTimeSlot?.label === slot.label
                                ? "bg-primary border-primary text-foreground shadow-md"
                                : "bg-card border-border text-text-secondary hover:border-primary/50 hover:text-text"
                          }`}
                        >
                          {slot.label}
                          {slot.disabled && (
                            <div className="absolute inset-0 bg-card/60 flex items-center justify-center rounded-xl">
                              <span className="text-[10px] text-text-muted">Booked</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAcquireLock}
                  disabled={loading || !bookingDate || !selectedTimeSlot || selectedTimeSlot?.disabled}
                  className="w-full bg-primary text-foreground font-semibold py-4 rounded-xl hover:bg-primary-light transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 text-sm"
                >
                  {loading ? <Loader className="animate-spin h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                  <span>{loading ? "Securing Slot..." : `Confirm & Pay ₹${totalFee.toFixed(2)}`}</span>
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 card p-6 sm:p-8 space-y-6 h-fit sticky top-24">
            <h3 className="text-lg font-bold text-text">Booking Summary</h3>
            <div className="card p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Doctor</span>
                <span className="text-text font-medium">Dr. {doctor.full_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Consultation Fee</span>
                <span className="text-text font-medium">₹{consultationFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Platform Fee</span>
                <span className="text-text font-medium">₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Platform GST (18%)</span>
                <span className="text-text font-medium">₹{platformTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Gateway Fee (2.36%)</span>
                <span className="text-text font-medium">₹{gatewayCommission.toFixed(2)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-base font-bold">
                <span className="text-text">Total</span>
                <span className="text-primary">₹{totalFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-text">10-Minute Lock</h4>
                  <p className="text-xs text-text-secondary">Your slot is reserved while you complete payment.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-text">Instant Confirmation</h4>
                  <p className="text-xs text-text-secondary">Receive email/SMS confirmation immediately.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-[50vh] text-text space-y-4">
        <Loader className="animate-spin h-8 w-8 text-primary" />
        <p className="text-sm font-medium text-text-secondary">Loading booking engine...</p>
      </div>
    }>
      <BookingDetails />
    </Suspense>
  );
}
