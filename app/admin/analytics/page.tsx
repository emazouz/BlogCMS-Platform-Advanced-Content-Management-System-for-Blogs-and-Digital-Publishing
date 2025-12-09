"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  DollarSign,
  Eye,
  TrendingUp,
  MousePointerClick,
} from "lucide-react";
import { AnalyticsChart } from "@/components/admin/widgets/AnalyticsChart";
import { AdSenseChart } from "@/components/admin/widgets/AdSenseChart";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
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
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Unique Visitors",
      value: stats?.visitors?.total.toLocaleString() || "0",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Total Earnings",
      value: `$${stats?.earnings?.total.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Ad Impressions",
      value: stats?.impressions?.total.toLocaleString() || "0",
      icon: MousePointerClick,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Monitor your blog's performance and revenue
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                {loading ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart />
        <AdSenseChart />
      </div>
    </div>
  );
}
