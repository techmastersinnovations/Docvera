//src/components/patients/components/CancelAppointmentModal.tsx
"use client";

import React, { useState } from "react";
import { X, Trash2, Loader, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface CancelAppointmentModalProps {
  isOpen: boolean;
  appointmentId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CancelAppointmentModal({ isOpen, appointmentId, onClose, onSuccess }: CancelAppointmentModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCancel = async () => {
    if (!appointmentId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/appointments/cancel/${appointmentId}/`, { reason });
      if (response.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || "Failed to cancel appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-card/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Cancel Appointment</h3>
            <button onClick={onClose} className="text-foreground hover:text-blue-900 transition-colors"><X className="h-5 w-5" /></button>
          </div>
          <p className="text-xs text-foreground mt-1">This action cannot be undone.</p>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs flex items-center gap-2"><AlertCircle className="h-4 w-4" />{error}</div>}
          <div className="p-4 bg-card shadow-xl shadow-black/50/50/10 border border-blue-100/20 rounded-xl">
            <p className="text-xs text-foreground"><strong>Note:</strong> Cancellations made more than 24 hours before the appointment are eligible for a full refund.</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Reason for Cancellation (Optional)</label>
            <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Help us improve by sharing why you're cancelling..." className="w-full bg-card border border-white/10 focus:border-blue-100 rounded-xl px-4 py-3 text-sm text-foreground outline-none placeholder:text-foreground resize-none" />
          </div>
        </div>
        <div className="p-6 border-t border-white/10 flex items-center justify-end space-x-3">
          <button onClick={onClose} disabled={loading} className="px-5 py-2.5 bg-card shadow-xl shadow-black/50/50 hover:bg-telehealth-blue text-foreground text-xs font-bold rounded-xl transition-colors">Keep Appointment</button>
          <button onClick={handleCancel} disabled={loading} className="px-5 py-2.5 bg-emergency-red hover:bg-red-600 text-foreground text-xs font-bold rounded-xl transition-colors flex items-center gap-2">
            {loading ? <><Loader className="h-4 w-4 animate-spin" /> Processing...</> : <><Trash2 className="h-4 w-4" /> Yes, Cancel</>}
          </button>
        </div>
      </div>
    </div>
  );
}