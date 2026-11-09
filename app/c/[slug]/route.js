import { countClick, getContests } from "@/lib/contests";

// salsa.team/c/<slug> → the contest's own site. Counts each visit.
// Switched-off or unknown contests go to the home page.
export async function GET(request, { params }) {
  const { slug } = await params;
  const contest = (await getContests()).find((c) => c.slug === String(slug).toLowerCase());
  if (!contest || !contest.active) return Response.redirect(new URL("/", request.url), 302);
  await countClick(contest.slug);
  return new Response(null, { status: 302, headers: { Location: contest.url, "Cache-Control": "no-store" } });
}
