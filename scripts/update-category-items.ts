import mongoose from "mongoose";
import { Category } from "../models/Category";

import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const categoryMappings: Record<string, string[]> = {
  Technical: [
    "Web Development",
    "AI & Machine Learning",
    "Cybersecurity",
    "Blockchain",
    "Cloud Computing",
  ],
  "Health & Beauty": [
    "Skincare",
    "Mental Health",
    "Fitness",
    "Nutrition",
    "Makeup Tips",
  ],
  Education: [
    "Online Courses",
    "Study Tips",
    "Scholarships",
    "Career Guidance",
    "E-Learning",
  ],
  Business: ["Startups", "Finance", "Marketing", "Leadership", "Market Trends"],
  Travel: [
    "Destinations",
    "Travel Tips",
    "Budget Travel",
    "Solo Travel",
    "Luxury Travel",
  ],
  Sports: ["Football", "Basketball", "Tennis", "Fitness Gear", "Esports"],
  Entertainment: ["Movies", "TV Shows", "Music", "Celebrity News", "Events"],
  Fashion: [
    "Trends",
    "Streetwear",
    "Luxury Brands",
    "Sustainable Fashion",
    "Accessories",
  ],
  Games: [
    "PC Gaming",
    "Console Gaming",
    "Mobile Games",
    "Reviews",
    "Walkthroughs",
  ],
  Kitchen: [
    "Recipes",
    "Baking",
    "Healthy Eating",
    "Kitchen Hacks",
    "Equipment",
  ],
  "Stories & Novels": [
    "Fiction",
    "Non-Fiction",
    "Short Stories",
    "Book Reviews",
    "Authors",
  ],
  Islamic: ["Quran", "Hadith", "History", "Lifestyle", "Events"],
  Commerce: [
    "E-commerce",
    "Retail",
    "Supply Chain",
    "Dropshipping",
    "Sales Strategies",
  ],
  General: [
    "Lifestyle",
    "Personal Development",
    "Opinions",
    "News",
    "Miscellaneous",
  ],
  Home: ["Design", "DIY", "Gardening", "Organization", "Smart Home"],
};

async function updateCategoryItems() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const [name, items] of Object.entries(categoryMappings)) {
      const result = await Category.updateOne(
        { name: name },
        { $set: { categoryItems: items } }
      );

      if (result.matchedCount > 0) {
        console.log(
          `Updated category: ${name} with items: ${items.join(", ")}`
        );
      } else {
        console.log(`Category not found: ${name}`);
      }
    }

    console.log("Migration completed successfully");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
}

updateCategoryItems();
