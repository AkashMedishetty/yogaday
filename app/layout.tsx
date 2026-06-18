import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "International Yoga Day 2026 | TCEI × TEFA",
  description:
    "Join International Yoga Day 2026 — Sunday, 21st June 2026, 8 AM onwards, beside Lake Park, NITHM, Gachibowli, Hyderabad. Organised by TCEI & TEFA. Free registration.",
  openGraph: {
    title: "International Yoga Day 2026",
    description:
      "Sunday, 21st June 2026 · 8 AM onwards · Beside Lake Park, NITHM, Gachibowli. Register free.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#7a1d0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
