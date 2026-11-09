import { requireAdmin } from "@/lib/auth";
import { saveSettings } from "@/lib/settings";

export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid request." }, { status: 400 });
  try {
    const settings = await saveSettings(body);
    return Response.json({ ok: true, settings });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not save settings." }, { status: 500 });
  }
}
