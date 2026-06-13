"use client";

import React from "react";
import { Download } from "lucide-react";

interface ExportReportButtonProps {
  appointments: any[];
}

export default function ExportReportButton({ appointments }: ExportReportButtonProps) {
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
    <button onClick={exportToCSV} className="flex items-center gap-2 bg-card border border-border hover:bg-surface text-text-secondary px-4 py-2 rounded-xl text-sm font-semibold transition-all">
      <Download className="h-4 w-4" />
      Export Report (CSV)
    </button>
  );
}
