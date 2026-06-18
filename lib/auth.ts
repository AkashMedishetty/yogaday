import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "yoga_admin";

function adminPassword(): string {
  // Default password for local/dev. CHANGE THIS in production via env var.
  return process.env.ADMIN_PASSWORD || "yoga2026";
}

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || adminPassword() + "::yoga-day-salt";
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

/** Token proves knowledge of the password without storing it in the cookie. */
export function makeToken(): string {
  const payload = "admin";
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  if (sig.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function checkPassword(password: string): boolean {
  const expected = adminPassword();
  if (password.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}
