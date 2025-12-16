"use server";

import connectDB from "@/lib/db/mongoose";
import { Category } from "@/models/Category";

export interface NavbarCategory {
  _id: string;
  name: string;
  slug: string;
  categoryItems?: string[];
  description?: string;
  postCount?: number;
}

export async function getNavbarCategories(): Promise<NavbarCategory[]> {
  try {
    await connectDB();

    const categories = await Category.find({
      // filters if needed, e.g. showInNavbar: true (if added to schema later)
    })
      .select("name slug categoryItems description")
      .sort({ name: 1 })
      .lean();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching navbar categories:", error);
    return [];
  }
}
