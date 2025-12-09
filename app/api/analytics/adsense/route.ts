import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { AdSenseStats } from "@/models/AdSenseStats";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30d";

    const daysAgo = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    startDate.setHours(0, 0, 0, 0);

    const stats = await AdSenseStats.find({
      date: { $gte: startDate },
    }).sort({ date: 1 });

    // Format and fill missing dates
    const chartData = fillMissingDates(
      stats.map((s) => ({
        date: new Date(s.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        earnings: s.earnings,
        impressions: s.impressions,
      })),
      daysAgo
    );

    return NextResponse.json({ data: chartData });
  } catch (error) {
    console.error("Error fetching adsense chart data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function fillMissingDates(data: any[], days: number) {
  const result = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const existing = data.find((d) => d.date === dateStr);

    result.push({
      date: dateStr,
      earnings: existing?.earnings || 0,
      impressions: existing?.impressions || 0,
    });
  }

  return result;
}
