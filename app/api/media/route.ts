import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { resources } = await cloudinary.search
      .expression("folder:blog-images")
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute();

    const images = resources.map((file: any) => ({
      id: file.public_id,
      url: file.secure_url,
      width: file.width,
      height: file.height,
      format: file.format,
      createdAt: file.created_at,
    }));

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}
