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
  User,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

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
      toast.error("Failed to load comments");
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
        toast.success(`Comment marked as ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating comment status:", error);
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setComments(comments.filter((c) => c._id !== commentId));
        setShowDeleteDialog(false);
        setCommentToDelete(null);
        toast.success("Comment deleted permanently");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
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
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "spam":
      case "trash":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircle;
      case "pending":
        return Clock;
      case "spam":
        return AlertTriangle;
      case "trash":
        return Trash2;
      default:
        return MessageSquare;
    }
  };

  // Calculate stats
  const pendingCount = comments.filter((c) => c.status === "pending").length;
  const approvedCount = comments.filter((c) => c.status === "approved").length;
  const spamCount = comments.filter((c) => c.status === "spam").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Comments</h1>
          <p className="text-muted-foreground mt-1">
            Manage user comments and moderation ({comments.length} total)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Comments
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {comments.length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending Review
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {pendingCount}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Approved
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {approvedCount}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Spam</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {spamCount}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="spam">Spam</SelectItem>
              <SelectItem value="trash">Trash</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Comments Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <span className="sr-only">Loading comments...</span>
            <p className="text-muted-foreground mt-4">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare
              className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50"
              aria-hidden="true"
            />
            <p className="text-foreground font-medium mb-1">
              No comments found
            </p>
            <p className="text-sm text-muted-foreground">
              {statusFilter !== "all"
                ? `No ${statusFilter} comments at the moment`
                : "Comments will appear here when users engage with your posts"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedComments.length === comments.length}
                      onChange={toggleSelectAll}
                      className="rounded border-input text-primary focus:ring-ring"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comments.map((comment) => {
                  const StatusIcon = getStatusIcon(comment.status);
                  return (
                    <tr
                      key={comment._id}
                      className="hover:bg-accent/50 transition"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedComments.includes(comment._id)}
                          onChange={() => toggleSelectComment(comment._id)}
                          className="rounded border-input text-primary focus:ring-ring"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {comment.authorName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {comment.authorEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-muted-foreground line-clamp-2 max-w-md">
                          {comment.content}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {comment.post ? (
                          <Link
                            href={`/blog/${comment.post.slug}`}
                            target="_blank"
                            className="text-primary hover:underline line-clamp-1 max-w-[200px] block"
                          >
                            {comment.post.title}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">
                            Deleted Post
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={getStatusBadgeVariant(comment.status)}
                          className="gap-1"
                        >
                          <StatusIcon className="h-3 w-3" />
                          {comment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <time
                          dateTime={comment.createdAt}
                          className="text-sm text-muted-foreground"
                        >
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </time>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Comment actions"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {comment.status !== "approved" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(comment._id, "approved")
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                  Approve
                                </DropdownMenuItem>
                              )}
                              {comment.status !== "spam" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(comment._id, "spam")
                                  }
                                >
                                  <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                                  Mark as Spam
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setCommentToDelete(comment._id);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Permanently
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this comment? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => commentToDelete && handleDelete(commentToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
