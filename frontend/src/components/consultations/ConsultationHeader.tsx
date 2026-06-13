"use client";

import React from "react";

import {
  Stethoscope,
} from "lucide-react";

import ActionButton from "@/components/dashboard/ActionButton";

interface Props {
  patientName: string;
  handleCompleteConsultation?: () => Promise<void>;
}

export default function ConsultationHeader({
  patientName,
  handleCompleteConsultation,
}: Props) {

  return (
    <div className="bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

      <div className="flex items-center gap-4">

        <div className="p-4 bg-card shadow-xl shadow-black/50/50/10 rounded-2xl border border-blue-100/20">

          <Stethoscope className="h-7 w-7 text-foreground" />

        </div>

        <div>

          <h1 className="text-2xl font-black text-foreground">

            Patient: {patientName}

          </h1>

        </div>

      </div>

      {handleCompleteConsultation && (
        <ActionButton
          onClick={handleCompleteConsultation}
          className="bg-or-green hover:bg-emerald-700 text-foreground font-bold px-6 py-3"
        >
          Complete Consultation
        </ActionButton>
      )}

      </div>
  );
}