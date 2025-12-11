import mongoose from "mongoose";
import { Category } from "../models/Category";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function verifyUpdates() {
  try {
    if (!process.env.MONGODB_URI) {
      console.log("No MONGODB_URI found");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);

    const cat = await Category.findOne({ name: "Technical" });
    if (cat) {
      const output = `Technical items: ${JSON.stringify(cat.categoryItems)}`;
      console.log(output);
      fs.writeFileSync("verification.txt", output);
    } else {
      const output = "Technical category not found";
      console.log(output);
      fs.writeFileSync("verification.txt", output);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

verifyUpdates();
