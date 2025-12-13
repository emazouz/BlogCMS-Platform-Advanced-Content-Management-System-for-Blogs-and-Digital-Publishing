import connectDB from "@/lib/db/mongoose";
import { Post } from "@/models/Post";
import { Category } from "@/models/Category";
import "@/models/User"; // Ensure model registration
import PostCard from "@/components/posts/PostCard";
import PostFilter from "@/components/posts/PostFilter";
import Pagination from "@/components/shared/Pagination";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "All Posts | DevBlog",
  description: "Browse our latest articles, tutorials, and insights.",
};

interface PostsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
    sort?: string;
  };
}

async function getPosts(params: PostsPageProps["searchParams"]) {
  await connectDB();

  const page = parseInt(params.page || "1", 10);
  const limit = 9;
  const skip = (page - 1) * limit;

  // Build Filter
  const query: any = { status: "published" };

  if (params.search) {
    query.$or = [
      { title: { $regex: params.search, $options: "i" } },
      { content: { $regex: params.search, $options: "i" } }, // Optional: expensive on large text
    ];
  }

  if (params.category) {
    // We need to find the category ID if filtering by slug, unless we store slug in post
    // The Post model stores category ID typically, let's check schema.
    // Actually, `Post.ts` schema reference usually is ObjectId.
    // But `populate` works on it.
    // To filter by slug, we first find the Category by slug, then filter posts by that ID.
    const categoryDoc = await Category.findOne({ slug: params.category });
    if (categoryDoc) {
      query.category = categoryDoc._id; // Filter by category ID
    } else if (params.category !== "all") {
      // If specific category requested but not found, maybe return nothing
      query.category = null;
    }
  }

  // Build Sort
  let sort: any = { createdAt: -1 }; // Default: Latest
  switch (params.sort) {
    case "oldest":
      sort = { createdAt: 1 };
      break;
    case "popular":
      sort = { views: -1 };
      break;
    case "rating":
      sort = { rating: -1 };
      break;
    default:
      sort = { createdAt: -1 };
  }

  const [posts, totalPosts, categories] = await Promise.all([
    Post.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("author", "username")
      .populate("category", "name"),
    Post.countDocuments(query),
    Category.find({}).sort({ name: 1 }),
  ]);

  // Serialize Mongoose Documents
  const serializedPosts = JSON.parse(JSON.stringify(posts)).map(
    (post: any) => ({
      ...post,
      category: post.category?.name || "General",
    })
  );

  const serializedCategories = JSON.parse(JSON.stringify(categories));

  return {
    posts: serializedPosts,
    categories: serializedCategories,
    totalPages: Math.ceil(totalPosts / limit),
    currentPage: page,
  };
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  // Await searchParams as required in newer Next.js versions if dynamic,
  // though currently props are passed directly in server components.
  // Actually in Next 15+ searchParams is a promise, but in 14 it's object.
  // Assuming Next 14/15 compat, treating as object is fine for now usually.
  // Wait, user is on Next 16.1 canary. `searchParams` IS A PROMISE in Next 15+.
  // So we MUST await it.

  const resolvedParams = await searchParams;
  const { posts, categories, totalPages, currentPage } = await getPosts(
    resolvedParams
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[calc(100vh-4rem)] mb-12 flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/seed/writing/1920/600"
          alt="Blog Posts Hero"
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
            Discover Our Stories
          </h1>
          <p className="text-lg md:text-2xl text-zinc-200 max-w-2xl mx-auto font-light leading-relaxed">
            Deep dives, tutorials, and creative insights from our community of
            writers.
          </p>
        </div>
      </div>

      <div className="wrapper">
        {/* Filters */}
        <PostFilter categories={categories} />

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.map((post: any) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
            <h3 className="text-lg font-bold mb-2">No posts found</h3>
            <p className="text-zinc-500">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/posts"
          searchParams={resolvedParams}
        />
      </div>
    </div>
  );
}
