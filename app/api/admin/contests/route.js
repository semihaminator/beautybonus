import { requireAdmin } from "@/lib/auth";
import { getClicks, saveContests, validateContests } from "@/lib/contests";

export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json().catch(() => null);
  const { list, error } = validateContests(body?.contests);
  if (error) return Response.json({ error }, { status: 400 });
  try {
    await saveContests(list);
    return Response.json({ ok: true, contests: list, clicks: await getClicks(list.map((c) => c.slug)) });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not save contests." }, { status: 500 });
  }
}
