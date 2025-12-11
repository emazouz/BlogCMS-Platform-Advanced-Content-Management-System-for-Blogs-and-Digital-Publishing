import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "editor" | "author";
  image?: string;
  bio?: string;
  location?: string;
  website?: string;
  socials?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    facebook?: string;
  };
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["admin", "editor", "author"],
      default: "author",
    },
    image: {
      type: String,
    },
    bio: String,
    location: String,
    website: String,
    socials: {
      twitter: String,
      github: String,
      linkedin: String,
      facebook: String,
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models?.User || model<IUser>("User", UserSchema);
