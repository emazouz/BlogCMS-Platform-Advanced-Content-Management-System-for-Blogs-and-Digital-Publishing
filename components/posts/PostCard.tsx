import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Star } from "lucide-react";
import { Post } from "@/types/post";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  className?: string;
}

export default function PostCard({ post, className }: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        "group flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
        className
      )}
    >
      <div className="h-48 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
        <Image
          src={post.featuredImage || "/placeholder.jpg"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold shadow-sm">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {post.views || 0}
          </span>
          {post.rating > 0 && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 text-yellow-500">
                <Star size={12} fill="currentColor" />
                {post.rating.toFixed(1)}
              </span>
            </>
          )}
        </div>

        <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 mb-4 flex-1">
          {post.excerpt || "Click to read this article..."}
        </p>

        <div className="flex items-center gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
          <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-500">
            {post.author?.username?.[0]?.toUpperCase() || "A"}
          </div>
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {post.author?.username || "Anonymous"}
          </span>
        </div>
      </div>
    </Link>
  );
}
