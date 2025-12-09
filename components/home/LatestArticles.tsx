"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { Post as PostType } from "@/types/post";

export default function LatestArticles({ posts }: { posts: PostType[] }) {
  if (!posts || posts.length === 0) return null;

  // Utilize the first post as a feature, others as list
  const featured = posts[0];
  const list = posts.slice(1);

  return (
    <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Latest Articles</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Fresh content just for you
            </p>
          </div>
          <Link
            href="/posts"
            className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Featured Latest Post */}
          <div className="lg:col-span-7">
            <Link
              href={`/posts/${featured.slug}`}
              className="group relative block rounded-3xl overflow-hidden aspect-video lg:aspect-auto lg:h-full border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950"
            >
              <Image
                src={featured.featuredImage || "/placeholder.jpg"}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                <div className="flex items-center gap-2 mb-3 text-white/80 text-sm">
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                    {featured.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(featured.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight group-hover:text-blue-200 transition-colors">
                  {featured.title}
                </h3>
                <p className="text-white/80 line-clamp-2 max-w-2xl">
                  {featured.excerpt}
                </p>
              </div>
            </Link>
          </div>

          {/* Side List */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {list.map((post) => (
              <Link
                key={post._id.toString()}
                href={`/posts/${post.slug}`}
                className="group flex gap-4 items-start p-3 rounded-2xl hover:bg-white dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src={post.featuredImage || "/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold group-hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
