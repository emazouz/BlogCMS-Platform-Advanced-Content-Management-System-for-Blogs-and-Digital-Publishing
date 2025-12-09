import { NextRequest, NextResponse } from "next/server";
import { Comment } from "@/models/Comment";
import { Post } from "@/models/Post"; // Ensure Post model is registered
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Ensure Post model is registered before populating
    // This is sometimes needed in dev mode hot-reloading
    const _ = Post;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const postId = searchParams.get("post");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }
    if (postId) {
      query.post = postId;
    }

    const comments = await Comment.find(query)
      .populate("post", "title slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Comment.countDocuments(query);

    return NextResponse.json({
      comments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
