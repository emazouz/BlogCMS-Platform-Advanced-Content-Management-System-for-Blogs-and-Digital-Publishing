"use client";

import Link from "next/link";
import { ArrowRight, Folder } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  postCount?: number;
}

export default function AllCategories({
  categories,
}: {
  categories: Category[];
}) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Explore Categories</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Browse content by topic
            </p>
          </div>
          <Link
            href="/categories"
            className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Folder size={24} />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {category.name}
              </h3>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {category.postCount || 0} Posts
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
