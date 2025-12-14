"use client";

import { useState, useEffect, useCallback } from "react";
import { MediaUploader } from "@/components/admin/media/MediaUploader";
import { MediaGrid, MediaItem } from "@/components/admin/media/MediaGrid";
import {
  RefreshCw,
  Image as ImageIcon,
  Upload,
  HardDrive,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function MediaPage() {
  const [images, setImages] = useState<MediaItem[]>([]);
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

  // Calculate stats
  const totalSize = images.reduce((sum, img) => sum + (img.size || 0), 0);
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground mt-1">
            Manage your blog images and assets ({images.length} files)
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchImages}
          title="Refresh library"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Files
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {images.length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Storage Used
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {formatBytes(totalSize)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <HardDrive className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Recent Upload
              </p>
              <p className="text-lg font-bold text-foreground mt-1 line-clamp-1">
                {images.length > 0
                  ? images[0]?.filename || "N/A"
                  : "No uploads yet"}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="library">
            <FolderOpen className="h-4 w-4 mr-2" />
            Library
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload New Image
              </CardTitle>
              <CardDescription>
                Upload images to your media library. Supported formats: JPG, PNG,
                GIF, WebP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaUploader onUploadComplete={fetchImages} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Library Tab */}
        <TabsContent value="library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                Recent Uploads
              </CardTitle>
              <CardDescription>
                Browse and manage your uploaded media files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaGrid images={images} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
