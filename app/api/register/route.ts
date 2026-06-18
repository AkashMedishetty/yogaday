import { NextRequest, NextResponse } from "next/server";
import { insertRegistration } from "@/lib/db";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; mobile?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const mobileRaw = (body.mobile || "").trim();
  const mobileDigits = mobileRaw.replace(/[^\d]/g, "");

  if (name.length < 2) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (mobileDigits.length < 7 || mobileDigits.length > 15) {
    return NextResponse.json({ error: "Please enter a valid mobile number." }, { status: 400 });
  }

  try {
    const reg = await insertRegistration({ name, email, mobile: mobileRaw });
    return NextResponse.json({ ok: true, id: reg.id }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/unique|duplicate/i.test(msg)) {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 409 }
      );
    }
    console.error("Registration failed:", msg);
    return NextResponse.json(
      { error: "Could not save your registration. Please try again." },
      { status: 500 }
    );
  }
}
