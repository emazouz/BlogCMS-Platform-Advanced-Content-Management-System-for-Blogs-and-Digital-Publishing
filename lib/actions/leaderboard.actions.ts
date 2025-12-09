"use server";

import connectToDatabase from "@/lib/db/mongoose";
import { Comment } from "@/models/Comment";
import { Rating } from "@/models/Rating";
import { User } from "@/models/User";

export async function getTopCommenters(limit = 5) {
  try {
    await connectToDatabase();

    // Aggregate comments by authorEmail (since Comment model uses email/name often, but check if authorId is available)
    // The Comment model has authorId field ? Let's check Comment.ts again.
    // Looking at Comment.ts: authorId is optional?
    // Let's use authorEmail as unique identifier if ID is missing, or prefer authorId.
    // Wait, the Comment schema has: authorName, authorEmail. authorId is optional.

    // Simplest approach: Group by authorEmail.
    const topCommenters = await Comment.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: "$authorEmail",
          name: { $first: "$authorName" },
          avatar: { $first: "$authorAvatar" }, // Assuming this field exists or we might need to fetch user
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    // If we want real user data (avatar etc), we might want to lookup users if possible.
    // But for now let's return what we have.
    return JSON.parse(JSON.stringify(topCommenters));
  } catch (error) {
    console.error("Error fetching top commenters:", error);
    return [];
  }
}

export async function getTopRaters(limit = 5) {
  try {
    await connectToDatabase();

    // We need to import User model to ensure it's registered if we populate?
    // Actually aggregate is fine.

    const topRaters = await Rating.aggregate([
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 1,
          count: 1,
          name: "$userInfo.name",
          username: "$userInfo.username",
          image: "$userInfo.image",
        },
      },
    ]);

    return JSON.parse(JSON.stringify(topRaters));
  } catch (error) {
    console.error("Error fetching top raters:", error);
    return [];
  }
}
