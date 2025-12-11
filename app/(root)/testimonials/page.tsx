"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star, User, Briefcase, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  createdAt: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to load testimonials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit testimonial");

      const newTestimonial = await res.json();
      setTestimonials([newTestimonial, ...testimonials]);
      setFormData({ name: "", role: "", content: "", rating: 5 });
      toast.success("Success!", {
        description: "Your testimonial has been submitted.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to submit testimonial. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 md:px-6">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
        <div className="p-3 bg-primary/10 rounded-full text-primary mb-4">
          <Quote className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Loved by Developers
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Join thousands of developers who rely on us for their daily dose of
          tech insights and tutorials.
        </p>
      </div>

      {/* Testimonials Grid */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial._id}
              className="flex flex-col h-full bg-card hover:shadow-lg transition-all duration-300 border-muted group"
            >
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <Avatar className="h-12 w-12 border-2 border-primary/10 group-hover:border-primary/50 transition-colors">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="bg-primary/5 text-primary">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">
                      {testimonial.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {testimonial.role}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "fill-current"
                          : "text-muted/30"
                      }`}
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground italic leading-relaxed">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Submission Form */}
      <div className="max-w-2xl mx-auto bg-muted/30 p-8 rounded-xl border">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Share Your Experience</h2>
          <p className="text-muted-foreground">
            We'd love to hear from you! Leave a review to help others.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-9"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="role"
                  placeholder="Software Engineer"
                  className="pl-9"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= formData.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Review</Label>
            <Textarea
              id="content"
              placeholder="Tell us what you think..."
              className="resize-none min-h-[120px]"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Testimonial
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
