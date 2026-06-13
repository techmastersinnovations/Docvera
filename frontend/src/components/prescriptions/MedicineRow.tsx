"use client";

import React from "react";

import {
  Trash2,
  Pill,
} from "lucide-react";

import {
  PrescriptionMedicine,
} from "@/types/prescription";

interface Props {
  medicine: PrescriptionMedicine;
  index: number;

  updateMedicine: (
    index: number,
    field: keyof PrescriptionMedicine,
    value: string
  ) => void;

  removeMedicine: (
    index: number
  ) => void;
}

export default function MedicineRow({
  medicine,
  index,
  updateMedicine,
  removeMedicine,
}: Props) {

  return (
    <div className="bg-card border border-white/10 rounded-3xl p-5 relative">
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl">
            <Pill className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-sm font-bold text-foreground">
            Medicine {index + 1}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => removeMedicine(index)}
          className="h-9 w-9 rounded-xl bg-error/5 border border-error/10 flex items-center justify-center text-error hover:bg-error/10 transition-all"
        >
          <Trash2 className="h-4 w-4 text-error" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">
            Medicine Name
          </label>
          <input
            type="text"
            value={medicine.medicine_name}
            onChange={(e) => updateMedicine(index, "medicine_name", e.target.value)}
            placeholder="Paracetamol"
            className="w-full bg-card shadow-xl shadow-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-foreground outline-none focus:border-or-green text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">
            Dosage
          </label>
          <select
            value={medicine.dosage}
            onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
            className="w-full bg-card shadow-xl shadow-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-foreground outline-none focus:border-or-green text-sm appearance-none"
          >
            <option value="">Select Dosage...</option>
            <option value="1 Tablet">1 Tablet</option>
            <option value="2 Tablets">2 Tablets</option>
            <option value="1 Capsule">1 Capsule</option>
            <option value="250mg">250mg</option>
            <option value="500mg">500mg</option>
            <option value="650mg">650mg</option>
            <option value="1g">1g</option>
            <option value="5ml">5ml</option>
            <option value="10ml">10ml</option>
            <option value="15ml">15ml</option>
            <option value="1 Drop">1 Drop</option>
            <option value="2 Drops">2 Drops</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">
            Frequency
          </label>
          <select
            value={medicine.frequency}
            onChange={(e) => updateMedicine(index, "frequency", e.target.value)}
            className="w-full bg-card shadow-xl shadow-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-foreground outline-none focus:border-or-green text-sm appearance-none"
          >
            <option value="">Select Frequency...</option>
            <option value="Once a day (OD)">Once a day (OD)</option>
            <option value="Twice a day (BID)">Twice a day (BID)</option>
            <option value="Three times a day (TID)">Three times a day (TID)</option>
            <option value="Four times a day (QID)">Four times a day (QID)</option>
            <option value="Every 4 hours">Every 4 hours</option>
            <option value="Every 6 hours">Every 6 hours</option>
            <option value="Every 8 hours">Every 8 hours</option>
            <option value="As needed (PRN)">As needed (PRN)</option>
            <option value="Before sleep (HS)">Before sleep (HS)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">
            Duration
          </label>
          <select
            value={medicine.duration}
            onChange={(e) => updateMedicine(index, "duration", e.target.value)}
            className="w-full bg-card shadow-xl shadow-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-foreground outline-none focus:border-or-green text-sm appearance-none"
          >
            <option value="">Select Duration...</option>
            <option value="1 Day">1 Day</option>
            <option value="3 Days">3 Days</option>
            <option value="5 Days">5 Days</option>
            <option value="7 Days (1 Week)">7 Days (1 Week)</option>
            <option value="10 Days">10 Days</option>
            <option value="14 Days (2 Weeks)">14 Days (2 Weeks)</option>
            <option value="30 Days (1 Month)">30 Days (1 Month)</option>
            <option value="Until finished">Until finished</option>
            <option value="Ongoing">Ongoing</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">
            Instructions
          </label>
          <select
            value={medicine.instructions}
            onChange={(e) => updateMedicine(index, "instructions", e.target.value)}
            className="w-full bg-card shadow-xl shadow-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-foreground outline-none focus:border-or-green text-sm appearance-none"
          >
            <option value="">Select Instructions...</option>
            <option value="After food">After food</option>
            <option value="Before food">Before food</option>
            <option value="Empty stomach">Empty stomach</option>
            <option value="With warm water">With warm water</option>
            <option value="With milk">With milk</option>
            <option value="Do not crush or chew">Do not crush or chew</option>
            <option value="Take exactly as directed">Take exactly as directed</option>
          </select>
        </div>
      </div>

    </div>
  );
}