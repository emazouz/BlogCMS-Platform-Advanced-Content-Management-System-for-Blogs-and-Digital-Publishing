// /components/admin/widgets/RecentPostsWidget.tsx
import Link from "next/link";
import { FileText, Eye, Clock, Edit, Trash2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import connectDB from "@/lib/db/mongoose";
import { Post } from "@/models/Post";
import { Category } from "@/models/Category";
import { formatDistanceToNow } from "date-fns";
import { DeletePostButton } from "./DeletePostButton";

// Types
type PostStatus = "published" | "draft" | "scheduled";
type BadgeVariant = "success" | "warning" | "secondary" | "destructive";

interface Author {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

interface RecentPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  status: PostStatus;
  views?: number;
  createdAt: Date;
  author?: Author;
  category?: Category;
}

interface PostMetaProps {
  views?: number;
  createdAt: Date;
  categoryName?: string;
}

interface PostActionsProps {
  postId: string;
  postTitle: string;
}

// Constants
const POST_LIMIT = 5;

// Utility functions
function getStatusVariant(status: PostStatus): BadgeVariant {
  const statusMap: Record<PostStatus, BadgeVariant> = {
    published: "success",
    scheduled: "warning",
    draft: "secondary",
  };

  return statusMap[status] || "secondary";
}

function formatPostDate(date: Date): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Unknown date";
  }
}

// Database query
async function getRecentPosts(): Promise<RecentPost[]> {
  try {
    await connectDB();

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(POST_LIMIT)
      .select(
        "title slug excerpt featuredImage status views createdAt author category"
      )
      .populate("author", "name")
      .populate("category", "name")
      .lean<RecentPost[]>();

    return posts;
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    throw new Error("Failed to fetch recent posts");
  }
}

// Sub-components
function PostThumbnail({ image, title }: { image?: string; title: string }) {
  if (image) {
    return (
      <img
        src={image}
        alt=""
        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        loading="lazy"
      />
    );
  }

  return (
    <div
      className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0"
      aria-hidden="true"
    >
      <FileText className="h-8 w-8 text-muted-foreground" />
    </div>
  );
}

function PostMeta({ views, createdAt, categoryName }: PostMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <Eye className="h-4 w-4" aria-hidden="true" />
        <span aria-label={`${views || 0} views`}>
          {(views || 0).toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" aria-hidden="true" />
        <time dateTime={createdAt.toISOString()}>
          {formatPostDate(createdAt)}
        </time>
      </div>
      {categoryName && (
        <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs font-medium">
          {categoryName}
        </span>
      )}
    </div>
  );
}

function PostActions({ postId, postTitle }: PostActionsProps) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <Link
        href={`/admin/posts/${postId}/edit`}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
        aria-label={`Edit ${postTitle}`}
      >
        <Edit className="h-4 w-4" />
      </Link>
      <DeletePostButton postId={postId} postTitle={postTitle} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-12 text-center">
      <FileText
        className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50"
        aria-hidden="true"
      />
      <p className="text-foreground font-medium mb-1">No posts yet</p>
      <p className="text-sm text-muted-foreground mb-4">
        Get started by creating your first post
      </p>
      <Link
        href="/admin/posts/new"
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        <FileText className="h-4 w-4" />
        Create Your First Post
      </Link>
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
        Failed to load recent posts
      </p>
      <p className="text-sm text-muted-foreground">
        Please try refreshing the page
      </p>
    </div>
  );
}

function PostItem({ post }: { post: RecentPost }) {
  return (
    <article className="p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-start gap-4">
        <PostThumbnail image={post.featuredImage} title={post.title} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link
              href={`/admin/posts/${post._id}/edit`}
              className="text-base font-semibold text-foreground hover:text-primary line-clamp-1 transition-colors"
            >
              {post.title}
            </Link>
            <Badge
              variant={getStatusVariant(post.status)}
              className="flex-shrink-0"
            >
              {post.status}
            </Badge>
          </div>

          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {post.excerpt}
            </p>
          )}

          <PostMeta
            views={post.views}
            createdAt={post.createdAt}
            categoryName={post.category?.name}
          />
        </div>

        <PostActions postId={post._id.toString()} postTitle={post.title} />
      </div>
    </article>
  );
}

// Main component
export async function RecentPostsWidget() {
  let posts: RecentPost[] = [];
  let hasError = false;

  try {
    posts = await getRecentPosts();
  } catch (error) {
    console.error("RecentPostsWidget error:", error);
    hasError = true;
  }

  return (
    <section className="bg-card rounded-lg border border-border">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText
            className="h-5 w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <h2 className="text-lg font-semibold text-foreground">
            Recent Posts
          </h2>
        </div>
        <Link
          href="/admin/posts"
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-1"
        >
          View All
          <span aria-hidden="true">→</span>
        </Link>
      </header>

      {/* Content */}
      {hasError ? (
        <ErrorState />
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <PostItem key={post._id.toString()} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
