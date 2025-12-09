import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IRating extends Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can only rate a post once
RatingSchema.index({ user: 1, post: 1 }, { unique: true });

export const Rating = models.Rating || model<IRating>("Rating", RatingSchema);
