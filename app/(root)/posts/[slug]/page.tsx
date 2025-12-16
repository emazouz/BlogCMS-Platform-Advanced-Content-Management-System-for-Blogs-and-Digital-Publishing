import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Calendar } from "lucide-react";

import connectDB from "@/lib/db/mongoose";
import { Post } from "@/models/Post";
import "@/models/Category"; // Ensure registration
import "@/models/Tag"; // Ensure registration
import "@/models/User"; // Ensure registration
import AdBanner from "@/components/ads/AdBanner";
import ShareButtons from "@/components/posts/ShareButtons";
import RelatedPosts from "@/components/posts/RelatedPosts";
import CommentSection, { CurrentUser } from "@/components/posts/CommentSection";
import { auth } from "@/auth";
import { getCommentsByPostId } from "@/lib/actions/comment.actions";
import { getRecentPosts, getPopularPosts } from "@/lib/actions/post.actions";
import SidebarTabsWidget from "@/components/widgets/SidebarTabsWidget";
import UserLeaderboardWidget from "@/components/widgets/UserLeaderboardWidget";
import {
  getTopCommenters,
  getTopRaters,
} from "@/lib/actions/leaderboard.actions";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// 1. Fetch Post Data
async function getPost(slug: string) {
  await connectDB();

  // Find main post
  const post = (await Post.findOne({ slug, status: "published" })
    .populate("author", "name username image bio") // Fetch bio if available
    .populate("category", "name slug")
    .populate("tags", "name") // Populate tags to get tag names
    .lean()) as any;

  if (!post) return null;

  // Find related posts (same category, different ID)
  // We need the category ID from the populated object or original field
  const categoryId = post.category?._id || post.category;

  const relatedPosts = await Post.find({
    category: categoryId,
    _id: { $ne: post._id },
    status: "published",
  })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate("category", "name")
    .lean();

  return {
    post: JSON.parse(JSON.stringify(post)),
    relatedPosts: JSON.parse(JSON.stringify(relatedPosts)),
  };
}

// 2. Generate SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const { slug } = await params;
  const post = (await Post.findOne({ slug }).populate("author").lean()) as any;

  if (!post) return {};

  const authorName =
    post.author?.name || post.author?.username || "DevBlog Author";

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      type: "article",
      publishedTime: new Date(post.createdAt).toISOString(),
      authors: [authorName],
      images: post.featuredImage ? [post.featuredImage] : [],
      url: `https://devblog.com/posts/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

const PostPage = async ({ params }: Props) => {
  const { slug } = await params;
  const data = await getPost(slug);
  const session = await auth();

  if (!data) {
    notFound();
  }

  const { post, relatedPosts } = data;
  const comments = await getCommentsByPostId(post._id);
  const recentPosts = await getRecentPosts(4);
  const popularPosts = await getPopularPosts(4);
  const topCommenters = await getTopCommenters(5);
  const topRaters = await getTopRaters(5);

  // JSON-LD for Search Engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.featuredImage ? [post.featuredImage] : [],
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author?.name || post.author?.username || "Anonymous",
      url: `/author/${post.author?.username}`,
    },
    publisher: {
      "@type": "Organization",
      name: "DevBlog",
      logo: {
        "@type": "ImageObject",
        url: "https://devblog.com/logo.png", // Replace with actual logo
      },
    },
  };

  return (
    <article className="min-h-screen bg-white dark:bg-zinc-950 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero / Header */}
      <div className="relative w-full h-[60vh] min-h-[400px] bg-zinc-900">
        {post.featuredImage && (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        <div className="absolute inset-0 max-w-4xl mx-auto px-6 flex flex-col justify-end pb-12 md:pb-20">
          <div className="mb-4">
            {post.category && (
              <Link
                href={`/categories/${post.category.slug}`}
                className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                {post.category.name}
              </Link>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-zinc-300 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-700 overflow-hidden relative border border-zinc-600">
                {post.author?.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.username || "user"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold">
                    {post.author?.username?.[0]?.toUpperCase() || "A"}
                  </div>
                )}
              </div>
              <span className="font-medium text-white">
                {post.author?.name || post.author?.username || "Anonymous"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{post.readingTime} min read</span>
            </div>

            <div className="flex items-center gap-2">
              <Eye size={18} />
              <span>{post.views} views</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 -mt-10 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-8">
          {/* Left Sidebar (Desktop Only) */}
          <div className="hidden lg:block space-y-8">
            <div className="sticky top-24">
              <UserLeaderboardWidget
                topCommenters={topCommenters}
                topRaters={topRaters}
              />
            </div>
          </div>

          {/* Main Content Column */}
          <div className="bg-background rounded-t-3xl lg:rounded-3xl p-8 md:p-12 shadow-xl border border-zinc-200 dark:border-zinc-800">
            {/* Top Ad */}
            <div className="mb-10 lg:hidden">
              <AdBanner dataAdSlot="TOP_CONTENT" />
            </div>

            {/* Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-zinc-900 dark:prose-headings:text-zinc-50 prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: any) => (
                    <span
                      key={tag._id || tag}
                      className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full text-sm"
                    >
                      #{tag.name || tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share & Author Bio */}
            <div className="mt-12 py-8 border-y border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
              <ShareButtons title={post.title} slug={post.slug} />
            </div>

            {/* Rating Section - REMOVED (Merged into Comments) */}

            {/* Comments */}
            <div className="mt-12">
              <CommentSection
                postId={post._id}
                comments={comments}
                currentUser={(session?.user as CurrentUser) || null}
                rating={post.rating || 0}
                ratingCount={post.ratingCount || 0}
              />
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-8">
            <div className="sticky top-24 space-y-8">
              {/* Rating Widget - REMOVED (Merged into Comments) */}

              {/* Sidebar Tabs (Recent / Popular) */}
              <SidebarTabsWidget
                recentPosts={recentPosts}
                popularPosts={popularPosts}
              />

              {/* About / Intro Widget (Optional) */}
              {post.author?.bio && (
                <div className="bg-background rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <h3 className="font-bold text-lg mb-2">About the Author</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-100">
                      {post.author.image ? (
                        <Image
                          src={post.author.image}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-zinc-500">
                          {post.author.username?.[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        {post.author.name || post.author.username}
                      </p>
                      <p className="text-xs text-muted-foreground">Author</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {post.author.bio}
                  </p>
                </div>
              )}

              {/* Sidebar Ad 1 */}
              <div className="bg-background rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[300px] relative">
                <div className="text-xs text-muted-foreground absolute top-2 left-2">
                  Advertisement
                </div>
                <div className="pt-6 w-full flex justify-center">
                  <AdBanner dataAdSlot="SIDEBAR_1" />
                </div>
              </div>

              {/* Sidebar Ad 2 */}
              <div className="bg-background rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[300px] relative">
                <div className="text-xs text-muted-foreground absolute top-2 left-2">
                  Advertisement
                </div>
                <div className="pt-6 w-full flex justify-center">
                  <AdBanner dataAdSlot="SIDEBAR_2" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} />
      </div>
    </article>
  );
};

export default PostPage;
