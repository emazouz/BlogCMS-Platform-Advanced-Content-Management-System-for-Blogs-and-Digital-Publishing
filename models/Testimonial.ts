import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  isApproved: boolean;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    avatar: { type: String },
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Testimonial =
  models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
