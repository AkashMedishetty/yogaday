"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Login failed.");
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "linear-gradient(180deg,#f3b733 0%,#e9a521 55%,#db9116 100%)" }}
      />
      <div className="w-full max-w-sm rounded-2xl bg-ivory shadow-[0_20px_60px_-25px_rgba(58,18,6,0.5)] ring-1 ring-maroon/10">
        <div className="gold-rule h-1 w-full rounded-t-2xl" />
        <form onSubmit={handleSubmit} className="p-8">
          <p className="eyebrow text-saffron">Yoga Day 2026</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-maroon">Admin access</h1>
          <p className="mt-1 text-sm text-ink/55">Enter the password to view registrations.</p>

          <label className="mt-7 block">
            <span className="field-label mb-1.5 block">Password</span>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="field-input"
            />
          </label>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-maroon px-6 py-3 text-sm font-semibold tracking-wide text-cream transition hover:bg-maroon-light disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
