"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardCard({ children, className = "" }: Props) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}
