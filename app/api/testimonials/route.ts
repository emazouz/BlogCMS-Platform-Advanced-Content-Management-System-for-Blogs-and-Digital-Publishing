import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import Testimonial from "@/models/Testimonial";

export async function GET() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, role, content, rating } = body;

    // Basic validation
    if (!name || !role || !content || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTestimonial = await Testimonial.create({
      name,
      role,
      content,
      rating,
      isApproved: true, // Auto-approve for now as requested, specific approval logic can be added later
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, // Generate avatar based on name
    });

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
