//src/components/patients/components/ReviewModal.tsx
"use client";

import React, { useState } from "react";
import { X, Star, CheckCircle, Loader } from "lucide-react";
import { api } from "@/lib/api";

interface ReviewModalProps {
  isOpen: boolean;
  appointmentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ isOpen, appointmentId, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const response = await api.post("/reviews/create/", { appointment_id: appointmentId, rating, comment });
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
          setComment("");
          setSuccess(false);
        }, 2000);
      }
    } catch (err: any) {
      alert(err?.error || err?.message || "Review submission failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-card/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <div className="w-full max-w-md bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-8 text-center space-y-4">
          <CheckCircle className="h-12 w-12 text-blue-700 mx-auto animate-bounce" />
          <h4 className="text-lg font-bold text-foreground">Review Submitted!</h4>
          <p className="text-xs text-foreground">Thank you for rating your consultation provider.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-card/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl space-y-6 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-foreground">Write Clinical Review</h3>
          <button onClick={onClose} className="text-foreground hover:text-blue-900 text-xs font-bold"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Doctor Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                  <Star className={`h-7 w-7 ${rating >= star ? "text-foreground fill-hospital-orange" : "text-foreground"}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Comments & Details</label>
            <textarea required rows={4} placeholder="Provide diagnostic insights, response timings, and feedback..." value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-card border border-white/10 focus:border-blue-100 rounded-xl px-4 py-2.5 text-xs text-foreground outline-none placeholder:text-telehealth-blue resize-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-500 text-foreground font-bold rounded-xl hover:shadow-lg transition-all">
            {loading ? <><Loader className="h-4 w-4 animate-spin inline mr-2" /> Submitting...</> : "Submit Verified Review"}
          </button>
        </form>
      </div>
    </div>
  );
}