"use client";

import { Copy, ExternalLink, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface MediaItem {
  id: string;
  url: string;
  width: number;
  height: number;
  format: string;
  createdAt: string;
}

interface MediaGridProps {
  images: MediaItem[];
  isLoading: boolean;
}

export function MediaGrid({ images, isLoading }: MediaGridProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <ImageIcon className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">No images found</h3>
        <p className="text-sm text-gray-500 mt-1">
          Upload an image to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
        >
          <Image
            src={image.url}
            alt="Media"
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => copyToClipboard(image.url, image.id)}
              className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-700 transition"
              title="Copy URL"
            >
              {copiedId === image.id ? (
                <span className="text-xs font-bold text-green-600">Copied</span>
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-700 transition"
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Info Badge */}
          <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
            {image.width}x{image.height} • {image.format.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
}
