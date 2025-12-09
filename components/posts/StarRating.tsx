"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { ratePost } from "@/lib/actions/post.actions";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  postId: string;
  initialRating: number;
  initialCount: number;
}

export default function StarRating({
  postId,
  initialRating,
  initialCount,
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [count, setCount] = useState(initialCount);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userRated, setUserRated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const handleRating = async (value: number) => {
    if (userRated || isPending) return;

    // Optimistic update
    setUserRated(true);
    setRating(value); // Temporarily show the selected value

    startTransition(async () => {
      const result = await ratePost(postId, value, pathname);
      if (
        result.success &&
        result.rating !== undefined &&
        result.ratingCount !== undefined
      ) {
        setRating(result.rating);
        setCount(result.ratingCount);
      } else {
        // Revert if failed
        setUserRated(false);
        setRating(initialRating);
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={userRated || isPending}
            onMouseEnter={() => !userRated && setHoveredRating(star)}
            onMouseLeave={() => !userRated && setHoveredRating(0)}
            onClick={() => handleRating(star)}
            className="transition-transform hover:scale-110 disabled:cursor-default"
          >
            <Star
              className={cn(
                "w-8 h-8 transition-colors",
                (
                  hoveredRating
                    ? star <= hoveredRating
                    : star <= Math.round(rating)
                )
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-zinc-300 dark:text-zinc-600"
              )}
            />
          </button>
        ))}
      </div>
      <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
        {rating.toFixed(1)} <span className="text-zinc-400 mx-1">•</span>{" "}
        {count} {count === 1 ? "rating" : "ratings"}
      </div>
      {userRated && (
        <span className="text-xs text-green-600 dark:text-green-500 animate-in fade-in slide-in-from-bottom-2">
          Thanks for rating!
        </span>
      )}
    </div>
  );
}
