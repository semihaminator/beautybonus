import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";
import AdminShell from "@/components/AdminShell";
import AgencyAdmin from "@/components/AgencyAdmin";
import ContestsAdmin from "@/components/ContestsAdmin";
import { getClicks, getContests } from "@/lib/contests";
import SettingsAdmin from "@/components/SettingsAdmin";
import StatsAdmin from "@/components/StatsAdmin";
import { dayKey, getDaily, getStats } from "@/lib/stats";
import { listAgencyApps } from "@/lib/agency";
import { isAdmin } from "@/lib/auth";
import { getStatuses, listApplications } from "@/lib/db";
import { getSettings, LINK_FIELDS, SECTION_FIELDS } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Salsa", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;

  let apps = [];
  let statuses = {};
  let agencyApps = [];
  let error = "";
  try {
    [apps, statuses, agencyApps] = await Promise.all([listApplications(), getStatuses(), listAgencyApps()]);
  } catch (err) {
    error = err.message;
  }
  const settings = await getSettings();
  let stats = { today: {}, week: {}, month: {}, all: {} };
  let daily = [];
  try {
    const [t1, week, month, all, d] = await Promise.all([getStats(1), getStats(7), getStats(30), getStats(0), getDaily(30)]);
    stats = { today: t1, week, month, all };
    daily = d;
  } catch (err) {
    console.error("stats unavailable", err.message);
  }
  const since = (days) => (days ? Date.now() - days * 86400000 : 0);
  const countApps = (days) => ({
    bb: apps.filter((a) => a.createdAt >= since(days)).length,
    agency: agencyApps.filter((a) => a.createdAt >= since(days)).length,
  });
  const today = dayKey();
  const appCounts = {
    today: { bb: apps.filter((a) => dayKey(new Date(a.createdAt)) === today).length, agency: agencyApps.filter((a) => dayKey(new Date(a.createdAt)) === today).length },
    week: countApps(7),
    month: countApps(30),
    all: countApps(0),
  };
  const contests = await getContests();
  const clicks = await getClicks(contests.map((c) => c.slug));
  const siteUrl = (process.env.SITE_URL || "https://salsa.team").replace(/\/$/, "");
  const newAgency = agencyApps.filter((a) => a.status === "new").length;
  const pendingBB = apps.filter((a) => !statuses[a.appId]).length;

  return (
    <AdminShell badges={{ beauty: pendingBB, agency: newAgency }}>
      {{
        stats: <StatsAdmin data={stats} daily={daily} apps={appCounts} />,
        beauty: <AdminDashboard apps={apps} statuses={statuses} error={error} />,
        agency: <AgencyAdmin apps={agencyApps} />,
        contests: <ContestsAdmin initial={contests} clicks={clicks} siteUrl={siteUrl} />,
        settings: <SettingsAdmin initial={settings} linkFields={LINK_FIELDS} sectionFields={SECTION_FIELDS} />,
      }}
    </AdminShell>
  );
}
