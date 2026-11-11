import { requireAdmin } from "@/lib/auth";
import { ROUND_RE, setStatus, STATUSES } from "@/lib/db";

// Body: { ids: string[] | "comma, or newline separated", status, round: "YYYY-MM" }
// status "pending" removes the IDs from that round's public lists.
export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { ids, status, round } = await request.json().catch(() => ({}));
  if (!ROUND_RE.test(String(round || ""))) {
    return Response.json({ error: "Choose which month these results are for." }, { status: 400 });
  }
  if (![...STATUSES, "pending"].includes(status)) {
    return Response.json({ error: "Unknown status." }, { status: 400 });
  }
  const list = Array.isArray(ids) ? ids : String(ids || "").split(/[\s,;]+/);
  const valid = list.map((s) => String(s).trim()).filter((s) => /^[A-Za-z0-9._-]{1,40}$/.test(s));
  const count = await setStatus(valid, status, round);
  return Response.json({ ok: true, count });
}
