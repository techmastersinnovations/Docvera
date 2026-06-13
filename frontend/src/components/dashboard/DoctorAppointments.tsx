"use client";

import React from "react";
import { Appointment } from "@/types/dashboard";
import AppointmentCard from "./AppointmentCard";
import EmptyAppointments from "./EmptyAppointments";
import SectionHeader from "./SectionHeader";
import DashboardCard from "./DashboardCard";

interface Props {
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  action?: React.ReactNode;
  appointments: Appointment[];
  handleStatusChange: (id: string, status: string) => Promise<void>;
}

export default function DoctorAppointments({
  title = "Paid & Completed Appointments",
  subtitle = "Consultations that are confirmed or completed.",
  emptyTitle = "No Paid Appointments",
  emptyDescription = "Completed and confirmed consultations will appear here.",
  action,
  appointments,
  handleStatusChange,
}: Props) {
  return (
    <DashboardCard>
      <div className="p-6 border-b border-border">
        <SectionHeader title={title} subtitle={subtitle} action={action} />
      </div>
      {appointments.length === 0 ? (
        <div className="p-6">
          <EmptyAppointments title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              handleStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
