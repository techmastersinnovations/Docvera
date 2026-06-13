"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ShieldCheck, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all email and password fields.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/token/", { email, password });

      if (response.data.success) {
        const { access, refresh, user } = response.data.data;

        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user_role", user.role);
        localStorage.setItem("user_email", user.email);
        localStorage.setItem("user_id", user.id);

        if (user.role === "ADMIN") {
          router.push("/dashboard/admin");
        } else if (user.role === "DOCTOR") {
          router.push("/dashboard/doctor");
        } else {
          router.push("/dashboard/patient");
        }
      }
    } catch (err: any) {
      const errMsg = err?.detail || err?.message || "Invalid authentication credentials. Please try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-card">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card p-8 space-y-8">
            <div className="text-center space-y-3">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <div className="p-2 bg-primary rounded-xl">
                  <Activity className="h-5 w-5 text-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground tracking-tight">Docvera</span>
              </Link>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Welcome Back</h2>
              <p className="text-sm text-foreground/70">Access your healthcare portal securely.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-4 bg-error/5 border border-error/10 rounded-xl flex items-start gap-3 text-error text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="email"
                    placeholder="doctor@docvera.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-card border border-border focus:border-primary/50 rounded-xl pl-11 pr-4 py-3 text-sm outline-none text-foreground transition-all placeholder:text-foreground/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-card border border-border focus:border-primary/50 rounded-xl pl-11 pr-4 py-3 text-sm outline-none text-foreground transition-all placeholder:text-foreground/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-foreground font-semibold rounded-xl hover:bg-primary-light transition-all disabled:opacity-50 text-sm"
              >
                <span>{loading ? "Signing in..." : "Sign In"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <hr className="border-border" />

            <div className="text-center text-sm text-text-secondary space-y-3">
              <div>
                Don't have an account?{" "}
                <Link href="/register" className="text-primary font-semibold hover:underline">
                  Create one
                </Link>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>256-bit AES Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
