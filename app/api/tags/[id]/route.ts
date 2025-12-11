import { NextRequest, NextResponse } from "next/server";
import { Tag } from "@/models/Tag";
import { auth } from "@/auth";

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();

    const tag = await Tag.findByIdAndUpdate(
      params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Tag name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tag = await Tag.findByIdAndDelete(params.id);

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Tag deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
