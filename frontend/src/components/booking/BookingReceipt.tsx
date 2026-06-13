//src/components/booking/BookingReceipt.tsx
"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, User, MapPin, ArrowLeft, Calendar, Clock } from "lucide-react";

interface BookingReceiptProps {
  appointmentData: any;
  doctor: any;
  consultationFee: number;
  platformFee: number;
  totalFee: number;
}

export default function BookingReceipt({
  appointmentData,
  doctor,
  consultationFee,
  platformFee,
  totalFee,
}: BookingReceiptProps) {
  return (
    <div className="text-center py-12 space-y-6 animate-in zoom-in-50 duration-500">
      <div className="h-20 w-20 bg-card border border-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-or-green/10">
        <CheckCircle2 className="h-10 w-10 animate-bounce" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-foreground">Booking Confirmed!</h2>
        <p className="text-foreground text-sm">Your appointment has been successfully scheduled.</p>
      </div>

      <div className="max-w-md mx-auto bg-card border border-white/10 rounded-2xl p-6 text-left space-y-6 mt-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <span className="text-xs font-bold text-foreground uppercase">Booking ID</span>
          <span className="text-xs font-mono text-foreground">{appointmentData?.id || "N/A"}</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-foreground mt-0.5" />
            <div>
                <span className="text-[10px] font-bold text-foreground uppercase block">Doctor</span>
                <span className="text-sm font-bold text-foreground">Dr. {appointmentData?.doctor_name || doctor?.full_name}</span>
                <div className="text-xs text-foreground">{appointmentData?.specialization || doctor?.specialization}</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-foreground mt-0.5" />
            <div>
                <span className="text-[10px] font-bold text-foreground uppercase block">Location</span>
                <span className="text-sm font-bold text-foreground">
                    {appointmentData?.hospital_name || appointmentData?.clinic_name || "Clinic"}
                </span>
                <div className="text-xs text-foreground">
                    {appointmentData?.clinic_address}, {appointmentData?.clinic_city} {appointmentData?.clinic_pin_code}
                </div>
            </div>
          </div>

          <div className="flex space-x-6">
             <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-foreground mt-0.5" />
                <div>
                    <span className="text-[10px] font-bold text-foreground uppercase block">Date</span>
                    <span className="text-sm font-bold text-foreground">{appointmentData?.booking_date}</span>
                </div>
             </div>
             <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-foreground mt-0.5" />
                <div>
                    <span className="text-[10px] font-bold text-foreground uppercase block">Time</span>
                    <span className="text-sm font-bold text-foreground">{appointmentData?.start_time} - {appointmentData?.end_time}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-2 bg-card shadow-xl shadow-black/50/50/50 p-4 rounded-xl">
          <div className="flex justify-between text-xs text-foreground">
            <span>Consultation Fee</span>
            <span>₹{consultationFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-foreground">
            <span>Platform Fee</span>
            <span>₹{platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-white/10/50">
            <span>Total Paid</span>
            <span className="text-blue-700">₹{totalFee.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Link 
          href="/dashboard/patient"
          className="inline-flex items-center space-x-2 px-8 py-3 bg-card shadow-xl shadow-black/50/50 hover:bg-telehealth-blue text-foreground text-sm font-bold rounded-xl transition-colors border border-telehealth-blue"
        >
          <span>Go to Patient Dashboard</span>
          <ArrowLeft className="h-4 w-4 rotate-180" />
        </Link>
      </div>
    </div>
  );
}