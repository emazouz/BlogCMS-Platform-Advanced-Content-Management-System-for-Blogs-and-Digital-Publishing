// /app/admin/page.tsx
import { Suspense } from "react";
import { auth } from "@/auth";
import { StatsCards } from "@/components/admin/widgets/StatsCard";
import { AnalyticsChart } from "@/components/admin/widgets/AnalyticsChart";
import { RecentPostsWidget } from "@/components/admin/widgets/RecentPostsWidget";
import { TopPostsWidget } from "@/components/admin/widgets/TopPostsWidget";
import { RecentCommentsWidget } from "@/components/admin/widgets/RecentCommentsWidget";
import { QuickActionsWidget } from "@/components/admin/widgets/QuickActionsWidget";

export const metadata = {
  title: "Dashboard - Admin",
  description: "Admin dashboard overview",
};

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session?.user?.name || "Admin"}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your blog today.
          </p>
        </div>
        <div className="text-right text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <AnalyticsChart />
        </Suspense>

        <Suspense fallback={<ChartSkeleton />}>
          <TopPostsWidget />
        </Suspense>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<TableSkeleton />}>
            <RecentPostsWidget />
          </Suspense>

          <Suspense fallback={<TableSkeleton />}>
            <RecentCommentsWidget />
          </Suspense>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          <QuickActionsWidget />
        </div>
      </div>
    </div>
  );
}

// Loading Skeletons
function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
        >
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="h-80 bg-gray-200 rounded"></div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="h-96 bg-gray-200 rounded"></div>
    </div>
  );
}
