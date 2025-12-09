"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Post } from "@/types/post";

export default function Hero({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) return null;

  // Use the 1st item as the large vertical one (index 0)
  const largePost = posts[0];
  // The next 4 items are the smaller grid items (indices 1-4)
  const gridPosts = posts.slice(1, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto lg:h-[500px]">
        {/* Left Side (2x2 Grid) - Spans 2 columns on large screens */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
          {gridPosts.map((post) => (
            <Link
              key={post._id}
              href={`/posts/${post.slug}`}
              className="group relative rounded-xl overflow-hidden h-60 lg:h-auto border border-zinc-200 dark:border-zinc-800 shadow-sm"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between items-start">
                {/* Category Badge */}
                <span
                  className={cn(
                    "px-3 py-1 rounded text-xs font-bold text-white shadow-sm",
                    "bg-blue-600"
                  )}
                >
                  {post.category}
                </span>

                {/* Title */}
                <h3
                  className="text-white text-lg font-bold leading-tight group-hover:text-primary-100 transition-colors line-clamp-2 text-right w-full"
                  dir="rtl"
                >
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Side (Large Vertical Card) - Spans 1 column */}
        <div className="lg:col-span-1 h-60 lg:h-auto">
          <Link
            href={`/posts/${largePost.slug}`}
            className="group relative block w-full h-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={largePost.featuredImage}
                alt={largePost.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between items-start">
              {/* Category Badge */}
              <span
                className={cn(
                  "px-3 py-1 rounded text-sm font-bold text-white shadow-sm",
                  "bg-blue-600"
                )}
              >
                {largePost.category}
              </span>

              {/* Title */}
              <h3
                className="text-white text-2xl font-bold leading-tight group-hover:text-primary-100 transition-colors text-right w-full"
                dir="rtl"
              >
                {largePost.title}
              </h3>
            </div>
          </Link>
        </div>
      </div>

      {/* Carousel Dots (Visual Only for now as requested by image style) */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 cursor-pointer"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 cursor-pointer hover:bg-zinc-400"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 cursor-pointer hover:bg-zinc-400"></div>
      </div>
    </div>
  );
}
