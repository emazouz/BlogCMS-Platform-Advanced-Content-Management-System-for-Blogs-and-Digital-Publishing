import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { Subscriber } from "@/models/Subscriber";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const subscribers = await Subscriber.find({})
      .sort({ subscribedAt: -1 })
      .lean();

    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({
      email: email.toLowerCase(),
    });

    if (existingSubscriber) {
      // If already subscribed, we can just return success or a specific message
      // Returning success is often better for privacy/UX
      return NextResponse.json(
        { message: "You are already subscribed!" },
        { status: 200 }
      );
    }

    await Subscriber.create({ email: email.toLowerCase() });

    return NextResponse.json(
      { message: "Successfully subscribed to the newsletter!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error subscribing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
