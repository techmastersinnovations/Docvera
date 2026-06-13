"use client";

import React from "react";

import ActionButton from "@/components/dashboard/ActionButton";

interface Props {
  diagnosis: any;

  setDiagnosis: any;

  handleSaveDiagnosis: () => void;
}

export default function DiagnosisForm({
  diagnosis,
  setDiagnosis,
  handleSaveDiagnosis,
}: Props) {

  return (
    <div className="bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl p-6 space-y-6">

      <h2 className="text-lg font-bold text-foreground">

        Diagnosis Notes

      </h2>

      <textarea
        rows={4}
        placeholder="Symptoms"
        value={
          diagnosis.symptoms
        }
        onChange={(e) =>
          setDiagnosis({
            ...diagnosis,
            symptoms:
              e.target.value,
          })
        }
        className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-foreground"
      />

      <textarea
        rows={4}
        placeholder="Diagnosis"
        value={
          diagnosis.diagnosis
        }
        onChange={(e) =>
          setDiagnosis({
            ...diagnosis,
            diagnosis:
              e.target.value,
          })
        }
        className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-foreground"
      />

      <textarea
        rows={5}
        placeholder="Clinical Notes"
        value={
          diagnosis.notes
        }
        onChange={(e) =>
          setDiagnosis({
            ...diagnosis,
            notes:
              e.target.value,
          })
        }
        className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-foreground"
      />

      <ActionButton
        onClick={
          handleSaveDiagnosis
        }
      >
        Save Diagnosis
      </ActionButton>

    </div>
  );
}