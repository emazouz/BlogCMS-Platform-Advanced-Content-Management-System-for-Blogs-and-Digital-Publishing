import mongoose from "mongoose";
import { Category } from "@/models/Category";

// Category image mappings with relevant Unsplash images
const categoryImages: Record<string, string> = {
  Technical:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
  "Health & Beauty":
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop",
  Education:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
  Business:
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=600&fit=crop",
  Travel:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
  Sports:
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
  Entertainment:
    "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&h=600&fit=crop",
  Fashion:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop",
  Games:
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
  Kitchen:
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop",
  "Stories & Novels":
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop",
  Islamic:
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=600&fit=crop",
  Commerce:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
  General:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
  Home: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
  Technology:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
  Lifestyle:
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop",
  Food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
};

async function seedCategoryImages() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("🌱 Updating category images...");

    // Fetch all categories
    const categories = await Category.find({});
    console.log(`📦 Found ${categories.length} categories`);

    let updatedCount = 0;

    for (const category of categories) {
      // Find matching image for category name
      const imageUrl = categoryImages[category.name];

      if (imageUrl) {
        category.image = imageUrl;
        await category.save();
        console.log(`✅ Updated ${category.name} with image`);
        updatedCount++;
      } else {
        // Use a default general image for categories not in the mapping
        category.image =
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop";
        await category.save();
        console.log(
          `⚠️  Updated ${category.name} with default image (no specific mapping found)`
        );
        updatedCount++;
      }
    }

    console.log(
      `\n✅ Successfully updated ${updatedCount} categories with images`
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating category images:", error);
    process.exit(1);
  }
}

seedCategoryImages();
