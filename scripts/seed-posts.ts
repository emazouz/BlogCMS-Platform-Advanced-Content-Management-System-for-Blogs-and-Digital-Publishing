import mongoose from "mongoose";
import { User } from "@/models/User";
import { Category } from "@/models/Category";
import { Tag } from "@/models/Tag";
import { Post } from "@/models/Post";
import { Comment } from "@/models/Comment";
import slugify from "slugify";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const categoriesData = [
  { name: "Technical", description: "All things tech, coding, and gadgets." },
  {
    name: "Health & Beauty",
    description: "Tips for a healthy lifestyle and beauty trends.",
  },
  {
    name: "Education",
    description: "Learning resources, tutorials, and academic guides.",
  },
  {
    name: "Business",
    description: "Business strategies, markets, and corporate news.",
  },
  { name: "Travel", description: "Destinations, travel tips, and adventures." },
  {
    name: "Sports",
    description: "Updates on football, basketball, and global sports.",
  },
  {
    name: "Entertainment",
    description: "Movies, music, celebrities, and fun.",
  },
  { name: "Fashion", description: "Latest trends, styles, and fashion shows." },
  { name: "Games", description: "Video games, reviews, and esports." },
  { name: "Kitchen", description: "Recipes, cooking tips, and culinary arts." },
  {
    name: "Stories & Novels",
    description: "Fiction, short stories, and literature.",
  },
  { name: "Islamic", description: "Islamic teachings, history, and culture." },
  { name: "Commerce", description: "E-commerce, trading, and economy." },
  { name: "General", description: "General topics and discussions." },
  { name: "Home", description: "Home related topics" }, // Added as requested, though usually a nav item
];

const tagsData = [
  "Coding",
  "AI",
  "Skincare",
  "Fitness",
  "Online Learning",
  "Startup",
  "Marketing",
  "Solo Travel",
  "Football",
  "Movies",
  "Streetwear",
  "RPG",
  "Baking",
  "Fantasy",
  "History",
  "Dropshipping",
  "Life Hacks",
  "Tech News",
  "Healthy Living",
  "E-commerce",
  "Daily Life",
];

const LONG_CONTENT = `
<h2>Introduction</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>

<h2>Deep Dive</h2>
<p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>

<blockquote>"Transformation is not about improving, it's about re-thinking."</blockquote>

<h3>Key Points</h3>
<ul>
  <li>First important point about the topic that needs detailed attention.</li>
  <li>Second crucial aspect to consider carefully for future growth.</li>
  <li>Third major breakthrough in this area that changed everything.</li>
  <li>Detailed analysis of the impact on the industry.</li>
  <li>Future predictions and trends for the next decade.</li>
</ul>

<h2>Analysis</h2>
<p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.</p>

<p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.</p>

<p>Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

<h2>Conclusion</h2>
<p>Final thoughts on the subject matter. It is clear that significant progress has been made, but challenges remain. We must assume a proactive stance to address these issues effectively. Thank you for reading this comprehensive guide. We hope it helps you in your journey.</p>
`.repeat(3); // >3000 chars

async function seedPosts() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
      console.log("🌱 Connected to database for seeding posts...");
    }

    // 1. Get or Create Admin User
    let admin = await User.findOne({ email: "admin@example.com" });
    if (!admin) {
      console.log("⚠️ Admin user not found. Creating default admin...");
      admin = await User.create({
        email: "admin@example.com",
        password: "password123", // In a real app this would be hashed
        name: "Admin User",
        role: "admin",
        isActive: true,
      });
    }

    // 2. Create Categories
    console.log("Creating categories...");
    const categories = [];
    for (const catData of categoriesData) {
      let category = await Category.findOne({ name: catData.name });
      if (!category) {
        category = await Category.create({
          ...catData,
          slug: slugify(catData.name, { lower: true, strict: true }),
        });
        console.log(`✅ Created category: ${category.name}`);
      }
      categories.push(category);
    }

    // 3. Create Tags
    console.log("Creating tags...");
    const tags = [];
    for (const tagName of tagsData) {
      let tag = await Tag.findOne({ name: tagName });
      if (!tag) {
        tag = await Tag.create({
          name: tagName,
          slug: slugify(tagName, { lower: true, strict: true }),
        });
        console.log(`✅ Created tag: ${tag.name}`);
      }
      tags.push(tag);
    }

    // 4. Create Posts
    console.log("Creating posts...");

    // Helper to get random item from array
    const getRandom = <T>(arr: T[]): T =>
      arr[Math.floor(Math.random() * arr.length)];
    const getRandomSubset = <T>(arr: T[], count: number): T[] => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    for (let i = 1; i <= 15; i++) {
      const category = getRandom(categories);
      const postTags = getRandomSubset(tags, 3);

      const title = `${category.name} Guide: The Ultimate Master Class #${i}`;
      const slug = slugify(title, { lower: true, strict: true });

      // Remove existing post with same slug
      await Post.deleteOne({ slug });

      const createdPost = await Post.create({
        title,
        slug,
        content: LONG_CONTENT,
        excerpt: `Discover currently trends in ${
          category.name
        }. This comprehensive guide covers everything you need to know about ${postTags
          .map((t) => t.name)
          .join(", ")} and more.`,
        metaTitle: title,
        metaDescription: `Read our comprehensive guide on ${category.name}.`,
        category: category._id,
        tags: postTags.map((t) => t._id), // Correcting to pass ObjectIds
        author: admin._id,
        status: "published",
        featuredImage: `https://picsum.photos/seed/${slug}/800/400`,
        views: Math.floor(Math.random() * 5000),
        readingTime: 15, // Approx for >3000 chars
        publishedAt: new Date(),
        rating: 0,
        ratingCount: 0,
      });

      // 5. Create Comments & Ratings
      const numComments = Math.floor(Math.random() * 8) + 3; // 3 to 10 comments
      let totalRating = 0;
      let ratingCount = 0;

      for (let j = 0; j < numComments; j++) {
        const hasRating = Math.random() > 0.3; // 70% chance of rating
        const ratingValue = hasRating
          ? Math.floor(Math.random() * 3) + 3
          : undefined; // 3-5 stars

        await Comment.create({
          post: createdPost._id,
          content: `This is comment #${
            j + 1
          }. Really insightful article about ${
            category.name
          }! I loved the part about ${postTags[0]?.name}.`,
          authorName: `User ${Math.floor(Math.random() * 100)}`,
          authorEmail: `user${i}_${j}@example.com`,
          status: "approved",
          rating: ratingValue,
          createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 10000000)
          ),
        });

        if (ratingValue) {
          totalRating += ratingValue;
          ratingCount++;
        }
      }

      // Update Post stats
      if (ratingCount > 0) {
        createdPost.rating = parseFloat((totalRating / ratingCount).toFixed(1));
        createdPost.ratingCount = ratingCount;
        await createdPost.save();
      }

      console.log(`✅ Created Post: ${title} (${ratingCount} ratings)`);
    }

    console.log("✅ Seed script completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedPosts();
