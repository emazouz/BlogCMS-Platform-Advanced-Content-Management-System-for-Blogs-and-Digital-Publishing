"use client";

import {
  FileText,
  Eye,
  MessageSquare,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useStats } from "@/hooks/use-stats";
import {
  formatNumber,
  formatCurrency,
  formatPercentage,
} from "@/lib/utils/number-utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Types
interface StatsCardConfig {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: "blue" | "green" | "purple" | "yellow";
  bgColor: string;
  iconColor: string;
}

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  isLoading?: boolean;
}

// Sub-components
function StatsCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-8 bg-muted rounded w-32" />
          <div className="h-4 bg-muted rounded w-28" />
        </div>
        <div className="h-12 w-12 bg-muted rounded-lg" />
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  bgColor,
  iconColor,
  isLoading,
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const isPositive = change >= 0;
  const changeColor = isPositive
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";

  // Smooth value transition
  useEffect(() => {
    if (!isLoading) {
      setDisplayValue(value);
    }
  }, [value, isLoading]);

  if (isLoading) {
    return <StatsCardSkeleton />;
  }

  return (
    <article className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-3xl font-bold text-foreground mt-2 transition-all duration-500">
            {displayValue}
          </p>

          <div className="flex items-center mt-3 gap-1">
            {isPositive ? (
              <TrendingUp
                className={`h-4 w-4 ${changeColor}`}
                aria-hidden="true"
              />
            ) : (
              <TrendingDown
                className={`h-4 w-4 ${changeColor}`}
                aria-hidden="true"
              />
            )}
            <span className={`text-sm font-semibold ${changeColor}`}>
              {formatPercentage(change)}
            </span>
            <span className="text-sm text-muted-foreground">vs last month</span>
          </div>
        </div>

        <div
          className={`p-3 rounded-lg ${bgColor} transition-transform duration-300 group-hover:scale-110`}
          aria-hidden="true"
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </article>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="col-span-full bg-destructive/10 border border-destructive/20 rounded-lg p-6">
      <div className="flex items-center justify-center gap-3">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <p className="text-destructive font-medium">
          Failed to load statistics
        </p>
        <Button variant="outline" size="sm" onClick={onRetry} className="ml-2">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
}

// Main component
export function StatsCards() {
  const { stats, isLoading, isError, mutate } = useStats();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (stats) {
      setLastUpdated(new Date());
    }
  }, [stats]);

  const createStatsCards = (): StatsCardConfig[] => {
    if (!stats) return [];

    return [
      {
        title: "Total Posts",
        value: formatNumber(stats.posts.total),
        change: stats.posts.change,
        icon: FileText,
        color: "blue",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        title: "Monthly Views",
        value: formatNumber(stats.views.thisMonth),
        change: stats.views.change,
        icon: Eye,
        color: "green",
        bgColor: "bg-green-50 dark:bg-green-950",
        iconColor: "text-green-600 dark:text-green-400",
      },
      {
        title: "Total Visitors",
        value: formatNumber(stats.visitors.total),
        change: stats.visitors.change,
        icon: MessageSquare,
        color: "purple",
        bgColor: "bg-purple-50 dark:bg-purple-950",
        iconColor: "text-purple-600 dark:text-purple-400",
      },
      {
        title: "AdSense Revenue",
        value: formatCurrency(stats.earnings.thisMonth),
        change: 0, // No change data for earnings yet
        icon: DollarSign,
        color: "yellow",
        bgColor: "bg-yellow-50 dark:bg-yellow-950",
        iconColor: "text-yellow-600 dark:text-yellow-400",
      },
    ];
  };

  if (isError) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ErrorState onRetry={mutate} />
      </div>
    );
  }

  const cards = createStatsCards();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {!isLoading && stats && (
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => mutate()}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading || !stats
          ? Array.from({ length: 4 }).map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))
          : cards.map((card) => <StatsCard key={card.title} {...card} />)}
      </div>
    </div>
  );
}
