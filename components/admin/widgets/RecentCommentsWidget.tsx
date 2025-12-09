// /components/admin/widgets/RecentCommentsWidget.tsx
import Link from "next/link";
import { MessageSquare, ThumbsUp, Trash2, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import connectDB from "@/lib/db/mongoose";
import { Comment } from "@/models/Comment";
import { formatDistanceToNow } from "date-fns";

async function getRecentComments() {
  await connectDB();

  const comments = await Comment.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("post", "title slug")
    .lean();

  return comments;
}

export async function RecentCommentsWidget() {
  const comments = await getRecentComments();

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Comments
          </h3>
        </div>
        <Link
          href="/admin/comments"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium transition"
        >
          View All →
        </Link>
      </div>

      {/* Comments List */}
      <div className="divide-y divide-gray-200">
        {comments.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No comments yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Comments will appear here when readers engage with your posts
            </p>
          </div>
        ) : (
          comments.map((comment: any) => (
            <CommentItem key={comment._id.toString()} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}

function CommentItem({ comment }: { comment: any }) {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {comment.authorName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Author Info */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 text-sm">
              {comment.authorName}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
            <Badge
              variant={getCommentStatusVariant(comment.status)}
              size="small"
            >
              {comment.status}
            </Badge>
          </div>

          {/* Comment Text */}
          <p className="text-sm text-gray-700 line-clamp-2 mb-2">
            {comment.content}
          </p>

          {/* Post Link */}
          {comment.post && (
            <Link
              href={`/admin/posts/${comment.post._id}/edit`}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              on "{comment.post.title}"
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {comment.status === "pending" && (
            <>
              <button
                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition"
                title="Approve"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                title="Reject"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function getCommentStatusVariant(
  status: string
): "success" | "warning" | "secondary" | "error" {
  switch (status) {
    case "approved":
      return "success";
    case "pending":
      return "warning";
    case "spam":
      return "error";
    default:
      return "secondary";
  }
}
