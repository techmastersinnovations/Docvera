"use client";

import React from "react";
import { CalendarX2 } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

export default function EmptyAppointments({ title, description }: Props) {
  return (
    <div className="p-12 text-center">
      <div className="flex justify-center mb-5">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <CalendarX2 className="h-10 w-10 text-text-muted" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-text mb-2">{title}</h2>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  );
}
