"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, Activity, MessageSquare, Star } from "lucide-react";

interface AnalyticsChartsProps {
  viewsOverTime: any[];
  engagementOverTime: any[];
  commentsBreakdown: any[];
  ratingsBreakdown: any[];
  ratingCount: number;
}

export function AnalyticsCharts({
  viewsOverTime,
  engagementOverTime,
  commentsBreakdown,
  ratingsBreakdown,
  ratingCount,
}: AnalyticsChartsProps) {
  return (
    <>
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Views Over Time
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Last 30 days performance
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
                name="Daily Views"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Engagement Metrics
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                User interactions over time
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="comments" fill="#10b981" name="Comments" />
              <Bar dataKey="likes" fill="#3b82f6" name="Likes" />
              <Bar dataKey="shares" fill="#8b5cf6" name="Shares" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comments Breakdown */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Comments Status
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Distribution by status
            </p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={commentsBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {commentsBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {commentsBreakdown.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ratings Breakdown */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Ratings Distribution
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {ratingCount} total ratings
            </p>
          </div>
          <div className="space-y-3">
            {[...ratingsBreakdown].reverse().map((item) => (
              <div key={item.rating} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{item.rating}</span>
                  </div>
                  <span className="text-muted-foreground">{item.count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${
                        (item.count / Math.max(ratingCount, 1)) * 100
                      }%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Chart Legend
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Understanding the metrics
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Views
              </p>
              <p className="text-blue-700 dark:text-blue-300 text-xs">
                Total number of times this post has been viewed
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="font-medium text-green-900 dark:text-green-100 mb-1">
                Engagement
              </p>
              <p className="text-green-700 dark:text-green-300 text-xs">
                Comments, likes, and shares from readers
              </p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <p className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                Ratings
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 text-xs">
                Quality scores from 1-5 stars given by readers
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
