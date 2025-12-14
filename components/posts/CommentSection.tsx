"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { createComment } from "@/lib/actions/comment.actions";
import {
  Loader2,
  Reply,
  Flag,
  MessageSquare,
  Star,
  CornerDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface Comment {
  _id: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  parent?: string | null;
  post: string;
}

export interface CurrentUser {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUser?: CurrentUser | null;
  rating?: number;
  ratingCount?: number;
}

// Helper to organize comments into a tree
const buildCommentTree = (comments: Comment[]) => {
  const commentMap = new Map<string, any>();
  const roots: any[] = [];

  // Initialize map
  comments.forEach((c) => {
    commentMap.set(c._id, { ...c, replies: [] });
  });

  // Build tree
  comments.forEach((c) => {
    if (c.parent && commentMap.has(c.parent)) {
      commentMap.get(c.parent).replies.push(commentMap.get(c._id));
    } else {
      roots.push(commentMap.get(c._id));
    }
  });

  // Sort by date (newest first for roots, oldest first for replies usually, but let's do newest for all for now)
  roots.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return roots;
};

function CommentItem({
  comment,
  currentUser,
  postId,
  onReply,
  depth = 0,
}: {
  comment: any;
  currentUser?: CurrentUser | null;
  postId: string;
  onReply: (authorName: string, parentId: string) => void;
  depth?: number;
}) {
  const [showDeepReplies, setShowDeepReplies] = useState(false);
  const isReply = depth > 0;
  const MAX_DEPTH = 5; // Maximum nesting depth before flattening
  const hasReplies = comment.replies && comment.replies.length > 0;
  const shouldFlatten = depth >= MAX_DEPTH && hasReplies;

  return (
    <div className={cn("relative group", isReply && "mt-4")}>
      {/* Connecting Line for Replies */}
      {isReply && (
        <div className="absolute -left-6 top-0 w-6 h-6 border-l-2 border-b-2 border-zinc-200 dark:border-zinc-800 rounded-bl-xl text-zinc-300 dark:text-zinc-700 pointer-events-none" />
      )}

      <div
        className={cn(
          "flex gap-4 p-4 rounded-xl transition-colors",
          isReply
            ? "bg-zinc-50/50 dark:bg-zinc-900/30 border border-l-4 border-zinc-100 dark:border-zinc-800 border-l-blue-500/50"
            : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm"
        )}
      >
        <div className="flex-shrink-0">
          <div
            className={cn(
              "rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative border border-zinc-200 dark:border-zinc-700",
              isReply ? "w-8 h-8" : "w-10 h-10"
            )}
          >
            {comment.authorAvatar ? (
              <Image
                src={comment.authorAvatar}
                alt={comment.authorName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-zinc-500 text-xs">
                {comment.authorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm truncate">
                {comment.authorName}
              </span>
              {comment.rating && comment.rating > 0 && (
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={10}
                      fill={
                        star <= comment.rating ? "currentColor" : "transparent"
                      }
                      className={
                        star <= comment.rating
                          ? ""
                          : "text-zinc-300 dark:text-zinc-600"
                      }
                    />
                  ))}
                </div>
              )}
              <span className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <button
              onClick={() => onReply(comment.authorName, comment._id)}
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-xs flex items-center gap-1 text-zinc-500 hover:text-blue-600 font-medium px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Reply size={14} /> Reply
            </button>
          </div>

          <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
            {comment.content}
          </div>
        </div>
      </div>

      {/* Render Replies */}
      {hasReplies && (
        <>
          {shouldFlatten ? (
            // Flatten deep replies with toggle button
            <div className="mt-4">
              <button
                onClick={() => setShowDeepReplies(!showDeepReplies)}
                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <CornerDownRight size={14} />
                {showDeepReplies ? "Hide" : "View"} {comment.replies.length}{" "}
                {comment.replies.length === 1 ? "reply" : "replies"}
              </button>
              {showDeepReplies && (
                <div className="mt-4 space-y-4 pl-0">
                  {comment.replies.map((reply: any) => (
                    <CommentItem
                      key={reply._id}
                      comment={reply}
                      currentUser={currentUser}
                      postId={postId}
                      onReply={onReply}
                      depth={MAX_DEPTH} // Keep at max depth to continue flattening
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Normal nested rendering
            <div className="pl-6 md:pl-10 space-y-0">
              {comment.replies.map((reply: any) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  currentUser={currentUser}
                  postId={postId}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CommentSection({
  postId,
  comments: initialComments,
  currentUser,
  rating = 0,
  ratingCount = 0,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [parentId, setParentId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const pathname = usePathname();

  // Guest fields
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);

  const [ratingInput, setRatingInput] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!currentUser && (!guestName || !guestEmail)) {
      alert("Please provide name and email");
      return;
    }

    startTransition(async () => {
      const result = await createComment({
        postId,
        content,
        authorName: currentUser?.name || guestName,
        authorEmail: currentUser?.email || guestEmail,
        rating: ratingInput > 0 ? ratingInput : undefined,
        parentId: parentId || undefined,
        path: pathname,
      });

      if (result.success && result.comment) {
        setComments((prev) => [result.comment, ...prev]);
        setContent("");
        setRatingInput(0);
        setParentId(null);
        setReplyTo(null);
        if (!currentUser) {
          setGuestName("");
          setGuestEmail("");
        }
      } else {
        alert("Failed to post comment");
      }
    });
  };

  const handleReply = (authorName: string, id: string) => {
    setReplyTo(authorName);
    setParentId(id);
    const form = document.querySelector("#comment-form");
    form?.scrollIntoView({ behavior: "smooth" });
  };

  const cancelReply = () => {
    setReplyTo(null);
    setParentId(null);
  };

  return (
    <div
      id="comments"
      className="bg-zinc-50 dark:bg-zinc-950 py-12 px-2 md:px-0"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header / Rating Summary */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
              Reviews & Discussion
              <span className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-sm rounded-full text-zinc-600 dark:text-zinc-400">
                {comments.length}
              </span>
            </h3>
            <p className="text-muted-foreground mt-1">
              Share your experience and rate this post.
            </p>
          </div>

          {/* Rating Card */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4 min-w-[240px]">
            <div className="flex flex-col items-center justify-center pl-2">
              <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
                {rating.toFixed(1)}
              </span>
              <div className="flex text-yellow-400 text-xs gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    fill={
                      star <= Math.round(rating)
                        ? "currentColor"
                        : "transparent"
                    }
                    className={
                      star <= Math.round(rating)
                        ? ""
                        : "text-zinc-300 dark:text-zinc-600"
                    }
                  />
                ))}
              </div>
            </div>
            <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex flex-col">
              <span className="font-bold text-sm">Overall Rating</span>
              <span className="text-xs text-muted-foreground">
                {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>
        </div>

        {/* Comments Tree */}
        <div className="space-y-8">
          {commentTree.length === 0 ? (
            <div className="text-center py-20 px-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                <MessageSquare size={24} />
              </div>
              <h4 className="font-bold text-lg mb-1">No comments yet</h4>
              <p className="text-muted-foreground">
                Be the first to share your thoughts on this post.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {commentTree.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  currentUser={currentUser}
                  postId={postId}
                  onReply={handleReply}
                />
              ))}
            </div>
          )}
        </div>

        {/* Comment Form */}
        <form
          id="comment-form"
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-lg">Leave a Review</h4>
            {replyTo && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg">
                <CornerDownRight size={14} />
                <span>
                  Replying to <b>{replyTo}</b>
                </span>
                <button
                  type="button"
                  onClick={cancelReply}
                  className="ml-2 hover:underline opacity-70 hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Rating Input */}
          {!replyTo && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500">
                Your Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingInput(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={24}
                      fill={
                        (
                          hoveredRating
                            ? star <= hoveredRating
                            : star <= ratingInput
                        )
                          ? "#facc15" // yellow-400
                          : "transparent"
                      }
                      className={
                        (
                          hoveredRating
                            ? star <= hoveredRating
                            : star <= ratingInput
                        )
                          ? "text-yellow-400"
                          : "text-zinc-300 dark:text-zinc-600"
                      }
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground font-medium">
                  {ratingInput > 0 ? (
                    <span className="text-zinc-900 dark:text-zinc-100">
                      {ratingInput === 5
                        ? "Excellent!"
                        : ratingInput === 4
                        ? "Very Good"
                        : ratingInput === 3
                        ? "Good"
                        : ratingInput === 2
                        ? "Fair"
                        : "Poor"}
                    </span>
                  ) : (
                    "Select a rating"
                  )}
                </span>
              </div>
            </div>
          )}

          {!currentUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-bold uppercase text-zinc-500"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-bold uppercase text-zinc-500"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="comment"
              className="text-xs font-bold uppercase text-zinc-500"
            >
              Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all resize-none"
              placeholder="Share your experience..."
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="px-8 py-2.5 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending && <Loader2 className="animate-spin" size={16} />}
              {isPending ? "Publishing..." : "Post Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
