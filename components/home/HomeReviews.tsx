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

export default function HomeReviews({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-900/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            What Our Readers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers and creators who are already sharing
            their stories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((review) => (
            <div
              key={review._id}
              className="group relative bg-white dark:bg-zinc-950 p-8 rounded-2xl border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 text-primary/10 h-12 w-12 group-hover:text-primary/20 transition-colors pointer-events-none" />

              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={cn(
                      "transition-colors",
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-zinc-200 dark:text-zinc-800"
                    )}
                  />
                ))}
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed mb-8 relative z-10">
                "{review.content}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border border-border">
                  <Image
                    src={
                      review.avatar ||
                      `https://ui-avatars.com/api/?name=${review.name}&background=random`
                    }
                    alt={review.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{review.name}</h4>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
