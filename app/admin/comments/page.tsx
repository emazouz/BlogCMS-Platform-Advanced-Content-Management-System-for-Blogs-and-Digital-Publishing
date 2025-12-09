"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  _id: string;
  content: string;
  status: "pending" | "approved" | "spam" | "trash";
  authorName: string;
  authorEmail: string;
  post: {
    _id: string;
    title: string;
    slug: string;
  };
  createdAt: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedComments, setSelectedComments] = useState<string[]>([]);

  useEffect(() => {
    fetchComments();
  }, [statusFilter]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/comments?${params}`);
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (commentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setComments(
          comments.map((c) =>
            c._id === commentId ? { ...c, status: newStatus as any } : c
          )
        );
      }
    } catch (error) {
      console.error("Error updating comment status:", error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to permanently delete this comment?"))
      return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setComments(comments.filter((c) => c._id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const toggleSelectComment = (commentId: string) => {
    setSelectedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedComments(
      selectedComments.length === comments.length
        ? []
        : comments.map((c) => c._id)
    );
  };

  const getStatusBadgeVariant = (
    status: string
  ):
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning" => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "spam":
        return "destructive";
      case "trash":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comments</h1>
          <p className="text-gray-600 mt-1">
            Manage user comments and moderation
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="spam">Spam</option>
            <option value="trash">Trash</option>
          </select>
        </div>
      </div>

      {/* Comments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No comments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedComments.length === comments.length}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Comment
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Post
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comments.map((comment) => (
                  <tr key={comment._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedComments.includes(comment._id)}
                        onChange={() => toggleSelectComment(comment._id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {comment.authorName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {comment.authorEmail}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-600 line-clamp-2 max-w-sm">
                        {comment.content}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {comment.post ? (
                        <Link
                          href={`/blog/${comment.post.slug}`}
                          target="_blank"
                          className="text-primary-600 hover:underline line-clamp-1 max-w-[150px]"
                        >
                          {comment.post.title}
                        </Link>
                      ) : (
                        <span className="text-gray-400">Deleted Post</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadgeVariant(comment.status)}>
                        {comment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {comment.status !== "approved" && (
                          <button
                            onClick={() =>
                              handleStatusChange(comment._id, "approved")
                            }
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {comment.status !== "spam" && (
                          <button
                            onClick={() =>
                              handleStatusChange(comment._id, "spam")
                            }
                            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                            title="Mark as Spam"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete Permanently"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
