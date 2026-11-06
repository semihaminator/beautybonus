import { createApplication } from "@/lib/db";
import { isValidStartMonth } from "@/lib/months";
import { isLocale } from "@/lib/i18n";

const APP_ID = /^[A-Za-z0-9._-]{2,40}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9 ()-]{7,22}$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field.
  if (body.website) return Response.json({ ok: true });

  const appId = String(body.appId || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const startMonth = String(body.startMonth || "");
  const photoUrl = String(body.photoUrl || "");
  const lang = isLocale(body.lang) ? body.lang : "en";
  const photoAccess = body.photoAccess === "private" ? "private" : "public";

  const errors = {};
  if (!APP_ID.test(appId)) errors.appId = "Enter your in-app ID (letters and numbers only).";
  if (!EMAIL.test(email) || email.length > 120) errors.email = "Enter a valid email address.";
  if (!PHONE.test(phone) || phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a valid phone number with country code.";
  if (!isValidStartMonth(startMonth)) errors.startMonth = "Choose a start month.";
  let photoOk = false;
  try {
    const u = new URL(photoUrl);
    photoOk = u.protocol === "https:" && u.hostname.endsWith(".blob.vercel-storage.com");
  } catch {}
  if (!photoOk) errors.photo = "Please upload your picture.";

  if (Object.keys(errors).length) {
    return Response.json({ error: "Please check the highlighted fields.", errors }, { status: 400 });
  }

  try {
    const rec = await createApplication({ appId, email, phone, startMonth, photoUrl, photoAccess, lang });
    return Response.json({ ok: true, reference: rec.id.slice(0, 8).toUpperCase() });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "We couldn't save your application. Please try again." }, { status: 500 });
  }
}
