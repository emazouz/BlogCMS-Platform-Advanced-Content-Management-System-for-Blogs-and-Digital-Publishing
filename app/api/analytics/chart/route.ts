import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { analyticsCache } from "@/lib/cache";
import {
  validatePeriod,
  getChartData,
  type Period,
} from "@/lib/api/analytics-helpers";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const periodParam = searchParams.get("period");
    const period: Period = validatePeriod(periodParam);

    // Check cache first
    const cacheKey = `analytics:chart:${period}`;
    const cached = analyticsCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // Fetch chart data using helper function
    const chartData = await getChartData(period);

    // Cache for 5 minutes
    analyticsCache.set(cacheKey, chartData, 300000);

    return NextResponse.json({
      success: true,
      data: chartData,
      cached: false,
    });
  } catch (error) {
    console.error("[Analytics Chart API] Error fetching analytics:", error);

    // Return more detailed error in development
    const errorMessage =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : "Failed to fetch analytics";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
