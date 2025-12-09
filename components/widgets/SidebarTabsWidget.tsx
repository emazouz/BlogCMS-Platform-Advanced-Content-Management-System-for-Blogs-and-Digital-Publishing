"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostSummary {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  createdAt: string;
  author?: {
    name?: string;
    username?: string;
  };
}

interface SidebarTabsWidgetProps {
  recentPosts: PostSummary[];
  popularPosts: PostSummary[];
}

export default function SidebarTabsWidget({
  recentPosts,
  popularPosts,
}: SidebarTabsWidgetProps) {
  const [activeTab, setActiveTab] = useState<"recent" | "popular">("recent");

  const posts = activeTab === "recent" ? recentPosts : popularPosts;

  return (
    <div className="bg-background rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* Tabs Header */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("recent")}
          className={cn(
            "flex-1 py-4 text-sm font-bold transition-colors relative",
            activeTab === "recent"
              ? "text-blue-600 bg-blue-50/50 dark:bg-blue-900/10"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          )}
        >
          Latest Articles
          {activeTab === "recent" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <div className="w-px bg-zinc-200 dark:bg-zinc-800" />
        <button
          onClick={() => setActiveTab("popular")}
          className={cn(
            "flex-1 py-4 text-sm font-bold transition-colors relative",
            activeTab === "popular"
              ? "text-blue-600 bg-blue-50/50 dark:bg-blue-900/10"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          )}
        >
          Most Rated
          {activeTab === "popular" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {/* Content List */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            No posts found.
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post._id}
              href={`/posts/${post.slug}`}
              className="flex gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group"
            >
              <div className="relative w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <span className="text-xl font-bold">Db</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <UserIcon size={12} />
                    <span className="truncate max-w-[80px]">
                      {post.author?.name || post.author?.username || "Admin"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
