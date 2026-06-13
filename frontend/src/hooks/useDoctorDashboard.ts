"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  fetchDoctorAppointments,
  updateAppointmentStatus,
  updateClinicProfile,
  createAvailabilitySlot,
} from "@/services/dashboardService";

import {
  Appointment,
  DashboardStats,
  ProfileMessage,
  AvailabilitySlot,
  DoctorDashboardHook,
} from "@/types/dashboard";

export default function useDoctorDashboard():
  DoctorDashboardHook {

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [stats, setStats] =
    useState<DashboardStats>({
      totalEarnings: 0,
      patientsSeen: 0,
      pendingAppointments: 0,
    });

  const [clinicName, setClinicName] =
    useState<string>("");

  const [
    clinicAddress,
    setClinicAddress,
  ] = useState<string>("");

  const [clinicCity, setClinicCity] =
    useState<string>("");

  const [
    consultationFees,
    setConsultationFees,
  ] = useState<string>("");

  const [
    profileMessage,
    setProfileMessage,
  ] = useState<ProfileMessage | null>(
    null
  );

  const [newSlot, setNewSlot] =
    useState<AvailabilitySlot>({
      day_of_week: "MONDAY",
      start_time: "09:00",
      end_time: "17:00",
      slot_duration_minutes: 15,
    });

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData =
    async (): Promise<void> => {

      setLoading(true);

      try {

        const apptRes =
          await fetchDoctorAppointments();

        if (
          apptRes.success
        ) {

          const data =
            apptRes.data;

          setAppointments(data);

          const paid =
            data.filter(
              (
                a: Appointment
              ) =>
                a.status ===
                  "CONFIRMED" ||
                a.status ===
                  "COMPLETED"
            );

          const now = new Date();
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

          const paidLast24h = data.filter((a: Appointment) => {
            if (a.status !== "CONFIRMED" && a.status !== "COMPLETED") {
              return false;
            }
            const apptDate = new Date(`${a.booking_date}T${a.start_time || "00:00:00"}`);
            return apptDate >= oneDayAgo && apptDate <= now;
          });

          const earnings =
            paidLast24h.reduce(
              (
                sum: number,
                a: Appointment
              ) =>
                sum +
                Number(
                  a.base_amount || 0
                ),
              0
            );

          setStats({
            totalEarnings:
              earnings,

            patientsSeen:
              paid.length,

            pendingAppointments:
              data.filter(
                (
                  a: Appointment
                ) =>
                  a.status ===
                  "PENDING"
              ).length,
          });

          if (
            data.length > 0
          ) {

            setClinicName(
              data[0]
                .clinic_name || ""
            );

            setClinicAddress(
              data[0]
                .clinic_address ||
                ""
            );

            setClinicCity(
              data[0]
                .clinic_city || ""
            );

            setConsultationFees(
              String(
                data[0]
                  .base_amount || ""
              )
            );
          }
        }

      } catch (err: any) {
        const msg = err?.message || err?.error || JSON.stringify(err);
        console.error("[DoctorDashboard] Failed to fetch data:", msg);
      } finally {

        setLoading(false);

      }
    };

  const handleStatusChange =
    async (
      id: string,
      status: string
    ): Promise<void> => {

      try {

        await updateAppointmentStatus(
          id,
          status
        );

        await fetchData();

      } catch (err) {

        console.error(err);

        alert(
          "Failed to update appointment status"
        );

      }
    };

  const handleProfileUpdate =
    async (
      e: React.FormEvent
    ): Promise<void> => {

      e.preventDefault();

      setProfileMessage(null);

      try {

        const response =
          await updateClinicProfile({
            clinic_name:
              clinicName,

            clinic_address:
              clinicAddress,

            clinic_city:
              clinicCity,

            consultation_fees:
              parseFloat(
                consultationFees
              ),
          });

        if (
          response.success
        ) {

          setProfileMessage({
            type: "success",
            text:
              "Clinic details updated successfully",
          });

        }

      } catch (err) {

        console.error(err);

        setProfileMessage({
          type: "error",
          text:
            "Failed to update clinic details",
        });

      }
    };

  const handleAddAvailability =
    async (
      e: React.FormEvent
    ): Promise<void> => {

      e.preventDefault();

      try {

        await createAvailabilitySlot(
          newSlot
        );

        setNewSlot({
          ...newSlot,
          start_time: "09:00",
          end_time: "17:00",
        });

        alert(
          "Availability slot added"
        );

      } catch (err) {

        console.error(err);

        alert(
          "Failed to add availability slot"
        );

      }
    };

  const [showAllCompleted, setShowAllCompleted] = useState<boolean>(false);

  const pendingAppointments =
    appointments.filter(
      (
        appt: Appointment
      ) =>
        appt.status ===
        "PENDING"
    );

  const paidAppointments =
    appointments.filter(
      (
        appt: Appointment
      ) =>
        appt.status ===
          "CONFIRMED"
    );

  const completedAppointments =
    appointments.filter(
      (
        appt: Appointment
      ) => {
        if (appt.status !== "COMPLETED") return false;
        if (showAllCompleted) return true;
        
        // Filter out completed appointments older than 24 hours
        try {
          const apptDateStr = `${appt.booking_date}T${appt.end_time || "23:59"}:00`;
          const apptDate = new Date(apptDateStr);
          const now = new Date();
          const diffHours = (now.getTime() - apptDate.getTime()) / (1000 * 60 * 60);
          return diffHours <= 24;
        } catch (err) {
          return true; // Fallback if parsing fails
        }
      }
    );

  return {
    appointments,
    loading,
    stats,

    clinicName,
    clinicAddress,
    clinicCity,
    consultationFees,

    profileMessage,

    newSlot,

    pendingAppointments,
    paidAppointments,
    completedAppointments,

    setClinicName,
    setClinicAddress,
    setClinicCity,
    setConsultationFees,

    setNewSlot,

    handleStatusChange,
    handleProfileUpdate,
    handleAddAvailability,

    showAllCompleted,
    setShowAllCompleted,
  };
}