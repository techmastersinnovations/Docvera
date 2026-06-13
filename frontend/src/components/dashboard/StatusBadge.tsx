"use client";

import React from "react";

interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const styles: Record<string, string> = {
    PENDING: "bg-warning/10 border-warning/20 text-warning",
    CONFIRMED: "bg-info/10 border-info/20 text-info",
    COMPLETED: "bg-accent/10 border-accent/20 text-accent",
    CANCELLED: "bg-error/10 border-error/10 text-error",
  };

  return (
    <span className={`px-3 py-1 rounded-full border text-xs font-bold ${styles[status] || "bg-surface border-border text-text-secondary"}`}>
      {status}
    </span>
  );
}
