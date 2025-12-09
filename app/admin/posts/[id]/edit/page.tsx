import connectToDatabase from "@/lib/db/mongoose";
import { Post } from "@/models/Post";
// import { updatePost } from "@/lib/actions/post.actions"; // Removed unused import assignment
import EditPostForm from "./EditPostForm";
import { notFound } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectToDatabase();
  const post = await Post.findById(id);

  if (!post) {
    notFound();
  }

  // Pass serialization-friendly object
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <EditPostForm post={JSON.parse(JSON.stringify(post))} />
    </div>
  );
}
