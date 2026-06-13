import {
  api,
} from "@/lib/api";

import {
  ConsultationVitals,
  DiagnosisData,
} from "@/types/consultation";

export const fetchConsultationSession =
  async (
    appointmentId: string
  ) => {

    const response =
      await api.get(
        `/consultations/session/${appointmentId}/`
      );

    return response.data;
  };

export const fetchConsultationMessages =
  async (
    appointmentId: string
  ) => {

    const response =
      await api.get(
        `/consultations/messages/${appointmentId}/`
      );

    return response.data;
  };

export const sendConsultationMessage =
  async (
    appointmentId: string,
    message: string
  ) => {

    const response =
      await api.post(
        `/consultations/messages/send/`,
        {
          appointment_id:
            appointmentId,

          message,
        }
      );

    return response.data;
  };

export const saveVitals =
  async (
    appointmentId: string,
    vitals: ConsultationVitals
  ) => {

    const response =
      await api.post(
        `/consultations/vitals/`,
        {
          appointment_id:
            appointmentId,

          ...vitals,
        }
      );

    return response.data;
  };

export const saveDiagnosis =
  async (
    appointmentId: string,
    payload: DiagnosisData
  ) => {

    const response =
      await api.post(
        `/consultations/diagnosis/`,
        {
          appointment_id:
            appointmentId,

          ...payload,
        }
      );

    return response.data;
  };

export const completeConsultation =
  async (
    appointmentId: string
  ) => {

    const response =
      await api.post(
        `/consultations/complete/`,
        {
          appointment_id:
            appointmentId,
        }
      );

    return response.data;
  };