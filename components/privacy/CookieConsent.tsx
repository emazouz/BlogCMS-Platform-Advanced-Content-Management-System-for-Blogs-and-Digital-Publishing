"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-background border-t border-border p-4 md:p-6 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground flex-1 pr-8">
          <h3 className="text-foreground font-semibold mb-1">
            We value your privacy
          </h3>
          <p>
            We use cookies to enhance your browsing experience, serve
            personalized ads or content, and analyze our traffic. By clicking
            "Accept All", you consent to our use of cookies. Read our{" "}
            <Link
              href="/cookie-policy"
              className="text-primary hover:underline font-medium"
            >
              Cookie Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" onClick={declineCookies}>
            Decline
          </Button>
          <Button onClick={acceptCookies}>Accept All</Button>
          <button
            onClick={() => setIsVisible(false)}
            className="md:hidden absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
