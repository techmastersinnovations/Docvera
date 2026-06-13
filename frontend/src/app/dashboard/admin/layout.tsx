"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader, ShieldAlert } from "lucide-react";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const verifyAdminSession = () => {
      const token = localStorage.getItem("access_token");
      const userRole = localStorage.getItem("user_role");

      if (!token) {
        setAuthError(true);
        setTimeout(() => router.push("/login"), 1500);
        return;
      }

      if (userRole !== "ADMIN") {
        setAuthError(true);
        setTimeout(() => router.push("/"), 1500);
        return;
      }

      setIsAuthorized(true);
    };
    verifyAdminSession();
  }, [router]);

  if (authError) {
    return (
      <div className="min-h-screen bg-card flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-error/5 border border-error/10 rounded-full">
          <ShieldAlert className="h-8 w-8 text-error" />
        </div>
        <p className="text-error text-sm font-bold tracking-wide uppercase">Unauthorized Access</p>
        <p className="text-text-secondary text-xs">Redirecting to secure gateway...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-card flex flex-col items-center justify-center space-y-5">
        <Loader className="h-10 w-10 text-primary animate-spin" />
        <div className="space-y-1 text-center">
          <p className="text-text text-sm font-bold tracking-wide uppercase">Verifying Admin Credentials</p>
          <p className="text-text-secondary text-xs">Establishing secure connection...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
