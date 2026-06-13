"use client";

import React from "react";
import { Download } from "lucide-react";
import { Appointment } from "@/types/dashboard";

interface Props {
  appointments: Appointment[];
}

export default function DashboardHeader({ appointments }: Props) {
  const exportToCSV = () => {
    const headers = ["Patient Name", "Date", "Start Time", "End Time", "Base Amount", "Status"];
    const csvRows = appointments.map((appt) => [
      `"${appt.patient_name || "N/A"}"`,
      appt.booking_date,
      appt.start_time,
      appt.end_time,
      appt.base_amount,
      appt.status,
    ]);
    const csvContent = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-text tracking-tight">Provider Dashboard</h1>
        <p className="text-text-secondary text-sm">Manage your schedule, earnings, and patient records.</p>
      </div>
      <button
        onClick={exportToCSV}
        className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-black/10 cursor-pointer"
      >
        <Download className="h-4 w-4 text-white" />
        Export CSV
      </button>
    </div>
  );
}
