import { del } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";
import { deleteApplication, getApplication } from "@/lib/db";

export async function DELETE(_request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const app = await getApplication(id);
  if (app?.photoUrl) {
    try {
      await del(app.photoUrl);
    } catch (err) {
      console.error("Could not delete photo", err);
    }
  }
  await deleteApplication(id);
  return Response.json({ ok: true });
}
