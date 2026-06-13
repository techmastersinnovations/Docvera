"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import {
  DoctorStats,
  DoctorAppointments,
  PendingAppointments,
  ClinicDetailsForm,
  AvailabilityForm,
  DashboardHeader,
  DashboardLoader,
  PageContainer,
} from "@/components/dashboard";

import useDoctorDashboard from "@/hooks/useDoctorDashboard";

export default function DoctorDashboardContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";

  const {
    appointments, loading, stats,
    clinicName, clinicAddress, clinicCity, consultationFees,
    profileMessage, newSlot,
    pendingAppointments, paidAppointments, completedAppointments,
    setClinicName, setClinicAddress, setClinicCity, setConsultationFees,
    setNewSlot,
    handleStatusChange, handleProfileUpdate, handleAddAvailability,
    showAllCompleted, setShowAllCompleted,
  } = useDoctorDashboard();

  if (loading) return <DashboardLoader />;

  return (
    <PageContainer>
      {(tab === "dashboard" || tab === "appointments") && (
        <>
          <DashboardHeader appointments={appointments} />
          <DoctorStats stats={stats} />
          <DoctorAppointments
            title="Live Appointments"
            subtitle="Consultations that are active or confirmed."
            emptyTitle="No Live Appointments"
            emptyDescription="Active and confirmed consultations will appear here."
            appointments={paidAppointments}
            handleStatusChange={handleStatusChange}
          />
          <DoctorAppointments
            title="Completed Appointments"
            subtitle="Consultations that are completed."
            emptyTitle="No Completed Appointments"
            emptyDescription="Completed consultations will appear here."
            action={
              <button
                onClick={() => setShowAllCompleted(!showAllCompleted)}
                className="text-sm px-4 py-2 bg-card border border-border hover:bg-surface text-text-secondary rounded-lg transition-colors font-semibold"
              >
                {showAllCompleted ? "Show Recent (24h)" : "Show All Past"}
              </button>
            }
            appointments={completedAppointments}
            handleStatusChange={handleStatusChange}
          />
        </>
      )}

      {tab === "address" && (
        <ClinicDetailsForm
          clinicName={clinicName}
          clinicAddress={clinicAddress}
          clinicCity={clinicCity}
          consultationFees={consultationFees}
          setClinicName={setClinicName}
          setClinicAddress={setClinicAddress}
          setClinicCity={setClinicCity}
          setConsultationFees={setConsultationFees}
          handleProfileUpdate={handleProfileUpdate}
          profileMessage={profileMessage}
        />
      )}

      {tab === "availability" && (
        <AvailabilityForm
          newSlot={newSlot}
          setNewSlot={setNewSlot}
          handleAddAvailability={handleAddAvailability}
        />
      )}
    </PageContainer>
  );
}
