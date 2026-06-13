"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Stethoscope, ShieldCheck, ArrowLeft, ArrowRight, Loader, Filter } from "lucide-react";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";

function SearchResults() {
  const searchParams = useSearchParams();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lat = searchParams.get("lat") || "";
  const lng = searchParams.get("lng") || "";
  const pin = searchParams.get("pin") || "";
  const city = searchParams.get("city") || "";
  const initialSpecialization = searchParams.get("specialization") || "";

  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialization);
  const [cityFilter, setCityFilter] = useState(city);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/doctors/search/", {
        params: { lat, lng, pin_code: pin, city: cityFilter, specialization: selectedSpecialty },
      });
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load doctor directory listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty, cityFilter, lat, lng, pin]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-[#1a4a5a] border border-white/10 p-6 rounded-2xl grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/70">Specialty</label>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full bg-white/5 border border-white/15 focus:border-[#00a6a6] rounded-xl px-4 py-2.5 text-sm text-white outline-none"
          >
            <option value="">All Specializations</option>
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
          <label className="text-xs font-semibold text-white/70">City</label>
          <input
            type="text"
            placeholder="e.g. Bengaluru"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/15 focus:border-[#00a6a6] rounded-xl px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/40"
          />
        </div>

        <button
          onClick={fetchDoctors}
          className="sm:col-span-2 lg:col-span-1 mt-auto flex items-center justify-center gap-2 py-3 bg-[#015d67] hover:bg-[#00a6a6] text-white font-semibold rounded-xl transition-all text-sm"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader className="h-8 w-8 text-[#00a6a6] animate-spin" />
          <span className="text-white/60 text-sm">Searching our certified medical registry...</span>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl">
          {error}
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-20 bg-[#1a4a5a] border border-white/10 rounded-2xl space-y-4">
          <Stethoscope className="h-12 w-12 text-white/40 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Verified Specialists Match</h3>
          <p className="text-sm text-white/60 max-w-sm mx-auto">
            Try adjusting your specialized category, removing city filters, or enabling browser geolocation.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {doctors.map((doc) => (
            <div key={doc.user} className="bg-[#1a4a5a] border border-white/10 hover:border-[#00a6a6]/50 p-6 flex flex-col justify-between transition-all rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 px-3 py-1.5 bg-[#015d67] border-l border-b border-white/10 text-white text-xs font-semibold rounded-bl-xl">
                {doc.experience_years} Years
              </div>

              <div className="space-y-4">
                <span className="px-2.5 py-1 bg-[#00a6a6]/20 text-[#00a6a6] border border-[#00a6a6]/30 rounded-md text-[10px] font-bold tracking-wider">
                  {doc.specialization}
                </span>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#00a6a6] transition-colors">
                    Dr. {doc.full_name}
                  </h3>
                  <p className="text-xs text-white/60">{doc.degree}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <MapPin className="h-4 w-4 text-[#00a6a6]" />
                  <span>{doc.clinic_city} ({doc.clinic_pin_code})</span>
                </div>
                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                  {doc.about || "Clinical provider offering high-fidelity consultations, general diagnostics, and tailored therapeutic strategies."}
                </p>
              </div>

              <hr className="border-white/10 my-5" />

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/50 uppercase tracking-wider block font-semibold">Consultation Fee</span>
                  <span className="text-base font-bold text-white">₹{doc.consultation_fees}</span>
                </div>
                <Link
                  href={`/booking?doctor_id=${doc.user}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#015d67] hover:bg-[#00a6a6] text-white text-xs font-semibold rounded-xl transition-all"
                >
                  Book Now
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DoctorsSearchPage() {
  return (
    <div className="min-h-screen bg-[#143642]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-[#00a6a6] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Verified Specialist Directory</h1>
          <p className="text-white/70 text-sm">Review certified clinicians and book appointments.</p>
        </div>

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader className="h-8 w-8 text-[#00a6a6] animate-spin" />
            <span className="text-white/60 text-sm">Loading...</span>
          </div>
        }>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
