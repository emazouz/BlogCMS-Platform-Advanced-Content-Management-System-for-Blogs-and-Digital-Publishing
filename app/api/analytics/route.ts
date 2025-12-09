import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { PageView } from "@/models/PageView";
import { AdSenseStats } from "@/models/AdSenseStats";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // PageView Stats
    const totalPageViews = await PageView.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } },
    ]);
    const totalUniqueVisitors = await PageView.aggregate([
      { $group: { _id: null, total: { $sum: "$uniqueVisitors" } } },
    ]);

    // AdSense Stats
    const totalEarnings = await AdSenseStats.aggregate([
      { $group: { _id: null, total: { $sum: "$earnings" } } },
    ]);
    const totalImpressions = await AdSenseStats.aggregate([
      { $group: { _id: null, total: { $sum: "$impressions" } } },
    ]);

    const stats = {
      views: {
        total: totalPageViews[0]?.total || 0,
        // Add monthly if needed, for simplicity returning total for now
      },
      visitors: {
        total: totalUniqueVisitors[0]?.total || 0,
      },
      earnings: {
        total: totalEarnings[0]?.total || 0,
      },
      impressions: {
        total: totalImpressions[0]?.total || 0,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching analytics stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
