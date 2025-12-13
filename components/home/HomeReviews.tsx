"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

interface HomeReviewsProps {
  testimonials: Testimonial[];
}

export default function HomeReviews({ testimonials }: HomeReviewsProps) {
  if (!testimonials?.length) return null;

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-900/30">
      <div className="wrapper">
        <header className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            What Our Readers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers and creators who are already sharing
            their stories.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial._id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const avatarSrc =
    testimonial.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      testimonial.name
    )}&background=random`;

  return (
    <article className="group relative bg-white dark:bg-zinc-950 p-8 rounded-2xl border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300">
      <Quote
        className="absolute top-6 right-6 text-primary/10 h-12 w-12 group-hover:text-primary/20 transition-colors pointer-events-none"
        aria-hidden="true"
      />

      <StarRating rating={testimonial.rating} />

      <blockquote className="text-muted-foreground text-lg leading-relaxed mb-8 relative z-10">
        "{testimonial.content}"
      </blockquote>

      <div className="flex items-center gap-4 mt-auto">
        <div className="relative h-12 w-12 rounded-full overflow-hidden border border-border flex-shrink-0">
          <img
            src={avatarSrc}
            alt={`${testimonial.name}'s avatar`}
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-foreground truncate">
            {testimonial.name}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {testimonial.role}
          </p>
        </div>
      </div>
    </article>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-1 mb-6"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={18}
          className={cn(
            "transition-colors",
            i < rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-zinc-200 dark:text-zinc-800"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
