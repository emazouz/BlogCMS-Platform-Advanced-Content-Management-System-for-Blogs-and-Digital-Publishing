// Analytics helper functions and utilities
import { PageView } from "@/models/PageView";

// Types
export type Period = "7d" | "30d" | "90d";

export interface DateRange {
  start: Date;
  end: Date;
  days: number;
}

export interface AnalyticsStats {
  totalViews: number;
  totalVisitors: number;
  previousViews?: number;
  previousVisitors?: number;
  viewsChange?: number;
  visitorsChange?: number;
}

// Validation
export function validatePeriod(period: string | null): Period {
  const validPeriods: Period[] = ["7d", "30d", "90d"];
  if (!period || !validPeriods.includes(period as Period)) {
    return "30d"; // Default
  }
  return period as Period;
}

// Date calculations
export function getDateRange(period: Period): DateRange {
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  return { start, end, days };
}

export function getPreviousDateRange(period: Period): DateRange {
  const currentRange = getDateRange(period);
  const days = currentRange.days;

  const end = new Date(currentRange.start);
  end.setMilliseconds(-1); // End just before current period starts

  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);

  return { start, end, days };
}

// Data formatting
export function formatDateForChart(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatDateForDB(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

// Fill missing dates in chart data
export function fillMissingDates(
  data: Array<{ date: string; pageViews: number; uniqueVisitors: number }>,
  days: number
): Array<{ date: string; pageViews: number; uniqueVisitors: number }> {
  const result = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dateStr = formatDateForChart(date);

    const existing = data.find((d) => d.date === dateStr);

    result.push({
      date: dateStr,
      pageViews: existing?.pageViews || 0,
      uniqueVisitors: existing?.uniqueVisitors || 0,
    });
  }

  return result;
}

// Calculate percentage change
export function calculateChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
}

// Optimized aggregation query for analytics stats
export async function getAnalyticsStats(
  startDate: Date,
  endDate?: Date
): Promise<AnalyticsStats> {
  const matchStage: any = {
    date: { $gte: startDate },
  };

  if (endDate) {
    matchStage.date.$lte = endDate;
  }

  const result = await PageView.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
        totalVisitors: { $sum: "$uniqueVisitors" },
      },
    },
  ]);

  return {
    totalViews: result[0]?.totalViews || 0,
    totalVisitors: result[0]?.totalVisitors || 0,
  };
}

// Get analytics with comparison to previous period
export async function getAnalyticsWithComparison(
  period: Period
): Promise<AnalyticsStats> {
  const currentRange = getDateRange(period);
  const previousRange = getPreviousDateRange(period);

  const [currentStats, previousStats] = await Promise.all([
    getAnalyticsStats(currentRange.start, currentRange.end),
    getAnalyticsStats(previousRange.start, previousRange.end),
  ]);

  const viewsChange = calculateChange(
    currentStats.totalViews,
    previousStats.totalViews
  );
  const visitorsChange = calculateChange(
    currentStats.totalVisitors,
    previousStats.totalVisitors
  );

  return {
    ...currentStats,
    previousViews: previousStats.totalViews,
    previousVisitors: previousStats.totalVisitors,
    viewsChange,
    visitorsChange,
  };
}

// Get chart data with optimized query
export async function getChartData(period: Period) {
  const { start, days } = getDateRange(period);

  const stats = await PageView.aggregate([
    {
      $match: {
        date: { $gte: start },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        pageViews: { $sum: "$views" },
        uniqueVisitors: { $sum: "$uniqueVisitors" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Format data for chart
  const chartData = stats.map((stat) => ({
    date: formatDateForChart(new Date(stat._id)),
    pageViews: stat.pageViews,
    uniqueVisitors: stat.uniqueVisitors,
  }));

  // Fill in missing dates with zeros
  return fillMissingDates(chartData, days);
}
