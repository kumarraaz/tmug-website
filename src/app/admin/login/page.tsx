"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IconArrowRight, IconSparkle } from "@/components/icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both your admin email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Authentication failed.");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch {
      setError("Unable to connect to server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-ivory px-4 py-12">
      {/* Background radial auras */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-pink-accent/20 blur-3xl" />
        <div className="absolute right-0 bottom-20 h-96 w-96 rounded-full bg-tea-gold/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-[2rem] border border-charcoal/10 bg-white p-8 shadow-[0_24px_60px_-18px_rgba(39,35,41,0.18)]">
          {/* Logo & Header */}
          <div className="text-center">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image
                src="/assets/logo.png"
                alt="TMUG Logo"
                width={120}
                height={50}
                className="mx-auto object-contain"
                priority
              />
            </Link>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-tea-gold/40 bg-warm-surface px-3 py-1 text-[11px] font-black uppercase tracking-wider text-charcoal">
              <IconSparkle className="h-3 w-3 text-tea-gold" />
              TMUG Control Panel
            </div>

            <h1 className="mt-3 font-display text-2xl font-black text-charcoal">
              Storefront Admin Access
            </h1>
            <p className="mt-1 text-xs text-charcoal/70">
              Manage campaign banners, product prices, collections, and section visibility.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-black uppercase tracking-wider text-[#33243A]"
              >
                Admin Email
              </label>
              <input
                id="admin-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                autoComplete="username"
                required
                className="mt-1.5 w-full rounded-xl border border-[#3A3438]/15 bg-[#FFF7EF]/50 px-4 py-3 text-sm text-[#33243A] outline-none transition-all placeholder:text-[#3A3438]/40 focus:border-[#FAA4B5] focus:bg-white focus:ring-2 focus:ring-[#FAA4B5]/20"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-black uppercase tracking-wider text-[#33243A]"
              >
                Admin Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
                required
                className="mt-1.5 w-full rounded-xl border border-[#3A3438]/15 bg-[#FFF7EF]/50 px-4 py-3 text-sm text-[#33243A] outline-none transition-all placeholder:text-[#3A3438]/40 focus:border-[#FAA4B5] focus:bg-white focus:ring-2 focus:ring-[#FAA4B5]/20"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-coral/30 bg-coral/10 p-3 text-xs font-bold text-coral">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-charcoal py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:bg-tea-gold hover:text-charcoal active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Enter Dashboard</span>
                  <IconArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 border-t border-charcoal/10 pt-4 text-center">
            <Link
              href="/"
              className="text-xs font-extrabold text-charcoal/60 hover:text-coral transition-colors"
            >
              ← Return to TMUG Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
