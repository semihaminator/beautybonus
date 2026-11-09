import { createAgencyApp, validateAgency } from "@/lib/agency";
import { isLocale } from "@/lib/i18n";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body.website) return Response.json({ ok: true }); // honeypot

  const { data, errors } = validateAgency(body);
  if (errors) return Response.json({ error: "Please check the highlighted fields.", errors }, { status: 400 });

  try {
    const rec = await createAgencyApp({ ...data, lang: isLocale(body.lang) ? body.lang : "en" });
    return Response.json({ ok: true, reference: rec.id.slice(0, 8).toUpperCase() });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "We couldn't save your application. Please try again." }, { status: 500 });
  }
}
