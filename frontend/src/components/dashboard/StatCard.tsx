"use client";

import React from "react";

interface Props {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtext: string;
  color: "emerald" | "blue" | "amber";
}

export default function StatCard({ icon, title, value, subtext, color }: Props) {
  return (
    <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.01] shadow-xl shadow-black/20 flex items-start justify-between hover:border-white/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
      <div>
        <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-black text-white">{value}</h3>
        <p className="text-white/40 text-[10px] mt-1.5 font-medium">{subtext}</p>
      </div>
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0">
        {icon}
      </div>
    </div>
  );
}
