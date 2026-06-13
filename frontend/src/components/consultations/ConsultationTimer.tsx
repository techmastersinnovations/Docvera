"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  Clock3,
} from "lucide-react";

export default function ConsultationTimer() {

  const [seconds, setSeconds] =
    useState(0);

  useEffect(() => {

    const interval =
      setInterval(() => {

        setSeconds(
          (prev) => prev + 1
        );

      }, 1000);

    return () =>
      clearInterval(interval);

  }, []);

  const formatTime =
    (
      totalSeconds: number
    ): string => {

      const hrs =
        Math.floor(
          totalSeconds / 3600
        );

      const mins =
        Math.floor(
          (totalSeconds %
            3600) /
            60
        );

      const secs =
        totalSeconds % 60;

      return `${String(
        hrs
      ).padStart(
        2,
        "0"
      )}:${String(
        mins
      ).padStart(
        2,
        "0"
      )}:${String(
        secs
      ).padStart(
        2,
        "0"
      )}`;
    };

  return (
    <div className="bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl px-6 py-5 flex items-center justify-between">

      <div className="flex items-center gap-4">

        <div className="p-3 bg-card shadow-xl shadow-black/50/50/10 border border-blue-100/20 rounded-2xl">

          <Clock3 className="h-5 w-5 text-foreground" />

        </div>

        <div>

          <h3 className="text-foreground font-black">

            Consultation Duration

          </h3>

          <p className="text-sm text-foreground mt-1">

            Active session timer

          </p>

        </div>

      </div>

      <div className="text-3xl font-black text-foreground tracking-wider">

        {formatTime(seconds)}

      </div>

    </div>
  );
}