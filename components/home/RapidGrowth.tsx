"use client";

import { TrendingUp, Users, FileText, Globe } from "lucide-react";

export default function RapidGrowth() {
  const stats = [
    {
      label: "Active Readers",
      value: "50K+",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Articles Published",
      value: "1,200+",
      icon: FileText,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Monthly Views",
      value: "2M+",
      icon: Globe,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Growth Rate",
      value: "125%",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Rapid Growth. <br />
            <span className="text-blue-600">
              The numbers speak for themselves.
            </span>
          </h2>
          <p className="text-xl text-zinc-500 dark:text-zinc-400">
            Join thousands of writers and readers who are already part of our
            thriving community.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}
              >
                <stat.icon size={28} />
              </div>
              <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                {stat.value}
              </span>
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
