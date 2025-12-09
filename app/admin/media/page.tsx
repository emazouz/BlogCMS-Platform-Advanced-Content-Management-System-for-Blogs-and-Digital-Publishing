"use client";

import { useState, useEffect, useCallback } from "react";
import { MediaUploader } from "@/components/admin/media/MediaUploader";
import { MediaGrid } from "@/components/admin/media/MediaGrid";
import { RefreshCw } from "lucide-react";

export default function MediaPage() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/media");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">
            Manage your blog images and assets
          </p>
        </div>
        <button
          onClick={fetchImages}
          className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
          title="Refresh library"
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Upload New Image
        </h2>
        <MediaUploader onUploadComplete={fetchImages} />
      </div>

      {/* Gallery Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Uploads</h2>
        <MediaGrid images={images} isLoading={isLoading} />
      </div>
    </div>
  );
}
