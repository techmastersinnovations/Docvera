"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ShieldCheck, Mail, Lock, User, MapPin, Briefcase, Plus, AlertCircle, Building2, IndianRupee, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("MALE");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");
  const [degree, setDegree] = useState("");
  const [specialization, setSpecialization] = useState("CARDIOLOGY");
  const [experienceYears, setExperienceYears] = useState("");
  const [medicalCouncilNumber, setMedicalCouncilNumber] = useState("");
  const [consultationFees, setConsultationFees] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicCity, setClinicCity] = useState("");
  const [clinicPinCode, setClinicPinCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const basePayload = {
      email, password, phone, full_name: fullName, gender, date_of_birth: dob, city, pin_code: pinCode, address,
    };

    try {
      if (role === "PATIENT") {
        const response = await api.post("/auth/register/patient/", basePayload);
        if (response.data.success) {
          setSuccess("Patient profile created successfully! Redirecting to login...");
          setTimeout(() => router.push("/login"), 2500);
        } else {
          setError(response.data.error || "Registration failed.");
        }
      } else {
        const doctorPayload = {
          ...basePayload, degree, specialization, experience_years: parseInt(experienceYears) || 0,
          medical_council_number: medicalCouncilNumber, consultation_fees: parseFloat(consultationFees) || 0,
          clinic_name: clinicName, clinic_address: clinicAddress, clinic_city: clinicCity, clinic_pin_code: clinicPinCode,
        };
        const response = await api.post("/auth/register/doctor/", doctorPayload);
        if (response.data.success) {
          setSuccess("Doctor application submitted! Admin must approve your credentials before login.");
          setTimeout(() => router.push("/login"), 4500);
        } else {
          setError(response.data.error || "Registration failed.");
        }
      }
    } catch (err: any) {
      let errMsg = "Registration failed.";
      if (err?.response?.data?.error) {
        errMsg = typeof err.response.data.error === 'object'
          ? JSON.stringify(err.response.data.error)
          : err.response.data.error;
      } else if (err?.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-card">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          <div className="card p-6 sm:p-8 space-y-8">
            <div className="text-center space-y-2">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="p-2 bg-primary rounded-lg">
                  <Activity className="h-5 w-5 text-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground tracking-tight">Docvera</span>
              </Link>
              <h2 className="text-2xl font-bold text-foreground">Create Platform Account</h2>
              <p className="text-sm text-foreground/70">Choose your clinical profile role to configure variables.</p>
            </div>

            {/* Role Selector */}
            <div className="flex bg-card p-1.5 border border-white/20 rounded-xl">
              <button
                type="button"
                onClick={() => setRole("PATIENT")}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
                  role === "PATIENT"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:text-foreground/80"
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole("DOCTOR")}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
                  role === "DOCTOR"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:text-foreground/80"
                }`}
              >
                Doctor / Provider
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <div className="p-4 bg-error/5 border border-error/10 rounded-xl flex items-start gap-3 text-error text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <span className="break-all">{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl flex items-start gap-3 text-accent text-sm">
                  <Plus className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Full Name</label>
                  <input type="text" required placeholder="Sarah Jenkins" value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-foreground/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Email Address</label>
                  <input type="email" required placeholder="jenkins@docvera.com" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-foreground/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Password</label>
                  <input type="password" required placeholder="Create a password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-foreground/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Mobile Number</label>
                  <input type="text" required placeholder="+91 9876543210" value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-foreground/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all">
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Date of Birth</label>
                  <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">City</label>
                  <input type="text" required placeholder="Bengaluru" value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-foreground/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">PIN Code</label>
                  <input type="text" required placeholder="560001" value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-foreground/50" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-foreground">Residential Address</label>
                  <textarea required rows={2} placeholder="House No, Street, Landmark..." value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-foreground/50 resize-none" />
                </div>
              </div>

              {role === "DOCTOR" && (
                <div className="border-t border-border pt-6 space-y-8">
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-text flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Professional Medical Credentials
                    </h3>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Medical Degree</label>
                        <input type="text" required placeholder="MBBS, MD - Cardiology" value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Specialization</label>
                        <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}
                          className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all">
                          <option value="CARDIOLOGY">Cardiology</option>
                          <option value="DERMATOLOGY">Dermatology</option>
                          <option value="PEDIATRICS">Pediatrics</option>
                          <option value="GENERAL_MEDICINE">General Medicine</option>
                          <option value="ORTHOPEDICS">Orthopedics</option>
                          <option value="GYNECOLOGY">Gynecology</option>
                          <option value="NEUROLOGY">Neurology</option>
                          <option value="OPHTHALMOLOGY">Ophthalmology</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Experience (Years)</label>
                        <input type="number" required placeholder="12" value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Medical Council Number</label>
                        <input type="text" required placeholder="KMC-87654" value={medicalCouncilNumber}
                          onChange={(e) => setMedicalCouncilNumber(e.target.value)}
                          className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all" />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-foreground">Consultation Fees (INR)</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                          <input type="number" required placeholder="800" value={consultationFees}
                            onChange={(e) => setConsultationFees(e.target.value)}
                            className="w-full bg-card border border-border focus:border-primary/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground outline-none transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-text flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Clinic / Hospital Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-foreground">Clinic / Hospital Name</label>
                        <input type="text" required placeholder="City Heart Care Center" value={clinicName}
                          onChange={(e) => setClinicName(e.target.value)}
                          className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Clinic City</label>
                        <input type="text" required placeholder="Bengaluru" value={clinicCity}
                          onChange={(e) => setClinicCity(e.target.value)}
                          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Clinic PIN Code</label>
                        <input type="text" required placeholder="560001" value={clinicPinCode}
                          onChange={(e) => setClinicPinCode(e.target.value)}
                          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Clinic Full Address</label>
                      <textarea required rows={2} placeholder="100 Feet Road, Near Metro Station" value={clinicAddress}
                        onChange={(e) => setClinicAddress(e.target.value)}
                        className="w-full bg-card border border-border focus:border-primary/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-foreground/50 resize-none" />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-foreground font-semibold rounded-xl hover:bg-primary-light transition-all disabled:opacity-50 text-sm"
              >
                <span>{loading ? "Registering..." : "Complete Registration"}</span>
              </button>
            </form>

            <hr className="border-border" />

            <div className="text-center text-sm text-text-secondary space-y-3">
              <div>
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Sign In
                </Link>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>Verifiable Doctor Credential Registry</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
