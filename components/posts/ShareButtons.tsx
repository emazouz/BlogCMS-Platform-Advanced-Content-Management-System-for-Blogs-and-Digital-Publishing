"use client";

import { Button } from "@/components/ui/button";
import {
  Facebook,
  Linkedin,
  Twitter,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  // URL might not be available during SSR, so we use a safe check or useEffect,
  // but for share links we can construct them.
  // Assuming strict origin is needed, we might need env var or window.location.
  // For now, let's assume a base URL or just partial if sharing libs handle it,
  // but usually full URL is best.
  // Let's rely on window.location in handler if possible, or pass baseUrl.
  // Using a placeholder domain if not provided.

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return `https://devblog.com/posts/${slug}`; // Fallback
  };

  const handleShare = (platform: string) => {
    const url = getShareUrl();
    const text = `Check out this article: ${title}`;
    let shareLink = "";

    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "width=600,height=400");
    }
  };

  const copyToClipboard = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-2">
        Share:
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("twitter")}
        className="hover:text-blue-400"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("facebook")}
        className="hover:text-blue-600"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("linkedin")}
        className="hover:text-blue-700"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={copyToClipboard}>
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <LinkIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
