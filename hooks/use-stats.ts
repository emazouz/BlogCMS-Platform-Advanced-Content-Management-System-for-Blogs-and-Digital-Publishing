"use client";

import useSWR from "swr";
import { useCallback } from "react";

// Types
interface Stats {
  views: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    change: number;
  };
  visitors: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    change: number;
  };
  posts: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    change: number;
  };
  earnings: {
    total: number;
    thisMonth: number;
  };
  impressions: {
    total: number;
    thisMonth: number;
  };
}

interface UseStatsReturn {
  stats: Stats | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  mutate: () => void;
}

// Fetcher function
const fetcher = async (url: string): Promise<Stats> => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("Failed to fetch stats");
    throw error;
  }

  return res.json();
};

/**
 * Custom hook for fetching admin stats with SWR
 * Automatically revalidates every 5 minutes
 */
export function useStats(): UseStatsReturn {
  const { data, error, isLoading, mutate } = useSWR<Stats>(
    "/api/analytics",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000, // 5 minutes
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Exponential backoff
        const timeout = Math.min(1000 * 2 ** retryCount, 30000);
        setTimeout(() => revalidate({ retryCount }), timeout);
      },
    }
  );

  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    stats: data,
    isLoading,
    isError: !!error,
    error,
    mutate: refresh,
  };
}
