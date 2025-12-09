import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IPageView extends Document {
  _id: mongoose.Types.ObjectId;
  post?: mongoose.Types.ObjectId;
  path: string;
  views: number;
  uniqueVisitors: number;
  date: Date;
}

const PageViewSchema = new Schema<IPageView>({
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  path: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  uniqueVisitors: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
});

PageViewSchema.index({ post: 1, date: -1 });
PageViewSchema.index({ path: 1, date: -1 });

export const PageView =
  models.PageView || model<IPageView>("PageView", PageViewSchema);
