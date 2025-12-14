// /components/admin/widgets/TopPostsWidget.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { TrendingUp, Eye, MessageSquare, ExternalLink, AlertCircle } from "lucide-react";
import Link from "next/link";

// Types
type Period = "7d" | "30d" | "all";

interface TopPost {
  _id: string;
  title: string;
  slug: string;
  views: number;
  commentsCount: number;
  featuredImage?: string;
}

interface ApiResponse {
  posts: TopPost[];
  success?: boolean;
  error?: string;
}

interface PeriodOption {
  value: Period;
  label: string;
}

// Constants
const PERIOD_OPTIONS: PeriodOption[] = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "all", label: "All Time" },
];

const RANK_STYLES = {
  0: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  1: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  2: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  default: "bg-muted text-muted-foreground",
} as const;

const SKELETON_COUNT = 5;

export function TopPostsWidget() {
  const [posts, setPosts] = useState<TopPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("30d");
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchTopPosts = useCallback(async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/posts/top?period=${period}&limit=10`,
        {
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch top posts: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setPosts(data.posts || []);
    } catch (err) {
      // Don't show error for aborted requests
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : "Failed to load top posts";

      console.error("Error fetching top posts:", err);
      setError(errorMessage);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchTopPosts();

    // Cleanup: abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchTopPosts]);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

  const handleRetry = () => {
    fetchTopPosts();
  };

  const getRankStyle = (index: number): string => {
    return RANK_STYLES[index as keyof typeof RANK_STYLES] || RANK_STYLES.default;
  };

  return (
    <article className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Top Performing Posts
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Most viewed content
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2" role="group" aria-label="Time period selector">
          {PERIOD_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handlePeriodChange(value)}
              disabled={loading}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  period === value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }
              `}
              aria-pressed={period === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3" role="status" aria-label="Loading top posts">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-muted rounded-lg" />
            </div>
          ))}
          <span className="sr-only">Loading...</span>
        </div>
      ) : error ? (
        <div
          className="flex flex-col items-center justify-center py-12"
          role="alert"
        >
          <AlertCircle className="h-12 w-12 text-destructive mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">
            Failed to load top posts
          </p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12" role="status">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">No posts available</p>
          <p className="text-xs text-muted-foreground mt-1">
            No posts data for the selected period
          </p>
        </div>
      ) : (
        <ol className="space-y-3 list-none">
          {posts.map((post, index) => (
            <li
              key={post._id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors border border-border"
            >
              {/* Rank Badge */}
              <div
                className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
                  font-bold text-sm ${getRankStyle(index)}
                `}
                aria-label={`Rank ${index + 1}`}
              >
                #{index + 1}
              </div>

              {/* Thumbnail */}
              {post.featuredImage ? (
                <img
                  src={post.featuredImage}
                  alt=""
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                  loading="lazy"
                />
              ) : (
                <div 
                  className="w-12 h-12 rounded bg-muted flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  <TrendingUp className="h-6 w-6 text-muted-foreground" />
                </div>
              )}

              {/* Post Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/posts/${post._id}/edit`}
                  className="font-medium text-foreground hover:text-primary line-clamp-1 transition-colors block"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    <span aria-label={`${post.views} views`}>
                      {post.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                    <span aria-label={`${post.commentsCount || 0} comments`}>
                      {post.commentsCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Link */}
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                aria-label={`View ${post.title} in new tab`}
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}