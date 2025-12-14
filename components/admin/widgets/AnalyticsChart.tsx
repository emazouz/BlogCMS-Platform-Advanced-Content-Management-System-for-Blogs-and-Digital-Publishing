"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Calendar,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Activity,
  Clock,
} from "lucide-react";

// Types
type Period = "7d" | "30d" | "90d";
type ChartType = "line" | "area";

interface ChartData {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
}

interface AnalyticsSummary {
  totalViews: number;
  totalVisitors: number;
  avgViewsPerDay: number;
  avgVisitorsPerDay: number;
  viewsChange: number;
  visitorsChange: number;
  peakDay: string;
  peakViews: number;
}

interface ApiResponse {
  data: ChartData[];
  summary?: AnalyticsSummary;
  success?: boolean;
  error?: string;
}

interface PeriodOption {
  value: Period;
  label: string;
}

interface SummaryCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: number;
  color: string;
}

// Constants
const PERIOD_OPTIONS: PeriodOption[] = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
];

const CHART_COLORS = {
  pageViews: "#3b82f6",
  uniqueVisitors: "#10b981",
  grid: "#e5e7eb",
  text: "#6b7280",
} as const;

// Utility functions
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

function calculateSummary(data: ChartData[]): AnalyticsSummary {
  if (data.length === 0) {
    return {
      totalViews: 0,
      totalVisitors: 0,
      avgViewsPerDay: 0,
      avgVisitorsPerDay: 0,
      viewsChange: 0,
      visitorsChange: 0,
      peakDay: "",
      peakViews: 0,
    };
  }

  const totalViews = data.reduce((sum, day) => sum + day.pageViews, 0);
  const totalVisitors = data.reduce((sum, day) => sum + day.uniqueVisitors, 0);

  const avgViewsPerDay = Math.round(totalViews / data.length);
  const avgVisitorsPerDay = Math.round(totalVisitors / data.length);

  // Calculate change (compare last half vs first half)
  const midpoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midpoint);
  const secondHalf = data.slice(midpoint);

  const firstHalfViews =
    firstHalf.reduce((sum, day) => sum + day.pageViews, 0) / firstHalf.length;
  const secondHalfViews =
    secondHalf.reduce((sum, day) => sum + day.pageViews, 0) / secondHalf.length;
  const viewsChange =
    firstHalfViews === 0
      ? 0
      : Math.round(((secondHalfViews - firstHalfViews) / firstHalfViews) * 100);

  const firstHalfVisitors =
    firstHalf.reduce((sum, day) => sum + day.uniqueVisitors, 0) /
    firstHalf.length;
  const secondHalfVisitors =
    secondHalf.reduce((sum, day) => sum + day.uniqueVisitors, 0) /
    secondHalf.length;
  const visitorsChange =
    firstHalfVisitors === 0
      ? 0
      : Math.round(
          ((secondHalfVisitors - firstHalfVisitors) / firstHalfVisitors) * 100
        );

  // Find peak day
  const peakData = data.reduce(
    (max, day) => (day.pageViews > max.pageViews ? day : max),
    data[0]
  );

  return {
    totalViews,
    totalVisitors,
    avgViewsPerDay,
    avgVisitorsPerDay,
    viewsChange,
    visitorsChange,
    peakDay: peakData.date,
    peakViews: peakData.pageViews,
  };
}

// Sub-components
function SummaryCard({
  icon: Icon,
  label,
  value,
  change,
  color,
}: SummaryCardProps) {
  const hasChange = typeof change === "number";
  const isPositive = change && change >= 0;

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        {hasChange && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${
              isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
            ) : (
              <TrendingDown className="h-3 w-3" aria-hidden="true" />
            )}
            <span>
              {isPositive ? "+" : ""}
              {change}%
            </span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ChartTypeToggle({
  chartType,
  onChange,
}: {
  chartType: ChartType;
  onChange: (type: ChartType) => void;
}) {
  return (
    <div className="flex gap-1 bg-muted rounded-lg p-1">
      <button
        onClick={() => onChange("line")}
        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
          chartType === "line"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={chartType === "line"}
      >
        Line
      </button>
      <button
        onClick={() => onChange("area")}
        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
          chartType === "area"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={chartType === "area"}
      >
        Area
      </button>
    </div>
  );
}

// Main component
export function AnalyticsChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("30d");
  const [chartType, setChartType] = useState<ChartType>("line");
  const abortControllerRef = useRef<AbortController | null>(null);

  const summary = useMemo(() => calculateSummary(data), [data]);

  const fetchAnalytics = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/analytics/chart?period=${period}`, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      const result: ApiResponse = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setData(result.data || []);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : "Failed to load analytics data";

      console.error("Error fetching analytics:", err);
      setError(errorMessage);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAnalytics]);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

  const handleRetry = () => {
    fetchAnalytics();
  };

  return (
    <div className="space-y-4">
      {/* Main Chart Card */}
      <article className="bg-card rounded-lg border border-border p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar
              className="h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Traffic Overview
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Page views and unique visitors
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Chart Type Toggle */}
            <ChartTypeToggle chartType={chartType} onChange={setChartType} />

            {/* Period Selector */}
            <div
              className="flex gap-2"
              role="group"
              aria-label="Time period selector"
            >
              {PERIOD_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handlePeriodChange(value)}
                  disabled={loading}
                  className={`
                    px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      period === value
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }
                  `}
                  aria-pressed={period === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative min-h-[320px]">
          {loading ? (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              role="status"
              aria-live="polite"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <span className="sr-only">Loading analytics data...</span>
              <p className="text-sm text-muted-foreground mt-3">
                Loading data...
              </p>
            </div>
          ) : error ? (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              role="alert"
            >
              <AlertCircle
                className="h-12 w-12 text-destructive mb-3"
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-foreground mb-1">
                Failed to load analytics
              </p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : data.length === 0 ? (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground"
              role="status"
            >
              <Calendar
                className="h-12 w-12 mb-3 opacity-50"
                aria-hidden="true"
              />
              <p className="text-sm font-medium">No data available</p>
              <p className="text-xs mt-1">
                No analytics data for the selected period
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              {chartType === "line" ? (
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.grid}
                    className="dark:opacity-20"
                  />
                  <XAxis
                    dataKey="date"
                    stroke={CHART_COLORS.text}
                    style={{ fontSize: "12px" }}
                    tick={{ fill: CHART_COLORS.text }}
                    tickMargin={8}
                  />
                  <YAxis
                    stroke={CHART_COLORS.text}
                    style={{ fontSize: "12px" }}
                    tick={{ fill: CHART_COLORS.text }}
                    tickMargin={8}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "14px",
                      padding: "12px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                    labelStyle={{
                      fontWeight: 600,
                      marginBottom: "8px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                    itemStyle={{
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: "14px",
                      paddingTop: "20px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pageViews"
                    stroke={CHART_COLORS.pageViews}
                    strokeWidth={2}
                    name="Page Views"
                    dot={{ fill: CHART_COLORS.pageViews, r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={500}
                  />
                  <Line
                    type="monotone"
                    dataKey="uniqueVisitors"
                    stroke={CHART_COLORS.uniqueVisitors}
                    strokeWidth={2}
                    name="Unique Visitors"
                    dot={{ fill: CHART_COLORS.uniqueVisitors, r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={500}
                  />
                </LineChart>
              ) : (
                <AreaChart
                  data={data}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="colorPageViews"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS.pageViews}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS.pageViews}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorVisitors"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS.uniqueVisitors}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS.uniqueVisitors}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.grid}
                    className="dark:opacity-20"
                  />
                  <XAxis
                    dataKey="date"
                    stroke={CHART_COLORS.text}
                    style={{ fontSize: "12px" }}
                    tick={{ fill: CHART_COLORS.text }}
                    tickMargin={8}
                  />
                  <YAxis
                    stroke={CHART_COLORS.text}
                    style={{ fontSize: "12px" }}
                    tick={{ fill: CHART_COLORS.text }}
                    tickMargin={8}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "14px",
                      padding: "12px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                    labelStyle={{
                      fontWeight: 600,
                      marginBottom: "8px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                    itemStyle={{
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: "14px",
                      paddingTop: "20px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    stroke={CHART_COLORS.pageViews}
                    strokeWidth={2}
                    fill="url(#colorPageViews)"
                    name="Page Views"
                    animationDuration={500}
                  />
                  <Area
                    type="monotone"
                    dataKey="uniqueVisitors"
                    stroke={CHART_COLORS.uniqueVisitors}
                    strokeWidth={2}
                    fill="url(#colorVisitors)"
                    name="Unique Visitors"
                    animationDuration={500}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </article>

      {/* Analytics Summary Cards */}
      {!loading && !error && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            icon={Eye}
            label="Total Page Views"
            value={formatNumber(summary.totalViews)}
            change={summary.viewsChange}
            color="from-blue-500 to-blue-600"
          />
          <SummaryCard
            icon={Users}
            label="Total Visitors"
            value={formatNumber(summary.totalVisitors)}
            change={summary.visitorsChange}
            color="from-green-500 to-green-600"
          />
          <SummaryCard
            icon={Activity}
            label="Avg. Views/Day"
            value={formatNumber(summary.avgViewsPerDay)}
            color="from-purple-500 to-purple-600"
          />
          <SummaryCard
            icon={Clock}
            label="Peak Day"
            value={summary.peakDay}
            color="from-orange-500 to-orange-600"
          />
        </div>
      )}
    </div>
  );
}
