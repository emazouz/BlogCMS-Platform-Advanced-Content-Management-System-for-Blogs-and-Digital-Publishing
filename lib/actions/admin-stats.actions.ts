"use server";

import connectDB from "@/lib/db/mongoose";
import { Comment } from "@/models/Comment";
import { Post } from "@/models/Post";

export interface AdminStats {
  pendingComments: number;
  draftPosts: number;
  totalPosts: number;
  totalComments: number;
}

export interface AdminNotification {
  id: string;
  title: string;
  time: string;
  type: "comment" | "subscriber" | "report" | "post";
  read: boolean;
  link?: string;
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    await connectDB();

    const [pendingComments, draftPosts, totalPosts, totalComments] =
      await Promise.all([
        // Count pending comments
        Comment.countDocuments({ status: "pending" }),

        // Count draft posts
        Post.countDocuments({ status: "draft" }),

        // Count total posts
        Post.countDocuments(),

        // Count total comments
        Comment.countDocuments(),
      ]);

    return {
      pendingComments,
      draftPosts,
      totalPosts,
      totalComments,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      pendingComments: 0,
      draftPosts: 0,
      totalPosts: 0,
      totalComments: 0,
    };
  }
}

export async function getRecentNotifications(): Promise<AdminNotification[]> {
  try {
    await connectDB();

    // Fetch recent pending comments
    const recentComments = await Comment.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("post", "title slug")
      .lean();

    const notifications: AdminNotification[] = recentComments.map(
      (comment: any) => {
        const timeAgo = getTimeAgo(new Date(comment.createdAt));
        const postTitle = comment.post?.title || "Unknown Post";

        return {
          id: comment._id.toString(),
          title: `New comment on "${postTitle}"`,
          time: timeAgo,
          type: "comment" as const,
          read: false,
          link: `/admin/comments`,
        };
      }
    );

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
}
