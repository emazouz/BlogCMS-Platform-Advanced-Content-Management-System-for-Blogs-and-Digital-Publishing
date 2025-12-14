"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  DollarSign,
  Eye,
  TrendingUp,
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsChart } from "@/components/admin/widgets/AnalyticsChart";
import { AdSenseChart } from "@/components/admin/widgets/AdSenseChart";

interface AnalyticsStats {
  views: {
    total: number;
    change: number;
  };
  visitors: {
    total: number;
    change: number;
  };
  earnings: {
    total: number;
    change: number;
  };
  impressions: {
    total: number;
    change: number;
  };
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/analytics");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching analytics stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Page Views",
      value: stats?.views?.total.toLocaleString() || "0",
      change: stats?.views?.change || 0,
      icon: Eye,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Unique Visitors",
      value: stats?.visitors?.total.toLocaleString() || "0",
      change: stats?.visitors?.change || 0,
      icon: Users,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Earnings",
      value: `$${stats?.earnings?.total.toFixed(2) || "0.00"}`,
      change: stats?.earnings?.change || 0,
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Ad Impressions",
      value: stats?.impressions?.total.toLocaleString() || "0",
      change: stats?.impressions?.change || 0,
      icon: MousePointerClick,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your blog's performance and revenue
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div
                className={`h-10 w-10 rounded-full ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    {stat.change >= 0 ? (
                      <>
                        <ArrowUpRight className="h-3 w-3 text-green-600 dark:text-green-400" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          +{stat.change.toFixed(1)}%
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="h-3 w-3 text-red-600 dark:text-red-400" />
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          {stat.change.toFixed(1)}%
                        </span>
                      </>
                    )}
                    <span className="text-muted-foreground">
                      from last month
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="traffic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="traffic">
            <TrendingUp className="h-4 w-4 mr-2" />
            Traffic Analytics
          </TabsTrigger>
          <TabsTrigger value="revenue">
            <DollarSign className="h-4 w-4 mr-2" />
            Revenue Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Traffic Overview
                </CardTitle>
                <CardDescription>
                  Page views and visitor trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  AdSense Performance
                </CardTitle>
                <CardDescription>
                  Earnings and impressions from advertising
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdSenseChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Best Day</span>
                <span className="font-medium">Monday</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Peak Hour</span>
                <span className="font-medium">2:00 PM</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg. Session</span>
                <span className="font-medium">3m 24s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Direct</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Search</span>
                <span className="font-medium">32%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Social</span>
                <span className="font-medium">23%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Bounce Rate</span>
                <span className="font-medium">42%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pages/Session</span>
                <span className="font-medium">2.4</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Return Rate</span>
                <span className="font-medium">28%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
