//src/components/booking/PaymentModal.tsx
"use client";

import React, { useState } from "react";
import { Loader, QrCode, Smartphone } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  orderId: string | null;
  totalAmount: number;
  paymentMethod: "CARD" | "UPI" | "NET_BANKING";
  setPaymentMethod: (m: "CARD" | "UPI" | "NET_BANKING") => void;
  isLoading: boolean;
  onVerify: () => void;
  onClose?: () => void;
}

export default function PaymentModal({
  isOpen,
  orderId,
  totalAmount,
  paymentMethod,
  setPaymentMethod,
  isLoading,
  onVerify,
  onClose
}: PaymentModalProps) {
  // Local state to handle UPI fallback UI
  const [upiId, setUpiId] = useState("");
  const [showManualUpi, setShowManualUpi] = useState(false);

  if (!isOpen) return null;

  // Disable verify button if manual UPI is selected but no valid VPA (UPI ID) is entered
  const isVerifyDisabled = isLoading || (paymentMethod === "UPI" && showManualUpi && !upiId.includes("@"));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-card/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl space-y-6 p-6 relative">
        
        {/* Close Button */}
        {onClose && (
            <button onClick={onClose} className="absolute top-4 right-4 text-foreground hover:text-blue-900 transition-colors">
                ✕
            </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-600 rounded-lg text-foreground font-extrabold text-xs">RP</div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-foreground">Razorpay Secure</h4>
              <p className="text-[10px] text-foreground truncate max-w-[150px]">Order: {orderId}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-surgical-steel/10 border border-white/10/20 text-foreground rounded text-[10px] font-bold tracking-wider">SANDBOX</span>
        </div>

        {/* Payment Summary */}
        <div className="bg-card p-4 rounded-xl border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-foreground">Total Amount</span>
            <span className="text-lg font-bold text-foreground">₹{totalAmount.toFixed(2)}</span>
          </div>
          <div className="text-[10px] text-foreground text-right">Includes platform fee and taxes</div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider">Payment Method</label>
          <div className="grid grid-cols-3 gap-3">
            {["CARD", "UPI", "NET_BANKING"].map((method) => (
              <button 
                key={method}
                type="button"
                onClick={() => {
                  setPaymentMethod(method as any);
                  setShowManualUpi(false); // Reset UPI view when switching tabs
                }}
                className={`py-3.5 text-[10px] font-bold rounded-xl border transition-all ${
                  paymentMethod === method
                    ? "bg-card border-white/10 text-foreground shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                    : "bg-card border-white/10 hover:border-telehealth-blue text-foreground"
                }`}
              >
                {method.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Payment Body */}
        <div className="min-h-[160px] flex flex-col justify-center">
          {paymentMethod === "CARD" && (
            <div className="text-center space-y-3 animate-in fade-in">
              <div className="h-12 w-12 bg-card border border-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-foreground font-bold">💳</span>
              </div>
              <p className="text-sm text-foreground font-medium">Test Card Gateway Selected</p>
              <p className="text-[10px] text-foreground">Processing happens automatically in bypass mode.</p>
            </div>
          )}

          {paymentMethod === "NET_BANKING" && (
            <div className="text-center space-y-3 animate-in fade-in">
              <div className="h-12 w-12 bg-card border border-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-foreground font-bold">🏦</span>
              </div>
              <p className="text-sm text-foreground font-medium">Test Net Banking Selected</p>
              <p className="text-[10px] text-foreground">Processing happens automatically in bypass mode.</p>
            </div>
          )}

          {paymentMethod === "UPI" && (
            <div className="bg-card/50 p-4 rounded-xl border border-white/10/80 animate-in fade-in zoom-in-95 duration-200">
              {!showManualUpi ? (
                <div className="text-center space-y-4">
                  {/* Mock QR Code Frame */}
                  <div className="h-36 w-36 bg-research-paper p-2 rounded-xl mx-auto flex items-center justify-center border-4 border-white/10 relative">
                    <QrCode className="h-24 w-24 text-trust-blue" strokeWidth={1} />
                    {/* Simulated Scanner Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-surgical-steel/50 blur-[2px] animate-[bounce_2s_infinite]" />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-foreground font-bold flex items-center justify-center gap-1.5">
                      <Smartphone className="h-3.5 w-3.5 text-foreground" />
                      Scan using any UPI App
                    </p>
                    <p className="text-[10px] text-foreground">Google Pay, PhonePe, Paytm</p>
                  </div>

                  <div className="pt-2 border-t border-white/10/50">
                    <button 
                      type="button"
                      onClick={() => setShowManualUpi(true)}
                      className="text-[11px] text-foreground font-bold hover:text-blue-900 transition-colors py-1"
                    >
                      QR not working? Enter UPI ID manually
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-left animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      Enter UPI ID / VPA
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. sachin.pratik97@okbank.com"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-card shadow-xl shadow-black/50/50 border border-telehealth-blue focus:border-white/10 focus:ring-1 focus:ring-surgical-steel/30 rounded-xl px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-foreground"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <button 
                      type="button"
                      onClick={() => {
                        setShowManualUpi(false);
                        setUpiId("");
                      }}
                      className="text-[10px] text-foreground hover:text-blue-900 transition-colors"
                    >
                      ← Back to QR Code
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Verify & Confirm Button */}
        <button 
          type="button"
          onClick={onVerify}
          disabled={isVerifyDisabled}
          className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-foreground font-extrabold rounded-xl hover:shadow-xl hover:shadow-surgical-steel/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="inline-flex items-center space-x-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span>Verifying Signature...</span>
            </div>
          ) : (
            <span>Pay ₹{totalAmount.toFixed(2)} & Confirm</span>
          )}
        </button>

        <div className="text-center text-[10px] text-foreground font-medium">
          Sandbox bypass utilizes strict SHA-256 HMAC backend verification.
        </div>
      </div>
    </div>
  );
}