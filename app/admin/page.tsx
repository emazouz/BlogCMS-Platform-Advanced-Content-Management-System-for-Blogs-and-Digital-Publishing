// /app/admin/page.tsx
import { Suspense } from "react";
import { auth } from "@/auth";
import { StatsCards } from "@/components/admin/widgets/StatsCard";
import { AnalyticsChart } from "@/components/admin/widgets/AnalyticsChart";
import { RecentPostsWidget } from "@/components/admin/widgets/RecentPostsWidget";
import { TopPostsWidget } from "@/components/admin/widgets/TopPostsWidget";
import { RecentCommentsWidget } from "@/components/admin/widgets/RecentCommentsWidget";
import { QuickActionsWidget } from "@/components/admin/widgets/QuickActionsWidget";
import UserLeaderboardWidget from "@/components/widgets/UserLeaderboardWidget";
import {
  getTopCommenters,
  getTopRaters,
} from "@/lib/actions/leaderboard.actions";
import { RefreshCw, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Dashboard - Admin",
  description: "Admin dashboard overview",
};

export default async function DashboardPage() {
  const session = await auth();
  const [topCommenters, topRaters] = await Promise.all([
    getTopCommenters(5),
    getTopRaters(5),
  ]);

  return (
    <div className="space-y-6 bg-background">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {session?.user?.name || "Admin"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your blog today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground hidden sm:block">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
            <Activity className="h-3 w-3" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
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
          <UserLeaderboardWidget
            topCommenters={topCommenters}
            topRaters={topRaters}
          />
        </div>
      </div>
    </div>
  );
}

// Loading Skeletons
function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-[300px] w-full rounded" />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
