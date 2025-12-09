import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types/post";

interface RelatedPostsProps {
  posts: Post[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      <h3 className="text-2xl font-bold mb-6">Similar Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post: any) => (
          <Link
            key={post._id}
            href={`/posts/${post.slug}`}
            className="group block"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={post.featuredImage || "/placeholder.jpg"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {post.category?.name || post.category}
            </span>
            <h4 className="font-bold text-lg leading-snug mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {post.title}
            </h4>
          </Link>
        ))}
      </div>
    </div>
  );
}
