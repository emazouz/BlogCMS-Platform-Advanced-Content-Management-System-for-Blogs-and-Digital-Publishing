"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash } from "lucide-react";
import { ICategory } from "@/models/Category";

interface CategoriesContentProps {
  categories: ICategory[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function CategoriesContent({
  categories,
}: CategoriesContentProps) {
  return (
    <div className="min-h-screen font-sans">
      {/* HERO SECTION */}
      <section className="relative h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden mb-12">
        <Image
          src="https://picsum.photos/seed/library/1920/800"
          alt="Categories Hero"
          fill
          className="object-cover brightness-[0.3]"
          priority
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white pt-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-semibold tracking-wider mb-6 uppercase">
              Browse our collection
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 drop-shadow-lg">
              EXPLORE TOPICS
            </h1>
            <p className="text-xl md:text-3xl text-zinc-200 max-w-3xl mx-auto font-light drop-shadow-md leading-relaxed">
              Dive into our diverse collection of stories, guides, and insights.
              Find exactly what sparks your curiosity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <div className="wrapper pb-24">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <motion.div key={category._id.toString()} variants={itemVariants}>
              <Link
                href={`/categories/${category.slug}`}
                className="block group h-full"
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/50 hover:-translate-y-2 overflow-hidden flex flex-col">
                  {/* Category Image */}
                  <div className="relative w-full h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                    <img
                      src={
                        category.image ||
                        `https://picsum.photos/seed/${category.slug}/800/600`
                      }
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 z-20 p-2.5 bg-background/90 backdrop-blur-md rounded-xl text-primary shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Hash className="h-5 w-5" />
                    </div>
                  </div>

                  <CardHeader className="pb-3 pt-6">
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-base mt-2">
                      {category.description ||
                        "Discover articles and guides in this category."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    {category.categoryItems &&
                    category.categoryItems.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {category.categoryItems.slice(0, 4).map((item, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs px-2.5 py-1 hover:bg-primary/10 transition-colors"
                          >
                            {item}
                          </Badge>
                        ))}
                        {category.categoryItems.length > 4 && (
                          <Badge
                            variant="outline"
                            className="text-xs px-2.5 py-1"
                          >
                            +{category.categoryItems.length - 4} more
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic pl-1">
                        Explore articles
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
