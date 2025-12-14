import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { PageView } from "@/models/PageView";
import { AdSenseStats } from "@/models/AdSenseStats";
import { auth } from "@/auth";
import { analyticsCache } from "@/lib/cache";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check cache first
    const cacheKey = "analytics:overview";
    const cached = analyticsCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    await dbConnect();

    // Date ranges for comparison
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Use $facet to run multiple aggregations in a single query
    const [pageViewStats] = await PageView.aggregate([
      {
        $facet: {
          total: [
            {
              $group: {
                _id: null,
                totalViews: { $sum: "$views" },
                totalVisitors: { $sum: "$uniqueVisitors" },
              },
            },
          ],
          thisMonth: [
            {
              $match: {
                date: { $gte: startOfMonth },
              },
            },
            {
              $group: {
                _id: null,
                monthViews: { $sum: "$views" },
                monthVisitors: { $sum: "$uniqueVisitors" },
              },
            },
          ],
          lastMonth: [
            {
              $match: {
                date: {
                  $gte: startOfLastMonth,
                  $lte: endOfLastMonth,
                },
              },
            },
            {
              $group: {
                _id: null,
                lastMonthViews: { $sum: "$views" },
                lastMonthVisitors: { $sum: "$uniqueVisitors" },
              },
            },
          ],
        },
      },
    ]);

    // Use $facet for AdSense stats as well
    const [adSenseStats] = await AdSenseStats.aggregate([
      {
        $facet: {
          total: [
            {
              $group: {
                _id: null,
                totalEarnings: { $sum: "$earnings" },
                totalImpressions: { $sum: "$impressions" },
              },
            },
          ],
          thisMonth: [
            {
              $match: {
                date: { $gte: startOfMonth },
              },
            },
            {
              $group: {
                _id: null,
                monthEarnings: { $sum: "$earnings" },
                monthImpressions: { $sum: "$impressions" },
              },
            },
          ],
        },
      },
    ]);

    // Extract data with safe defaults
    const totalData = pageViewStats.total[0] || {
      totalViews: 0,
      totalVisitors: 0,
    };
    const thisMonthData = pageViewStats.thisMonth[0] || {
      monthViews: 0,
      monthVisitors: 0,
    };
    const lastMonthData = pageViewStats.lastMonth[0] || {
      lastMonthViews: 0,
      lastMonthVisitors: 0,
    };

    const adSenseTotalData = adSenseStats.total[0] || {
      totalEarnings: 0,
      totalImpressions: 0,
    };
    const adSenseMonthData = adSenseStats.thisMonth[0] || {
      monthEarnings: 0,
      monthImpressions: 0,
    };

    // Calculate percentage changes
    const viewsChange =
      lastMonthData.lastMonthViews === 0
        ? 0
        : Math.round(
            ((thisMonthData.monthViews - lastMonthData.lastMonthViews) /
              lastMonthData.lastMonthViews) *
              100
          );

    const visitorsChange =
      lastMonthData.lastMonthVisitors === 0
        ? 0
        : Math.round(
            ((thisMonthData.monthVisitors - lastMonthData.lastMonthVisitors) /
              lastMonthData.lastMonthVisitors) *
              100
          );

    const stats = {
      views: {
        total: totalData.totalViews,
        thisMonth: thisMonthData.monthViews,
        lastMonth: lastMonthData.lastMonthViews,
        change: viewsChange,
      },
      visitors: {
        total: totalData.totalVisitors,
        thisMonth: thisMonthData.monthVisitors,
        lastMonth: lastMonthData.lastMonthVisitors,
        change: visitorsChange,
      },
      earnings: {
        total: adSenseTotalData.totalEarnings,
        thisMonth: adSenseMonthData.monthEarnings,
      },
      impressions: {
        total: adSenseTotalData.totalImpressions,
        thisMonth: adSenseMonthData.monthImpressions,
      },
    };

    // Cache for 5 minutes
    analyticsCache.set(cacheKey, stats, 300000);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[Analytics API] Error fetching analytics stats:", error);

    // Return more detailed error in development
    const errorMessage =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : "Failed to fetch analytics";

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
