import React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2d6a73] border-t border-[#f8fbff]/10 text-[#f8fbff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          <div className="col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#f8fbff] text-[#2d6a73]">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#f8fbff]">Docvera</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-[#f8fbff]/80">
              Enterprise-grade scheduling with 10-minute pessimistic checkout holds. Connecting patients with verified healthcare providers.
            </p>
            <div className="text-xs text-[#f8fbff]/60">
              &copy; 2026 Docvera Technologies Pvt Ltd. All rights reserved.
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8fbff]">For Patients</h4>
            <ul className="space-y-2.5">
              <li><Link href="/doctors" className="text-sm transition-colors text-[#f8fbff]/80 hover:text-[#f8fbff]">Search Doctors</Link></li>
              <li><Link href="/hospitals" className="text-sm transition-colors text-[#f8fbff]/80 hover:text-[#f8fbff]">Find Hospitals</Link></li>
              <li><Link href="/login" className="text-sm transition-colors text-[#f8fbff]/80 hover:text-[#f8fbff]">Patient Login</Link></li>
              <li><Link href="/register" className="text-sm transition-colors text-[#f8fbff]/80 hover:text-[#f8fbff]">Registration</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8fbff]">For Providers</h4>
            <ul className="space-y-2.5">
              <li><Link href="/register" className="text-sm transition-colors text-[#f8fbff]/80 hover:text-[#f8fbff]">Doctor Registration</Link></li>
              <li><Link href="/hospitals" className="text-sm transition-colors text-[#f8fbff]/80 hover:text-[#f8fbff]">Hospital Affiliations</Link></li>
              <li><Link href="/login" className="text-sm transition-colors text-[#f8fbff]/80 hover:text-[#f8fbff]">Provider Login</Link></li>
              <li><Link href="/terms" className="text-sm transition-colors text-[#f8fbff]/80 hover:text-[#f8fbff]">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8fbff]">Company</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm transition-colors text-[#f8fbff]/80 hover:text-[#f8fbff]">About Us</a></li>
              <li><a href="#" className="text-sm transition-colors text-[#f8fbff]/80 hover:text-[#f8fbff]">Careers</a></li>
              <li><a href="#" className="text-sm transition-colors text-[#f8fbff]/80 hover:text-[#f8fbff]">Privacy Policy</a></li>
              <li><a href="#" className="text-sm transition-colors text-[#f8fbff]/80 hover:text-[#f8fbff]">Contact Support</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
