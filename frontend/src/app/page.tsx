//src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Stethoscope, 
  Activity, 
  Compass, 
  ArrowRight, 
  Award, 
  Eye,
  Plus,
  Hospital as HospitalIcon,
  CheckCircle,
  Shield,
  Sparkles
} from "lucide-react";
import AOS from "aos";

import Navbar from "@/components/Navbar";

interface Doctor {
  user: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  city: string;
  pin_code: string;
  address: string;
  degree: string;
  specialization: string;
  experience_years: number;
  medical_council_number: string;
  consultation_fees: string;
  languages_spoken: string;
  about: string;
  clinic_name: string;
  clinic_address: string;
  clinic_city: string;
  clinic_pin_code: string;
  clinic_latitude: string | null;
  clinic_longitude: string | null;
  approval_status: string;
  profile_photo: string | null;
  availabilities: any[];
}

export default function LandingPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [searchMode, setSearchMode] = useState<'DOCTOR' | 'HOSPITAL'>('DOCTOR');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [cityInput, setCityInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "success" | "denied">("idle");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedPreviewIdx, setSelectedPreviewIdx] = useState<number>(0);

  const handleGeoLocate = () => {
    if (!navigator.geolocation) {
      setGeoStatus("denied");
      setSearchError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoStatus("loading");
    setSearchError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setGeoStatus("success");
      },
      (error) => {
        setGeoStatus("denied");
        setSearchError("Location access denied. Please use PIN or City search.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSearch = () => {
    setSearchError(null);
    if (!latitude && !pinInput.trim() && !cityInput.trim()) {
      setSearchError("Please enable location access or enter a PIN Code/City to search.");
      return;
    }
    const params = new URLSearchParams();
    if (latitude && longitude) {
      params.append('lat', latitude.toString());
      params.append('lng', longitude.toString());
    }
    if (pinInput.trim()) params.append('pin_code', pinInput.trim());
    if (cityInput.trim()) params.append('city', cityInput.trim());

    if (searchMode === 'DOCTOR') {
      if (searchQuery.trim()) params.append('specialization', searchQuery.trim());
      router.push(`/doctors?${params.toString()}`);
    } else {
      if (searchQuery.trim()) params.append('name', searchQuery.trim());
      router.push(`/hospitals?${params.toString()}`);
    }
  };

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      easing: 'ease-out-cubic'
    });

    const fetchDoctors = async () => {
      try {
        setIsLoadingDoctors(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/doctors/search/`);
        if (!response.ok) throw new Error('Failed to fetch doctors');
        const result = await response.json();
        if (result.success && result.data) {
          setDoctors(result.data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setIsLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const specializations = [
    { name: "Cardiology", icon: Heart, desc: "Heart disease diagnosis & advanced treatments" },
    { name: "Dermatology", icon: Stethoscope, desc: "Comprehensive skin health & clinical therapy" },
    { name: "Pediatrics", icon: Activity, desc: "Newborn health & pediatric wellness care" },
    { name: "Neurology", icon: Award, desc: "Expert neurological evaluation & care" },
    { name: "Orthopedics", icon: Compass, desc: "Bone restoration, joints & trauma surgeries" },
    { name: "Ophthalmology", icon: Eye, desc: "Precision eye testings & visual enhancements" },
  ];

  const faqs = [
    { q: "How does the 10-minute slot lock booking engine function?", a: "When you select a doctor's slot, the booking engine applies an atomic lock on that schedule for exactly 10 minutes. This guarantees that no other user can double-book or hijack the slot while you complete your Razorpay transaction." },
    { q: "Can I reschedule or cancel my appointment later?", a: "Yes. Through your patient dashboard, you can reschedule to any other open availability slot for the same doctor, or cancel. Cancellations automatically trigger transactional status updates and refund payloads." },
    { q: "What should I do if my browser geolocation is blocked?", a: "If you deny location privileges, Docvera falls back dynamically to PIN Code search, and then to City filtering to ensure you can locate certified clinicians in your proximity instantly." },
  ];

  const currentPreviewDoctor = doctors[selectedPreviewIdx] || doctors[0];

  /* Per-specialization accent colors using the new palette */
  const specColors = [
    { bg: "bg-[#00D4FF]/15", border: "border-[#00D4FF]/25", icon: "bg-[#00D4FF]/20", iconStroke: "text-[#00D4FF]", link: "text-[#00D4FF]" },
    { bg: "bg-[#D0F56A]/10", border: "border-[#D0F56A]/20", icon: "bg-[#D0F56A]/20", iconStroke: "text-[#D0F56A]", link: "text-[#D0F56A]" },
    { bg: "bg-[#A78BF0]/12", border: "border-[#A78BF0]/22", icon: "bg-[#A78BF0]/20", iconStroke: "text-[#A78BF0]", link: "text-[#A78BF0]" },
    { bg: "bg-[#00E8B4]/10", border: "border-[#00E8B4]/20", icon: "bg-[#00E8B4]/20", iconStroke: "text-[#00E8B4]", link: "text-[#00E8B4]" },
    { bg: "bg-[#D0F56A]/10", border: "border-[#D0F56A]/20", icon: "bg-[#D0F56A]/20", iconStroke: "text-[#D0F56A]", link: "text-[#D0F56A]" },
    { bg: "bg-[#A78BF0]/12", border: "border-[#A78BF0]/22", icon: "bg-[#A78BF0]/20", iconStroke: "text-[#A78BF0]", link: "text-[#A78BF0]" },
  ];

  return (
    <div className="font-sans min-h-screen bg-[#0d1f2d] text-white selection:bg-[#00D4FF] selection:text-[#0d1f2d] flex flex-col">
      <Navbar />

      {/* ═══════ HERO ═══════ */}
      <section id="home" className="relative overflow-hidden pt-12 pb-16 bg-[#0d1f2d]">
        {/* Ambient blobs */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-[#00D4FF]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#A78BF0]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-[#D0F56A]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-12 gap-10 items-center">

            {/* Left Content */}
            <div className="md:col-span-7 space-y-5" data-aos="fade-up" data-aos-duration="1000">
              <div className="inline-flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/25 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#00D4FF] shadow-sm">
                <ShieldCheck className="h-4 w-4" /> Verified Healthcare Ecosystem
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
                Instant consultations. <br />
                <span className="text-gradient">Zero double bookings.</span>
              </h1>
              <p className="text-white/65 text-sm sm:text-base max-w-lg leading-relaxed">
                Connect with top-rated medical specialists and verified multi-specialty hospitals instantly.
                Pessimistic database locking protects your slot reservation in real-time.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#search-engine"
                  className="btn-gradient px-7 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2 text-xs uppercase tracking-wider"
                >
                  Find Providers <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#specializations"
                  className="border border-white/20 text-white px-7 py-3 rounded-full font-semibold hover:bg-white/6 hover:border-[#D0F56A]/50 transition-all text-xs uppercase tracking-wider"
                >
                  Clinical Specializations
                </a>
              </div>

              <div className="flex items-center gap-5 pt-4 text-white/50 text-xs">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#015d67] border-2 border-[#0d1f2d] flex items-center justify-center font-bold text-[9px] text-white">MD</div>
                  <div className="w-8 h-8 rounded-full bg-[#00D4FF] border-2 border-[#0d1f2d] flex items-center justify-center font-bold text-[9px] text-[#0d1f2d]">OB</div>
                  <div className="w-8 h-8 rounded-full bg-[#A78BF0] border-2 border-[#0d1f2d] flex items-center justify-center font-bold text-[9px] text-white">P</div>
                  <div className="w-8 h-8 rounded-full bg-[#D0F56A]/30 flex items-center justify-center text-[9px] font-bold border-2 border-[#0d1f2d] text-white">1K+</div>
                </div>
                <span className="text-white/60"><CheckCircle className="inline h-4 w-4 text-[#D0F56A] mr-1" /> Trusted by patients for priority bookings</span>
              </div>
            </div>

            {/* Right: Floating booking card */}
            <div className="md:col-span-5 relative flex justify-center float-animation" data-aos="fade-left" data-aos-duration="1200">
              {isLoadingDoctors ? (
                <div className="w-full max-w-md p-8 bg-[#1a4a5a] border border-white/10 rounded-3xl h-64 animate-pulse" />
              ) : currentPreviewDoctor ? (
                <div className="w-full max-w-md p-6 bg-[#1a4a5a] border border-[#00D4FF]/20 rounded-3xl shadow-2xl space-y-4 relative">
                  <div className="absolute -top-3 -right-3 bg-gradient-to-br from-[#00D4FF] to-[#00E8B4] rounded-full p-2.5 shadow-lg">
                    <Shield className="h-5 w-5 text-[#0d1f2d]" />
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-[#D0F56A] animate-ping" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-white/70">Booking Lock Engine Active</span>
                    </div>
                    <span className="px-2 py-0.5 bg-red-500/15 text-red-400 border border-red-500/25 rounded text-[9px] font-bold">10:00 LOCK TIMER</span>
                  </div>

                  <div className="p-4 bg-[#0d1f2d] rounded-2xl flex items-center justify-between border border-white/8">
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-white/50 font-bold">Specialist MD</span>
                      <h4 className="text-sm font-bold text-white">Dr. {currentPreviewDoctor.full_name}</h4>
                      <p className="text-[10px] text-white/60">{currentPreviewDoctor.specialization} • {currentPreviewDoctor.clinic_name || "Certified Facility"}</p>
                    </div>
                    <Heart className="h-5 w-5 text-red-400 fill-red-400/20" />
                  </div>

                  <div className="space-y-3 pt-1">
                    {[
                      "Acquired pessimistic DB concurrency lock",
                      "Initialized secure Razorpay transaction",
                    ].map((step, i) => (
                      <div key={i} className="flex items-center space-x-3 text-xs">
                        <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#00E8B4] flex items-center justify-center font-bold text-[10px] text-[#0d1f2d] shrink-0">{i + 1}</div>
                        <p className="text-white/75">{step}</p>
                      </div>
                    ))}
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="h-6 w-6 rounded-lg bg-[#D0F56A] flex items-center justify-center font-bold text-[10px] text-[#0d1f2d] shrink-0">3</div>
                      <Link
                        href={`/booking?doctor_id=${currentPreviewDoctor.user}`}
                        className="font-bold underline text-[#D0F56A] hover:text-[#00D4FF] transition-colors"
                      >
                        Proceed with appointment reservation slot →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-md p-8 bg-[#1a4a5a] border border-white/10 rounded-3xl text-center py-12 text-sm text-white/50">
                  No active provider linked.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CLINICAL SPECIALIZATIONS ═══════ */}
      <section id="specializations" className="py-16 px-6 border-t border-white/8 bg-[#143642]">
        <div className="max-w-7xl mx-auto text-center space-y-4" data-aos="fade-up">
          <span className="text-[#0d1f2d] font-bold tracking-wide uppercase text-[10px] bg-[#D0F56A] px-4 py-1.5 rounded-full shadow-sm">
            Clinical Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Clinical Specializations
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-sm leading-relaxed">
            Discover and consult top-rated doctors categorized under certified medical specializations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto mt-12">
          {specializations.map((spec, idx) => {
            const Icon = spec.icon;
            const c = specColors[idx];
            return (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 80}
                className={`${c.bg} border ${c.border} bg-[#1a4a5a] rounded-2xl p-6 transition-all hover:-translate-y-1.5 hover:shadow-xl duration-300 group spec-card`}
                style={{ background: "rgba(26,74,90,0.90)" }}
              >
                <div className={`w-11 h-11 ${c.icon} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-5 w-5 ${c.iconStroke}`} strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{spec.name}</h3>
                <p className="text-white/60 text-xs leading-relaxed mb-4">{spec.desc}</p>
                <Link
                  href={`/doctors?specialization=${spec.name.toUpperCase()}`}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold ${c.link} hover:opacity-75 transition-opacity`}
                >
                  Explore Specialists <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════ TOP RATED SPECIALISTS ═══════ */}
      <section id="doctors" className="py-16 px-6 bg-[#0d1f2d]">
        <div className="max-w-7xl mx-auto space-y-10" data-aos="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[#0d1f2d] font-bold tracking-wide uppercase text-[10px] bg-[#00D4FF] px-4 py-1.5 rounded-full shadow-sm">Verified Directory</span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Top Rated Specialists</h2>
              <p className="text-white/60 text-sm">Docvera partners with premium healthcare professionals ensuring clinical quality.</p>
            </div>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a4a5a] hover:bg-[#00D4FF]/15 border border-[#00D4FF]/30 text-xs font-bold rounded-xl transition-all w-fit text-white hover:text-[#00D4FF]"
            >
              View All Doctors <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {isLoadingDoctors ? (
              [...Array(3)].map((_, idx) => (
                <div key={idx} className="p-6 bg-[#1a4a5a] border border-white/10 rounded-2xl h-52 animate-pulse" />
              ))
            ) : doctors.length > 0 ? (
              doctors.slice(0, 3).map((doctor, idx) => (
                <div
                  key={doctor.user || idx}
                  onClick={() => setSelectedPreviewIdx(idx)}
                  className={`p-6 bg-[#1a4a5a] border rounded-2xl space-y-4 relative cursor-pointer transition-all duration-300 ${
                    selectedPreviewIdx === idx
                      ? "border-[#00D4FF] ring-1 ring-[#00D4FF]/25 -translate-y-1 shadow-xl shadow-[#00D4FF]/10"
                      : "border-white/10 hover:border-[#00D4FF]/35"
                  }`}
                >
                  <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-[#00D4FF] to-[#00E8B4] border-l border-b border-[#0d1f2d]/20 text-[10px] font-bold rounded-bl-xl text-[#0d1f2d]">
                    {doctor.experience_years} Yrs Exp
                  </div>

                  <div className="space-y-2.5">
                    <span className="px-2.5 py-1 bg-[#A78BF0]/15 border border-[#A78BF0]/25 text-[9px] font-bold rounded uppercase tracking-wider text-[#A78BF0]">
                      {doctor.specialization}
                    </span>
                    <h3 className="text-base font-bold text-white pt-1">Dr. {doctor.full_name}</h3>
                    <div className="flex items-center space-x-1.5 text-xs text-white/55">
                      <MapPin className="h-3.5 w-3.5 text-[#00D4FF] shrink-0" />
                      <span>{doctor.clinic_city}, {doctor.clinic_pin_code}</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/8" />

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-white/80">₹{doctor.consultation_fees} <span className="text-white/45 font-normal">/ consult</span></span>
                    <Link
                      href={`/booking?doctor_id=${doctor.user}`}
                      className="font-bold text-[#D0F56A] hover:text-[#00E8B4] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Book Now →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 border border-dashed border-white/15 rounded-2xl text-sm text-white/50 bg-[#1a4a5a]">
                No doctors found in our network yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="howitworks" className="py-16 px-6 bg-[#143642] border-t border-white/8">
        <div className="max-w-7xl mx-auto text-center space-y-4" data-aos="fade-up">
          <span className="bg-[#A78BF0] text-[#0d1f2d] px-5 py-1 rounded-full text-xs font-mono font-bold uppercase">
            Simple & Secure
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            From search to consultation in 4 steps
          </h2>
          <p className="text-white/60 text-sm max-w-xl mx-auto">
            How Docvera manages scheduling conflicts using state-of-the-art database slot allocations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mt-12">
          {[
            { step: "1", title: "Locate & Filter", desc: "Find specialist doctors or clinic facilities using active GPS coordinates or city PIN code search.", color: "#00D4FF" },
            { step: "2", title: "Pessimistic Lock", desc: "Select an open appointment slot. The engine locks it for 10 minutes to guarantee zero overlap.", color: "#D0F56A" },
            { step: "3", title: "Secure Checkout", desc: "Complete transaction smoothly via Razorpay Sandbox supporting Net Banking, UPI, and Cards.", color: "#A78BF0" },
            { step: "4", title: "Consultation Room", desc: "Once verified, access the real-time doctor portal for prescriptions, diagnoses, and medical charts.", color: "#00E8B4" },
          ].map((item, idx) => (
            <div
              key={idx}
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
              className="bg-[#1a4a5a] border border-white/10 hover:border-white/20 rounded-2xl p-6 text-center transition-all hover:-translate-y-1.5 duration-300 group"
            >
              <div
                className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-lg font-black text-[#0d1f2d] group-hover:scale-110 transition-transform shadow-lg"
                style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}
              >
                {item.step}
              </div>
              <h4 className="font-bold mt-4 text-sm text-white">{item.title}</h4>
              <p className="text-white/55 text-xs mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ TRUST & PIPELINE INTEGRITY ═══════ */}
      <section id="trust" className="py-16 px-6 bg-[#0d1f2d] overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6" data-aos="fade-right">
            <div className="bg-[#00D4FF]/10 border border-[#00D4FF]/20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-[#00D4FF] font-bold">
              <ShieldCheck className="h-4 w-4" /> HIPAA-Compliant Data Pipeline
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Clinical scheduling <br /> engineered for <span className="text-gradient">integrity.</span>
            </h2>
            <ul className="space-y-4 text-sm text-white/75">
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-[#D0F56A] shrink-0 mt-0.5" />
                <span>Zero Slot Overlaps: Atomic locking stops transaction conflicts instantly.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-[#00D4FF] shrink-0 mt-0.5" />
                <span>Administrative Review: Every registered clinician undergoes strict identity checks.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-[#A78BF0] shrink-0 mt-0.5" />
                <span>Clear Refund SLA: Easy cancelations directly initiate refund webhook sequences.</span>
              </li>
            </ul>
            <div className="flex gap-3 p-4 bg-[#00D4FF]/8 border border-[#00D4FF]/15 rounded-xl">
              <Shield className="text-3xl text-[#00D4FF] shrink-0" />
              <span className="text-white/65 text-xs leading-relaxed max-w-sm">
                Docvera locks appointments on verified servers. Payment tokens, credentials, and charts are fully encrypted under AES-256 protocols.
              </span>
            </div>
          </div>

          <div className="relative" data-aos="fade-left">
            <div className="bg-[#1a4a5a] rounded-3xl p-6 border border-white/10 shadow-2xl relative">
              <div className="p-5 bg-[#0d1f2d] rounded-2xl space-y-4 border border-white/8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-[#00D4FF] to-[#00E8B4] rounded-xl flex items-center justify-center font-extrabold text-sm text-[#0d1f2d]">DV</div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Dr. Sanidhya MD</h4>
                    <p className="text-[10px] text-white/45">Verification Code: <span className="text-[#D0F56A] font-bold">DV-ACTIVE-99</span></p>
                  </div>
                </div>
                <div className="bg-[#143642] px-3.5 py-2 rounded-lg border border-white/8 flex items-center justify-between text-[10px] font-bold text-white">
                  <span>e-KYC & License Confirmed</span>
                  <span className="text-[#D0F56A]">ACTIVE ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIAL ═══════ */}
      <section className="py-16 bg-[#143642] border-t border-white/8">
        <div className="max-w-4xl mx-auto text-center px-6 space-y-6" data-aos="fade-up">
          <span className="text-5xl text-[#00D4FF] font-serif leading-none block">"</span>
          <p className="text-lg md:text-xl font-medium italic text-white/85 leading-relaxed max-w-2xl mx-auto">
            "Docvera solved my schedule conflict issues entirely. The location filter and lock engine are flawless. I got my cardiac report checkup confirmed within minutes."
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#A78BF0] flex items-center justify-center font-bold text-xs text-[#0d1f2d]">SP</div>
            <div className="text-left">
              <p className="font-bold text-xs text-white">Sachin Pratik</p>
              <p className="text-[10px] text-white/45">Verified Consultation Patient</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ UNIFIED SEARCH ENGINE ═══════ */}
      <section id="search-engine" className="py-16 px-6 bg-[#0d1f2d]">
        <div className="max-w-3xl mx-auto bg-[#1a4a5a] rounded-3xl shadow-2xl p-8 border border-[#00D4FF]/15 relative z-10" data-aos="flip-up">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex gap-1 bg-[#D0F56A]/12 border border-[#D0F56A]/25 text-[#D0F56A] rounded-full px-3 py-1 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 mr-0.5" /> Real-time Locator
            </div>
            <h3 className="text-2xl font-black text-white">Search Available Providers</h3>
            <p className="text-white/60 text-xs max-w-sm mx-auto">
              Find certified doctors and multi-specialty clinics in your neighborhood instantly.
            </p>
          </div>

          <div className="space-y-5">
            {/* Mode Selector */}
            <div className="inline-flex bg-[#0d1f2d] p-1.5 rounded-xl w-full sm:w-auto shadow-inner border border-white/8">
              <button
                onClick={() => setSearchMode('DOCTOR')}
                className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  searchMode === 'DOCTOR' ? 'bg-gradient-to-r from-[#00D4FF] to-[#00E8B4] text-[#0d1f2d] shadow-md' : 'text-white/65 hover:text-white'
                }`}
              >
                <Stethoscope className="h-3.5 w-3.5" /> Find Doctors
              </button>
              <button
                onClick={() => setSearchMode('HOSPITAL')}
                className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  searchMode === 'HOSPITAL' ? 'bg-gradient-to-r from-[#A78BF0] to-[#00D4FF] text-[#0d1f2d] shadow-md' : 'text-white/65 hover:text-white'
                }`}
              >
                <HospitalIcon className="h-3.5 w-3.5" /> Find Clinics
              </button>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

              {/* Geolocation Trigger */}
              <div className="md:col-span-4">
                <button
                  onClick={handleGeoLocate}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs border transition-all ${
                    geoStatus === "success"
                      ? "bg-[#D0F56A]/15 border-[#D0F56A]/30 text-[#D0F56A]"
                      : geoStatus === "loading"
                      ? "bg-white/5 border-white/10 animate-pulse text-white"
                      : "bg-white/5 border-white/12 text-white hover:bg-[#00D4FF]/8 hover:border-[#00D4FF]/25"
                  }`}
                >
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {geoStatus === "success" ? "Location Detected" :
                     geoStatus === "loading" ? "Locating..." :
                     geoStatus === "denied" ? "Access Denied" : "Current Location"}
                  </span>
                </button>
              </div>

              {/* Specialization Query */}
              <div className="md:col-span-4 relative flex items-center">
                <input
                  type="text"
                  placeholder={searchMode === 'DOCTOR' ? "Specialization or name..." : "Clinic or hospital..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0d1f2d] border border-white/12 focus:border-[#00D4FF] rounded-xl pl-4 pr-10 py-3 text-xs outline-none transition-all text-white placeholder:text-white/35"
                />
                <Search className="absolute right-3 text-white/35 h-4 w-4 pointer-events-none" />
              </div>

              {/* Location Input */}
              <div className="md:col-span-4 relative flex items-center">
                <MapPin className="absolute left-3 text-white/35 h-4 w-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="City or PIN Code"
                  value={cityInput || pinInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d+$/.test(val)) {
                      setPinInput(val);
                      setCityInput("");
                    } else {
                      setCityInput(val);
                      setPinInput("");
                    }
                  }}
                  className="w-full bg-[#0d1f2d] border border-white/12 focus:border-[#00D4FF] rounded-xl pl-9 pr-4 py-3 text-xs outline-none transition-all text-white placeholder:text-white/35"
                />
              </div>
            </div>

            {/* Search CTA */}
            <button
              onClick={handleSearch}
              className="w-full flex items-center justify-center gap-2 py-3.5 btn-gradient rounded-xl transition-all hover:scale-[1.005] text-sm shadow-lg border-none font-bold"
            >
              <Search className="h-4 w-4" />
              <span>Search Available Providers</span>
            </button>

            {searchError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-center font-medium text-red-400">
                {searchError}
              </div>
            )}
          </div>

          <p className="text-center text-[10px] text-white/35 mt-5">
            <Shield className="inline h-3.5 w-3.5 mr-1" /> Data runs through verified API servers. No spam guaranteed.
          </p>
        </div>
      </section>
    </div>
  );
}
