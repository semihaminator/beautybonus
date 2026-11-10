import { cookies } from "next/headers";
import { trackEvent } from "@/lib/stats";

// Receives page views and button clicks from the site (see components/Tracker.jsx).
// A short-lived cookie (no personal data) lets us count each visitor once per day.
export async function POST(request) {
  let body;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 204 });
  }
  const jar = await cookies();
  const newVisitor = body?.t === "view" && !jar.get("sv");
  try {
    await trackEvent(body || {}, newVisitor);
  } catch (err) {
    console.error("track failed", err.message);
  }
  const res = new Response(null, { status: 204 });
  if (newVisitor) res.headers.append("Set-Cookie", "sv=1; Path=/; Max-Age=86400; SameSite=Lax");
  return res;
}
