"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Folder } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
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
              className="group relative flex flex-col items-center justify-center p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center overflow-hidden"
            >
              {category.image ? (
                <div className="relative w-full aspect-[16/10] mb-3 rounded-xl overflow-hidden shadow-sm">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              ) : (
                <div className="w-full aspect-[16/10] bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-inner">
                  <Folder size={32} strokeWidth={1.5} />
                </div>
              )}

              <h3 className="font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {category.name}
              </h3>
              {typeof category.postCount === "number" && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {category.postCount} Posts
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
