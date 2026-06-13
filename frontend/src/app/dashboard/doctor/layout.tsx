"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Activity, LogOut, LayoutDashboard, Calendar, MapPin, Clock, Menu, X } from "lucide-react";

function DoctorNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const navLinks = [
    { name: "Dashboard", tab: "dashboard", icon: LayoutDashboard },
    { name: "Appointments", tab: "appointments", icon: Calendar },
    { name: "Clinic Details", tab: "address", icon: MapPin },
    { name: "Availability", tab: "availability", icon: Clock },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <Activity className="h-5 w-5 text-foreground" />
              </div>
              <span className="text-lg font-bold text-text">Docvera</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.tab}
                  href={`/dashboard/doctor?tab=${link.tab}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    currentTab === link.tab
                      ? "bg-primary/5 text-primary border border-primary/10"
                      : "text-text-secondary hover:text-text hover:bg-surface"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              ))}
              <button onClick={handleLogout} className="ml-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-error hover:bg-error/5 transition-all">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </nav>

            <button className="md:hidden text-text p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.tab}
              href={`/dashboard/doctor?tab=${link.tab}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                currentTab === link.tab ? "bg-primary/5 text-primary" : "text-text-secondary"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.name}
            </Link>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-error w-full">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}
    </>
  );
}

export default function DoctorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Suspense fallback={
        <header className="sticky top-0 z-40 glass">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary rounded-lg">
                  <Activity className="h-5 w-5 text-foreground" />
                </div>
                <span className="text-lg font-bold text-text">Docvera</span>
              </div>
            </div>
          </div>
        </header>
      }>
        <DoctorNav />
      </Suspense>

      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}
