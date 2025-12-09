"use server";

import { auth } from "@/auth";
import connectToDatabase from "@/lib/db/mongoose";
import { Comment } from "@/models/Comment";
import { revalidatePath } from "next/cache";

interface CreateCommentParams {
  postId: string;
  content: string;
  authorName: string;
  authorEmail: string;
  rating?: number;
  parentId?: string; // For nested comments/replies
  path: string; // url pathname to revalidate
}

export async function createComment({
  postId,
  content,
  authorName,
  authorEmail,
  rating,
  parentId,
  path,
}: CreateCommentParams) {
  try {
    await connectToDatabase();
    // Assuming Post model is needed for updating rating
    const { Post } = await import("@/models/Post");

    const newComment = await Comment.create({
      post: postId,
      content,
      authorName,
      authorEmail,
      rating: rating || undefined,
      parent: parentId || null,
      status: "pending",
    });

    // Auto-approve for demo/context
    newComment.status = "approved";
    await newComment.save();

    // If there is a rating, update the Post's average rating
    if (rating && rating > 0) {
      const post = await Post.findById(postId);
      if (post) {
        // Re-calculate average from all APPROVED comments with ratings
        const stats = await Comment.aggregate([
          {
            $match: {
              post: post._id,
              status: "approved",
              rating: { $exists: true, $ne: null },
            },
          },
          {
            $group: {
              _id: "$post",
              averageRating: { $avg: "$rating" },
              ratingCount: { $sum: 1 },
            },
          },
        ]);

        if (stats.length > 0) {
          post.rating = parseFloat(stats[0].averageRating.toFixed(1));
          post.ratingCount = stats[0].ratingCount;
        } else {
          // Should be at least this one, but just in case
          post.rating = rating;
          post.ratingCount = 1;
        }
        await post.save();
      }
    }

    revalidatePath(path);
    return { success: true, comment: JSON.parse(JSON.stringify(newComment)) };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { success: false, error: "Failed to create comment" };
  }
}

export async function getCommentsByPostId(postId: string) {
  try {
    await connectToDatabase();

    const comments = await Comment.find({
      post: postId,
      status: "approved", // Only fetch approved comments
      parent: null, // Fetch top-level comments first
    })
      .sort({ createdAt: -1 })
      .lean();

    // Loop through comments and fetch replies?
    // Or just fetch all and build tree in client?
    // For simplicity, let's just fetch top level.
    // If we want threaded, we should fetch all and reconstruct.
    // Let's fetch ALL approved comments for this post and let client handle nesting if needed.

    const allComments = await Comment.find({
      post: postId,
      status: "approved",
    })
      .sort({ createdAt: 1 })
      .lean();

    return JSON.parse(JSON.stringify(allComments));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}
