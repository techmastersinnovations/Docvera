"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const ConsultationPageContent = dynamic(
  () => import("./ConsultationPageContent"),
  { ssr: false }
);

export default function ConsultationPage() {
  return (
    <Suspense fallback={<div className="h-full bg-card flex items-center justify-center text-text">Loading consultation...</div>}>
      <ConsultationPageContent />
    </Suspense>
  );
}
