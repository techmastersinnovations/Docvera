"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, ArrowRight, Loader, ArrowLeft, Hospital, Star, Clock, IndianRupee } from "lucide-react";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function HospitalDetailPage() {
  const params = useParams();
  const hospitalId = params.id as string;

  const [hospital, setHospital] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/hospitals/${hospitalId}/`);
        if (response.data.success) {
          setHospital(response.data.data.hospital);
          setDoctors(response.data.data.doctors);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hospitalId]);

  if (loading) return (
    <div className="min-h-screen bg-primary text-primary-foreground flex items-center justify-center">
      <Loader className="h-8 w-8 text-primary animate-spin" />
    </div>
  );

  if (!hospital) return (
    <div className="min-h-screen bg-primary text-primary-foreground flex flex-col items-center justify-center gap-4 text-center">
      <Hospital className="h-12 w-12 text-text-muted" />
      <p className="text-text-secondary">Hospital not found.</p>
      <Link href="/hospitals" className="text-sm font-semibold text-primary hover:underline">Back to search</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        <Link href="/hospitals" className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Link>

        <div className="card p-8 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-text">{hospital.name}</h1>
              <div className="flex items-center gap-2 text-text-secondary">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{hospital.address}, {hospital.city} - {hospital.pin_code}</span>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider rounded-lg">
              Verified
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-text">Specialists at this Facility</h2>

          {doctors.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-text-secondary">No doctors currently listed for this hospital.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {doctors.map((doc) => (
                <div key={doc.user} className="card p-6 flex flex-col justify-between hover:card-elevated transition-all group">
                  <div className="space-y-3">
                    <span className="px-2.5 py-1 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider rounded-md">
                      {doc.specialization}
                    </span>
                    <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">
                      Dr. {doc.full_name}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {doc.experience_years} Years Experience
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {doc.consultation_fees}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <Link
                      href={`/booking?doctor_id=${doc.user}&hospital_id=${hospital.id}`}
                      className="flex items-center justify-between text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      <span>Book Appointment</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
