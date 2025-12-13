"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Post as PostType } from "@/types/post";

// Constants
const PLACEHOLDER_IMAGE = "/images/placeholder.jpg";
const DEFAULT_RATING = 0;
const MIN_RATING_COUNT = 0;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Helper function for safe ID conversion
const getPostId = (post: PostType): string => {
  return typeof post._id === "string" ? post._id : post._id.toString();
};

interface HighestRatedProps {
  posts: PostType[];
}

export default function HighestRated({ posts }: HighestRatedProps) {
  if (!posts?.length) return null;

  return (
    <section className="py-16 bg-white dark:bg-zinc-950">
      <div className="wrapper">
        {/* Header */}
        <motion.div
          className="flex justify-between items-end mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">Highest Rated</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Readers' favorites this month
            </p>
          </div>
          <Link
            href="/posts?sort=rating"
            className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="View all highly rated posts"
          >
            View all <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Posts Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {posts.map((post) => {
            const rating = post.rating ?? DEFAULT_RATING;
            const ratingCount = post.ratingCount ?? MIN_RATING_COUNT;
            const authorName = post.author?.username || "Anonymous";
            const excerpt =
              post.excerpt || "A wonderful read worth exploring...";

            return (
              <motion.div key={getPostId(post)} variants={itemVariants}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group block border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors h-full"
                  aria-label={`Read ${post.title} by ${authorName}, rated ${rating} stars`}
                >
                  {/* Post Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Image
                        src={post.featuredImage || PLACEHOLDER_IMAGE}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                        onError={(e) => {
                          e.currentTarget.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </motion.div>

                    <div className="min-w-0 flex-1">
                      {/* Rating */}
                      <div className="flex items-center gap-1 text-yellow-500 mb-1">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Star
                            size={14}
                            fill="currentColor"
                            aria-hidden="true"
                          />
                        </motion.div>
                        <span className="text-sm font-bold">
                          {rating > 0 ? rating.toFixed(1) : "N/A"}
                        </span>
                        {ratingCount > 0 && (
                          <span className="text-xs text-zinc-400">
                            ({ratingCount}{" "}
                            {ratingCount === 1 ? "review" : "reviews"})
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {post.title}
                      </h3>

                      {/* Author */}
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        by {authorName}
                      </p>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <motion.p
                    className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg italic min-h-[60px]"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {excerpt}
                  </motion.p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
