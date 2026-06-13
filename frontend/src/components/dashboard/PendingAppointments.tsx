"use client";

import React from "react";
import { Appointment } from "@/types/dashboard";
import AppointmentCard from "./AppointmentCard";
import EmptyAppointments from "./EmptyAppointments";
import SectionHeader from "./SectionHeader";
import DashboardCard from "./DashboardCard";

interface Props {
  appointments: Appointment[];
  handleStatusChange: (id: string, status: string) => Promise<void>;
}

export default function PendingAppointments({ appointments, handleStatusChange }: Props) {
  return (
    <DashboardCard>
      <div className="p-6 border-b border-border">
        <SectionHeader
          title="Pending Appointments"
          subtitle="Appointments waiting for confirmation or payment."
        />
      </div>
      {appointments.length === 0 ? (
        <div className="p-6">
          <EmptyAppointments title="No Pending Appointments" description="Upcoming pending bookings will appear here." />
        </div>
      ) : (
        <div className="divide-y divide-border">
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
