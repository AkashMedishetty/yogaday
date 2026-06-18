"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMobile("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <div className="relative rounded-2xl bg-ivory shadow-[0_20px_60px_-25px_rgba(58,18,6,0.45)] ring-1 ring-maroon/10">
      <div className="gold-rule h-1 w-full rounded-t-2xl" />
      <div className="p-7 sm:p-9">
        {status === "success" ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-saffron/15 ring-1 ring-saffron/30">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-maroon"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-semibold text-maroon">You&apos;re registered</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink/65">
              See you on Sunday, 21 June 2026 at 8 AM — beside Lake Park, NITHM, Gachibowli.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-7 rounded-full border border-maroon/25 px-6 py-2.5 text-sm font-semibold text-maroon transition hover:bg-maroon hover:text-cream"
            >
              Register another person
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="eyebrow text-saffron">Free registration</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-maroon">Reserve your spot</h3>
            <p className="mt-1 text-sm text-ink/55">Takes less than a minute.</p>

            <div className="mt-7 space-y-5">
              <Field label="Full name">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asha Reddy"
                  className="field-input"
                  autoComplete="name"
                />
              </Field>

              <Field label="Email address">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="field-input"
                  autoComplete="email"
                />
              </Field>

              <Field label="Mobile number">
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  pattern="[0-9+\-\s]{7,15}"
                  className="field-input"
                  autoComplete="tel"
                />
              </Field>
            </div>

            {status === "error" && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700 ring-1 ring-red-100">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-7 w-full rounded-full bg-maroon px-6 py-3.5 text-sm font-semibold tracking-wide text-cream transition hover:bg-maroon-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Registering…" : "Register Now"}
            </button>

            <p className="mt-4 text-center text-xs text-ink/45">
              We&apos;ll only use your details for this event.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="field-label mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
