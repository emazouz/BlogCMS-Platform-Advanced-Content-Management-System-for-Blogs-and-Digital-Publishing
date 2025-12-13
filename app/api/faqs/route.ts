import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { FAQ } from "@/models/FAQ";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDB();
    const faqs = await FAQ.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(faqs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    const faq = await FAQ.create(body);
    return NextResponse.json(faq);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create FAQ" },
      { status: 500 }
    );
  }
}
