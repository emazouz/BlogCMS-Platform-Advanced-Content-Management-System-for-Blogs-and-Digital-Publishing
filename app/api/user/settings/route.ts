import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongoose";
import { User } from "@/models/User";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return safely (password is already excluded by schema select: false usually,
    // but explicit select is safer or just returning specific fields)
    const { password, ...userData } = user.toObject();

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      bio,
      location,
      website,
      socials,
      notificationPreferences,
      image,
    } = body;

    await dbConnect();

    // Prevent updating email/role/password via this route for security
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        name,
        bio,
        location,
        website,
        socials,
        notificationPreferences,
        image,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
