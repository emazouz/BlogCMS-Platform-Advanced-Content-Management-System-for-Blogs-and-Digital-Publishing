import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IPageView extends Document {
  _id: mongoose.Types.ObjectId;
  post?: mongoose.Types.ObjectId;
  path: string;
  views: number;
  uniqueVisitors: number;
  date: Date;
  sessionIds?: string[]; // Track unique session IDs for better visitor counting
  createdAt?: Date;
  updatedAt?: Date;
}

const PageViewSchema = new Schema<IPageView>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      index: true,
    },
    path: {
      type: String,
      required: true,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    uniqueVisitors: {
      type: Number,
      default: 0,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    sessionIds: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for better query performance
PageViewSchema.index({ post: 1, date: -1 });
PageViewSchema.index({ path: 1, date: -1 });
PageViewSchema.index({ date: -1, views: -1 }); // For sorting by date and views
PageViewSchema.index({ date: 1 }); // For date range queries

// Static methods for common queries
PageViewSchema.statics = {
  /**
   * Get total views and visitors for a date range
   */
  async getStatsForDateRange(
    startDate: Date,
    endDate?: Date
  ): Promise<{ totalViews: number; totalVisitors: number }> {
    const matchStage: any = { date: { $gte: startDate } };
    if (endDate) {
      matchStage.date.$lte = endDate;
    }

    const result = await this.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalVisitors: { $sum: "$uniqueVisitors" },
        },
      },
    ]);

    return {
      totalViews: result[0]?.totalViews || 0,
      totalVisitors: result[0]?.totalVisitors || 0,
    };
  },

  /**
   * Get views for a specific post
   */
  async getPostViews(
    postId: string | mongoose.Types.ObjectId
  ): Promise<number> {
    const result = await this.aggregate([
      { $match: { post: new mongoose.Types.ObjectId(postId.toString()) } },
      { $group: { _id: null, total: { $sum: "$views" } } },
    ]);

    return result[0]?.total || 0;
  },

  /**
   * Increment view count for a path/post
   */
  async incrementView(
    path: string,
    sessionId?: string,
    postId?: string | mongoose.Types.ObjectId
  ): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const query: any = { path, date: today };
    if (postId) {
      query.post = new mongoose.Types.ObjectId(postId.toString());
    }

    const existingRecord = await this.findOne(query);

    if (existingRecord) {
      // Update existing record
      const isNewVisitor =
        sessionId && !existingRecord.sessionIds?.includes(sessionId);

      const update: any = {
        $inc: { views: 1 },
      };

      if (isNewVisitor && sessionId) {
        update.$addToSet = { sessionIds: sessionId };
        update.$inc.uniqueVisitors = 1;
      }

      await this.updateOne(query, update);
    } else {
      // Create new record
      await this.create({
        path,
        post: postId
          ? new mongoose.Types.ObjectId(postId.toString())
          : undefined,
        date: today,
        views: 1,
        uniqueVisitors: sessionId ? 1 : 0,
        sessionIds: sessionId ? [sessionId] : [],
      });
    }
  },
};

export const PageView =
  models.PageView || model<IPageView>("PageView", PageViewSchema);
