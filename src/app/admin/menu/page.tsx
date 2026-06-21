import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminMenuPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return <AdminDashboard view="menu" />;
}
