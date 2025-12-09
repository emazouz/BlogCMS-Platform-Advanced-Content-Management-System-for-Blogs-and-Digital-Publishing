// /components/admin/widgets/RecentPostsWidget.tsx
import Link from 'next/link';
import { FileText, Eye, Clock, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import connectDB from '@/lib/db/mongoose';
import { Post } from '@/models/Post';
import { formatDistanceToNow } from 'date-fns';

async function getRecentPosts() {
  await connectDB();
  
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('author', 'name')
    .populate('category', 'name')
    .lean();

  return posts;
}

export async function RecentPostsWidget() {
  const posts = await getRecentPosts();

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
        </div>
        <Link 
          href="/admin/posts"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium transition"
        >
          View All →
        </Link>
      </div>

      {/* Posts List */}
      <div className="divide-y divide-gray-200">
        {posts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No posts yet</p>
            <Link 
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          posts.map((post: any) => (
            <div key={post._id.toString()} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Link 
                      href={`/admin/posts/${post._id}/edit`}
                      className="text-base font-semibold text-gray-900 hover:text-primary-600 line-clamp-1 transition"
                    >
                      {post.title}
                    </Link>
                    <Badge variant={getStatusVariant(post.status)}>
                      {post.status}
                    </Badge>
                  </div>

                  {post.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.excerpt}</p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                    </div>
                    {post.category && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {post.category.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link href={`/admin/posts/${post._id}/edit`}>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      <Edit className="h-4 w-4" />
                    </button>
                  </Link>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getStatusVariant(status: string): 'success' | 'warning' | 'secondary' {
  switch (status) {
    case 'published':
      return 'success';
    case 'scheduled':
      return 'warning';
    default:
      return 'secondary';
  }
}