import { requireAdmin } from "@/lib/auth";
import { deleteAgencyApp, updateAgencyApp } from "@/lib/agency";

export async function PATCH(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const patch = await request.json().catch(() => ({}));
  const rec = await updateAgencyApp(id, patch);
  if (!rec) return Response.json({ error: "Not found." }, { status: 404 });
  return Response.json({ ok: true, record: rec });
}

export async function DELETE(_request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  await deleteAgencyApp(id);
  return Response.json({ ok: true });
}
