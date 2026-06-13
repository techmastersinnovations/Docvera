"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, ArrowLeft, Loader, Star, Hospital } from "lucide-react";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";

function HospitalResults() {
  const searchParams = useSearchParams();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const name = searchParams.get("name") || "";
  const city = searchParams.get("city") || "";
  const pin_code = searchParams.get("pin_code") || "";

  const fetchHospitals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/hospitals/search/", {
        params: { name, city, pin_code },
      });
      if (response.data.success) {
        setHospitals(response.data.data);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load hospitals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [name, city, pin_code]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Hospitals in {city || pin_code || "Your Area"}</h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader className="h-8 w-8 text-primary animate-spin" />
          <span className="text-text-secondary text-sm">Searching facilities...</span>
        </div>
      ) : error ? (
        <div className="p-6 bg-error/5 border border-error/10 text-error text-sm rounded-2xl">{error}</div>
      ) : hospitals.length === 0 ? (
        <div className="text-center py-20 card space-y-4">
          <Hospital className="h-12 w-12 text-text-muted mx-auto" />
          <h3 className="text-lg font-bold text-text">No Hospitals Found</h3>
          <p className="text-sm text-text-secondary">Try adjusting your location or search terms.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hosp) => (
            <Link
              key={hosp.id}
              href={`/hospitals/${hosp.id}`}
              className="card p-6 flex flex-col justify-between hover:card-elevated transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 bg-accent/10 text-accent border border-accent/20 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    Verified Facility
                  </span>
                  <Star className="h-4 w-4 text-warning fill-warning" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">{hosp.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <MapPin className="h-4 w-4" />
                    <span>{hosp.city}, {hosp.pin_code}</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary line-clamp-2">{hosp.address}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">View Doctors & Book</span>
                <ArrowLeft className="h-4 w-4 text-text-muted rotate-180" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HospitalsPage() {
  return (
    <div className="min-h-screen bg-card">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Suspense fallback={<div className="text-center py-20 text-text-secondary">Loading...</div>}>
          <HospitalResults />
        </Suspense>
      </div>
    </div>
  );
}
