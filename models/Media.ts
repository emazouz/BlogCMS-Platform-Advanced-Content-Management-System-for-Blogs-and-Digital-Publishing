import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IMedia extends Document {
  _id: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number; // bytes
  width?: number;
  height?: number;
  url: string;
  altText?: string;
  caption?: string;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    url: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
    },
    caption: {
      type: String,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

MediaSchema.index({ uploadedBy: 1, createdAt: -1 });

export const Media = models.Media || model<IMedia>("Media", MediaSchema);
