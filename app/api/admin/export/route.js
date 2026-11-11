import { requireAdmin } from "@/lib/auth";
import { getAllStatuses, listApplications, STATUS_LABELS } from "@/lib/db";
import { monthLabel } from "@/lib/months";

const cell = (v) => {
  const s = String(v ?? "");
  // Quote, and neutralise spreadsheet formula injection.
  const safe = /^[=@\t\r]|^[+-](?![\d\s(])/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET(request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const [apps, statuses] = await Promise.all([listApplications(), getAllStatuses()]);
  const rows = [["Submitted", "In-app ID", "Start", "Email", "Phone", "Language", "Status", "Photo"]];
  for (const a of apps) {
    rows.push([
      new Date(a.createdAt).toISOString(),
      a.appId,
      monthLabel(a.startMonth),
      a.email,
      a.phone,
      ({ en: "EN", ru: "RU", uk: "UA" })[a.lang] || "EN",
      STATUS_LABELS[statuses[a.startMonth]?.[a.appId] || "pending"],
      `${new URL(request.url).origin}/api/admin/photo/${a.id}`,
    ]);
  }
  const csv = "﻿" + rows.map((r) => r.map(cell).join(",")).join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="beauty-bonus-applications-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
