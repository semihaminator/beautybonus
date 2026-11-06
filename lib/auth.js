import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "bb_admin";

function sign(value) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHmac("sha256", pw).update(value).digest("hex");
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

export function sessionToken() {
  return sign("beauty-bonus-admin-session-v1");
}

export function passwordMatches(input) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || !input) return false;
  // Hash both sides so the comparison is constant-time regardless of length.
  const h = (s) => createHmac("sha256", "bb-pw").update(String(s)).digest("hex");
  return safeEqual(h(input), h(pw));
}

export async function isAdmin() {
  const token = sessionToken();
  if (!token) return false;
  const jar = await cookies();
  const value = jar.get(ADMIN_COOKIE)?.value;
  return !!value && safeEqual(value, token);
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }
  return null;
}
