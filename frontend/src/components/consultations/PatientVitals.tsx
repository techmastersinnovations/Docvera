"use client";

import React from "react";

import ActionButton from "@/components/dashboard/ActionButton";

interface Props {
  vitals: any;

  setVitals: any;

  handleSaveVitals: () => void;
}

export default function PatientVitals({
  vitals,
  setVitals,
  handleSaveVitals,
}: Props) {

  return (
    <div className="bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl p-6 space-y-6">

      <h2 className="text-lg font-bold text-foreground">

        Patient Vitals

      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Blood Pressure"
          value={
            vitals.blood_pressure
          }
          onChange={(e) =>
            setVitals({
              ...vitals,
              blood_pressure:
                e.target.value,
            })
          }
          className="bg-card border border-white/10 rounded-xl px-4 py-3 text-foreground"
        />

        <input
          type="text"
          placeholder="Pulse Rate"
          value={
            vitals.pulse_rate
          }
          onChange={(e) =>
            setVitals({
              ...vitals,
              pulse_rate:
                e.target.value,
            })
          }
          className="bg-card border border-white/10 rounded-xl px-4 py-3 text-foreground"
        />

        <input
          type="text"
          placeholder="Temperature"
          value={
            vitals.temperature
          }
          onChange={(e) =>
            setVitals({
              ...vitals,
              temperature:
                e.target.value,
            })
          }
          className="bg-card border border-white/10 rounded-xl px-4 py-3 text-foreground"
        />

        <input
          type="text"
          placeholder="Oxygen Saturation"
          value={
            vitals.oxygen_saturation
          }
          onChange={(e) =>
            setVitals({
              ...vitals,
              oxygen_saturation:
                e.target.value,
            })
          }
          className="bg-card border border-white/10 rounded-xl px-4 py-3 text-foreground"
        />

      </div>

      <ActionButton
        onClick={
          handleSaveVitals
        }
      >
        Save Vitals
      </ActionButton>

    </div>
  );
}