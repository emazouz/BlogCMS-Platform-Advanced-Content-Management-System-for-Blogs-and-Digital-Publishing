"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, ControllerRenderProps } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/actions/post.actions";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Image as ImageIcon } from "lucide-react";
import AdminTopNavBar from "@/components/admin/AdminTopNavBar";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
}

interface Tag {
  _id: string;
  name: string;
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | FileList;
  status: "draft" | "published" | "scheduled" | "archived";
  publishedAt: string;
  scheduledFor: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  category: string;
  tags: string[];
}

export default function CreatePostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      status: "draft",
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      tags: [],
    },
  });

  const title = watch("title");

  // Fetch Categories and Tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/tags"),
        ]);
        const catData = await catRes.json();
        const tagData = await tagRes.json();
        setCategories(catData);
        setAvailableTags(tagData);
      } catch (error) {
        toast.error("Failed to load categories/tags");
      }
    };
    fetchData();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      setValue("slug", slug);
    }
  }, [title, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      let imageUrl = data.featuredImage;

      // Handle file upload if it's a FileList
      if (
        data.featuredImage instanceof FileList &&
        data.featuredImage.length > 0
      ) {
        const file = data.featuredImage[0];
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!response.ok) throw new Error("Failed to upload image");

        const uploadData = await response.json();
        imageUrl = uploadData.url;
      }

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "tags") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "featuredImage") {
          // Ensure we send the URL string, not the FileList
          if (typeof imageUrl === "string") {
            formData.append(key, imageUrl);
          }
        } else if (value) {
          formData.append(key, value as string);
        }
      });

      await createPost(formData);
      toast.success("Post created successfully");
      router.push("/admin/posts");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <AdminTopNavBar
        title="Create New Post"
        description="Write and publish your content"
        onBack={() => router.back()}
        onSave={handleSubmit(onSubmit)}
        onSaveDraft={() => setValue("status", "draft")}
        isSaving={isSubmitting}
        saveLabel="Publish"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                {...register("title", { required: "Title is required" })}
                placeholder="Enter post title"
                className="text-lg font-medium"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Slug</label>
              <Input
                {...register("slug", { required: "Slug is required" })}
                className="bg-gray-50 font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Excerpt</label>
              <textarea
                {...register("excerpt")}
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Brief summary of your post..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <div className="prose-editor">
                <Controller
                  name="content"
                  control={control}
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<FormData, "content">;
                  }) => (
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </Card>

          {/* SEO Section */}
          <Card className="p-6 space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
                <SearchIcon className="h-4 w-4" />
              </div>
              SEO Settings
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Meta Title</label>
                <Input
                  {...register("metaTitle")}
                  placeholder="SEO optimized title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Meta Description</label>
                <textarea
                  {...register("metaDescription")}
                  className="w-full min-h-[80px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Description for search engines..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Focus Keyword</label>
                <Input
                  {...register("focusKeyword")}
                  placeholder="Main keyword"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <h2 className="font-semibold text-gray-900">Publishing</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                {...register("status")}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Publish Date</label>
              <div className="relative">
                <Input
                  type="datetime-local"
                  {...register("publishedAt")}
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <h2 className="font-semibold text-gray-900">Organization</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                {...register("category")}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="p-3 border rounded-md bg-white max-h-40 overflow-y-auto space-y-2">
                {availableTags.map((tag) => (
                  <label key={tag._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={tag._id}
                      {...register("tags")}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{tag.name}</span>
                  </label>
                ))}
                {availableTags.length === 0 && (
                  <p className="text-xs text-gray-500">No tags found</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Featured Image</h2>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                {...register("featuredImage")}
              />
              <div className="h-40 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                {watch("featuredImage") &&
                ((typeof watch("featuredImage") === "string" &&
                  watch("featuredImage")) ||
                  (watch("featuredImage") instanceof FileList &&
                    (watch("featuredImage") as any).length > 0)) ? (
                  <img
                    src={
                      watch("featuredImage") instanceof FileList
                        ? URL.createObjectURL(
                            (watch("featuredImage") as any)[0]
                          )
                        : (watch("featuredImage") as string)
                    }
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-xs">Select an image to preview</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
