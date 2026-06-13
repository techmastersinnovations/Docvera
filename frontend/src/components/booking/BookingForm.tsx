//src/components/booking/BookingForm.tsx
"use client";

import React from "react";
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";

interface BookingFormProps {
  doctor: any;
  affiliatedHospitals: any[];
  selectedHospitalId: string;
  setSelectedHospitalId: (id: string) => void;
  bookingDate: string;
  setBookingDate: (date: string) => void;
  selectedTimeSlot: any; // Can be string or object
  setSelectedTimeSlot: (slot: any) => void;
  availableSlots: any[];
  error: string | null;
}

export default function BookingForm({
  doctor,
  affiliatedHospitals,
  selectedHospitalId,
  setSelectedHospitalId,
  bookingDate,
  setBookingDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  availableSlots,
  error,
}: BookingFormProps) {
  
  return (
    <div className="bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl p-8 space-y-8">
      
      {/* Doctor Header */}
      <div className="space-y-3 border-b border-white/10 pb-6">
        <h2 className="text-2xl font-black text-foreground">
          Dr. {doctor?.full_name}
        </h2>
        <p className="text-sm text-foreground font-medium">
          {doctor?.specialization} • {doctor?.experience_years} Years Exp.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-500 px-5 py-4 rounded-2xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Hospital Selection */}
      <div className="space-y-4">
         <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-foreground" />
          <h3 className="text-lg font-bold text-foreground">Consultation Facility</h3>
        </div>
        
        {affiliatedHospitals.length > 0 ? (
           <select 
             value={selectedHospitalId}
             onChange={(e) => setSelectedHospitalId(e.target.value)}
             className="w-full bg-card border border-white/10 focus:border-blue-100 rounded-xl px-4 py-3 text-sm text-foreground outline-none transition-colors"
           >
             {affiliatedHospitals.map((hosp: any) => (
               <option key={hosp.id} value={hosp.id}>
                 {hosp.name} ({hosp.city})
               </option>
             ))}
           </select>
        ) : (
          <div className="p-4 bg-card shadow-xl shadow-black/50/50/10 border border-blue-100/20 rounded-xl text-foreground text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            No hospitals linked to this doctor. Please contact admin.
          </div>
        )}
      </div>

      {/* 2. Date Selection */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-foreground">Select Date</h3>
        </div>
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={bookingDate}
          onChange={(e) => {
            setBookingDate(e.target.value);
            // Reset slot when date changes to avoid invalid selections
            if (typeof setSelectedTimeSlot === 'function') setSelectedTimeSlot(null);
          }}
          className="w-full bg-card border border-white/10 focus:border-blue-100 rounded-2xl px-4 py-3 text-foreground outline-none transition-colors"
        />
      </div>

      {/* 3. Slot Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-700" />
          <h3 className="text-lg font-bold text-foreground">
            Available Slots
          </h3>
        </div>

        {!bookingDate ? (
          <p className="text-sm text-foreground italic">Please select a date to view slots.</p>
        ) : availableSlots.length === 0 ? (
          <div className="p-4 bg-card border border-white/10 rounded-xl text-center">
            <p className="text-foreground text-sm">No slots available for this day.</p>
            <p className="text-xs text-foreground mt-1">Doctor may not have configured availability for this weekday.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {availableSlots.map((slot: any, index: number) => (
              <button
                key={`${slot.label}-${index}`}
                onClick={() => setSelectedTimeSlot(slot)}
                className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                  selectedTimeSlot?.label === slot.label
                    ? "bg-or-green border-or-green text-foreground shadow-lg shadow-or-green/20 scale-105"
                    : "bg-card border-white/10 text-foreground hover:border-blue-100 hover:text-blue-900"
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}