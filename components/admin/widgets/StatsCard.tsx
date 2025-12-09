// /components/admin/widgets/StatsCards.tsx
import {
  FileText,
  Eye,
  MessageSquare,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import connectDB from "@/lib/db/mongoose";
import { Post } from "@/models/Post";
import { Comment } from "@/models/Comment";
import { PageView } from "@/models/PageView";
import { AdSenseStats } from "@/models/AdSenseStats";

async function getStats() {
  await connectDB();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Total Posts
  const totalPosts = await Post.countDocuments({ status: "published" });
  const postsThisMonth = await Post.countDocuments({
    status: "published",
    createdAt: { $gte: startOfMonth },
  });
  const postsLastMonth = await Post.countDocuments({
    status: "published",
    createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
  });

  // Monthly Views
  const viewsThisMonth = await PageView.aggregate([
    { $match: { date: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: "$views" } } },
  ]);
  const viewsLastMonth = await PageView.aggregate([
    { $match: { date: { $gte: startOfLastMonth, $lt: startOfMonth } } },
    { $group: { _id: null, total: { $sum: "$views" } } },
  ]);

  // Comments
  const totalComments = await Comment.countDocuments({ status: "approved" });
  const commentsThisMonth = await Comment.countDocuments({
    status: "approved",
    createdAt: { $gte: startOfMonth },
  });
  const commentsLastMonth = await Comment.countDocuments({
    status: "approved",
    createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
  });

  // AdSense Revenue
  const revenueThisMonth = await AdSenseStats.aggregate([
    { $match: { date: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: "$earnings" } } },
  ]);
  const revenueLastMonth = await AdSenseStats.aggregate([
    { $match: { date: { $gte: startOfLastMonth, $lt: startOfMonth } } },
    { $group: { _id: null, total: { $sum: "$earnings" } } },
  ]);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return {
    totalPosts,
    postsChange: calculateChange(postsThisMonth, postsLastMonth),

    monthlyViews: viewsThisMonth[0]?.total || 0,
    viewsChange: calculateChange(
      viewsThisMonth[0]?.total || 0,
      viewsLastMonth[0]?.total || 0
    ),

    totalComments,
    commentsChange: calculateChange(commentsThisMonth, commentsLastMonth),

    adsenseRevenue: revenueThisMonth[0]?.total || 0,
    revenueChange: calculateChange(
      revenueThisMonth[0]?.total || 0,
      revenueLastMonth[0]?.total || 0
    ),
  };
}

export async function StatsCards() {
  const stats = await getStats();

  const cards = [
    {
      title: "Total Posts",
      value: stats.totalPosts.toLocaleString(),
      change: stats.postsChange,
      icon: FileText,
      color: "blue" as const,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Monthly Views",
      value: stats.monthlyViews.toLocaleString(),
      change: stats.viewsChange,
      icon: Eye,
      color: "green" as const,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Comments",
      value: stats.totalComments.toLocaleString(),
      change: stats.commentsChange,
      icon: MessageSquare,
      color: "purple" as const,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "AdSense Revenue",
      value: `$${stats.adsenseRevenue.toFixed(2)}`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: "yellow" as const,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <StatsCard key={card.title} {...card} />
      ))}
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
}

function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  bgColor,
  iconColor,
}: StatsCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>

          <div className="flex items-center mt-3 gap-1">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span
              className={`text-sm font-semibold ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>

        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
