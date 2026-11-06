import { requireAdmin } from "@/lib/auth";
import { setStatus, STATUSES } from "@/lib/db";

// Body: { ids: string[] | "comma, or newline separated", status }
// status "pending" removes the IDs from all public lists.
export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { ids, status } = await request.json().catch(() => ({}));
  if (![...STATUSES, "pending"].includes(status)) {
    return Response.json({ error: "Unknown status." }, { status: 400 });
  }
  const list = Array.isArray(ids) ? ids : String(ids || "").split(/[\s,;]+/);
  const valid = list.map((s) => String(s).trim()).filter((s) => /^[A-Za-z0-9._-]{1,40}$/.test(s));
  const count = await setStatus(valid, status);
  return Response.json({ ok: true, count });
}
