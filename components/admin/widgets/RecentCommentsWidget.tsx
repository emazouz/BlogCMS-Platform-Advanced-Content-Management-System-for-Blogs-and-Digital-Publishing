// /components/admin/widgets/RecentCommentsWidget.tsx
import Link from "next/link";
import { MessageSquare, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import connectDB from "@/lib/db/mongoose";
import { Comment } from "@/models/Comment";
import { formatDistanceToNow } from "date-fns";
import { CommentActions } from "./CommentActions";

// Types
type CommentStatus = "approved" | "pending" | "spam" | "rejected";
type BadgeVariant = "success" | "warning" | "secondary" | "destructive";

interface Post {
  _id: string;
  title: string;
  slug: string;
}

interface RecentComment {
  _id: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: CommentStatus;
  createdAt: Date;
  post?: Post;
}

interface CommentItemProps {
  comment: RecentComment;
}

// Constants
const COMMENT_LIMIT = 5;

// Utility functions
function getCommentStatusVariant(status: CommentStatus): BadgeVariant {
  const statusMap: Record<CommentStatus, BadgeVariant> = {
    approved: "success",
    pending: "warning",
    spam: "destructive",
    rejected: "secondary",
  };

  return statusMap[status] || "secondary";
}

function formatCommentDate(date: Date): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Unknown date";
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  // Generate consistent color based on name
  const hash = name.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const colors = [
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
    "from-indigo-500 to-indigo-600",
    "from-red-500 to-red-600",
    "from-orange-500 to-orange-600",
  ];

  return colors[Math.abs(hash) % colors.length];
}

// Database query
async function getRecentComments(): Promise<RecentComment[]> {
  try {
    await connectDB();

    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(COMMENT_LIMIT)
      .select("authorName authorEmail content status createdAt post")
      .populate("post", "title slug")
      .lean<RecentComment[]>();

    return comments;
  } catch (error) {
    console.error("Error fetching recent comments:", error);
    throw new Error("Failed to fetch recent comments");
  }
}

// Sub-components
function CommentAvatar({ name }: { name: string }) {
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);

  return (
    <div className="flex-shrink-0">
      <div
        className={`w-10 h-10 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center`}
        aria-hidden="true"
      >
        <span className="text-white font-semibold text-sm">{initials}</span>
      </div>
    </div>
  );
}

function CommentMeta({
  authorName,
  createdAt,
  status,
}: {
  authorName: string;
  createdAt: Date;
  status: CommentStatus;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-1">
      <span className="font-semibold text-foreground text-sm">
        {authorName}
      </span>
      <span className="text-muted-foreground" aria-hidden="true">
        •
      </span>
      <time
        dateTime={createdAt.toISOString()}
        className="text-sm text-muted-foreground"
      >
        {formatCommentDate(createdAt)}
      </time>
      <Badge variant={getCommentStatusVariant(status)} className="text-xs">
        {status}
      </Badge>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-12 text-center">
      <MessageSquare
        className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50"
        aria-hidden="true"
      />
      <p className="text-foreground font-medium mb-1">No comments yet</p>
      <p className="text-sm text-muted-foreground">
        Comments will appear here when readers engage with your posts
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="p-12 text-center" role="alert">
      <AlertCircle
        className="h-12 w-12 text-destructive mx-auto mb-3"
        aria-hidden="true"
      />
      <p className="text-foreground font-medium mb-1">
        Failed to load recent comments
      </p>
      <p className="text-sm text-muted-foreground">
        Please try refreshing the page
      </p>
    </div>
  );
}

function CommentItem({ comment }: CommentItemProps) {
  return (
    <article className="p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-start gap-3">
        <CommentAvatar name={comment.authorName} />

        <div className="flex-1 min-w-0">
          <CommentMeta
            authorName={comment.authorName}
            createdAt={comment.createdAt}
            status={comment.status}
          />

          <p className="text-sm text-foreground line-clamp-2 mb-2">
            {comment.content}
          </p>

          {comment.post && (
            <Link
              href={`/admin/posts/${comment.post._id}/edit`}
              className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              on "{comment.post.title}"
            </Link>
          )}
        </div>

        <CommentActions
          commentId={comment._id.toString()}
          status={comment.status}
          authorName={comment.authorName}
        />
      </div>
    </article>
  );
}

// Main component
export async function RecentCommentsWidget() {
  let comments: RecentComment[] = [];
  let hasError = false;

  try {
    comments = await getRecentComments();
  } catch (error) {
    console.error("RecentCommentsWidget error:", error);
    hasError = true;
  }

  return (
    <section className="bg-card rounded-lg border border-border">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare
            className="h-5 w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <h2 className="text-lg font-semibold text-foreground">
            Recent Comments
          </h2>
        </div>
        <Link
          href="/admin/comments"
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-1"
        >
          View All
          <span aria-hidden="true">→</span>
        </Link>
      </header>

      {/* Content */}
      {hasError ? (
        <ErrorState />
      ) : comments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="divide-y divide-border">
          {comments.map((comment) => (
            <CommentItem key={comment._id.toString()} comment={comment} />
          ))}
        </div>
      )}
    </section>
  );
}
