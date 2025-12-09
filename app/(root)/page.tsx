import Link from "next/link";
import Image from "next/image";
import connectDB from "@/lib/db/mongoose";
import { Post } from "@/models/Post";
import { ArrowRight } from "lucide-react";
import AdBanner from "@/components/ads/AdBanner";
import Hero from "@/components/home/Hero";
import "@/models/User"; // Ensure User model is registered
import "@/models/Category"; // Ensure Category model is registered
import { Category, ICategory } from "@/models/Category"; // Ensure Category model is registered
import MostPopular from "@/components/home/MostPopular";
import LatestArticles from "@/components/home/LatestArticles";
import HighestRated from "@/components/home/HighestRated";
import AllCategories from "@/components/home/AllCategories";
import RapidGrowth from "@/components/home/RapidGrowth";

async function getData() {
  await connectDB();

  // Parallel fetch for all sections
  const [latestPosts, popularPosts, ratedPosts, categories] = await Promise.all(
    [
      // 1. Latest Posts
      Post.find({ status: "published" })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("author", "username")
        .populate("category", "name"),

      // 2. Most Popular (by views)
      Post.find({ status: "published" })
        .sort({ views: -1 })
        .limit(4)
        .populate("author", "username")
        .populate("category", "name"),

      // 3. Highest Rated (by rating)
      Post.find({ status: "published" })
        .sort({ rating: -1 })
        .limit(3)
        .populate("author", "username"),

      // 4. Categories
      Category.find({}).limit(12),
    ]
  );

  // Helper to serialize
  const serialize = (data: any) => JSON.parse(JSON.stringify(data));

  const formatPosts = (posts: any[]) =>
    posts.map((post) => ({
      ...post,
      category: post.category?.name || "General",
    }));

  return {
    latestPosts: formatPosts(serialize(latestPosts)),
    popularPosts: formatPosts(serialize(popularPosts)),
    ratedPosts: formatPosts(serialize(ratedPosts)),
    categories: serialize(categories),
  };
}

export default async function Home() {
  const { latestPosts, popularPosts, ratedPosts, categories } = await getData();

  return (
    <div className="min-h-screen font-sans transition-colors duration-300 wrapper">
      {/* Navbar Placeholder */}
      <div className="container mx-auto px-6 pt-20">
        <AdBanner dataAdSlot="HOME_LEADERBOARD" />
      </div>

      {/* 1. Hero Section (Uses latest posts for now, or could use popular) */}
      <Hero posts={latestPosts} />

      {/* 2. Most Popular */}
      <MostPopular posts={popularPosts} />

      {/* 3. Latest Articles */}
      <LatestArticles posts={latestPosts} />

      {/* 4. Highest Rated */}
      <HighestRated posts={ratedPosts} />

      {/* 5. All Categories */}
      <AllCategories categories={categories} />

      {/* 6. Rapid Growth Stats */}
      <RapidGrowth />
    </div>
  );
}
