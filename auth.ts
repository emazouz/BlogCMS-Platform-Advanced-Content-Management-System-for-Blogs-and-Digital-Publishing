import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod"; // You might need to install zod if not present, or use standard validation
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db/mongoose";
import { User } from "@/models/User";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          await dbConnect();
          const user = await User.findOne({ email }).select("+password");
          if (!user) return null;

          // Check if user is admin
          if (user.role !== "admin") return null;

          if (!user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
