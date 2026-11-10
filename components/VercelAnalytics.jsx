"use client";

import { Analytics } from "@vercel/analytics/next";

// Vercel Web Analytics (countries, devices, referrers). Admin pages are not sent.
export default function VercelAnalytics() {
  return <Analytics beforeSend={(e) => (e.url.includes("/admin") ? null : e)} />;
}
