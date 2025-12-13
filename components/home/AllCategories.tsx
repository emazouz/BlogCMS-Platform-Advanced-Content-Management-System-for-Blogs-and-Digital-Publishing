"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Folder, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 bg-zinc-50/50 dark:bg-zinc-900/50 border-y border-zinc-200/50 dark:border-zinc-800/50">
      <div className="wrapper">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight text-zinc-900 dark:text-zinc-50">
              Explore Categories
            </h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-lg">
              Browse content by topic
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4 md:-ml-6 py-4">
            {categories.map((category) => (
              <div
                key={category._id}
                className="pl-4 md:pl-6 min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%]"
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-500/30">
                        <Folder size={48} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {typeof category.postCount === "number"
                          ? `${category.postCount} Posts`
                          : "Explore"}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
