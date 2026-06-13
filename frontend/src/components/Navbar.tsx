"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, LogOut, User, Shield, Calendar, Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      const userRole = localStorage.getItem("user_role");
      setIsLoggedIn(!!token);
      setRole(userRole);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
    router.push("/login");
    router.refresh();
  };

  const navLinks = [
    { href: "/doctors", label: "Find Doctors" },
    { href: "/hospitals", label: "Hospitals" },
  ];

  const dashboardLink = role === 'PATIENT'
    ? { href: "/dashboard/patient", label: "My Appointments", icon: Calendar }
    : role === 'DOCTOR'
    ? { href: "/dashboard/doctor", label: "Dashboard", icon: User }
    : role === 'ADMIN'
    ? { href: "/dashboard/admin", label: "Admin", icon: Shield }
    : null;

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="p-1.5 bg-primary rounded-lg group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
              <Activity className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">Docvera</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {dashboardLink && (
              <Link
                href={dashboardLink.href}
                className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10 hover:bg-primary/10 transition-colors"
              >
                <dashboardLink.icon className="h-4 w-4" />
                {dashboardLink.label}
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-error bg-error/5 border border-error/10 rounded-xl hover:bg-error/10 transition-all"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-foreground bg-primary hover:bg-primary-light rounded-xl transition-all shadow-lg shadow-primary/20"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-text p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-text-secondary hover:text-primary py-2"
            >
              {link.label}
            </Link>
          ))}
          {dashboardLink && (
            <Link
              href={dashboardLink.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold text-primary py-2"
            >
              <dashboardLink.icon className="h-4 w-4" />
              {dashboardLink.label}
            </Link>
          )}
          <hr className="border-border" />
          {isLoggedIn ? (
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-semibold text-error py-2">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          ) : (
            <div className="flex items-center gap-3 pt-2">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-text-secondary">
                Sign In
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="px-5 py-2 text-sm font-semibold text-foreground bg-primary rounded-xl">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
