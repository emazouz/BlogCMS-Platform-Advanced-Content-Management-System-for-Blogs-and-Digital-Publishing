import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { PageView } from "@/models/PageView";
import { AdSenseStats } from "@/models/AdSenseStats";
import { Post } from "@/models/Post";
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

    // Run parallel queries
    const [pageViewStats, adSenseStats, postStats] = await Promise.all([
      // 1. PageView Stats (Views & Visitors)
      PageView.aggregate([
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
      ]),

      // 2. AdSense Stats
      AdSenseStats.aggregate([
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
      ]),

      // 3. Post Stats
      Post.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            thisMonth: [
              { $match: { createdAt: { $gte: startOfMonth } } },
              { $count: "count" },
            ],
            lastMonth: [
              {
                $match: {
                  createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                },
              },
              { $count: "count" },
            ],
          },
        },
      ]),
    ]);

    // Extract PageView Data
    const pvTotal = pageViewStats[0]?.total[0] || {
      totalViews: 0,
      totalVisitors: 0,
    };
    const pvThisMonth = pageViewStats[0]?.thisMonth[0] || {
      monthViews: 0,
      monthVisitors: 0,
    };
    const pvLastMonth = pageViewStats[0]?.lastMonth[0] || {
      lastMonthViews: 0,
      lastMonthVisitors: 0,
    };

    // Extract AdSense Data
    const asTotal = adSenseStats[0]?.total[0] || {
      totalEarnings: 0,
      totalImpressions: 0,
    };
    const asMonth = adSenseStats[0]?.thisMonth[0] || {
      monthEarnings: 0,
      monthImpressions: 0,
    };

    // Extract Post Data
    const postsTotal = postStats[0]?.total[0]?.count || 0;
    const postsThisMonth = postStats[0]?.thisMonth[0]?.count || 0;
    const postsLastMonth = postStats[0]?.lastMonth[0]?.count || 0;

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const viewsChange = calculateChange(
      pvThisMonth.monthViews,
      pvLastMonth.lastMonthViews
    );
    const visitorsChange = calculateChange(
      pvThisMonth.monthVisitors,
      pvLastMonth.lastMonthVisitors
    );
    const postsChange = calculateChange(postsThisMonth, postsLastMonth);

    const stats = {
      views: {
        total: pvTotal.totalViews,
        thisMonth: pvThisMonth.monthViews,
        lastMonth: pvLastMonth.lastMonthViews,
        change: viewsChange,
      },
      visitors: {
        total: pvTotal.totalVisitors,
        thisMonth: pvThisMonth.monthVisitors,
        lastMonth: pvLastMonth.lastMonthVisitors,
        change: visitorsChange,
      },
      posts: {
        total: postsTotal,
        thisMonth: postsThisMonth,
        lastMonth: postsLastMonth,
        change: postsChange,
      },
      earnings: {
        total: asTotal.totalEarnings,
        thisMonth: asMonth.monthEarnings,
      },
      impressions: {
        total: asTotal.totalImpressions,
        thisMonth: asMonth.monthImpressions,
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
