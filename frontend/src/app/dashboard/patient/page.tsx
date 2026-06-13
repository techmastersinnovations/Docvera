"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus, Calendar, Loader, Mail, Phone, MapPin,
  AlertCircle, Save, CheckCircle2, UserCheck, Camera, Clock, User
} from "lucide-react";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import CancelAppointmentModal from "@/components/patients/components/CancelAppointmentModal";
import ReviewModal from "@/components/patients/components/ReviewModal";

export default function PatientDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "edit-profile">("overview");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [cancelModal, setCancelModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [reviewModal, setReviewModal] = useState<{ open: boolean; id: string }>({ open: false, id: "" });

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profileRes, apptRes] = await Promise.all([
        api.get("/patients/profile/"),
        api.get("/appointments/dashboard/patient/")
      ]);
      if (profileRes.data.success) {
        const p = profileRes.data.data;
        setProfile(p);
        setFullName(p.full_name || "");
        setGender(p.gender || "MALE");
        setCity(p.city || "");
        setPinCode(p.pin_code || "");
        setAddress(p.address || "");
        setBloodGroup(p.blood_group || "");
        setEmergencyContact(p.emergency_contact || "");
        if (p.profile_photo) {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          setPhotoPreview(p.profile_photo.startsWith("http") ? p.profile_photo : `${baseUrl}${p.profile_photo}`);
        }
      }
      if (apptRes.data.success) {
        setAppointments(apptRes.data.data);
      }
    } catch (err) {
      console.error("Error loading system metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setFormMessage(null);
    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("gender", gender);
    formData.append("city", city);
    formData.append("pin_code", pinCode);
    formData.append("address", address);
    if (bloodGroup) formData.append("blood_group", bloodGroup);
    if (emergencyContact) formData.append("emergency_contact", emergencyContact);
    if (selectedFile) formData.append("profile_photo", selectedFile);

    try {
      const response = await api.put("/patients/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        const updatedData = response.data.data;
        setProfile(updatedData);
        setFormMessage({ type: "success", text: "Profile updated successfully!" });
        setSelectedFile(null);
        if (updatedData.profile_photo) {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          setPhotoPreview(updatedData.profile_photo.startsWith("http") ? updatedData.profile_photo : `${baseUrl}${updatedData.profile_photo}`);
        }
        setTimeout(() => setActiveTab("overview"), 1500);
      }
    } catch (err: any) {
      setFormMessage({
        type: "error",
        text: err?.response?.data?.error ? JSON.stringify(err.response.data.error) : "Update failed."
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#143642] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="h-10 w-10 text-[#00a6a6] animate-spin mx-auto" />
          <p className="text-white/60 text-sm font-medium">Loading your health profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#143642]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-white/10">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Patient Dashboard</h1>
            <p className="text-white/60">Manage your appointments, update your profile, and track your health journey.</p>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => { setFormMessage(null); setActiveTab(activeTab === "overview" ? "edit-profile" : "overview"); }}
              className={`flex-1 lg:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-white/8 text-white border border-white/15 hover:bg-white/12"
                  : "bg-[#015d67] text-white hover:bg-[#00a6a6]"
              }`}
            >
              {activeTab === "overview" ? "Edit Profile" : "Back to Overview"}
            </button>
            <Link href="/doctors" className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#015d67] hover:bg-[#00a6a6] text-white font-semibold rounded-xl transition-all text-sm">
              <Plus className="h-4 w-4" />
              Book Appointment
            </Link>
          </div>
        </div>

        {activeTab === "overview" ? (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Profile Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#1a4a5a] border border-white/10 rounded-2xl overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-[#015d67] to-[#00a6a6]" />
                <div className="relative px-6 -mt-14">
                  <div className="relative group w-fit">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className="h-28 w-28 rounded-2xl object-cover border-4 border-[#1a4a5a] shadow-lg" />
                    ) : (
                      <div className="h-28 w-28 rounded-2xl bg-[#0e2c36] border-4 border-[#1a4a5a] shadow-lg flex items-center justify-center">
                        <span className="font-bold text-4xl text-[#00a6a6]">
                          {profile?.full_name?.charAt(0) || "P"}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 h-4 w-4 bg-[#00a6a6] rounded-full border-2 border-[#1a4a5a] shadow" />
                  </div>
                </div>
                <div className="px-6 pt-3 pb-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-xl text-white">{profile?.full_name}</h3>
                    <p className="text-white/60 text-sm mt-0.5">Patient &bull; {profile?.city || "Location not set"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/8 border border-white/12 rounded-lg text-xs text-white font-semibold">
                      {profile?.blood_group?.replace("_POSITIVE", "+")?.replace("_NEGATIVE", "-") || "N/A"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00a6a6]/15 border border-[#00a6a6]/25 rounded-lg text-xs text-[#00a6a6] font-semibold">
                      <UserCheck className="h-3 w-3" />
                      Verified
                    </span>
                  </div>
                </div>
                <hr className="border-white/10" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                      <Mail className="h-5 w-5 text-[#00a6a6]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-semibold text-white/50 tracking-wider">Email</p>
                      <p className="text-sm text-white font-medium truncate">{profile?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                      <Phone className="h-5 w-5 text-[#00a6a6]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-semibold text-white/50 tracking-wider">Phone</p>
                      <p className="text-sm text-white font-medium">{profile?.phone || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                      <MapPin className="h-5 w-5 text-[#00a6a6]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-semibold text-white/50 tracking-wider">Location</p>
                      <p className="text-sm text-white font-medium">{profile?.city || "Not set"}</p>
                    </div>
                  </div>
                </div>
                {profile?.address && (
                  <>
                    <hr className="border-white/10" />
                    <div className="p-6">
                      <p className="text-[10px] uppercase font-semibold text-white/50 tracking-wider mb-2">Address</p>
                      <p className="text-sm text-white/80 leading-relaxed">{profile?.address}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Appointments */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-[#1a4a5a] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                      <Calendar className="h-5 w-5 text-[#00a6a6]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Your Appointments</h2>
                      <p className="text-xs text-white/60">Manage your scheduled visits</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs bg-white/8 border border-white/12 font-semibold text-white/70">
                    {appointments.length} Total
                  </span>
                </div>

                <div className="divide-y divide-white/8">
                  {appointments.length > 0 ? (
                    appointments.map((appt) => (
                      <div key={appt.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 hover:bg-white/3 transition-all group">
                        <div className="space-y-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/8 text-white border border-white/12 uppercase tracking-widest">
                              {appt.specialization || "General"}
                            </span>
                            <span className={`px-3 py-1 text-[11px] font-bold rounded-xl border uppercase tracking-wider ${
                              appt.status === "COMPLETED" ? "bg-[#00a6a6]/15 text-[#00a6a6] border-[#00a6a6]/25" :
                              appt.status === "CANCELLED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                              "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            }`}>
                              {appt.status}
                            </span>
                          </div>
                          <h4 className="text-white font-bold text-lg group-hover:text-[#00a6a6] transition-colors">Dr. {appt.doctor_name || "Specialist"}</h4>
                          <div className="flex flex-wrap gap-4 text-sm text-white/60">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-[#00a6a6]" />
                              <span>{appt.booking_date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-[#00a6a6]" />
                              <span>{appt.start_time} - {appt.end_time}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-white/10 pt-4 sm:pt-0">
                          <div className="text-left sm:text-right space-y-1">
                            <span className="block text-[10px] text-white/50 font-semibold uppercase tracking-wider">Fee</span>
                            <span className="text-[#00a6a6] font-bold text-lg">₹{appt.base_amount}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {(appt.status === "PENDING" || appt.status === "CONFIRMED") && (
                              <button
                                onClick={() => setCancelModal({ open: true, id: appt.id })}
                                className="px-4 py-2 bg-red-500/8 hover:bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl transition-all"
                              >
                                Cancel
                              </button>
                            )}
                            {appt.status === "COMPLETED" && (
                              <button
                                onClick={() => setReviewModal({ open: true, id: appt.id })}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/12 text-white text-xs font-semibold rounded-xl transition-all"
                              >
                                Review
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-16 text-center space-y-4">
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl w-fit mx-auto">
                        <Calendar className="h-6 w-6 text-white/40" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-white font-medium">No appointments yet</p>
                        <p className="text-white/60 text-sm">Book your first appointment to get started</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Profile */
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#1a4a5a] border border-white/10 rounded-2xl p-6 sm:p-8">
              {formMessage && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold border ${
                  formMessage.type === "success" ? "bg-[#00a6a6]/10 text-[#00a6a6] border-[#00a6a6]/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}>
                  {formMessage.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                  <span>{formMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="relative group overflow-hidden rounded-xl shrink-0">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="h-24 w-24 rounded-xl object-cover border border-white/10 shadow-sm" />
                    ) : (
                      <div className="h-24 w-24 rounded-xl bg-[#0e2c36] border border-white/10 flex items-center justify-center text-white/40">
                        <User className="h-8 w-8" />
                      </div>
                    )}
                    <label htmlFor="photo-upload" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-xl">
                      <Camera className="h-6 w-6 text-white" />
                    </label>
                    <input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="text-base font-bold text-white">Profile Photo</h4>
                    <p className="text-xs text-white/60 mt-1">Click the photo to upload a new image.</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70">Full Name</label>
                    <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-[#00a6a6] rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-[#00a6a6] rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all">
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70">Blood Group</label>
                    <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-[#00a6a6] rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all">
                      <option value="">Select</option>
                      <option value="A_POSITIVE">A+</option>
                      <option value="A_NEGATIVE">A-</option>
                      <option value="B_POSITIVE">B+</option>
                      <option value="B_NEGATIVE">B-</option>
                      <option value="O_POSITIVE">O+</option>
                      <option value="O_NEGATIVE">O-</option>
                      <option value="AB_POSITIVE">AB+</option>
                      <option value="AB_NEGATIVE">AB-</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70">Emergency Contact</label>
                    <input type="text" placeholder="+91 00000 00000" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-[#00a6a6] rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-white/35" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70">City</label>
                    <input type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-[#00a6a6] rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70">PIN Code</label>
                    <input type="text" required value={pinCode} onChange={(e) => setPinCode(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-[#00a6a6] rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all" />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-white/70">Full Address</label>
                    <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-[#00a6a6] rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all resize-none" />
                  </div>
                </div>

                <button type="submit" disabled={updating}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#015d67] hover:bg-[#00a6a6] text-white font-semibold rounded-xl transition-all disabled:opacity-50 text-sm">
                  {updating ? <Loader className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                  <span>Save Changes</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <CancelAppointmentModal
        isOpen={cancelModal.open}
        appointmentId={cancelModal.id}
        onClose={() => setCancelModal({ open: false, id: null })}
        onSuccess={() => { setCancelModal({ open: false, id: null }); fetchDashboardData(); }}
      />
      <ReviewModal
        isOpen={reviewModal.open}
        appointmentId={reviewModal.id}
        onClose={() => setReviewModal({ open: false, id: "" })}
        onSuccess={() => { setReviewModal({ open: false, id: "" }); fetchDashboardData(); }}
      />
    </div>
  );
}
