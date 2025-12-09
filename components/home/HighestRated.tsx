"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";
import { Post as PostType } from "@/types/post";

export default function HighestRated({ posts }: { posts: PostType[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-16 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Highest Rated</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Readers&apos; favorites this month
            </p>
          </div>
          <Link
            href="/posts?sort=rating"
            className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post._id.toString()}
              href={`/posts/${post.slug}`}
              className="group block border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={post.featuredImage || "/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-bold">
                      {post.rating || 5.0}
                    </span>
                    <span className="text-xs text-zinc-400">
                      ({post.ratingCount || 10} reviews)
                    </span>
                  </div>
                  <h3 className="font-bold text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    by {post.author?.username || "Anonymous"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg italic">
                &quot;
                {post.excerpt ||
                  "A wonderful read considering the depth of the topic..."}
                &quot;
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
