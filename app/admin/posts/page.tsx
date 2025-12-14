"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ExternalLink,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

// Types
type PostStatus = "draft" | "published" | "scheduled";
type BadgeVariant = "success" | "warning" | "secondary" | "default";

interface Category {
  _id: string;
  name: string;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  status: PostStatus;
  views: number;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
}

interface ApiResponse {
  posts: Post[];
  pagination: PaginationData;
  success?: boolean;
  error?: string;
}

// Constants
const POSTS_PER_PAGE = 10;
const DEBOUNCE_DELAY = 500;

// Utility functions
function getStatusVariant(status: PostStatus): BadgeVariant {
  const statusMap: Record<PostStatus, BadgeVariant> = {
    published: "success",
    scheduled: "warning",
    draft: "secondary",
  };
  return statusMap[status] || "default";
}

function getStatusIcon(status: PostStatus) {
  const icons = {
    published: TrendingUp,
    scheduled: Calendar,
    draft: FileText,
  };
  return icons[status];
}

// Sub-components
function PostThumbnail({ image, title }: { image?: string; title: string }) {
  if (image) {
    return (
      <div className="relative w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
        <Image src={image} alt="" fill sizes="48px" className="object-cover" />
      </div>
    );
  }

  return (
    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
      <FileText className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
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
      <p className="text-foreground font-medium mb-1">No posts found</p>
      <p className="text-sm text-muted-foreground mb-4">
        Get started by creating your first post
      </p>
      <Link href="/admin/posts/new">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create First Post
        </Button>
      </Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-12 text-center" role="status" aria-live="polite">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
      <span className="sr-only">Loading posts...</span>
      <p className="text-muted-foreground mt-4">Loading posts...</p>
    </div>
  );
}

function PostActions({ post, onDelete }: { post: Post; onDelete: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Post actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/posts/${post._id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/blog/${post.slug}`} target="_blank">
            <ExternalLink className="h-4 w-4 mr-2" />
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/admin/posts/${post._id}/analytics`}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Main component
export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    postsPerPage: POSTS_PER_PAGE,
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPosts = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);

    try {
      const params = new URLSearchParams({
        search: searchQuery,
        status: statusFilter,
        category: categoryFilter,
        page: pagination.currentPage.toString(),
        limit: POSTS_PER_PAGE.toString(),
      });

      const response = await fetch(`/api/posts?${params}`, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data: ApiResponse = await response.json();
      setPosts(data.posts || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, searchQuery, pagination.currentPage]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCategories]);

  useEffect(() => {
    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
      fetchPosts();
    }, DEBOUNCE_DELAY);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete post");

      setShowDeleteDialog(false);
      setPostToDelete(null);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedPosts.map((id) =>
          fetch(`/api/posts/${id}`, { method: "DELETE" })
        )
      );
      setSelectedPosts([]);
      setShowBulkDeleteDialog(false);
      fetchPosts();
    } catch (error) {
      console.error("Error bulk deleting:", error);
      alert("Failed to delete posts. Please try again.");
    }
  };

  const toggleSelectPost = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedPosts(
      selectedPosts.length === posts.length ? [] : posts.map((p) => p._id)
    );
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your blog posts ({pagination.totalPosts} total)
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-input transition"
                aria-label="Search posts"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
            className="px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-input transition"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="scheduled">Scheduled</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
            className="px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-input transition"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-3 bg-accent rounded-lg border border-border">
            <span className="text-sm font-medium text-foreground">
              {selectedPosts.length} post{selectedPosts.length > 1 ? "s" : ""}{" "}
              selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowBulkDeleteDialog(true)}
            >
              Delete Selected
            </Button>
            <button
              onClick={() => setSelectedPosts([])}
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Posts Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {loading ? (
          <LoadingState />
        ) : posts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          posts.length > 0 &&
                          selectedPosts.length === posts.length
                        }
                        onChange={toggleSelectAll}
                        className="rounded border-input text-primary focus:ring-ring"
                        aria-label="Select all posts"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Views
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {posts.map((post) => {
                    const StatusIcon = getStatusIcon(post.status);
                    return (
                      <tr
                        key={post._id}
                        className="hover:bg-accent/50 transition"
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedPosts.includes(post._id)}
                            onChange={() => toggleSelectPost(post._id)}
                            className="rounded border-input text-primary focus:ring-ring"
                            aria-label={`Select ${post.title}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <PostThumbnail
                              image={post.featuredImage}
                              title={post.title}
                            />
                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/admin/posts/${post._id}/edit`}
                                className="font-medium text-foreground hover:text-primary line-clamp-1 transition-colors block"
                              >
                                {post.title}
                              </Link>
                              {post.excerpt && (
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {post.excerpt}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-muted-foreground">
                            {post.category?.name || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={getStatusVariant(post.status)}
                            className="flex items-center gap-1 w-fit"
                          >
                            <StatusIcon className="h-3 w-3" />
                            {post.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            <span className="text-sm">
                              {post.views?.toLocaleString() || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <time
                            dateTime={post.createdAt}
                            className="text-sm text-muted-foreground"
                          >
                            {formatDistanceToNow(new Date(post.createdAt), {
                              addSuffix: true,
                            })}
                          </time>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end">
                            <PostActions
                              post={post}
                              onDelete={() => {
                                setPostToDelete(post._id);
                                setShowDeleteDialog(true);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => postToDelete && handleDelete(postToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Posts</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedPosts.length} post
              {selectedPosts.length > 1 ? "s" : ""}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
