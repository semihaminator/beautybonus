import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";
import AdminShell from "@/components/AdminShell";
import AgencyAdmin from "@/components/AgencyAdmin";
import ContestsAdmin from "@/components/ContestsAdmin";
import { getClicks, getContests } from "@/lib/contests";
import SettingsAdmin from "@/components/SettingsAdmin";
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
  const contests = await getContests();
  const clicks = await getClicks(contests.map((c) => c.slug));
  const siteUrl = (process.env.SITE_URL || "https://salsa.team").replace(/\/$/, "");
  const newAgency = agencyApps.filter((a) => a.status === "new").length;
  const pendingBB = apps.filter((a) => !statuses[a.appId]).length;

  return (
    <AdminShell badges={{ beauty: pendingBB, agency: newAgency }}>
      {{
        beauty: <AdminDashboard apps={apps} statuses={statuses} error={error} />,
        agency: <AgencyAdmin apps={agencyApps} />,
        contests: <ContestsAdmin initial={contests} clicks={clicks} siteUrl={siteUrl} />,
        settings: <SettingsAdmin initial={settings} linkFields={LINK_FIELDS} sectionFields={SECTION_FIELDS} />,
      }}
    </AdminShell>
  );
}
