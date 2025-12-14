// "use client"
import { notFound } from "next/navigation";
import Link from "next/link";
// Models must be imported before use to ensure they are registered
import { User } from "@/models/User";
import { Category } from "@/models/Category";
import { Tag } from "@/models/Tag";
import { Post } from "@/models/Post";
import { Comment } from "@/models/Comment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Eye,
  MessageSquare,
  Star,
  TrendingUp,
  Calendar,
  Clock,
  Users,
  ThumbsUp,
  Share2,
  BarChart3,
  Activity,
  Target,
  Award,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import connectDB from "@/lib/db/mongoose";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Fetch post analytics data
async function getPostAnalytics(postId: string) {
  await connectDB();

  const post = (await Post.findById(postId)
    .populate({ path: "author", model: User, select: "name email image" })
    .populate({ path: "category", model: Category, select: "name slug" })
    .populate({ path: "tags", model: Tag, select: "name slug" })
    .lean()) as any;

  if (!post) return null;

  // Get comments analytics
  const comments = await Comment.find({ post: postId }).lean();
  const approvedComments = comments.filter((c) => c.status === "approved");
  const pendingComments = comments.filter((c) => c.status === "pending");
  const spamComments = comments.filter((c) => c.status === "spam");

  // Calculate engagement metrics
  const totalComments = comments.length;
  const avgCommentsPerDay = post.publishedAt
    ? totalComments /
      Math.max(
        1,
        Math.ceil(
          (Date.now() - new Date(post.publishedAt).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  // Get ratings from comments
  const ratingsData = comments.filter((c) => c.rating).map((c) => c.rating!);
  const avgRating =
    ratingsData.length > 0
      ? ratingsData.reduce((a, b) => a + b, 0) / ratingsData.length
      : 0;

  // Mock time-series data (in real app, this would come from analytics tracking)
  const viewsOverTime = generateMockTimeSeriesData(post.views);
  const engagementOverTime = generateMockEngagementData(totalComments);

  return {
    post: JSON.parse(JSON.stringify(post)),
    analytics: {
      views: post.views || 0,
      totalComments,
      approvedComments: approvedComments.length,
      pendingComments: pendingComments.length,
      spamComments: spamComments.length,
      avgRating: avgRating.toFixed(1),
      ratingCount: ratingsData.length,
      avgCommentsPerDay: avgCommentsPerDay.toFixed(1),
      viewsOverTime,
      engagementOverTime,
      commentsBreakdown: [
        { name: "Approved", value: approvedComments.length, color: "#10b981" },
        { name: "Pending", value: pendingComments.length, color: "#f59e0b" },
        { name: "Spam", value: spamComments.length, color: "#ef4444" },
      ],
      ratingsBreakdown: [
        {
          rating: 5,
          count: ratingsData.filter((r) => r === 5).length,
          color: "#10b981",
        },
        {
          rating: 4,
          count: ratingsData.filter((r) => r === 4).length,
          color: "#84cc16",
        },
        {
          rating: 3,
          count: ratingsData.filter((r) => r === 3).length,
          color: "#f59e0b",
        },
        {
          rating: 2,
          count: ratingsData.filter((r) => r === 2).length,
          color: "#f97316",
        },
        {
          rating: 1,
          count: ratingsData.filter((r) => r === 1).length,
          color: "#ef4444",
        },
      ],
    },
  };
}

// Helper functions for mock data
function generateMockTimeSeriesData(totalViews: number) {
  const days = 30;
  const data = [];
  let cumulativeViews = 0;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dailyViews = Math.floor(Math.random() * (totalViews / days) * 1.5);
    cumulativeViews += dailyViews;

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      views: dailyViews,
      cumulative: Math.min(cumulativeViews, totalViews),
    });
  }

  return data;
}

function generateMockEngagementData(totalComments: number) {
  const days = 30;
  const data = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      comments: Math.floor(Math.random() * (totalComments / days) * 2),
      likes: Math.floor(Math.random() * 50),
      shares: Math.floor(Math.random() * 20),
    });
  }

  return data;
}

export default async function PostAnalyticsPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getPostAnalytics(id);

  if (!data) {
    notFound();
  }

  const { post, analytics } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/admin/posts">
            <Button variant="ghost" size="icon" aria-label="Back to posts">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">
                Post Analytics
              </h1>
              <Badge
                variant={
                  post.status === "published"
                    ? "default"
                    : post.status === "draft"
                    ? "secondary"
                    : "outline"
                }
              >
                {post.status}
              </Badge>
            </div>
            <h2 className="text-xl text-muted-foreground mb-1">{post.title}</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readingTime || 5} min read
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/posts/${post.slug}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Post
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/posts/${id}/edit`}>Edit Post</Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Views"
          value={analytics.views.toLocaleString()}
          icon={Eye}
          color="blue"
          trend="+12.5%"
        />
        <MetricCard
          title="Comments"
          value={analytics.totalComments.toLocaleString()}
          icon={MessageSquare}
          color="green"
          trend="+8.3%"
        />
        <MetricCard
          title="Average Rating"
          value={analytics.avgRating}
          icon={Star}
          color="yellow"
          subtitle={`${analytics.ratingCount} ratings`}
        />
        <MetricCard
          title="Engagement Rate"
          value={`${(
            (analytics.totalComments / Math.max(analytics.views, 1)) *
            100
          ).toFixed(1)}%`}
          icon={TrendingUp}
          color="purple"
          trend="+5.2%"
        />
      </div>

      {/* Analytics Charts - Client Component */}
      <AnalyticsCharts
        viewsOverTime={analytics.viewsOverTime}
        engagementOverTime={analytics.engagementOverTime}
        commentsBreakdown={analytics.commentsBreakdown}
        ratingsBreakdown={analytics.ratingsBreakdown}
        ratingCount={analytics.ratingCount}
      />

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Performance Insights
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Key performance indicators
            </p>
          </div>
          <div className="space-y-4">
            <InsightItem
              label="Avg. Comments/Day"
              value={analytics.avgCommentsPerDay}
              icon={MessageSquare}
              color="green"
            />
            <InsightItem
              label="Approval Rate"
              value={`${(
                (analytics.approvedComments /
                  Math.max(analytics.totalComments, 1)) *
                100
              ).toFixed(0)}%`}
              icon={ThumbsUp}
              color="blue"
            />
            <InsightItem
              label="Reading Time"
              value={`${post.readingTime || 5} min`}
              icon={Clock}
              color="orange"
            />
            <InsightItem
              label="Category"
              value={post.category?.name || "Uncategorized"}
              icon={Award}
              color="purple"
            />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Engagement Summary
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Overall interaction metrics
            </p>
          </div>
          <div className="space-y-4">
            <InsightItem
              label="Total Views"
              value={analytics.views.toLocaleString()}
              icon={Eye}
              color="blue"
            />
            <InsightItem
              label="Total Comments"
              value={analytics.totalComments}
              icon={MessageSquare}
              color="green"
            />
            <InsightItem
              label="Avg Rating"
              value={`${analytics.avgRating} / 5.0`}
              icon={Star}
              color="orange"
            />
            <InsightItem
              label="Engagement Rate"
              value={`${(
                (analytics.totalComments / Math.max(analytics.views, 1)) *
                100
              ).toFixed(1)}%`}
              icon={TrendingUp}
              color="purple"
            />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Audience Insights
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Reader behavior patterns
            </p>
          </div>
          <div className="space-y-4">
            <InsightItem
              label="Approved Comments"
              value={analytics.approvedComments}
              icon={ThumbsUp}
              color="green"
            />
            <InsightItem
              label="Pending Review"
              value={analytics.pendingComments}
              icon={Clock}
              color="orange"
            />
            <InsightItem
              label="Spam Detected"
              value={analytics.spamComments}
              icon={AlertCircle}
              color="blue"
            />
            <InsightItem
              label="Total Ratings"
              value={analytics.ratingCount}
              icon={Star}
              color="purple"
            />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Post Information"
          items={[
            { label: "Author", value: post.author?.name || "Unknown" },
            { label: "Category", value: post.category?.name || "None" },
            { label: "Tags", value: post.tags?.length || 0 },
            {
              label: "Published",
              value: post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : "Not published",
            },
          ]}
        />
        <StatCard
          title="Engagement Summary"
          items={[
            { label: "Total Views", value: analytics.views.toLocaleString() },
            { label: "Total Comments", value: analytics.totalComments },
            { label: "Approved Comments", value: analytics.approvedComments },
            { label: "Pending Review", value: analytics.pendingComments },
          ]}
        />
        <StatCard
          title="Quality Metrics"
          items={[
            { label: "Average Rating", value: `${analytics.avgRating} / 5.0` },
            { label: "Total Ratings", value: analytics.ratingCount },
            {
              label: "Engagement Rate",
              value: `${(
                (analytics.totalComments / Math.max(analytics.views, 1)) *
                100
              ).toFixed(1)}%`,
            },
            {
              label: "Spam Rate",
              value: `${(
                (analytics.spamComments /
                  Math.max(analytics.totalComments, 1)) *
                100
              ).toFixed(1)}%`,
            },
          ]}
        />
      </div>
    </div>
  );
}

// Component: Metric Card
function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: "blue" | "green" | "yellow" | "purple";
  trend?: string;
  subtitle?: string;
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    green: "bg-green-500/10 text-green-600 dark:text-green-400",
    yellow: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

// Component: Insight Item
function InsightItem({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: any;
  color: "blue" | "green" | "orange" | "purple";
}) {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    orange: "text-orange-600 dark:text-orange-400",
    purple: "text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className={`h-4 w-4 ${colorClasses[color]}`} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

// Component: Stat Card
function StatCard({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string | number }[];
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-medium text-foreground">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
