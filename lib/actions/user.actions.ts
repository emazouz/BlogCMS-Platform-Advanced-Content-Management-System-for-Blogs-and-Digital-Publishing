"use server";

import { User } from "@/models/User";
import connectDB from "../db/mongoose";


interface RegisterUserParams {
  name: string;
  email: string;
  password: string;
}

export async function registerUser(params: RegisterUserParams) {
  try {
    await connectDB();

    const { name, email, password } = params;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return { error: "User already exists with this email" };
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: "author", // Default role
    });

    return { success: true, userId: JSON.parse(JSON.stringify(newUser._id)) };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user" };
  }
}
