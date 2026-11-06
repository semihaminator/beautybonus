import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";
import { isAdmin } from "@/lib/auth";
import { getStatuses, listApplications } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Salsa Beauty Bonus", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;

  let apps = [];
  let statuses = {};
  let error = "";
  try {
    [apps, statuses] = await Promise.all([listApplications(), getStatuses()]);
  } catch (err) {
    error = err.message;
  }
  return <AdminDashboard apps={apps} statuses={statuses} error={error} />;
}
