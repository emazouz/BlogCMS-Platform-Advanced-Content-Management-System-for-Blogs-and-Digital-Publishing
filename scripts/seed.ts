import { User } from "@/models/User";
import mongoose from "mongoose";

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    await mongoose.connect(MONGODB_URI);
    console.log("🌱 Seeding database...");

    // تنظيف البيانات القديمة
    await User.deleteMany({});

    // إنشاء مستخدمين

    const admin = await User.create({
      email: "admin@example.com",
      password: "password123",
      name: "Admin User",
      role: "admin",
      isActive: true,
    });

    const user = await User.create({
      email: "user@example.com",
      password: "password123",
      name: "Regular User",
      role: "author",
      isActive: true,
    });

    console.log("✅ Admin created successfully: ", admin);
    console.log("✅ User created successfully: ", user);
    console.log("✅ Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.log("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
