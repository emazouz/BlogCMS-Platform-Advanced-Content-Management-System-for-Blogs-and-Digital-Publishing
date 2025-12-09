"use server";

import { auth } from "@/auth";
import connectToDatabase from "@/lib/db/mongoose";
import { Post } from "@/models/Post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const featuredImage = formData.get("featuredImage") as string;
  const status = formData.get("status") as string;
  const categoryId = formData.get("category") as string;
  const tagsJson = formData.get("tags") as string;

  // SEO & Meta
  const metaTitle = formData.get("metaTitle") as string;
  const metaDescription = formData.get("metaDescription") as string;
  const focusKeyword = formData.get("focusKeyword") as string;

  // Dates
  const publishedAt = formData.get("publishedAt") as string;
  const scheduledFor = formData.get("scheduledFor") as string;

  // Parse tags
  let tags: string[] = [];
  try {
    tags = tagsJson ? JSON.parse(tagsJson) : [];
  } catch (e) {
    console.error("Failed to parse tags", e);
  }

  await connectToDatabase();

  await Post.create({
    title,
    slug: slug
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, ""),
    content,
    excerpt,
    featuredImage,
    status: status || "draft",
    category: categoryId || undefined,
    tags: tags,
    author: session.user.id,

    // SEO
    metaTitle,
    metaDescription,
    focusKeyword,

    // Dates
    publishedAt: publishedAt ? new Date(publishedAt) : undefined,
    scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
  });

  revalidatePath("/admin");
  revalidatePath("/blog");
  redirect("/admin/posts");
}

export async function updatePost(postId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const featuredImage = formData.get("featuredImage") as string;
  const status = formData.get("status") as string;
  const categoryId = formData.get("category") as string;
  const tagsJson = formData.get("tags") as string;

  // SEO & Meta
  const metaTitle = formData.get("metaTitle") as string;
  const metaDescription = formData.get("metaDescription") as string;
  const focusKeyword = formData.get("focusKeyword") as string;

  // Dates
  const publishedAt = formData.get("publishedAt") as string;
  const scheduledFor = formData.get("scheduledFor") as string;

  // Parse tags
  let tags: string[] = [];
  try {
    tags = tagsJson ? JSON.parse(tagsJson) : [];
  } catch (e) {
    console.error("Failed to parse tags", e);
  }

  await connectToDatabase();

  await Post.findByIdAndUpdate(postId, {
    title,
    slug: slug
      ? slug
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "")
      : undefined,
    content,
    excerpt,
    featuredImage,
    status: status,
    category: categoryId || undefined,
    tags: tags,

    // SEO
    metaTitle,
    metaDescription,
    focusKeyword,

    // Dates
    publishedAt: publishedAt ? new Date(publishedAt) : undefined,
    scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath(`/blog/${slug || postId}`);
  redirect("/admin/posts");
}

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();
  await Post.findByIdAndDelete(postId);
  revalidatePath("/admin");
}

export async function togglePublish(postId: string, currentState: boolean) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();
  await Post.findByIdAndUpdate(postId, { published: !currentState });
  revalidatePath("/admin");
}

export async function ratePost(postId: string, rating: number, path: string) {
  try {
    const session = await auth();
    // Assuming anonymous ratings are not allowed for leaderboard tracking
    // If they are allowed, we can't track them for the leaderboard anyway.
    // Let's require auth for rating or at least check it.

    // For now, let's proceed. If user is logged in, we save the rating.

    await connectToDatabase();

    // We need to fetch the current post to calculate the new average
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    // If logged in, save/update Rating document
    if (session?.user?.id) {
      // Check if user already rated
      const existingRating = await import("@/models/Rating").then((m) =>
        m.Rating.findOne({
          user: session.user.id,
          post: postId,
        })
      );

      if (existingRating) {
        // Update existing rating
        // We'd need more complex math to update the average correctly if we support changing ratings
        // For simplicity in this iteration, let's just update the value and recalculate average from scratch or approximation
        // But the requirement implies "users who have rated", so unique rating per user per post.

        // Let's simplified approach: Update the rating doc. Then Recalculate average from all ratings?
        // Calculating from all ratings is safer for consistency.
        existingRating.value = rating;
        await existingRating.save();
      } else {
        // Create new rating
        await import("@/models/Rating").then((m) =>
          m.Rating.create({
            user: session.user.id,
            post: postId,
            value: rating,
          })
        );
      }

      // Recalculate post average from Rating collection to be accurate
      const stats = await import("@/models/Rating").then((m) =>
        m.Rating.aggregate([
          { $match: { post: post._id } },
          {
            $group: {
              _id: "$post",
              averageRating: { $avg: "$value" },
              ratingCount: { $sum: 1 },
            },
          },
        ])
      );

      if (stats.length > 0) {
        post.rating = parseFloat(stats[0].averageRating.toFixed(1));
        post.ratingCount = stats[0].ratingCount;
      } else {
        // Fallback if something went wrong, though create above should ensure stats
        post.rating = rating;
        post.ratingCount = 1;
      }
    } else {
      // Anonymous rating (legacy logic - keep it or disable? Request implies tracking users)
      // If tracking users is the goal, we should probably force login, but let's keep legacy behavior for anonymous valid?
      // Actually, the new requirement is "users who have rated". Anonymous ratings can't be tracked for leaderboard.
      // Let's keep the legacy math for anonymous users ONLY if we want to allow them, but mixing sources is messy.
      // Decision: Only track ratings for logged-in users?
      // For now, I will stick to the existing "dumb" math for non-logged in (if allowed), OR just enforce login.
      // Let's assume for this task we want to move towards logged-in ratings.
      // But to avoid breaking existing functionality for anonymous (if it was allowed), I'll leave the old math as fallback?
      // Actually the old math was: new Avg = ((Old * Count) + New) / Count+1.
      // If we start using Rating model, we should rely on it.
      // Let's just use the Rating model logic if user is logged in.
      // If NOT logged in, we return error or prompt login? The UI shows it's possible?
      // `StarRating` component doesn't enforce auth explicitly in UI but `ratePost` didn't check.
      // I'll wrap the Rating logic in a check. If no session, we might return error or just do the old simple math (but that won't show on leaderboard).
      // Let's allow anonymous for now but they won't show on leaderboard.

      const currentRating = post.rating || 0;
      const currentCount = post.ratingCount || 0;
      const newCount = currentCount + 1;
      const newRating = (currentRating * currentCount + rating) / newCount;
      post.rating = parseFloat(newRating.toFixed(1));
      post.ratingCount = newCount;
    }

    await post.save();

    revalidatePath(path);
    return {
      success: true,
      rating: post.rating,
      ratingCount: post.ratingCount,
    };
  } catch (error) {
    console.error("Error rating post:", error);
    return { success: false, error: "Failed to submit rating" };
  }
}

// Sidebar Data Fetching
export async function getRecentPosts(limit = 5) {
  try {
    await connectToDatabase();
    const posts = await Post.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("author", "name username")
      .select("title slug featuredImage createdAt author category")
      .lean();
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }
}

export async function getPopularPosts(limit = 5) {
  try {
    await connectToDatabase();
    // Sort by rating first, then views
    const posts = await Post.find({ status: "published" })
      .sort({ rating: -1, views: -1 })
      .limit(limit)
      .populate("author", "name username")
      .select("title slug featuredImage createdAt author category rating")
      .lean();
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return [];
  }
}
