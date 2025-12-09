import { NextRequest, NextResponse } from "next/server";
import { Tag } from "@/models/Tag";
import { auth } from "@/auth";

export async function GET() {
  try {
    const tags = await Tag.find().sort({ createdAt: -1 });
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const tag = await Tag.create({ name });
    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Tag already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
