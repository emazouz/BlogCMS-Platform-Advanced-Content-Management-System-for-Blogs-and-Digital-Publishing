import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { AdSenseStats } from "@/models/AdSenseStats";
import { auth } from "@/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const stat = await AdSenseStats.findByIdAndDelete(params.id);

    if (!stat) {
      return NextResponse.json(
        { error: "Stat entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Stat deleted successfully" });
  } catch (error) {
    console.error("Error deleting adsense stat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
