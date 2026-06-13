"use client";

import React from "react";

import {
  IndianRupee,
  User,
  Calendar,
} from "lucide-react";

import StatCard from "./StatCard";

import {
  DashboardStats,
} from "@/types/dashboard";

interface Props {
  stats:
    DashboardStats;
}

export default function DoctorStats({
  stats,
}: Props) {

  return (
    <div className="grid md:grid-cols-3 gap-6">

      <StatCard
        icon={
          <IndianRupee className="h-6 w-6 text-white" />
        }
        title="Total Earnings"
        value={`₹${stats.totalEarnings.toFixed(2)}`}
        subtext="Refreshes every 24h"
        color="emerald"
      />

      <StatCard
        icon={
          <User className="h-6 w-6 text-foreground" />
        }
        title="Patients Seen"
        value={stats.patientsSeen}
        subtext="Paid visits"
        color="blue"
      />

      <StatCard
        icon={
          <Calendar className="h-6 w-6 text-foreground" />
        }
        title="Pending Payments"
        value={
          stats.pendingAppointments
        }
        subtext="Awaiting confirmation"
        color="amber"
      />

    </div>
  );
}