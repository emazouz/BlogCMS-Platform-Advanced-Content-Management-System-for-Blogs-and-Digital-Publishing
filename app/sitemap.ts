import { MetadataRoute } from "next";
import connectDB from "@/lib/db/mongoose";
import { Post } from "@/models/Post";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log("Generating sitemap...");
  await connectDB();
  console.log("Connected to DB, fetching posts...");
  const posts = await Post.find({ status: "published" })
    .select("slug updatedAt")
    .lean();

  // Replace with your actual domain
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...postUrls,
  ];
}
