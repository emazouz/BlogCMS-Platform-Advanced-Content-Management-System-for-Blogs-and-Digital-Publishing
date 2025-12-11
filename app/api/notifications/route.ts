import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongoose";
import Notification from "@/models/Notification";
import { User, IUser } from "@/models/User";

// GET: Fetch notifications for the current user
export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find notifications for this user
    const query = { recipient: session.user.id };

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST: Create a notification (Admin only)
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { recipientId, title, message, type, link, broadcast } = body;

    await dbConnect();

    if (broadcast) {
      const users = await User.find({}, "_id");
      const notifications = users.map((user: IUser) => ({
        recipient: user._id,
        title,
        message,
        type: type || "info",
        link,
        read: false,
      }));
      await Notification.insertMany(notifications);
      return NextResponse.json(
        { message: `Sent to ${users.length} users` },
        { status: 201 }
      );
    }

    if (!recipientId) {
      return NextResponse.json(
        { error: "Recipient ID required" },
        { status: 400 }
      );
    }

    const newNotification = await Notification.create({
      recipient: recipientId,
      title,
      message,
      type: type || "info",
      link,
      read: false,
    });

    return NextResponse.json(
      { notification: newNotification },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

// PATCH: Mark read
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    await dbConnect();

    if (id) {
      // Mark single notification as read, verify ownership
      const notification = await Notification.findOneAndUpdate(
        { _id: id, recipient: session.user.id },
        { read: true },
        { new: true }
      );
      if (!notification) {
        return NextResponse.json(
          { error: "Notification not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ notification }, { status: 200 });
    } else {
      // Mark all as read for user
      await Notification.updateMany(
        { recipient: session.user.id, read: false },
        { read: true }
      );
      return NextResponse.json(
        { message: "All marked as read" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}

// DELETE: Clear notifications
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await dbConnect();

    if (id) {
      await Notification.findOneAndDelete({
        _id: id,
        recipient: session.user.id,
      });
    } else {
      await Notification.deleteMany({ recipient: session.user.id });
    }

    return NextResponse.json(
      { message: "Notification(s) deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting notifications:", error);
    return NextResponse.json(
      { error: "Failed to delete notifications" },
      { status: 500 }
    );
  }
}
