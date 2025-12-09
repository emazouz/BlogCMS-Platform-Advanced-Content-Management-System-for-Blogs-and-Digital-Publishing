"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface MediaUploaderProps {
  onUploadComplete: () => void;
}

export function MediaUploader({ onUploadComplete }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Show preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        // Reset and notify
        setPreview(null);
        onUploadComplete();
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload image");
      } finally {
        setUploading(false);
        URL.revokeObjectURL(objectUrl);
      }
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-primary-500 bg-primary-50"
            : "border-gray-300 hover:border-gray-400"
        }
        ${uploading ? "pointer-events-none opacity-50" : ""}
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-2">
        {uploading ? (
          <>
            <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
            <p className="text-sm text-gray-500">Uploading...</p>
          </>
        ) : (
          <>
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <Upload className="h-6 w-6 text-gray-500" />
            </div>
            <p className="font-medium text-gray-900">
              {isDragActive
                ? "Drop the image here"
                : "Click or drag image to upload"}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP, GIF up to 5MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}
