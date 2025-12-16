"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Post } from "@/types/post";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState, useCallback } from "react";

export default function Hero({ posts }: { posts: Post[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  if (!posts || posts.length === 0) return null;

  // Chunk posts into groups of 5
  const chunkSize = 5;
  const slides = [];
  for (let i = 0; i < posts.length; i += chunkSize) {
    slides.push(posts.slice(i, i + chunkSize));
  }

  // If we have fewer than 5 posts total, just show one slide with what we have
  if (slides.length === 0) return null;

  return (
    <div className="relative pb-24 pt-8">
      {/* Hero Header */}
      <div className="text-center mb-10 relative z-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 mb-3">
          Featured Stories
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover the most popular articles and insights from our community of
          writers.
        </p>
      </div>

      <div className="wrapper relative z-10 group">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {slides.map((slidePosts, slideIndex) => {
              // For each slide, we need 1 large post and up to 4 grid posts
              const largePost = slidePosts[0];
              const gridPosts = slidePosts.slice(1, 5);

              return (
                <div className="flex-[0_0_100%] min-w-0" key={slideIndex}>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto lg:h-[500px]">
                    {/* Left Side (2x2 Grid) - Spans 2 columns on large screens */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                      {gridPosts.length > 0 ? (
                        gridPosts.map((post) => (
                          <Link
                            key={post._id}
                            href={`/posts/${post.slug}`}
                            className="group/item relative rounded-xl overflow-hidden h-60 lg:h-auto border border-zinc-200 dark:border-zinc-800 shadow-sm"
                          >
                            <div className="absolute inset-0">
                              <Image
                                src={
                                  post.featuredImage ||
                                  `https://picsum.photos/seed/${post.slug}/800/400`
                                }
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            </div>
                            <div className="absolute inset-0 p-4 flex flex-col justify-between items-start">
                              <span
                                className={cn(
                                  "px-3 py-1 rounded text-xs font-bold text-white shadow-sm",
                                  "bg-blue-600"
                                )}
                              >
                                {post.category || "General"}
                              </span>
                              <h3
                                className="text-white text-lg font-bold leading-tight group-hover/item:text-primary-100 transition-colors line-clamp-2 text-right w-full"
                                dir="rtl"
                              >
                                {post.title}
                              </h3>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="col-span-2 flex items-center justify-center text-muted-foreground">
                          No posts available
                        </div>
                      )}
                    </div>

                    {/* Right Side (Large Vertical Card) - Spans 1 column */}
                    {largePost && (
                      <div className="lg:col-span-1 h-60 lg:h-auto">
                        <Link
                          href={`/posts/${largePost.slug}`}
                          className="group/item relative block w-full h-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm"
                        >
                          <div className="absolute inset-0">
                            <Image
                              src={
                                largePost.featuredImage ||
                                `https://picsum.photos/seed/${largePost.slug}/800/400`
                              }
                              alt={largePost.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                          </div>
                          <div className="absolute inset-0 p-6 flex flex-col justify-between items-start">
                            <span
                              className={cn(
                                "px-3 py-1 rounded text-sm font-bold text-white shadow-sm",
                                "bg-blue-600"
                              )}
                            >
                              {largePost.category || "General"}
                            </span>
                            <h3
                              className="text-white text-2xl font-bold leading-tight group-hover/item:text-primary-100 transition-colors text-right w-full"
                              dir="rtl"
                            >
                              {largePost.title}
                            </h3>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                index === selectedIndex
                  ? "bg-orange-500 w-6" // Active state
                  : "bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400"
              )}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Hero Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 lg:h-32 w-full overflow-hidden pointer-events-none z-0 opacity-10 dark:opacity-5">
        <svg
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
}
