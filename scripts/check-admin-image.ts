import dbConnect from "../lib/db/mongoose";
import { User } from "../models/User";

async function checkAdmin() {
  await dbConnect();
  const user = await User.findOne({ email: "admin@example.com" });
  if (user) {
    console.log("User found:", user.name);
    console.log("Image:", user.image);
    console.log("Full Object:", JSON.stringify(user.toObject(), null, 2));
  } else {
    console.log("User not found");
  }
  process.exit(0);
}

checkAdmin();
