"use client";

import React, {
  useState,
} from "react";

import {
  Plus,
  Eye,
  EyeOff,
  Pill,
  Activity,
  FileText,
} from "lucide-react";

import MedicineRow from "./MedicineRow";
import PrescriptionPreview from "./PrescriptionPreview";
import ActionButton from "@/components/dashboard/ActionButton";

interface Props {
  patientName?: string;
  diagnosis: string;
  notes: string;

  medicines: any[];
  consultationId?: string;

  setDiagnosis:
    React.Dispatch<
      React.SetStateAction<string>
    >;
  setNotes:
    React.Dispatch<
      React.SetStateAction<string>
    >;
  addMedicine:
    () => void;
  updateMedicine: any;
  removeMedicine: any;
  savePrescription: () => Promise<void>;
  
  vitals?: any;
  setVitals?: any;
  isCompleted?: boolean;
  prescriptionHistory?: any[];
}

export default function PrescriptionForm({
  patientName = "Patient",
  diagnosis,
  notes,
  medicines,
  setDiagnosis,
  setNotes,
  addMedicine,
  updateMedicine,
  removeMedicine,
  savePrescription,
  vitals,
  setVitals,
  isCompleted = false,
  prescriptionHistory = [],
}: Props) {
  const [showPreview, setShowPreview] =
    useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // savePrescription now handles vitals + diagnosis + medicines atomically
      await savePrescription();
      alert("Consultation details saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save consultation details.");
    } finally {
      setIsSaving(false);
    }
  };

  const isRevisit = prescriptionHistory && prescriptionHistory.length > 0;
  const lastPrescription = isRevisit ? prescriptionHistory[0] : null;

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
        {/* LEFT COLUMN (50%): Merged Vitals & Prescription Details */}
        <div className="flex-1 p-8 bg-card shadow-xl shadow-black/50 border border-white/10 rounded-3xl space-y-6 flex flex-col min-w-[320px]">
          
          {/* Section 1: Vitals */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl w-fit bg-white/5 border border-white/10 text-white shadow-inner">
                <Activity className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">
                  Vitals
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  {isCompleted ? "Stored vitals" : isRevisit ? "Previous vitals (Stored)" : "Enter vitals"}
                </p>
              </div>
            </div>

            <div className="space-y-6 mt-2">
              {isCompleted ? (
                vitals && (
                  <div className="bg-card/40 p-6 rounded-2xl border border-white/10 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-card/60 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-white/60 block uppercase font-bold tracking-wider">Blood Pressure</span>
                        <span className="text-base font-bold text-white mt-1 block">{vitals.blood_pressure || "N/A"}</span>
                      </div>
                      <div className="bg-card/60 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-white/60 block uppercase font-bold tracking-wider">Pulse Rate</span>
                        <span className="text-base font-bold text-white mt-1 block">{vitals.pulse_rate || "N/A"}</span>
                      </div>
                      <div className="bg-card/60 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-white/60 block uppercase font-bold tracking-wider">Temperature</span>
                        <span className="text-base font-bold text-white mt-1 block">{vitals.temperature || "N/A"}</span>
                      </div>
                      <div className="bg-card/60 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-white/60 block uppercase font-bold tracking-wider">O2 Saturation</span>
                        <span className="text-base font-bold text-white mt-1 block">{vitals.oxygen_saturation || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                )
              ) : isRevisit ? (
                lastPrescription?.vitals && (
                  <div className="bg-card/40 p-6 rounded-2xl border border-white/10 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-card/60 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-white/60 block uppercase font-bold tracking-wider">Blood Pressure</span>
                        <span className="text-base font-bold text-white mt-1 block">{lastPrescription.vitals.blood_pressure || "N/A"}</span>
                      </div>
                      <div className="bg-card/60 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-white/60 block uppercase font-bold tracking-wider">Pulse Rate</span>
                        <span className="text-base font-bold text-white mt-1 block">{lastPrescription.vitals.pulse_rate || "N/A"}</span>
                      </div>
                      <div className="bg-card/60 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-white/60 block uppercase font-bold tracking-wider">Temperature</span>
                        <span className="text-base font-bold text-white mt-1 block">{lastPrescription.vitals.temperature || "N/A"}</span>
                      </div>
                      <div className="bg-card/60 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-white/60 block uppercase font-bold tracking-wider">O2 Saturation</span>
                        <span className="text-base font-bold text-white mt-1 block">{lastPrescription.vitals.oxygen_saturation || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                vitals && setVitals && (
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white/70">Blood Pressure</label>
                      <input
                        type="text"
                        placeholder="e.g. 120/80"
                        value={vitals.blood_pressure || ""}
                        disabled={isCompleted}
                        onChange={(e) => setVitals({ ...vitals, blood_pressure: e.target.value })}
                        className="bg-card border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white/70">Pulse Rate</label>
                      <input
                        type="text"
                        placeholder="e.g. 80"
                        value={vitals.pulse_rate || ""}
                        disabled={isCompleted}
                        onChange={(e) => setVitals({ ...vitals, pulse_rate: e.target.value })}
                        className="bg-card border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white/70">Temperature</label>
                      <input
                        type="text"
                        placeholder="e.g. 98.6"
                        value={vitals.temperature || ""}
                        disabled={isCompleted}
                        onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                        className="bg-card border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white/70">O2 Saturation</label>
                      <input
                        type="text"
                        placeholder="e.g. 98"
                        value={vitals.oxygen_saturation || ""}
                        disabled={isCompleted}
                        onChange={(e) => setVitals({ ...vitals, oxygen_saturation: e.target.value })}
                        className="bg-card border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors w-full"
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <hr className="border-white/10 my-4" />

          {/* Section 2: Prescription Details */}
          <div className="space-y-6 flex-grow">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl w-fit bg-white/5 border border-white/10 text-white shadow-inner">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">
                  Prescription Details
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  {isRevisit ? "Previous & current consultation details" : "Clinical notes and patient diagnosis"}
                </p>
              </div>
            </div>

            <div className="space-y-6 mt-2">
              {/* If it's a revisit, show the last prescription's diagnosis, notes, and medicines */}
              {isRevisit && lastPrescription && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 mb-4">
                  <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Last Visit Details</h3>
                  
                  <div>
                    <span className="text-xs text-white/60 block font-bold uppercase tracking-wider mb-1">Diagnosis Given Last Time</span>
                    <div className="w-full bg-card/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm">
                      {lastPrescription.diagnosis || "No diagnosis recorded."}
                    </div>
                  </div>

                  {lastPrescription.notes && (
                    <div>
                      <span className="text-xs text-white/60 block font-bold uppercase tracking-wider mb-1">Doctor Notes Given Last Time</span>
                      <div className="w-full bg-card/40 border border-white/5 rounded-xl px-4 py-2.5 text-white/80 text-sm">
                        {lastPrescription.notes}
                      </div>
                    </div>
                  )}

                  {lastPrescription.medicines && lastPrescription.medicines.length > 0 && (
                    <div>
                      <span className="text-xs text-white/60 block font-bold uppercase tracking-wider mb-2">Medicines Given Last Time</span>
                      <div className="grid gap-2">
                        {lastPrescription.medicines.map((med: any, medIndex: number) => (
                          <div key={medIndex} className="bg-card/60 border border-white/5 rounded-xl p-3 text-xs text-white flex items-center justify-between">
                            <div>
                              <span className="font-bold text-white">{med.medicine_name}</span>
                              <span className="text-white/60 block mt-0.5">{med.dosage} • {med.frequency} • {med.duration}</span>
                            </div>
                            {med.instructions && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 bg-white/5 border border-white/10 rounded text-white/70">{med.instructions}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  {isRevisit ? "Further Diagnosis (Today's Diagnosis)" : "Diagnosis"}
                </label>
                {isCompleted ? (
                  <div className="w-full bg-card/40 border border-white/10 rounded-2xl px-4 py-3 text-white min-h-[100px] whitespace-pre-wrap text-sm leading-relaxed">
                    {diagnosis || "No diagnosis recorded."}
                  </div>
                ) : (
                  <textarea
                    rows={4}
                    placeholder="Enter diagnosis..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full bg-card border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-white transition-colors resize-none"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  {isRevisit ? "Further Doctor Notes (Today's Notes)" : "Doctor Notes"}
                </label>
                {isCompleted ? (
                  <div className="w-full bg-card/40 border border-white/10 rounded-2xl px-4 py-3 text-white min-h-[100px] whitespace-pre-wrap text-sm leading-relaxed">
                    {notes || "No notes recorded."}
                  </div>
                ) : (
                  <textarea
                    rows={4}
                    placeholder="Additional instructions or notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-card border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-white transition-colors resize-none"
                  />
                )}
              </div>

              {isCompleted && medicines && medicines.filter(m => m.medicine_name).length > 0 && (
                <div className="pt-4 mt-4 space-y-2 border-t border-white/10">
                  <label className="block text-sm font-semibold text-white/85 mb-2">
                    Prescribed Medicines
                  </label>
                  <div className="grid gap-3">
                    {medicines.filter(m => m.medicine_name).map((med: any, medIndex: number) => (
                      <div key={medIndex} className="bg-card/40 border border-white/5 rounded-2xl p-4 text-sm text-white flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white text-base">{med.medicine_name}</span>
                          <span className="text-white/60 text-xs block mt-1">{med.dosage} • {med.frequency} • {med.duration}</span>
                        </div>
                        {med.instructions && (
                          <span className="text-xs font-semibold px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white/70">{med.instructions}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (50%): Medicines Inputs */}
        {!isCompleted && medicines && (
          <div className="flex-1 p-8 bg-card shadow-xl shadow-black/50 border border-white/10 rounded-3xl space-y-6 flex flex-col min-w-[320px]">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl w-fit bg-white/5 border border-white/10 text-white shadow-inner">
                <Pill className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">
                  Medicines
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  Prescribe medicines
                </p>
              </div>
            </div>

            <div className="space-y-6 flex-grow mt-2">
              {medicines.map((medicine, index) => (
                <MedicineRow
                  key={index}
                  index={index}
                  medicine={medicine}
                  updateMedicine={updateMedicine}
                  removeMedicine={removeMedicine}
                />
              ))}

              <button
                type="button"
                onClick={addMedicine}
                className="w-full py-3.5 border border-dashed border-white/20 hover:border-white rounded-2xl text-sm font-bold text-white transition-colors cursor-pointer"
              >
                + Add Medicine
              </button>

              <div className="pt-4 mt-4 border-t border-white/10">
                <ActionButton 
                  onClick={handleSaveAll} 
                  disabled={isSaving}
                  variant="secondary" 
                  className="w-full justify-center py-4 bg-[#00a6a6] text-white hover:bg-[#00a6a6]/90 text-base font-black shadow-lg"
                >
                  {isSaving ? "Saving Details..." : "Save Consultation Details"}
                </ActionButton>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPreview && (
        <PrescriptionPreview
          patientName={patientName}
          diagnosis={diagnosis}
          notes={notes}
          medicines={medicines}
        />
      )}
    </div>
  );
}