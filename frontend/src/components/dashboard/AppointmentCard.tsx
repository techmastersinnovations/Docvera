"use client";

import React from "react";
import { CheckCircle, XCircle, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { Appointment } from "@/types/dashboard";
import ActionButton from "./ActionButton";

interface Props {
  appointment: Appointment;
  handleStatusChange: (id: string, status: string) => Promise<void>;
}

export default function AppointmentCard({ appointment, handleStatusChange }: Props) {
  const isCompleted = appointment.status === "COMPLETED";
  const isCancelled = appointment.status === "CANCELLED";

  return (
    <div className="bg-card p-6 flex flex-col gap-5 border border-white/10 rounded-3xl shadow-xl shadow-black/30 text-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shrink-0 text-white">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">{appointment.patient_name}</h2>
            <p className="text-sm text-white/80 mt-0.5">Consultation</p>
          </div>
        </div>
        <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${isCompleted ? "bg-[#08A29E]/20 text-[#08A29E] border-[#08A29E]/30" :
            isCancelled ? "bg-red-500/20 text-red-400 border-red-500/30" :
              "bg-amber-500/20 text-amber-400 border-amber-500/30"
          }`}>
          {appointment.status}
        </span>
      </div>

      <div className="flex flex-col gap-3 text-sm text-white/80 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-white/60" />
          <span className="font-medium text-white">{appointment.booking_date}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-white/60" />
          <span className="font-medium text-white">{appointment.start_time} - {appointment.end_time}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-auto pt-2">
        {!isCancelled && (
          <Link href={`/dashboard/doctor/consultation?appointment=${appointment.id}`} className="flex-1">
            <button
              className={`w-full justify-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${isCompleted
                  ? "bg-[#08A29E] text-white hover:bg-[#08A29E]/90"
                  : "bg-[#00a6a6] text-white hover:bg-[#00a6a6]/90 shadow-md"
                }`}
            >
              {isCompleted ? "View Details" : "Start Consultation"}
            </button>
          </Link>
        )}

        {!isCompleted && !isCancelled && (
          <button
            onClick={() => handleStatusChange(appointment.id, "COMPLETED")}
            className="shrink-0 h-[46px] w-[46px] bg-[#08A29E]/10 text-[#08A29E] rounded-xl hover:bg-[#08A29E]/20 flex items-center justify-center transition-colors border border-[#08A29E]/20"
          >
            <CheckCircle className="h-5 w-5" />
          </button>
        )}

        {!isCancelled && (
          <button
            onClick={() => handleStatusChange(appointment.id, "CANCELLED")}
            className="shrink-0 h-[46px] w-[46px] bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 flex items-center justify-center transition-colors border border-red-500/20"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
