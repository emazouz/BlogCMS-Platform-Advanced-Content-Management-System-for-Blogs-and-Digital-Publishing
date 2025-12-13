"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye } from "lucide-react";
import { Post as PostType } from "@/types/post";

export default function MostPopular({ posts }: { posts: PostType[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-16 bg-white dark:bg-zinc-950">
      <div className="wrapper">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Most Popular</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Trending articles this week
            </p>
          </div>
          <Link
            href="/posts?sort=popular"
            className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, index) => (
            <Link
              key={post._id.toString()}
              href={`/posts/${post.slug}`}
              className="group relative flex flex-col h-full"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                <Image
                  src={post.featuredImage || "/placeholder.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Eye size={12} />
                  <span>{post.views || 0}</span>
                </div>
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-black dark:text-white text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full shadow-sm">
                  #{index + 1}
                </div>
              </div>

              <div className="flex-1">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 block">
                  {post.category}
                </span>
                <h3 className="text-lg font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
