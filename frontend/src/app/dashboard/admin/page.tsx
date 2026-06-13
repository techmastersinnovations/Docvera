"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users, ShieldCheck, CreditCard, Settings, LogOut,
  Loader, AlertCircle, CheckCircle2, XCircle, Ban, Activity
} from "lucide-react";
import { api } from "@/lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"PROVIDERS" | "PAYOUTS" | "SETTINGS">("PROVIDERS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT" | "SUSPEND" | "ACTIVATE">("APPROVE");
  const [actionReason, setActionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [newSettingKey, setNewSettingKey] = useState("");
  const [newSettingValue, setNewSettingValue] = useState("");

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/admin/doctors/");
      setDoctors(res.data.results || res.data.data || res.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load providers.");
    }
  };

  const fetchPayouts = async () => {
    try {
      const res = await api.get("/admin/payouts/");
      if (res.data.success) setPayouts(res.data.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load payouts.");
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get("/admin/settings/");
      if (res.data.success) setSettings(res.data.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load settings.");
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (activeTab === "PROVIDERS") fetchDoctors().finally(() => setLoading(false));
    if (activeTab === "PAYOUTS") fetchPayouts().finally(() => setLoading(false));
    if (activeTab === "SETTINGS") fetchSettings().finally(() => setLoading(false));
  }, [activeTab]);

  const handleDoctorAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post(`/admin/doctors/${selectedDoctorId}/action/`, { action: actionType, reason: actionReason });
      setIsActionOpen(false);
      setActionReason("");
      fetchDoctors();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessPayout = async (payoutId: string) => {
    if (!confirm("Mark this payout as paid?")) return;
    try {
      await api.post(`/admin/payouts/${payoutId}/`);
      fetchPayouts();
    } catch { alert("Failed to process payout."); }
  };

  const handleSaveSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSettingKey || !newSettingValue) return;
    try {
      await api.post("/admin/settings/", { key: newSettingKey, value: newSettingValue });
      setNewSettingKey(""); setNewSettingValue("");
      fetchSettings();
    } catch { alert("Failed to save setting."); }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const tabs = [
    { id: "PROVIDERS" as const, label: "Provider Management", icon: Users },
    { id: "PAYOUTS" as const, label: "Financial Settlements", icon: CreditCard },
    { id: "SETTINGS" as const, label: "Global Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text tracking-tight">Admin Console</h1>
            <p className="text-text-secondary mt-2">Manage providers, financial settlements, and system configuration.</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-error/5 border border-error/10 text-error rounded-xl font-semibold hover:bg-error/10 transition-all w-fit text-sm">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 border-b border-border pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 font-semibold border-b-2 transition-all whitespace-nowrap text-sm ${
                  isActive ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader className="h-8 w-8 text-primary animate-spin" />
            <span className="text-text-secondary text-sm font-medium">Loading...</span>
          </div>
        ) : error ? (
          <div className="p-6 bg-error/5 border border-error/10 text-error rounded-2xl flex items-center gap-3 text-sm">
            <AlertCircle className="h-5 w-5" /> {error}
          </div>
        ) : (
          <>
            {activeTab === "PROVIDERS" && (
              <div className="space-y-4">
                {doctors.length === 0 ? (
                  <p className="text-text-secondary text-center py-10">No providers found.</p>
                ) : (
                  doctors.map((doc, idx) => (
                    <div key={idx} className="card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`px-3 py-1 text-[11px] font-bold rounded uppercase tracking-wider border ${
                            doc.approval_status === "APPROVED" ? "bg-accent/10 text-accent border-accent/20" :
                            doc.approval_status === "REJECTED" ? "bg-error/10 text-error border-error/10" :
                            "bg-warning/10 text-warning border-warning/20"
                          }`}>
                            {doc.approval_status}
                          </span>
                          {doc.status === 'SUSPENDED' && (
                            <span className="px-3 py-1 bg-error/10 text-error text-[11px] font-bold rounded uppercase tracking-wider border border-error/10">
                              SUSPENDED
                            </span>
                          )}
                          <span className="text-[11px] text-text-secondary font-medium">
                            {doc.specialization} &bull; {doc.medical_council_number}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-text">Dr. {doc.full_name}</h3>
                          <p className="text-sm text-text-secondary">{doc.degree} &bull; {doc.clinic_name}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {doc.approval_status === 'PENDING_APPROVAL' && (
                          <>
                            <button onClick={() => { setSelectedDoctorId(doc.user); setActionType("APPROVE"); setIsActionOpen(true); }}
                              className="px-4 py-2 bg-accent/10 text-accent hover:bg-accent/20 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 border border-accent/20">
                              <CheckCircle2 className="h-4 w-4" /> Approve
                            </button>
                            <button onClick={() => { setSelectedDoctorId(doc.user); setActionType("REJECT"); setIsActionOpen(true); }}
                              className="px-4 py-2 bg-error/10 text-error hover:bg-error/20 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 border border-error/10">
                              <XCircle className="h-4 w-4" /> Reject
                            </button>
                          </>
                        )}
                        {doc.approval_status === 'APPROVED' && doc.status === 'ACTIVE' && (
                          <button onClick={() => { setSelectedDoctorId(doc.user); setActionType("SUSPEND"); setIsActionOpen(true); }}
                            className="px-4 py-2 bg-warning/10 text-warning hover:bg-warning/20 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 border border-warning/20">
                            <Ban className="h-4 w-4" /> Suspend
                          </button>
                        )}
                        {doc.approval_status === 'APPROVED' && doc.status === 'SUSPENDED' && (
                          <button onClick={() => { setSelectedDoctorId(doc.user); setActionType("ACTIVATE"); setIsActionOpen(true); }}
                            className="px-4 py-2 bg-accent/10 text-accent hover:bg-accent/20 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 border border-accent/20">
                            <Activity className="h-4 w-4" /> Reactivate
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "PAYOUTS" && (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-text">Payout ID</th>
                        <th className="px-6 py-4 font-semibold text-text">Doctor ID</th>
                        <th className="px-6 py-4 font-semibold text-text">Amount</th>
                        <th className="px-6 py-4 font-semibold text-text">Status</th>
                        <th className="px-6 py-4 font-semibold text-text text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {payouts.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-10 text-center text-text-secondary">No payout records found.</td></tr>
                      ) : (
                        payouts.map((p) => (
                          <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                            <td className="px-6 py-4 text-text font-mono text-xs">{p.id?.split('-')[0]}...</td>
                            <td className="px-6 py-4 text-text font-mono text-xs">{p.doctor_id?.split('-')[0]}...</td>
                            <td className="px-6 py-4 font-semibold text-text">₹{p.amount}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${
                                p.status === 'PAID' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-warning/10 text-warning border-warning/20'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {p.status === 'PENDING' && (
                                <button onClick={() => handleProcessPayout(p.id)} className="text-primary font-semibold hover:underline text-xs">
                                  Mark as Paid
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "SETTINGS" && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="card p-6 sm:p-8 space-y-6">
                  <h3 className="text-xl font-bold text-text">Add / Update Setting</h3>
                  <form onSubmit={handleSaveSetting} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text uppercase">Config Key</label>
                      <input required value={newSettingKey} onChange={(e) => setNewSettingKey(e.target.value)}
                        placeholder="e.g. PLATFORM_FEE"
                        className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-3 text-sm text-text outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text uppercase">Config Value</label>
                      <input required value={newSettingValue} onChange={(e) => setNewSettingValue(e.target.value)}
                        placeholder="e.g. 5.00"
                        className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-3 text-sm text-text outline-none" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-primary text-foreground font-semibold rounded-xl hover:bg-primary-light transition-all text-sm">
                      Save Configuration
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-text">Active Configurations</h3>
                  {settings.length === 0 ? (
                    <div className="p-6 border border-dashed border-border rounded-2xl text-center text-text-secondary">No settings configured.</div>
                  ) : (
                    settings.map((s, idx) => (
                      <div key={idx} className="card p-5 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold text-text font-mono">{s.key}</p>
                          <p className="text-xs text-text-secondary mt-1">{s.description || 'System variable'}</p>
                        </div>
                        <span className="px-3 py-1 bg-surface border border-border rounded-lg text-text font-mono text-sm">{s.value}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Modal */}
      {isActionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg card p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-text">Confirm Action</h3>
              <button onClick={() => setIsActionOpen(false)} className="text-text-secondary hover:text-text font-semibold text-sm">Close</button>
            </div>

            <form onSubmit={handleDoctorAction} className="space-y-6">
              <div className="p-4 bg-surface border border-border rounded-xl">
                <p className="text-sm text-text-secondary">
                  You are about to <span className="font-bold text-text">{actionType}</span> this provider profile.
                </p>
              </div>

              {(actionType === "REJECT" || actionType === "SUSPEND") && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text uppercase">Reason (Required)</label>
                  <textarea required rows={4} value={actionReason} onChange={(e) => setActionReason(e.target.value)}
                    className="w-full bg-card border border-border focus:border-error/50 rounded-xl px-4 py-3 text-sm text-text outline-none"
                    placeholder="Enter reason for this action..." />
                </div>
              )}

              <button type="submit" disabled={actionLoading}
                className="w-full py-3.5 font-semibold rounded-xl transition-all bg-primary text-foreground hover:bg-primary-light disabled:opacity-50 text-sm">
                {actionLoading ? <Loader className="animate-spin h-5 w-5 mx-auto" /> : "Execute"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
