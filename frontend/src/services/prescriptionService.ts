import { api } from "@/lib/api";

import {
  PrescriptionData,
} from "@/types/prescription";

export const savePrescription =
  async (
    payload: PrescriptionData
  ) => {

    const response =
      await api.post(
        "/prescriptions/create/",
        payload
      );

    return response.data;
  };

export const fetchPrescriptionHistory =
  async (
    patientId: string,
    excludeAppointmentId?: string
  ) => {

    const params: Record<string, string> = {};
    if (excludeAppointmentId) {
      params.exclude_appointment = excludeAppointmentId;
    }

    const response =
      await api.get(
        `/prescriptions/patient/${patientId}/`,
        { params }
      );

    return response.data;
  };

export const downloadPrescription =
  async (
    prescriptionId: string
  ) => {

    const response =
      await api.get(
        `/prescriptions/download/${prescriptionId}/`,
        {
          responseType:
            "blob",
        }
      );

    return response.data;
  };