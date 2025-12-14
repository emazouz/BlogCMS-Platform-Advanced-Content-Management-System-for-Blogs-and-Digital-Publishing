// /components/admin/widgets/CommentActions.tsx
"use client";

import { useState } from "react";
import { Check, X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CommentStatus = "approved" | "pending" | "spam" | "rejected";

interface CommentActionsProps {
  commentId: string;
  status: CommentStatus;
  authorName: string;
}

export function CommentActions({
  commentId,
  status,
  authorName,
}: CommentActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleStatusUpdate = async (newStatus: CommentStatus) => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update comment status");
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating comment status:", error);
      alert("Failed to update comment. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      setDeleteDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <TooltipProvider>
        {status === "pending" && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleStatusUpdate("approved")}
                  disabled={isUpdating}
                  className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Approve comment from ${authorName}`}
                >
                  <Check className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Approve</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleStatusUpdate("rejected")}
                  disabled={isUpdating}
                  className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Reject comment from ${authorName}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reject</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <button
                  disabled={isUpdating}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Delete comment from ${authorName}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Comment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this comment from{" "}
                <strong>{authorName}</strong>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isUpdating}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isUpdating}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isUpdating ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TooltipProvider>
    </div>
  );
}
