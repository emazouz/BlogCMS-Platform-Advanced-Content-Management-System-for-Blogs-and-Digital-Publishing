import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { AdSenseStats } from "@/models/AdSenseStats";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const stats = await AdSenseStats.find({}).sort({ date: -1 });

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching adsense stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { date, earnings, impressions, clicks, ctr, rpm } = body;

    // Basic validation
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    await dbConnect();

    // Check if date already exists
    const existing = await AdSenseStats.findOne({ date: new Date(date) });
    if (existing) {
      return NextResponse.json(
        {
          error:
            "Stats for this date already exist. Delete existing entry first.",
        },
        { status: 400 }
      );
    }

    const newStat = await AdSenseStats.create({
      date: new Date(date),
      earnings: Number(earnings) || 0,
      impressions: Number(impressions) || 0,
      clicks: Number(clicks) || 0,
      ctr: Number(ctr) || 0,
      rpm: Number(rpm) || 0,
    });

    return NextResponse.json({ stat: newStat }, { status: 201 });
  } catch (error) {
    console.error("Error creating adsense stat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
