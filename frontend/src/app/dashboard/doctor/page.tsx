"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const DoctorDashboardContent = dynamic(
  () => import("./DoctorDashboardContent"),
  { ssr: false }
);

export default function DoctorDashboardPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-full min-h-[400px]"><p className="text-text-secondary">Loading dashboard...</p></div>}>
      <DoctorDashboardContent />
    </Suspense>
  );
}
