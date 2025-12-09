import mongoose, { Schema, model, models, Document } from "mongoose";

export interface ISubscriber extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  status: "active" | "unsubscribed";
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    status: {
      type: String,
      enum: ["active", "unsubscribed"],
      default: "active",
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
    },
  },
  {
    timestamps: false,
  }
);

SubscriberSchema.index({ email: 1 });

export const Subscriber =
  models.Subscriber || model<ISubscriber>("Subscriber", SubscriberSchema);
