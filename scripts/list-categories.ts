import mongoose from "mongoose";
import { Category } from "../models/Category";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function listCategories() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const categories = await Category.find({}, "name");
    console.log(
      "Categories found:",
      categories.map((c) => c.name)
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

listCategories();
