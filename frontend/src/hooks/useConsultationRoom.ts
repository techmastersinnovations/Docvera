"use client";

import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  fetchConsultationSession,
  fetchConsultationMessages,
  sendConsultationMessage,
  saveVitals,
  saveDiagnosis,
  completeConsultation,
} from "@/services/consultationService";

import {
  ConsultationSession,
  ConsultationMessage,
  ConsultationVitals,
  DiagnosisData,
  ConsultationHook,
} from "@/types/consultation";

export default function useConsultationRoom(
  appointmentId: string
): ConsultationHook {
  const router = useRouter();

  const [session, setSession] =
    useState<ConsultationSession | null>(
      null
    );

  const [messages, setMessages] =
    useState<
      ConsultationMessage[]
    >([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [message, setMessage] =
    useState<string>("");

  const [vitals, setVitals] =
    useState<ConsultationVitals>({
      blood_pressure: "",
      pulse_rate: "",
      temperature: "",
      oxygen_saturation: "",
      weight: "",
      height: "",
    });

  const [diagnosis, setDiagnosis] =
    useState<DiagnosisData>({
      symptoms: "",
      diagnosis: "",
      notes: "",
    });

  useEffect(() => {

    if (appointmentId) {
      initialize();
    }

  }, [appointmentId]);

  const initialize =
    async (): Promise<void> => {

      setLoading(true);

      try {

        const sessionRes =
          await fetchConsultationSession(
            appointmentId
          );

        if (
          sessionRes.success
        ) {

          setSession(
            sessionRes.data
          );

          if (sessionRes.data.vitals) {
            setVitals(sessionRes.data.vitals);
          }
        }

        const msgRes =
          await fetchConsultationMessages(
            appointmentId
          );

        if (
          msgRes.success
        ) {

          setMessages(
            msgRes.data || []
          );

        }

      } catch (err) {

        console.error(
          "Consultation initialization failed:",
          err
        );

      } finally {

        setLoading(false);

      }
    };

  const handleSendMessage =
    async (): Promise<void> => {

      if (
        !message.trim()
      ) {
        return;
      }

      try {

        const response =
          await sendConsultationMessage(
            appointmentId,
            message
          );

        if (
          response.success
        ) {

          setMessages(
            (prev) => [
              ...prev,
              response.data,
            ]
          );

          setMessage("");

        }

      } catch (err) {

        console.error(
          "Message send failed:",
          err
        );

      }
    };

  const handleSaveVitals =
    async (): Promise<void> => {

      try {

        const response =
          await saveVitals(
            appointmentId,
            vitals
          );

        if (
          response.success
        ) {
          // Vitals saved successfully
        }

      } catch (err) {

        console.error(
          "Vitals save failed:",
          err
        );

      }
    };

  const handleSaveDiagnosis =
    async (): Promise<void> => {

      try {

        const response =
          await saveDiagnosis(
            appointmentId,
            diagnosis
          );

        if (
          response.success
        ) {

          alert(
            "Diagnosis saved successfully"
          );

        }

      } catch (err) {

        console.error(
          "Diagnosis save failed:",
          err
        );

      }
    };

  const handleCompleteConsultation =
    async (): Promise<void> => {

      try {

        const response =
          await completeConsultation(
            appointmentId
          );

        if (
          response.success
        ) {

          router.push("/dashboard/doctor");

        }

      } catch (err) {

        console.error(
          "Consultation completion failed:",
          err
        );

      }
    };

  return {
    session,
    messages,
    loading,
    message,
    setMessage,
    vitals,
    setVitals,
    diagnosis,
    setDiagnosis,
    handleSendMessage,
    handleSaveVitals,
    handleSaveDiagnosis,
    handleCompleteConsultation,
  };
}