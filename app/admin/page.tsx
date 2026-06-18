import { isAuthed } from "@/lib/auth";
import { listRegistrations } from "@/lib/db";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthed())) {
    return <AdminLogin />;
  }

  const registrations = await listRegistrations();
  return <AdminDashboard registrations={registrations} />;
}
