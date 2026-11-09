import { requireAdmin } from "@/lib/auth";
import { AGENCY_STATUS_LABELS, listAgencyApps } from "@/lib/agency";

const cell = (v) => {
  const s = String(v ?? "");
  const safe = /^[=@\t\r]|^[+-](?![\d\s(])/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const apps = await listAgencyApps();
  const rows = [["Submitted", "Status", "Name", "Agent ID", "Email", "Phone", "Country", "City", "Address", "Streamer IDs", "Streamers", "Language", "Comment", "Admin note"]];
  for (const a of apps) {
    rows.push([
      new Date(a.createdAt).toISOString(), AGENCY_STATUS_LABELS[a.status] || a.status, a.name, a.agentId, a.email, a.phone,
      a.country, a.city, a.address, (a.streamerIds || []).join(" "), (a.streamerIds || []).length,
      ({ en: "EN", ru: "RU", uk: "UA" })[a.lang] || "EN", a.comment, a.note,
    ]);
  }
  const csv = "﻿" + rows.map((r) => r.map(cell).join(",")).join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="agency-applications-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
