import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db/mongoose";
import { Post } from "@/models/Post";
import { User } from "@/models/User"; // Ensure model registration
import { Category } from "@/models/Category"; // Ensure model registration
import { Tag } from "@/models/Tag"; // Ensure model registration
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Eye,
  Folder,
  Tag as TagIcon,
  User as UserIcon,
  Globe,
  Search,
} from "lucide-react";

export default async function ViewPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await dbConnect();

  const post = await Post.findById(id)
    .populate("category", "name")
    .populate("tags", "name")
    .populate("author", "name email");

  if (!post) {
    notFound();
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "published":
        return "success"; // Verify if 'success' is a valid variant for your Badge
      case "scheduled":
        return "warning"; // Verify if 'warning' is valid
      default:
        return "secondary";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 line-clamp-1">
                {post.title}
              </h1>
              <Badge variant={getStatusVariant(post.status)}>
                {post.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Created {format(new Date(post.createdAt), "MMM d, yyyy")}
              </span>
              {post.publishedAt && (
                <span className="flex items-center gap-1 text-green-600">
                  <Globe className="h-3.5 w-3.5" />
                  Published {format(new Date(post.publishedAt), "MMM d, yyyy")}
                </span>
              )}
            </div>
          </div>
        </div>
        <Link href={`/admin/posts/${post._id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          <Card className="overflow-hidden bg-gray-50 border-gray-200">
            {post.featuredImage ? (
              <div className="relative aspect-video w-full">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                <div className="p-4 rounded-full bg-gray-100 mb-2">
                  <Folder className="h-8 w-8" />
                </div>
                <p>No featured image found</p>
              </div>
            )}
          </Card>

          {/* Excerpt */}
          {post.excerpt && (
            <Card className="p-6 bg-blue-50/50 border-blue-100">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Excerpt
              </h3>
              <p className="text-blue-800 leading-relaxed font-medium">
                {post.excerpt}
              </p>
            </Card>
          )}

          {/* Content */}
          <Card className="p-8">
            <h3 className="text-lg font-semibold border-b pb-4 mb-6">
              Post Content
            </h3>
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats & Info */}
          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-gray-900">Post Details</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Author
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                    {post.author?.name?.substring(0, 2)?.toUpperCase() || "AU"}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {post.author?.name || "Unknown Author"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {post.author?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
                    <Eye className="h-3 w-3" /> Views
                  </label>
                  <p className="mt-1 font-mono text-sm">
                    {post.views?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Read Time
                  </label>
                  <p className="mt-1 font-mono text-sm">
                    {post.readingTime || 1} min
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1 mb-2">
                  <Folder className="h-3 w-3" /> Category
                </label>
                {post.category ? (
                  <Badge variant="outline" className="text-sm font-normal">
                    {post.category.name}
                  </Badge>
                ) : (
                  <span className="text-sm text-gray-400 italic">
                    Uncategorized
                  </span>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1 mb-2">
                  <TagIcon className="h-3 w-3" /> Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {post.tags && post.tags.length > 0 ? (
                    post.tags.map((tag: any) => (
                      <Badge
                        key={tag._id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      No tags
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* SEO Info */}
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Search className="h-4 w-4" /> SEO Metadata
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Meta Title
                </label>
                <p className="text-sm text-gray-900 mt-0.5">
                  {post.metaTitle || "—"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Focus Keyword
                </label>
                <p className="text-sm text-gray-900 mt-0.5">
                  {post.focusKeyword || "—"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Meta Description
                </label>
                <p className="text-sm text-gray-600 mt-0.5 line-clamp-3">
                  {post.metaDescription || "—"}
                </p>
              </div>
            </div>
          </Card>

          {/* System Info */}
          <Card className="p-6 bg-gray-50 border-gray-200">
            <h3 className="font-semibold text-gray-900 text-sm mb-4">
              System Info
            </h3>
            <div className="space-y-2 text-xs text-gray-500 font-mono">
              <div className="flex justify-between">
                <span>ID</span>
                <span className="select-all">{post._id.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Slug</span>
                <span className="select-all">{post.slug}</span>
              </div>
              <div className="flex justify-between">
                <span>Updated</span>
                <span>
                  {format(new Date(post.updatedAt), "yyyy-MM-dd HH:mm")}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
