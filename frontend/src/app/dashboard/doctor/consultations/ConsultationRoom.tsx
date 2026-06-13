"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ConsultationRoom from "@/components/consultations/ConsultationRoom";

export default function ConsultationPage() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointment");

  if (!appointmentId) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center text-foreground">
        Appointment ID missing
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card text-foreground p-6">
      <ConsultationRoom appointmentId={appointmentId} />
    </div>
  );
}