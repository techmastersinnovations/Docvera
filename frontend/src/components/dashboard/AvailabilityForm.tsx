"use client";

import React from "react";
import { Clock } from "lucide-react";
import { AvailabilitySlot } from "@/types/dashboard";
import DashboardCard from "./DashboardCard";
import SectionHeader from "./SectionHeader";
import ActionButton from "./ActionButton";

interface Props {
  newSlot: AvailabilitySlot;
  setNewSlot: React.Dispatch<React.SetStateAction<AvailabilitySlot>>;
  handleAddAvailability: (e: React.FormEvent) => Promise<void>;
}

export default function AvailabilityForm({ newSlot, setNewSlot, handleAddAvailability }: Props) {
  return (
    <DashboardCard className="max-w-4xl mx-auto p-6 sm:p-8">
      <SectionHeader title="Manage Weekly Availability" subtitle="Configure consultation timings and slot duration." />

      <form onSubmit={handleAddAvailability} className="mt-8 bg-surface p-6 rounded-2xl border border-border grid md:grid-cols-5 gap-4 items-end">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text">Day</label>
          <select value={newSlot.day_of_week} onChange={(e) => setNewSlot({ ...newSlot, day_of_week: e.target.value })}
            className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-text outline-none">
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            <option value="FRIDAY">Friday</option>
            <option value="SATURDAY">Saturday</option>
            <option value="SUNDAY">Sunday</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text">Start</label>
          <input type="time" value={newSlot.start_time} onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
            className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-text outline-none" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text">End</label>
          <input type="time" value={newSlot.end_time} onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
            className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-text outline-none" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text">Duration (min)</label>
          <input type="number" value={newSlot.slot_duration_minutes} onChange={(e) => setNewSlot({ ...newSlot, slot_duration_minutes: parseInt(e.target.value) })}
            className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-text outline-none" placeholder="15" />
        </div>
        <ActionButton type="submit" className="w-full justify-center">Add Slot</ActionButton>
      </form>
    </DashboardCard>
  );
}
