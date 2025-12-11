import mongoose, { Schema, Model, Document } from "mongoose";

export interface INotification extends Document {
  recipient?: string; // If null, global notification
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info",
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
