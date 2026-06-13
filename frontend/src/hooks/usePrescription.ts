"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  PrescriptionMedicine,
  PrescriptionHook,
  PrescriptionHistoryItem,
} from "@/types/prescription";

import {
  savePrescription as savePrescriptionService,
  fetchPrescriptionHistory,
} from "@/services/prescriptionService";

import { ConsultationVitals } from "@/types/consultation";

export default function usePrescription(
  appointmentId: string,
  patientName: string,
  vitals?: ConsultationVitals
): PrescriptionHook {

  const [diagnosis, setDiagnosis] =
    useState<string>("");

  const [notes, setNotes] =
    useState<string>("");

  const [prescriptionHistory,
    setPrescriptionHistory] =
    useState<
      PrescriptionHistoryItem[]
    >([]);

  const [medicines, setMedicines] =
    useState<
      PrescriptionMedicine[]
    >([
      {
        medicine_name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);

  useEffect(() => {
    if (patientName) {
      fetchHistory();
    }
  }, [patientName]);

  const addMedicine =
    (): void => {

      setMedicines(
        (prev) => [
          ...prev,
          {
            medicine_name: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: "",
          },
        ]
      );
    };

  const updateMedicine =
    (
      index: number,
      field:
        keyof PrescriptionMedicine,
      value: string
    ): void => {

      setMedicines(
        (prev) =>
          prev.map(
            (
              medicine,
              i
            ) =>
              i === index
                ? {
                    ...medicine,
                    [field]:
                      value,
                  }
                : medicine
          )
      );
    };

  const removeMedicine =
    (
      index: number
    ): void => {

      setMedicines(
        (prev) =>
          prev.filter(
            (_, i) =>
              i !== index
          )
      );
    };

  const fetchHistory =
    async (): Promise<void> => {

      try {

        const response =
          await fetchPrescriptionHistory(
            patientName,
            appointmentId
          );

        if (
          response.success
        ) {

          setPrescriptionHistory(
            response.data || []
          );

        }

      } catch (err) {

        console.error(err);

      }
    };

  const savePrescription =
    async (): Promise<void> => {

      try {

        const response =
          await savePrescriptionService(
            {
              appointment_id:
                appointmentId,

              patient_name:
                patientName,

              diagnosis,

              notes,

              medicines,

              // Include vitals so everything saves atomically in one call
              vitals: vitals
                ? {
                    blood_pressure: vitals.blood_pressure,
                    pulse_rate: vitals.pulse_rate,
                    temperature: vitals.temperature,
                    oxygen_saturation: vitals.oxygen_saturation,
                    weight: vitals.weight,
                    height: vitals.height,
                  }
                : undefined,
            }
          );

        if (
          response.success
        ) {
          await fetchHistory();
        }

      } catch (err) {

        console.error(err);

        alert(
          "Failed to save prescription"
        );

      }
    };

  return {
    medicines,
    diagnosis,
    notes,

    setDiagnosis,
    setNotes,

    addMedicine,
    updateMedicine,
    removeMedicine,

    savePrescription,

    prescriptionHistory,

    fetchHistory,
  };
}