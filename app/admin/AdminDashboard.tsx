"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Registration } from "@/lib/db";

export default function AdminDashboard({
  registrations,
}: {
  registrations: Registration[];
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return registrations;
    return registrations.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.mobile.toLowerCase().includes(q)
    );
  }, [query, registrations]);

  const today = registrations.filter(
    (r) => new Date(r.created_at).toDateString() === new Date().toDateString()
  ).length;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-maroon/10 bg-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div>
            <p className="eyebrow text-saffron">Yoga Day 2026</p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-maroon">
              Registrations
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/admin/export"
              className="inline-flex items-center gap-2 rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-maroon-light"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
              </svg>
              Export to Excel
            </a>
            <button
              onClick={logout}
              className="rounded-full border border-maroon/25 px-4 py-2.5 text-sm font-semibold text-maroon transition hover:bg-maroon/5"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Total registrations" value={registrations.length} />
          <Stat label="Registered today" value={today} />
          <Stat label="Showing" value={filtered.length} />
        </div>

        <div className="mb-4 mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon/40" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email or mobile…"
              className="w-full rounded-full border border-maroon/15 bg-ivory py-2.5 pl-11 pr-4 text-sm text-ink outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/20"
            />
          </div>
          <button
            onClick={() => router.refresh()}
            className="shrink-0 rounded-full border border-maroon/20 px-4 py-2.5 text-sm font-semibold text-maroon transition hover:bg-maroon/5"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-maroon/10 bg-ivory shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-maroon/10 bg-cream/70 text-maroon/55">
                  <th className="px-5 py-3.5 font-semibold">#</th>
                  <th className="px-5 py-3.5 font-semibold">Name</th>
                  <th className="px-5 py-3.5 font-semibold">Email</th>
                  <th className="px-5 py-3.5 font-semibold">Mobile</th>
                  <th className="px-5 py-3.5 font-semibold">Registered</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-ink/45">
                      {registrations.length === 0
                        ? "No registrations yet."
                        : "No matches for your search."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      className="border-b border-maroon/5 transition last:border-0 hover:bg-saffron/[0.06]"
                    >
                      <td className="px-5 py-3.5 tabular-nums text-ink/40">{i + 1}</td>
                      <td className="px-5 py-3.5 font-medium text-ink">{r.name}</td>
                      <td className="px-5 py-3.5 text-ink/75">{r.email}</td>
                      <td className="px-5 py-3.5 tabular-nums text-ink/75">{r.mobile}</td>
                      <td className="px-5 py-3.5 text-ink/55">{fmt(r.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-maroon/10 bg-cream/60 p-6">
      <p className="font-display text-4xl font-semibold tabular-nums text-maroon">{value}</p>
      <p className="mt-1 text-sm text-ink/55">{label}</p>
    </div>
  );
}
