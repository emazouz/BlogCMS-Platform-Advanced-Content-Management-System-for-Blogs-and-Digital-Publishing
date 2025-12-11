import Link from "next/link";
import Image from "next/image";
import connectDB from "@/lib/db/mongoose";
import { Post } from "@/models/Post";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import HomeReviews from "@/components/home/HomeReviews";
import Testimonial from "@/models/Testimonial";
import WaveContainer from "@/components/ui/WaveContainer";

async function getData() {
  await connectDB();

  // Parallel fetch for all sections
  const [latestPosts, popularPosts, ratedPosts, categories, testimonials] =
    await Promise.all([
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

      // 5. Testimonials
      Testimonial.find({ isApproved: true }).sort({ createdAt: -1 }).limit(6),
    ]);

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
    testimonials: serialize(testimonials),
  };
}

export default async function Home() {
  const { latestPosts, popularPosts, ratedPosts, categories, testimonials } =
    await getData();

  return (
    <div className="min-h-screen font-sans transition-colors duration-300">
      {/* LANDING HERO */}
      <section className="relative h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden mb-12">
        <Image
          src="https://picsum.photos/seed/writing-desk/1920/800"
          alt="Home Hero"
          fill
          className="object-cover brightness-[0.3]"
          priority
        />
        <div className="relative z-10 wrapper text-center text-white pt-20">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-semibold tracking-wider mb-6 uppercase">
            Welcome to the future of blogging
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-lg">
            YOUR VOICE MATTERS
            <br />
            MAKE IT HEARD
          </h1>
          <p className="text-xl md:text-3xl text-zinc-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
            Dive into a world where creativity meets technology. Share your
            unique perspective with a global audience of thinkers and dreamers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full text-lg h-14 px-8 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <Link href="#latest">Start Reading</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full text-lg h-14 px-8 border-white text-white bg-white/10 hover:bg-white hover:text-black backdrop-blur-sm transition-all"
            >
              <Link href="/auth/register">Become an Author</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="wrapper">
        {/* Navbar Placeholder */}
        <div className="">
          <AdBanner dataAdSlot="HOME_LEADERBOARD" />
        </div>

        {/* 1. Hero Section (Uses latest posts for now, or could use popular) */}
        <Hero posts={latestPosts} />

        {/* 2. Most Popular */}
        <MostPopular posts={popularPosts} />

        {/* MID-PAGE AD: Capture users scrolling down */}
        <WaveContainer variant="teal">
          <AdBanner dataAdSlot="HOME_MID_CONTENT" />
        </WaveContainer>

        {/* 3. Latest Articles */}
        <LatestArticles posts={latestPosts} />

        {/* 4. Highest Rated */}
        <HighestRated posts={ratedPosts} />

        {/* 5. All Categories */}
        <div id="latest">
          <AllCategories categories={categories} />
        </div>

        {/* LOWER-PAGE AD: Break before reviews */}
        <WaveContainer variant="default">
          <AdBanner dataAdSlot="HOME_LOWER_CONTENT" />
        </WaveContainer>

        {/* 6. Reviews Section */}
        <HomeReviews testimonials={testimonials} />

        {/* 7. Rapid Growth Stats */}
        <RapidGrowth />
      </div>
    </div>
  );
}
