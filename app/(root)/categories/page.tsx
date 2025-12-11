import React from "react";
import Link from "next/link";
import { Category, ICategory } from "@/models/Category";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, BookOpen } from "lucide-react";
import connectDB from "@/lib/db/mongoose";

export const metadata = {
  title: "Categories | DevBlog",
  description: "Explore our wide range of topics and categories",
};

async function getCategories() {
  await connectDB();
  const categories = await Category.find({}).sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(categories)) as ICategory[];
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Explore Topics
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Browse through our diverse collection of categories to find exactly
          what you're looking for.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            href={`/categories/${category.slug}`}
            key={category._id.toString()}
            className="block group h-full"
          >
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 group-hover:-translate-y-1 overflow-hidden">
              {/* Category Image */}
              <div className="relative w-full h-48 overflow-hidden">
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                <img
                  src={
                    category.image ||
                    `https://picsum.photos/seed/${category.slug}/800/600`
                  }
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 z-20 p-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-lg text-primary shadow-sm">
                  <Hash className="h-5 w-5" />
                </div>
              </div>

              <CardHeader className="pb-4">
                <CardTitle className="text-xl group-hover:text-primary transition-colors flex items-center justify-between">
                  {category.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {category.description ||
                    "Discover articles and guides in this category."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {category.categoryItems && category.categoryItems.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {category.categoryItems.slice(0, 4).map((item, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs group-hover:bg-secondary/80"
                      >
                        {item}
                      </Badge>
                    ))}
                    {category.categoryItems.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{category.categoryItems.length - 4} more
                      </Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No specific topics
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
