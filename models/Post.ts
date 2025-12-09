import mongoose, { Schema, model, models, Document } from "mongoose";
import slugify from "slugify";

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  status: "draft" | "published" | "scheduled" | "archived";
  publishedAt?: Date;
  scheduledFor?: Date;
  views: number;
  readingTime?: number;

  // Rating
  rating?: number;
  ratingCount?: number;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;

  // Relations
  author: mongoose.Types.ObjectId;
  category?: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    featuredImage: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled", "archived"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    scheduledFor: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number, // in minutes
    },

    // Rating
    rating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },

    // SEO Fields
    metaTitle: {
      type: String,
      maxlength: [70, "Meta title cannot exceed 70 characters"],
    },
    metaDescription: {
      type: String,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    focusKeyword: {
      type: String,
    },

    // Relations
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
PostSchema.pre("save", async function () {
  if (this.isModified("title")) {
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Check for unique slug
    while (
      await mongoose.models.Post.findOne({ slug, _id: { $ne: this._id } })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  // Calculate reading time (average 200 words per minute)
  if (this.isModified("content")) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }
});

// Indexes for better query performance

PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ author: 1 });
PostSchema.index({ category: 1 });
PostSchema.index({ tags: 1 });

export const Post = models.Post || model<IPost>("Post", PostSchema);
