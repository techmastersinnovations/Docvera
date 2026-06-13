//src/components/patients/components/AppointmentList.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Plus, Loader, AlertCircle, Star, Trash2, CreditCard } from "lucide-react";

interface AppointmentListProps {
  appointments: any[];
  loading: boolean;
  error: string | null;
  onCancel: (id: string) => void;
  onReview: (id: string) => void;
}

export default function AppointmentList({ appointments, loading, error, onCancel, onReview }: AppointmentListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader className="h-8 w-8 text-foreground animate-spin" />
        <span className="text-foreground text-base">Loading appointments...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-base">{error}</div>;
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-20 bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl space-y-5">
        <Calendar className="h-12 w-12 text-foreground mx-auto" />
        <h3 className="text-lg font-bold text-foreground">No Appointments Found</h3>
        <p className="text-base text-foreground max-w-sm mx-auto">You haven't scheduled any clinical appointments yet.</p>
        <Link href="/doctors" className="inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-500 text-foreground font-bold rounded-xl hover:shadow-lg transition-all">
          <Plus className="h-4.5 w-4.5" />
          <span>Search & Book Doctor</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {appointments.map((appt) => (
        <div key={appt.id} className="p-6 bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-750 transition-all">
          
          <div className="space-y-4">
            {/* Status & ID */}
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-wider ${
                appt.status === "CONFIRMED" ? "bg-card text-blue-700 border border-blue-100" :
                appt.status === "PENDING" ? "bg-card shadow-xl shadow-black/50/50/10 text-foreground border border-blue-100/20" :
                appt.status === "CANCELLED" ? "bg-red-50 text-red-500 border border-red-100" :
                "bg-card shadow-xl shadow-black/50/50 text-foreground border border-slate-750"
              }`}>{appt.status}</span>
              
              {/* Payment Status Badge */}
              <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-wider flex items-center gap-1 ${
                appt.payment_status === "CAPTURED" ? "bg-surgical-steel/10 text-foreground border border-white/10/20" :
                "bg-card shadow-xl shadow-black/50/50 text-foreground border border-slate-750"
              }`}>
                <CreditCard className="h-3 w-3" />
                {appt.payment_status === "CAPTURED" ? "Paid" : "Unpaid"}
              </span>

              <span className="text-xs text-foreground font-semibold tracking-wider">ID: {appt.id.substr(0, 8).toUpperCase()}</span>
            </div>

            {/* Doctor Info */}
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Dr. {appt.doctor_name}</h3>
              <p className="text-sm text-foreground font-semibold">{appt.specialization}</p>
              
              {/* Facility Name - Fixed to show Clinic Name if Hospital is null */}
              <p className="text-sm text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-foreground" />
                {appt.hospital_name || appt.clinic_name || "Clinic Details Unavailable"}
              </p>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4 text-sm text-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-foreground" />
                <span>{appt.booking_date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-foreground" />
                <span>{appt.start_time} - {appt.end_time}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {["PENDING", "CONFIRMED"].includes(appt.status) && (
              <button 
                onClick={() => onCancel(appt.id)} 
                className="px-4 py-2.5 bg-red-50 hover:bg-red-100/20 text-red-500 border border-red-100 hover:border-emergency-red/30 text-sm font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" /> Cancel
              </button>
            )}
            
            {appt.status === "COMPLETED" && !appt.review && (
              <button 
                onClick={() => onReview(appt.id)} 
                className="px-4 py-2.5 bg-card shadow-xl shadow-black/50/50/15 hover:bg-card shadow-xl shadow-black/50/50 hover:text-blue-900 text-foreground hover:text-blue-900 border border-blue-100/20 hover:border-blue-100 text-sm font-bold rounded-xl transition-all"
              >
                Write Review
              </button>
            )}

            {appt.review && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-2 bg-card border border-slate-805 rounded-xl text-sm text-foreground font-semibold">
                <Star className="h-4 w-4 text-foreground fill-hospital-orange" /><span>Reviewed</span>
              </div>
            )}

            <div className="text-right pl-4 border-l border-white/10 ml-2">
              <span className="block text-xs text-foreground font-semibold uppercase">Total Paid</span>
              <span className="text-lg font-extrabold text-foreground">₹{appt.total_amount}</span>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}