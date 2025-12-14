"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Star, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type TabType = "commenters" | "raters";

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

interface TabConfig {
  id: TabType;
  label: string;
  icon: typeof MessageSquare;
  activeColor: string;
}

interface UserAvatarProps {
  user: LeaderboardUser;
}

interface RankBadgeProps {
  index: number;
}

interface UserItemProps {
  user: LeaderboardUser;
  index: number;
  activeTab: TabType;
}

// Constants
const TABS: TabConfig[] = [
  {
    id: "commenters",
    label: "Top Commenters",
    icon: MessageSquare,
    activeColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "raters",
    label: "Top Raters",
    icon: Star,
    activeColor: "text-purple-600 dark:text-purple-400",
  },
];

const RANK_STYLES = [
  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", // 1st place
  "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400", // 2nd place
  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", // 3rd place
];

// Utility functions
function getUserDisplayName(user: LeaderboardUser): string {
  return user.name || user.username || "Anonymous";
}

function getUserInitial(user: LeaderboardUser): string {
  if (user.name?.[0]) return user.name[0].toUpperCase();
  if (user.username?.[0]) return user.username[0].toUpperCase();
  return "U";
}

function getUserAvatar(user: LeaderboardUser): string | null {
  return user.avatar || user.image || null;
}

function getCountLabel(count: number, type: TabType): string {
  if (type === "commenters") {
    return count === 1 ? "comment" : "comments";
  }
  return count === 1 ? "rating" : "ratings";
}

// Sub-components
function RankBadge({ index }: RankBadgeProps) {
  const rankStyle = RANK_STYLES[index] || "text-muted-foreground";

  return (
    <div
      className={cn(
        "font-bold w-5 h-5 flex items-center justify-center text-xs rounded-full",
        rankStyle
      )}
      aria-label={`Rank ${index + 1}`}
    >
      {index + 1}
    </div>
  );
}

function UserAvatar({ user }: UserAvatarProps) {
  const avatarSrc = getUserAvatar(user);
  const displayName = getUserDisplayName(user);
  const initial = getUserInitial(user);

  return (
    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border">
      {avatarSrc ? (
        <Image
          src={avatarSrc}
          alt=""
          fill
          sizes="32px"
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted text-xs font-bold text-muted-foreground">
          {initial}
        </div>
      )}
    </div>
  );
}

function UserItem({ user, index, activeTab }: UserItemProps) {
  const displayName = getUserDisplayName(user);
  const countLabel = getCountLabel(user.count, activeTab);

  return (
    <div
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
      role="listitem"
    >
      <RankBadge index={index} />
      <UserAvatar user={user} />

      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate text-foreground">
          {displayName}
        </p>
        <p className="text-xs text-muted-foreground">
          {user.count} {countLabel}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm"
      role="status"
    >
      <User size={32} className="mb-2 opacity-20" aria-hidden="true" />
      <p>No activity yet</p>
    </div>
  );
}

function TabButton({
  tab,
  isActive,
  onClick,
}: {
  tab: TabConfig;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = tab.icon;

  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${tab.id}-panel`}
      id={`${tab.id}-tab`}
      className={cn(
        "flex-1 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center justify-center gap-1.5",
        isActive
          ? `bg-card ${tab.activeColor} border border-border border-b-transparent -mb-px z-10`
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
      )}
    >
      <Icon size={14} aria-hidden="true" />
      {tab.label}
    </button>
  );
}

// Main component
export default function UserLeaderboardWidget({
  topCommenters = [],
  topRaters = [],
}: UserLeaderboardWidgetProps) {
  const [activeTab, setActiveTab] = useState<TabType>("commenters");

  const displayList = useMemo(() => {
    return activeTab === "commenters" ? topCommenters : topRaters;
  }, [activeTab, topCommenters, topRaters]);

  const activeTabConfig = useMemo(() => {
    return TABS.find((tab) => tab.id === activeTab) || TABS[0];
  }, [activeTab]);

  return (
    <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b border-border bg-accent/30">
        <h2 className="font-bold text-lg flex items-center gap-2 text-foreground">
          <Trophy
            className="text-yellow-500 dark:text-yellow-400"
            size={20}
            aria-hidden="true"
          />
          Community Leaders
        </h2>
      </header>

      {/* Tabs */}
      <div
        className="flex px-2 pt-2 gap-1 border-b border-border"
        role="tablist"
        aria-label="Leaderboard categories"
      >
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {/* Content */}
      <div
        id={`${activeTab}-panel`}
        role="tabpanel"
        aria-labelledby={`${activeTab}-tab`}
        className="p-2 min-h-[200px]"
      >
        {displayList.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-1" role="list">
            {displayList.map((user, index) => (
              <UserItem
                key={user._id || `${activeTab}-${index}`}
                user={user}
                index={index}
                activeTab={activeTab}
              />
            ))}
          </div>
        )}
      </div>

      {/* Optional: View All Link */}
      {/* Uncomment if needed */}
      {/* <footer className="p-3 border-t border-border text-center">
        <Link 
          href="/leaderboard" 
          className="text-xs font-bold text-primary hover:text-primary/80 hover:underline transition-colors"
        >
          View All Rankings
        </Link>
      </footer> */}
    </section>
  );
}
