import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IAdSenseStats extends Document {
  _id: mongoose.Types.ObjectId;
  date: Date;
  impressions: number;
  clicks: number;
  earnings: number;
  ctr: number;
  rpm: number;
}

const AdSenseStatsSchema = new Schema<IAdSenseStats>({
  date: {
    type: Date,
    required: true,
    unique: true,
    index: true,
  },
  impressions: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  earnings: {
    type: Number,
    default: 0,
  },
  ctr: {
    type: Number,
    default: 0,
  },
  rpm: {
    type: Number,
    default: 0,
  },
});

export const AdSenseStats =
  models.AdSenseStats ||
  model<IAdSenseStats>("AdSenseStats", AdSenseStatsSchema);
