import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  status: "pending" | "approved" | "spam" | "trash";
  authorName: string;
  authorEmail: string;
  authorWebsite?: string;
  authorAvatar?: string;
  authorId?: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  parent?: mongoose.Types.ObjectId;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      maxlength: [2000, "Comment cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "spam", "trash"],
      default: "pending",
    },
    authorName: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    authorEmail: {
      type: String,
      required: [true, "Author email is required"],
      lowercase: true,
      trim: true,
    },
    authorWebsite: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ post: 1, status: 1, createdAt: -1 });

export const Comment =
  models.Comment || model<IComment>("Comment", CommentSchema);
