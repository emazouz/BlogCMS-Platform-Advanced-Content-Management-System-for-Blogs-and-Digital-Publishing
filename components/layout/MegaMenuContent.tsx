"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  _id: string;
  name: string;
  slug: string;
  categoryItems?: string[];
}

export default function MegaMenuContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 w-full md:w-[600px] h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 w-full md:w-[600px]">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-background rounded-md shadow-lg border outline-none w-full max-w-[100vw] overflow-y-auto max-h-[60vh] md:max-h-none md:overflow-visible scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6">
        {categories.slice(0, 12).map((category) => (
          <div key={category._id} className="space-y-3">
            <Link
              href={`/categories/${category.slug}`}
              className="block font-semibold text-base hover:text-primary transition-colors text-foreground"
            >
              {category.name}
            </Link>

            {category.categoryItems && category.categoryItems.length > 0 ? (
              <ul className="space-y-1.5">
                {category.categoryItems.slice(0, 5).map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={`/posts?category=${
                        category.slug
                      }&tag=${encodeURIComponent(item)}`}
                      className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-1 block"
                      title={item}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
                {category.categoryItems.length > 5 && (
                  <li>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-xs text-primary hover:underline block mt-1"
                    >
                      View all...
                    </Link>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No sub-topics
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t flex justify-between items-center bg-muted/20 -mx-6 -mb-6 px-6 py-4 rounded-b-md">
        <div className="text-sm text-muted-foreground">
          Explore more topics in our full catalog
        </div>
        <Link
          href="/categories"
          className="text-sm font-medium text-primary hover:underline"
        >
          View All Categories &rarr;
        </Link>
      </div>
    </div>
  );
}
