import dotenv from "dotenv";
import mongoose from "mongoose";
import { FAQ } from "../models/FAQ"; // Assuming running from root with tsx

dotenv.config({ path: ".env.local" });

const faqs = [
  {
    question: "What is this platform about?",
    answer:
      "We are a next-generation publishing platform designed for writers who want to reach a global audience. We provide tools for creating beautiful, engaging content.",
    order: 1,
    isPublished: true,
  },
  {
    question: "How do I create an account?",
    answer:
      "Simply click on the 'Sign Up' button in the top right corner. You can register with your email or use a social login provider like Google or GitHub.",
    order: 2,
    isPublished: true,
  },
  {
    question: "Is it free to start writing?",
    answer:
      "Yes, it is completely free to create an account and publish your stories. We believe in democratizing access to digital publishing.",
    order: 3,
    isPublished: true,
  },
  {
    question: "Can I monetize my content?",
    answer:
      "Absolutely. We offer a Partner Program where you can earn revenue based on the engagement your articles receive. You can also enable tipping.",
    order: 4,
    isPublished: true,
  },
  {
    question: "What kind of content can I publish?",
    answer:
      "You can publish articles on a wide range of topics including technology, lifestyle, business, and personal stories. We encourage authentic and high-quality writing.",
    order: 5,
    isPublished: true,
  },
  {
    question: "How does the editor work?",
    answer:
      "Our editor is a rich-text block-based editor. It supports markdown shortcuts, image embedding, code blocks, and more to make writing a breeze.",
    order: 6,
    isPublished: true,
  },
  {
    question: "Can I import my posts from other platforms?",
    answer:
      "Yes, we support importing content from Medium, WordPress, and other major platforms. You can find this option in your settings.",
    order: 7,
    isPublished: true,
  },
  {
    question: "Is there a community guideline?",
    answer:
      "Yes, we expect all users to adhere to our community guidelines which promote respect, safety, and constructive dialogue. Hate speech is strictly prohibited.",
    order: 8,
    isPublished: true,
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach out to our support team via the 'Contact Us' page or email us directly at support@example.com. We typically respond within 24 hours.",
    order: 9,
    isPublished: true,
  },
  {
    question: "Can I customize my profile?",
    answer:
      "Yes, you can upload a profile picture, add a bio, link your social media accounts, and even customize the accent color of your profile page.",
    order: 10,
    isPublished: true,
  },
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    await FAQ.deleteMany({});
    console.log("Cleared existing FAQs.");

    await FAQ.insertMany(faqs);
    console.log("Seeded 10 FAQs successfully.");

    await mongoose.disconnect();
    console.log("Disconnected.");
  } catch (error) {
    console.error("Error seeding FAQs:", error);
    process.exit(1);
  }
}

seed();
