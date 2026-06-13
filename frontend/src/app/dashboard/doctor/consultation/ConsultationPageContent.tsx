"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import ConsultationHeader from "@/components/consultations/ConsultationHeader";
import PrescriptionForm from "@/components/prescriptions/PrescriptionForm";
import PrescriptionHistory from "@/components/prescriptions/PrescriptionHistory";

import useConsultationRoom from "@/hooks/useConsultationRoom";
import usePrescription from "@/hooks/usePrescription";

export default function ConsultationPageContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointment") || "";

  const {
    session, loading, vitals, setVitals,
    handleCompleteConsultation,
  } = useConsultationRoom(appointmentId);

  const {
    medicines, diagnosis: prescriptionDiagnosis, notes,
    setDiagnosis: setPrescriptionDiagnosis, setNotes,
    addMedicine, updateMedicine, removeMedicine,
    savePrescription, prescriptionHistory,
  } = usePrescription(appointmentId, session?.patient_name || "", vitals);

  const isCompleted = session?.status === "COMPLETED";

  if (loading) {
    return (
      <div className="h-full bg-card flex items-center justify-center text-text">
        Loading Consultation...
      </div>
    );
  }

  const hasHistory = prescriptionHistory && prescriptionHistory.length > 0;

  // For completed consultations, show data saved in session (read-only)
  const displayDiagnosis = isCompleted ? (session?.diagnosis || "") : prescriptionDiagnosis;
  const displayNotes = isCompleted ? (session?.notes || "") : notes;
  const displayMedicines = isCompleted ? (session?.medicines || []) : medicines;

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4">
      <ConsultationHeader
        patientName={session?.patient_name || "Patient"}
        handleCompleteConsultation={!isCompleted ? handleCompleteConsultation : undefined}
      />

      <PrescriptionForm
        patientName={session?.patient_name || "Patient"}
        diagnosis={displayDiagnosis}
        notes={displayNotes}
        medicines={displayMedicines}
        setDiagnosis={setPrescriptionDiagnosis}
        setNotes={setNotes}
        addMedicine={addMedicine}
        updateMedicine={updateMedicine}
        removeMedicine={removeMedicine}
        savePrescription={savePrescription}
        vitals={vitals}
        setVitals={setVitals}
        isCompleted={isCompleted}
        prescriptionHistory={prescriptionHistory}
      />

      {hasHistory && (
        <PrescriptionHistory prescriptionHistory={prescriptionHistory} />
      )}
    </div>
  );
}
