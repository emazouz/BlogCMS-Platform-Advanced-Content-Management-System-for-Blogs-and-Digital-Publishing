import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { Post } from "@/models/Post";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  const query: any = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (status && status !== "all") {
    query.status = status;
  }

  if (category && category !== "all") {
    query.category = category;
  }

  const posts = await Post.find(query)
    .populate("category", "name")
    .sort({ createdAt: -1 });

  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const newPost = await Post.create(body);
    return NextResponse.json(newPost, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
