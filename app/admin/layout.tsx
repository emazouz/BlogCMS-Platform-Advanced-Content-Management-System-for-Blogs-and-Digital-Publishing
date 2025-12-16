import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import {
  getAdminStats,
  getRecentNotifications,
} from "@/lib/actions/admin-stats.actions";

export const metadata = {
  title: "Admin Dashboard",
  description: "Blog administration panel",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  // Fetch admin statistics and notifications
  const [stats, notifications] = await Promise.all([
    getAdminStats(),
    getRecentNotifications(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar user={session.user} stats={stats} />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <AdminHeader
          user={session.user}
          stats={stats}
          notifications={notifications}
        />

        {/* Page Content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
