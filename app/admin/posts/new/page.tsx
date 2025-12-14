"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createPost } from "@/lib/actions/post.actions";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Image as ImageIcon,
  Search,
  ArrowLeft,
  Save,
  FileText,
  FolderTree,
  Tag,
  Eye,
  Upload,
  X,
  Check,
  Clock,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

// Types
interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Tag {
  _id: string;
  name: string;
  slug: string;
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

type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

// Constants
const AUTO_SAVE_DELAY = 3000; // 3 seconds
const LOCAL_STORAGE_KEY = "draft_post";

// Utility functions
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getAutoSaveStatusConfig(status: AutoSaveStatus) {
  const configs = {
    idle: {
      icon: Clock,
      text: "Auto-save ready",
      color: "text-muted-foreground",
    },
    saving: {
      icon: Clock,
      text: "Saving draft...",
      color: "text-blue-600 dark:text-blue-400",
    },
    saved: {
      icon: Check,
      text: "Draft saved",
      color: "text-green-600 dark:text-green-400",
    },
    error: {
      icon: AlertCircle,
      text: "Save failed",
      color: "text-destructive",
    },
  };
  return configs[status];
}

// Sub-components
function AutoSaveIndicator({ status }: { status: AutoSaveStatus }) {
  const config = getAutoSaveStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 text-sm ${config.color}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{config.text}</span>
    </div>
  );
}

function CharacterCount({
  text,
  max,
  label,
}: {
  text: string;
  max: number;
  label: string;
}) {
  const count = text?.length || 0;
  const percentage = (count / max) * 100;
  const isNearLimit = percentage > 80;
  const isOverLimit = percentage > 100;

  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`font-medium ${
          isOverLimit
            ? "text-destructive"
            : isNearLimit
            ? "text-yellow-600 dark:text-yellow-400"
            : "text-muted-foreground"
        }`}
      >
        {count} / {max}
      </span>
    </div>
  );
}

function SEOScore({
  title,
  description,
  keyword,
}: {
  title: string;
  description: string;
  keyword: string;
}) {
  const calculateScore = () => {
    let score = 0;
    if (title && title.length >= 30 && title.length <= 60) score += 33;
    if (description && description.length >= 120 && description.length <= 160)
      score += 33;
    if (keyword && title.toLowerCase().includes(keyword.toLowerCase()))
      score += 34;
    return score;
  };

  const score = calculateScore();
  const getScoreColor = () => {
    if (score >= 70) return "text-green-600 dark:text-green-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-destructive";
  };

  return (
    <div className="p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">SEO Score</span>
        <span className={`text-sm font-bold ${getScoreColor()}`}>{score}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            score >= 70
              ? "bg-green-600"
              : score >= 40
              ? "bg-yellow-600"
              : "bg-destructive"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

// Main component
export default function CreatePostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");
  const [showSEOPanel, setShowSEOPanel] = useState(false);

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedDraft = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
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
  const status = watch("status");
  const featuredImage = watch("featuredImage");
  const metaTitle = watch("metaTitle");
  const metaDescription = watch("metaDescription");
  const focusKeyword = watch("focusKeyword");
  const content = watch("content");
  const excerpt = watch("excerpt");

  // Load draft from localStorage on mount
  useEffect(() => {
    if (!hasLoadedDraft.current) {
      try {
        const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          Object.entries(draft).forEach(([key, value]) => {
            if (key !== "featuredImage") {
              setValue(key as keyof FormData, value as any);
            }
          });
          toast.success("Draft loaded from auto-save");
        }
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
      hasLoadedDraft.current = true;
    }
  }, [setValue]);

  // Fetch categories and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/tags"),
        ]);

        if (!catRes.ok || !tagRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const catData = await catRes.json();
        const tagData = await tagRes.json();

        setCategories(catData.categories || catData || []);
        setAvailableTags(tagData.tags || tagData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load categories/tags");
      }
    };
    fetchData();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const slug = generateSlug(title);
      setValue("slug", slug, { shouldDirty: true });
    }
  }, [title, setValue]);

  // Handle image preview
  useEffect(() => {
    if (featuredImage instanceof FileList && featuredImage.length > 0) {
      const file = featuredImage[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof featuredImage === "string" && featuredImage) {
      setImagePreview(featuredImage);
    } else {
      setImagePreview("");
    }
  }, [featuredImage]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!isDirty) return;

    setAutoSaveStatus("saving");

    try {
      const formData = {
        title: watch("title"),
        slug: watch("slug"),
        excerpt: watch("excerpt"),
        content: watch("content"),
        metaTitle: watch("metaTitle"),
        metaDescription: watch("metaDescription"),
        focusKeyword: watch("focusKeyword"),
        category: watch("category"),
        tags: watch("tags"),
        status: watch("status"),
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
      setAutoSaveStatus("saved");

      setTimeout(() => {
        setAutoSaveStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Auto-save failed:", error);
      setAutoSaveStatus("error");
    }
  }, [isDirty, watch]);

  // Trigger auto-save on form changes
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    if (isDirty) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSave();
      }, AUTO_SAVE_DELAY);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [title, content, excerpt, autoSave, isDirty]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      let imageUrl = data.featuredImage;

      // Handle file upload
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
          if (typeof imageUrl === "string") {
            formData.append(key, imageUrl);
          }
        } else if (value) {
          formData.append(key, value as string);
        }
      });

      await createPost(formData);

      // Clear auto-saved draft
      localStorage.removeItem(LOCAL_STORAGE_KEY);

      toast.success("Post created successfully");
      router.push("/admin/posts");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setValue("status", "draft");
    await handleSubmit(onSubmit)();
  };

  const handlePublish = async () => {
    setValue("status", "published");
    await handleSubmit(onSubmit)();
  };

  const clearDraft = () => {
    if (confirm("Clear the current draft? This action cannot be undone.")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts">
            <Button variant="ghost" size="icon" aria-label="Back to posts">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Create New Post
            </h1>
            <p className="text-muted-foreground mt-1">
              Write and publish your content
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AutoSaveIndicator status={autoSaveStatus} />
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handlePublish} disabled={isSubmitting} size="lg">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Publishing...
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-card rounded-lg border border-border p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                Title *
                <Badge variant="outline" className="text-xs">
                  {title?.length || 0} characters
                </Badge>
              </label>
              <Input
                {...register("title", { required: "Title is required" })}
                placeholder="Enter an engaging post title"
                className="text-lg font-medium"
              />
              {errors.title && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                Slug
                <Badge variant="secondary" className="text-xs">
                  Auto-generated
                </Badge>
              </label>
              <Input
                {...register("slug", { required: "Slug is required" })}
                className="bg-muted font-mono text-sm"
                placeholder="post-url-slug"
              />
              {errors.slug && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Excerpt
              </label>
              <textarea
                {...register("excerpt")}
                className="w-full min-h-[100px] p-3 rounded-lg border border-input bg-background text-foreground text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                placeholder="Brief summary of your post (recommended for SEO)"
              />
              <CharacterCount
                text={watch("excerpt") || ""}
                max={160}
                label="Optimal for search previews"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center justify-between">
                <span>Content *</span>
                <Badge variant="outline" className="text-xs">
                  {content?.length || 0} characters
                </Badge>
              </label>
              <div className="prose-editor border border-border rounded-lg overflow-hidden">
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: "Content is required" }}
                  render={({ field }) => (
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.content && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.content.message}
                </p>
              )}
            </div>
          </div>

          {/* SEO Section */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSEOPanel(!showSEOPanel)}
              className="w-full p-6 flex items-center justify-between hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  SEO Settings
                </h2>
              </div>
              <Badge variant="secondary">
                {showSEOPanel ? "Hide" : "Show"}
              </Badge>
            </button>

            {showSEOPanel && (
              <div className="px-6 pb-6 space-y-4 border-t border-border pt-6">
                <SEOScore
                  title={metaTitle || title}
                  description={metaDescription}
                  keyword={focusKeyword}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Meta Title
                  </label>
                  <Input
                    {...register("metaTitle")}
                    placeholder="SEO optimized title (leave empty to use post title)"
                  />
                  <CharacterCount
                    text={metaTitle || title || ""}
                    max={60}
                    label="Optimal: 50-60 characters"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Meta Description
                  </label>
                  <textarea
                    {...register("metaDescription")}
                    className="w-full min-h-[80px] p-3 rounded-lg border border-input bg-background text-foreground text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    placeholder="Description for search engines (120-160 characters)"
                  />
                  <CharacterCount
                    text={metaDescription || ""}
                    max={160}
                    label="Optimal: 120-160 characters"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Focus Keyword
                  </label>
                  <Input
                    {...register("focusKeyword")}
                    placeholder="Main keyword for this post"
                  />
                  {focusKeyword &&
                    title &&
                    !title
                      .toLowerCase()
                      .includes(focusKeyword.toLowerCase()) && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Keyword not found in title
                      </p>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 p-4 space-y-3">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={clearDraft}
                className="w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear auto-saved draft
              </button>
            </div>
          </div>

          {/* Publishing Card */}
          <div className="bg-card rounded-lg border border-border p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Publishing</h2>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Publish Date
              </label>
              <Input
                type="datetime-local"
                {...register("publishedAt")}
                className="w-full"
              />
            </div>

            {status === "scheduled" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Schedule For
                </label>
                <Input
                  type="datetime-local"
                  {...register("scheduledFor", {
                    required:
                      status === "scheduled"
                        ? "Schedule date is required"
                        : false,
                  })}
                  className="w-full"
                />
                {errors.scheduledFor && (
                  <p className="text-sm text-destructive">
                    {errors.scheduledFor.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Organization Card */}
          <div className="bg-card rounded-lg border border-border p-6 space-y-6">
            <div className="flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Organization</h2>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Category
              </label>
              <select
                {...register("category")}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
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
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </label>
              <div className="p-3 border border-border rounded-lg bg-background max-h-48 overflow-y-auto space-y-2">
                {availableTags.length > 0 ? (
                  availableTags.map((tag) => (
                    <label
                      key={tag._id}
                      className="flex items-center gap-2 hover:bg-accent/50 p-2 rounded transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={tag._id}
                        {...register("tags")}
                        className="rounded border-input text-primary focus:ring-ring"
                      />
                      <span className="text-sm text-foreground">
                        {tag.name}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No tags available
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="bg-card rounded-lg border border-border p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Featured Image</h2>
            </div>

            <div className="space-y-3">
              <div className="relative h-48 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30 overflow-hidden group">
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setValue("featuredImage", "");
                        setImagePreview("");
                      }}
                      className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-xs">Click to upload image</span>
                  </div>
                )}
              </div>

              <Input
                type="file"
                accept="image/*"
                {...register("featuredImage")}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
