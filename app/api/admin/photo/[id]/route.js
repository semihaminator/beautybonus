import { get } from "@vercel/blob";
import { isAdmin } from "@/lib/auth";
import { getApplication } from "@/lib/db";

// Serves an applicant's photo to signed-in admins only.
// Works for both public and private Blob stores.
export async function GET(_request, { params }) {
  if (!(await isAdmin())) return new Response("Not signed in.", { status: 401 });
  const { id } = await params;
  const app = await getApplication(id);
  if (!app?.photoUrl) return new Response("Not found", { status: 404 });

  const access = app.photoAccess === "private" ? "private" : "public";
  try {
    const result = await get(app.photoUrl, { access });
    if (!result || result.statusCode !== 200) return new Response("Not found", { status: 404 });
    return new Response(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType || "image/jpeg",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Photo fetch failed", err);
    if (access === "public") return Response.redirect(app.photoUrl, 302);
    return new Response("Photo unavailable", { status: 502 });
  }
}
