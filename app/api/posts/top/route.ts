// /app/api/posts/top/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { Post, IPost } from "@/models/Post";
import { Comment } from "@/models/Comment";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "30d";
    const limit = parseInt(searchParams.get("limit") || "10");

    // Calculate date filter based on period
    let dateFilter = {};
    if (period !== "all") {
      const daysAgo = period === "7d" ? 7 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      dateFilter = { createdAt: { $gte: startDate } };
    }

    // Get top posts by views
    const posts = (await Post.find({
      status: "published",
      ...dateFilter,
    })
      .sort({ views: -1 })
      .limit(limit)
      .select("title slug views featuredImage")
      .lean()) as unknown as IPost[];

    // Get comment counts for each post
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({
          post: post._id,
          status: "approved",
        });
        return {
          ...post,
          _id: post._id.toString(),
          commentsCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      posts: postsWithComments,
    });
  } catch (error) {
    console.error("Error fetching top posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch top posts" },
      { status: 500 }
    );
  }
}
