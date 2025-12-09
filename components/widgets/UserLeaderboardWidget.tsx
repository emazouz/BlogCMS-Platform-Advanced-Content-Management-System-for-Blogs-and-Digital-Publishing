"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Star, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardUser {
  _id?: string;
  name: string;
  username?: string;
  avatar?: string;
  image?: string;
  count: number;
}

interface UserLeaderboardWidgetProps {
  topCommenters?: LeaderboardUser[];
  topRaters?: LeaderboardUser[];
}

export default function UserLeaderboardWidget({
  topCommenters = [],
  topRaters = [],
}: UserLeaderboardWidgetProps) {
  const [activeTab, setActiveTab] = useState<"commenters" | "raters">(
    "commenters"
  );

  const displayList = activeTab === "commenters" ? topCommenters : topRaters;

  return (
    <div className="bg-background rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Trophy className="text-yellow-500" size={20} />
          Community Leaders
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex px-2 pt-2 gap-1 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("commenters")}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center justify-center gap-1.5",
            activeTab === "commenters"
              ? "bg-white dark:bg-zinc-950 text-blue-600 border border-zinc-200 dark:border-zinc-800 border-b-transparent -mb-px z-10"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          )}
        >
          <MessageSquare size={14} />
          Top Commenters
        </button>
        <button
          onClick={() => setActiveTab("raters")}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center justify-center gap-1.5",
            activeTab === "raters"
              ? "bg-white dark:bg-zinc-950 text-purple-600 border border-zinc-200 dark:border-zinc-800 border-b-transparent -mb-px z-10"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          )}
        >
          <Star size={14} />
          Top Raters
        </button>
      </div>

      {/* Content */}
      <div className="p-2 min-h-[200px]">
        {displayList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
            <User size={32} className="mb-2 opacity-20" />
            <p>No activity yet.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {displayList.map((user, index) => (
              <div
                key={user._id || index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group"
              >
                <div
                  className={cn(
                    "font-bold w-5 h-5 flex items-center justify-center text-xs rounded-full",
                    index === 0
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : index === 1
                      ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                      : index === 2
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : "text-zinc-400"
                  )}
                >
                  {index + 1}
                </div>

                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200 dark:border-zinc-800">
                  {user.avatar || user.image ? (
                    <Image
                      src={user.avatar || user.image || ""}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-xs font-bold text-zinc-500 uppercase">
                      {(user.name && user.name[0]) ||
                        (user.username && user.username[0]) ||
                        "U"}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate text-zinc-800 dark:text-zinc-200">
                    {user.name || user.username || "Anonymous"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.count}{" "}
                    {activeTab === "commenters"
                      ? user.count === 1
                        ? "comment"
                        : "comments"
                      : user.count === 1
                      ? "rating"
                      : "ratings"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <Link href="/leaderboard" className="text-xs font-bold text-blue-600 hover:underline">
          View All Rankings
        </Link>
      </div> */}
    </div>
  );
}
