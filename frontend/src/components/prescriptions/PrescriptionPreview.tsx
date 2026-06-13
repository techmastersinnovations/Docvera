"use client";

import React from "react";

import {
  FileText,
  Pill,
  ClipboardPlus,
} from "lucide-react";

import PrescriptionPDFButton from "./PrescriptionPDFButton";

interface Props {
  patientName: string;
  diagnosis: string;
  notes: string;
  medicines: any[];
}

export default function PrescriptionPreview({
  patientName,
  diagnosis,
  notes,
  medicines,
}: Props) {

  return (
    <div className="space-y-4">

      <div className="flex justify-end">

        <PrescriptionPDFButton
          targetId="prescription-preview"
        />

      </div>

      <div
        id="prescription-preview"
        className="bg-research-paper rounded-3xl overflow-hidden shadow-2xl"
      >

        <div className="bg-gradient-to-r from-or-green to-amber-500 px-8 py-6">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-black text-foreground">

                Medical Prescription

              </h1>

              <p className="text-sm text-trust-blue mt-2 font-medium">

                Digital Healthcare System

              </p>

            </div>

            <div className="h-16 w-16 rounded-2xl bg-research-paper/20 flex items-center justify-center">

              <FileText className="h-8 w-8 text-foreground" />

            </div>

          </div>

        </div>

        <div className="p-8 space-y-8 text-trust-blue">

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-research-paper rounded-2xl p-5">

              <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">

                Patient Name

              </p>

              <h2 className="text-lg font-bold">

                {patientName}

              </h2>

            </div>

            <div className="bg-research-paper rounded-2xl p-5">

              <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">

                Prescription Date

              </p>

              <h2 className="text-lg font-bold">

                {new Date().toLocaleDateString()}

              </h2>

            </div>

          </div>

          <div className="bg-research-paper rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-4">

              <div className="p-2 rounded-xl bg-card">

                <ClipboardPlus className="h-5 w-5 text-or-green" />

              </div>

              <h2 className="text-lg font-black">

                Diagnosis

              </h2>

            </div>

            <p className="leading-7 text-sm">

              {diagnosis || "-"}

            </p>

          </div>

          <div className="space-y-5">

            <div className="flex items-center gap-3">

              <div className="p-2 rounded-xl bg-card">

                <Pill className="h-5 w-5 text-or-green" />

              </div>

              <h2 className="text-lg font-black">

                Prescribed Medicines

              </h2>

            </div>

            <div className="space-y-4">

              {medicines.map(
                (
                  medicine,
                  index
                ) => (

                  <div
                    key={index}
                    className="border border-clinic-100 rounded-2xl p-5"
                  >

                    <div className="flex items-center justify-between mb-4">

                      <h3 className="font-bold text-lg">

                        {
                          medicine.medicine_name
                        }

                      </h3>

                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">

                        {
                          medicine.duration
                        }

                      </span>

                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">

                      <div>

                        <span className="font-semibold text-foreground">

                          Dosage:
                          {" "}

                        </span>

                        <span>

                          {
                            medicine.dosage
                          }

                        </span>

                      </div>

                      <div>

                        <span className="font-semibold text-foreground">

                          Frequency:
                          {" "}

                        </span>

                        <span>

                          {
                            medicine.frequency
                          }

                        </span>

                      </div>

                    </div>

                    <div className="mt-4">

                      <span className="font-semibold text-foreground text-sm">

                        Instructions

                      </span>

                      <p className="mt-2 text-sm leading-6">

                        {
                          medicine.instructions ||
                          "-"
                        }

                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

          <div className="bg-research-paper rounded-2xl p-6">

            <h2 className="text-lg font-black mb-4">

              Doctor Notes

            </h2>

            <p className="text-sm leading-7">

              {notes || "-"}

            </p>

          </div>

          <div className="pt-6 border-t border-clinic-100 flex items-center justify-between">

            <div>

              <p className="text-xs text-foreground">

                Generated by Healthcare ERP System

              </p>

            </div>

            <div className="text-right">

              <p className="text-sm font-semibold">

                Authorized Doctor

              </p>

              <div className="mt-3 h-[1px] w-40 bg-surgical-steel" />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}