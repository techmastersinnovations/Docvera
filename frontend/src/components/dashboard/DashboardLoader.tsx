"use client";

import React from "react";
import { Loader } from "lucide-react";

export default function DashboardLoader() {
  return (
    <div className="flex justify-center items-center h-full min-h-[400px]">
      <Loader className="animate-spin text-primary h-8 w-8" />
    </div>
  );
}
