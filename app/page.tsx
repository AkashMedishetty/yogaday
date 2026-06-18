import RegistrationForm from "./components/RegistrationForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-ivory">
      {/* ---------------- Top bar ---------------- */}
      <header className="border-b border-maroon/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Brand acronym="TCEI" sub="Telangana Chamber of Events Industry" />
          <div className="text-right">
            <p className="eyebrow text-maroon/45">Organised by</p>
            <Brand acronym="TEFA" sub="Telangana Event Facilitators Association" align="right" />
          </div>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
            {/* Left */}
            <div>
              <p className="eyebrow text-maroon/60">12th International Day of Yoga</p>

              <h1 className="mt-5 font-display text-[2.5rem] font-semibold leading-[1.0] tracking-tight text-maroon sm:text-6xl lg:text-7xl">
                International
                <br />
                Yoga Day
              </h1>

              <div className="mt-4 flex items-baseline gap-4">
                <span className="font-display text-3xl font-medium text-maroon/85 sm:text-4xl">
                  2026
                </span>
                <Diamonds className="h-3 text-maroon/40" />
              </div>

              <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70">
                A guided sunrise practice of asana, pranayama and meditation — open to
                everyone, from first-timers to lifelong practitioners. Begin the day
                with breath, balance and stillness.
              </p>

              {/* Details strip */}
              <div className="mt-8 flex flex-col gap-5 border-y border-maroon/15 py-5 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-x-7">
                <Detail
                  label="Date"
                  value="Sun, 21 June 2026"
                  icon={<path d="M8 2v3M16 2v3M3.5 9h17M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />}
                />
                <Divider />
                <Detail
                  label="Venue"
                  value="Lake Park, NITHM"
                  sub="Gachibowli, Hyderabad"
                  icon={
                    <>
                      <path d="M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </>
                  }
                />
                <Divider />
                <Detail
                  label="Time"
                  value="8:00 AM"
                  sub="Onwards"
                  icon={
                    <>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </>
                  }
                />
              </div>

              <div className="mt-8 flex flex-col items-start gap-4 sm:mt-9 sm:flex-row sm:items-center sm:gap-5">
                <a
                  href="#register"
                  className="w-full rounded-full bg-maroon px-8 py-3.5 text-center text-sm font-semibold tracking-wide text-cream shadow-sm transition hover:bg-maroon-light sm:w-auto"
                >
                  Register — it&apos;s free
                </a>
                <p className="text-sm text-ink/55">Bring your own mat · All levels welcome</p>
              </div>
            </div>

            {/* Right: form */}
            <div id="register" className="scroll-mt-8">
              <RegistrationForm />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- The morning ---------------- */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="eyebrow text-saffron">The Morning</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-maroon sm:text-4xl">
            One hour to reset the body and quiet the mind.
          </h2>

          <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-3">
            <Info
              n="01"
              title="What to expect"
              body="A guided session of asanas, pranayama and meditation led by experienced instructors — paced for every level."
            />
            <Info
              n="02"
              title="Who can join"
              body="Everyone is welcome — children, families and seniors alike. Wear comfortable clothing and carry your own mat if you can."
            />
            <Info
              n="03"
              title="Why it matters"
              body="International Yoga Day celebrates the harmony of body and mind. Join the community for a refreshing morning of wellness."
            />
          </div>
        </div>
      </section>

      {/* ---------------- Contact band ---------------- */}
      <section className="border-t border-maroon/10 bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center sm:px-8">
          <p className="eyebrow text-saffron">Get in touch</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-maroon sm:text-3xl">
            For more details and sponsorships
          </h3>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
            <Contact name="Azmat Ali" role="Convenor" />
            <span className="hidden h-10 w-px bg-maroon/15 sm:block" />
            <Contact name="Jigna Mehta" role="Co Convenor" />
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="bg-maroon py-8 text-center text-sm text-cream/75">
        <div className="mx-auto max-w-6xl px-5">
          <p>
            © 2026 International Yoga Day · Organised by TCEI &amp; TEFA ·{" "}
            <a
              href="/admin"
              className="underline decoration-cream/30 underline-offset-4 transition hover:text-cream"
            >
              Admin
            </a>
          </p>
          <p className="mt-3 text-xs text-cream/60">
            Tech Partner ·{" "}
            <a
              href="https://www.purplehatevents.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-cream/90 underline decoration-cream/30 underline-offset-4 transition hover:text-cream"
            >
              Purplehat Events
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ---------------- pieces ---------------- */

function Brand({
  acronym,
  sub,
  align = "left",
}: {
  acronym: string;
  sub: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <p className="font-display text-xl font-semibold tracking-wide text-maroon">{acronym}</p>
      <p className="max-w-[15rem] text-[10px] leading-tight text-ink/45">{sub}</p>
    </div>
  );
}

function Detail({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <svg
        viewBox="0 0 24 24"
        className="mt-0.5 h-5 w-5 shrink-0 text-saffron"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon}
      </svg>
      <div>
        <p className="eyebrow text-[0.62rem] text-maroon/45">{label}</p>
        <p className="font-display text-lg font-medium leading-tight text-maroon">{value}</p>
        {sub && <p className="text-xs text-ink/55">{sub}</p>}
      </div>
    </div>
  );
}

function Divider() {
  return <span className="hidden w-px self-stretch bg-maroon/12 sm:block" />;
}

function Info({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="border-t border-maroon/15 pt-5">
      <p className="font-display text-sm font-medium text-saffron">{n}</p>
      <h3 className="mt-3 font-display text-xl font-semibold text-maroon">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/65">{body}</p>
    </div>
  );
}

function Contact({ name, role }: { name: string; role: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-xl font-semibold text-maroon">{name}</p>
      <p className="eyebrow mt-1 text-[0.62rem] text-saffron">{role}</p>
    </div>
  );
}

function Diamonds({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 16" className={className} fill="currentColor" aria-hidden>
      {[8, 32, 56, 80, 104].map((x) => (
        <rect key={x} x={x - 4} y={4} width={8} height={8} transform={`rotate(45 ${x} 8)`} />
      ))}
    </svg>
  );
}

