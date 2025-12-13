import React from "react";
import { Category, ICategory } from "@/models/Category";
import connectDB from "@/lib/db/mongoose";
import CategoriesContent from "@/components/categories/CategoriesContent";

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

  return <CategoriesContent categories={categories} />;
}
