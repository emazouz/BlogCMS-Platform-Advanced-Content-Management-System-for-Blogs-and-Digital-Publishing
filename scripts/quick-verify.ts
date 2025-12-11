import mongoose from "mongoose";
import { User } from "../models/User";
import path from "path";
import dotenv from "dotenv";

const __dirname = path.resolve();
dotenv.config({ path: path.resolve(__dirname, ".env.local") });

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const user = await User.findOne({ email: "admin@example.com" });
    if (user) {
      console.log("CHECK_USER_IMAGE:", user.image);
      console.log("CHECK_USER_DATA:", JSON.stringify(user, null, 2));
    } else {
      console.log("User not found");
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
verify();
