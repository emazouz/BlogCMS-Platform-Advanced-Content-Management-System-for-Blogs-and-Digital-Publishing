import dotenv from "dotenv";
import mongoose from "mongoose";
import Testimonial from "../models/Testimonial";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const testimonials = [
  {
    name: "John Doe",
    role: "Software Engineer",
    content:
      "This blog has completely transformed the way I approach coding. The tutorials are in-depth and easy to follow.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    isApproved: true,
  },
  {
    name: "Jane Smith",
    role: "Product Manager",
    content:
      "I love the variety of topics covered here. From technical deep dives to soft skills, there's something for everyone.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    isApproved: true,
  },
  {
    name: "Mike Johnson",
    role: "DevOps Engineer",
    content:
      "The DevOps section is particularly strong. I've implemented several of the best practices mentioned here.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    isApproved: true,
  },
  {
    name: "Sarah Williams",
    role: "Frontend Developer",
    content:
      "Great resource for keeping up with the latest frontend trends. The React articles are top-notch.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    isApproved: true,
  },
  {
    name: "David Brown",
    role: "Backend Developer",
    content:
      "Solid backend architectural advice. Helped me scale my latest project significantly.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    isApproved: true,
  },
  {
    name: "Emily Davis",
    role: "UI/UX Designer",
    content:
      "Love the design insights. It helps developers understand the 'why' behind design decisions.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    isApproved: true,
  },
  {
    name: "Linear Grunt",
    role: "Junior Developer",
    content:
      "As a beginner, I find the explanations very clear and encouraging. A must-read for juniors.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Linear",
    isApproved: true,
  },
  {
    name: "Robert Wilson",
    role: "Full Stack Developer",
    content:
      "The bridge between frontend and backend concepts is handled beautifully here.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    isApproved: true,
  },
  {
    name: "Jessica Taylor",
    role: "Tech Lead",
    content:
      "I recommend this blog to my team constantly. High-quality content that triggers good discussions.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    isApproved: true,
  },
  {
    name: "William Moore",
    role: "System Admin",
    content:
      "Found some great troubleshooting tips for Linux server management.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=William",
    isApproved: true,
  },
  {
    name: "Ashley Anderson",
    role: "Mobile Developer",
    content:
      "The React Native tutorials saved me hours of debugging. Thank you!",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ashley",
    isApproved: true,
  },
  {
    name: "Brian Thomas",
    role: "Data Scientist",
    content:
      "Interesting take on data visualization tools. Would love to see more Python content.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brian",
    isApproved: true,
  },
  {
    name: "Megan Jackson",
    role: "Quality Assurance",
    content:
      "Testing strategies discussed here are very practical and easy to integrate.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Megan",
    isApproved: true,
  },
  {
    name: "Chris White",
    role: "Security Analyst",
    content: "Good awareness articles on web security vulnerabilities.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
    isApproved: true,
  },
  {
    name: "Amanda Harris",
    role: "Freelancer",
    content:
      "This blog helps me stay relevant in the fast-paced tech world. Invaluable for freelancers.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda",
    isApproved: true,
  },
  {
    name: "Kevin Miller",
    role: "Database Administrator",
    content:
      "The SQL optimization guides are lifesavers. Highly recommended for anyone dealing with large datasets.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin",
    isApproved: true,
  },
  {
    name: "Sophia Martinez",
    role: "Cloud Architect",
    content:
      "Excellent coverage of AWS and Azure services. Helped me clarify some complex architectural patterns.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
    isApproved: true,
  },
  {
    name: "Daniel Lee",
    role: "Machine Learning Engineer",
    content:
      "The AI section is surprisingly deep. Good balance between theory and practical application.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel",
    isApproved: true,
  },
  {
    name: "Laura Wilson",
    role: "Technical Writer",
    content:
      "I appreciate the clarity and structure of the articles. A great example of technical communication.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura",
    isApproved: true,
  },
  {
    name: "James Anderson",
    role: "Cybersecurity Specialist",
    content:
      "Solid advice on securing web applications. The practical examples are very helpful.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    isApproved: true,
  },
];

async function seedTestimonials() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    await Testimonial.deleteMany({});
    console.log("Cleared existing testimonials");

    await Testimonial.insertMany(testimonials);
    console.log("Seeded 15 testimonials successfully");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding testimonials:", error);
    process.exit(1);
  }
}

seedTestimonials();
