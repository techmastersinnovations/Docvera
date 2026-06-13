//src/components/consultations/ConsultationRoom.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Calendar,
 Clock,
  FileText,
  Activity,
  Loader,
} from "lucide-react";

import { api } from "@/lib/api";

import PrescriptionForm from "@/components/prescriptions/PrescriptionForm";

interface ConsultationRoomProps {
  appointmentId: string;
}

export default function ConsultationRoom({
  appointmentId,
}: ConsultationRoomProps) {

  const [appointment, setAppointment] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const [consultationId, setConsultationId] =
    useState<string | null>(null);

  useEffect(() => {
    fetchAppointment();
    createConsultation();
  }, []);

  const fetchAppointment = async () => {
    try {

      const response = await api.get(
        "/appointments/dashboard/doctor/"
      );

      if (response.data.success) {

        const found = response.data.data.find(
          (a: any) => a.id === appointmentId
        );

        setAppointment(found);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createConsultation = async () => {
    try {

      const response = await api.post(
        `/consultations/create/${appointmentId}/`
      );

      if (response.data.success) {
        setConsultationId(response.data.data.id);
      }

    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteConsultation = async () => {
    try {

      if (!consultationId) {
        alert("Consultation missing");
        return;
      }

      await api.patch(
        `/consultations/update/${consultationId}/`,
        {
          symptoms,
          diagnosis,
          notes,
          status: "COMPLETED",
        }
      );

      await api.patch(
        `/appointments/${appointmentId}/status/`,
        {
          status: "COMPLETED",
        }
      );

      alert("Consultation completed");

    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center py-20 text-foreground">
        Consultation not found
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl p-6">

        <div className="flex items-center justify-between">

          <div className="space-y-2">

            <h2 className="text-2xl font-bold text-foreground">
              Consultation Room
            </h2>

            <div className="flex items-center gap-3 text-sm text-foreground">
              <User className="h-4 w-4" />
              <span>{appointment.patient_name}</span>
            </div>

          </div>

          <div className="space-y-2 text-right">

            <div className="flex items-center gap-2 text-sm text-foreground justify-end">
              <Calendar className="h-4 w-4" />
              <span>{appointment.booking_date}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-foreground justify-end">
              <Clock className="h-4 w-4" />
              <span>
                {appointment.start_time} - {appointment.end_time}
              </span>
            </div>

          </div>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="space-y-6">

          <div className="bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl p-6 space-y-4">

            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-foreground" />

              <h3 className="text-lg font-bold text-foreground">
                Symptoms
              </h3>
            </div>

            <textarea
              rows={6}
              value={symptoms}
              onChange={(e) =>
                setSymptoms(e.target.value)
              }
              placeholder="Enter patient symptoms..."
              className="w-full bg-card border border-white/10 rounded-2xl p-4 text-sm text-foreground outline-none focus:border-blue-100 resize-none"
            />

          </div>

          <div className="bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl p-6 space-y-4">

            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-700" />

              <h3 className="text-lg font-bold text-foreground">
                Diagnosis
              </h3>
            </div>

            <textarea
              rows={6}
              value={diagnosis}
              onChange={(e) =>
                setDiagnosis(e.target.value)
              }
              placeholder="Enter diagnosis..."
              className="w-full bg-card border border-white/10 rounded-2xl p-4 text-sm text-foreground outline-none focus:border-or-green resize-none"
            />

          </div>

        </div>

        <div className="space-y-6">

          <div className="bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl p-6 space-y-4">

            <h3 className="text-lg font-bold text-foreground">
              Clinical Notes
            </h3>

            <textarea
              rows={10}
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="Write consultation notes..."
              className="w-full bg-card border border-white/10 rounded-2xl p-4 text-sm text-foreground outline-none focus:border-white/10 resize-none"
            />

            <button
              onClick={handleCompleteConsultation}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-500 rounded-2xl text-foreground font-bold"
            >
              Complete Consultation
            </button>

          </div>

          {consultationId && (
            // @ts-ignore
            <PrescriptionForm
              consultationId={consultationId}
            />
          )}

        </div>

      </div>

    </div>
  );
}