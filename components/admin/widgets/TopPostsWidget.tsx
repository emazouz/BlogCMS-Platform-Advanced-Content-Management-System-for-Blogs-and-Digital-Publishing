// /components/admin/widgets/TopPostsWidget.tsx
"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Eye, MessageSquare, ExternalLink } from "lucide-react";
import Link from "next/link";

interface TopPost {
  _id: string;
  title: string;
  slug: string;
  views: number;
  commentsCount: number;
  featuredImage?: string;
}

export function TopPostsWidget() {
  const [posts, setPosts] = useState<TopPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("30d");

  useEffect(() => {
    fetchTopPosts();
  }, [period]);

  const fetchTopPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/top?period=${period}&limit=10`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching top posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Top Performing Posts
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">Most viewed content</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {(["7d", "30d", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                ${
                  period === p
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No posts data available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post, index) => (
            <div
              key={post._id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              {/* Rank Badge */}
              <div
                className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                ${
                  index === 0
                    ? "bg-yellow-100 text-yellow-700"
                    : index === 1
                    ? "bg-gray-100 text-gray-700"
                    : index === 2
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-50 text-gray-600"
                }
              `}
              >
                #{index + 1}
              </div>

              {/* Thumbnail */}
              {post.featuredImage ? (
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
              )}

              {/* Post Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/posts/${post._id}/edit`}
                  className="font-medium text-gray-900 hover:text-primary-600 line-clamp-1 transition block"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{post.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{post.commentsCount || 0}</span>
                  </div>
                </div>
              </div>

              {/* View Link */}
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="flex-shrink-0 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                title="View post"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
