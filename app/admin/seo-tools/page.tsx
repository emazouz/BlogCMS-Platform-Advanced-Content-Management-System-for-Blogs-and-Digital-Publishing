"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  BarChart2,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Hash,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SeoToolsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "",
    metaDescription: "",
    googleVerification: "",
  });

  // Preview Tool State
  const [preview, setPreview] = useState({
    title: "How to Build a Blog with Next.js",
    url: "https://example.com/blog/build-nextjs-blog",
    description:
      "Learn how to build a high-performance blog using Next.js 14, Tailwind CSS, and MongoDB. A complete comprehensive guide for developers.",
  });

  // Keyword Tool State
  const [keywordText, setKeywordText] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (data.settings?.seo) {
        setSeoSettings({
          metaTitle: data.settings.seo.metaTitle || "",
          metaDescription: data.settings.seo.metaDescription || "",
          googleVerification: data.settings.seo.googleVerification || "",
        });
      }
    } catch (error) {
      console.error("Error fetching SEO settings:", error);
      toast.error("Failed to load SEO settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSeoSettings = async () => {
    // Validation
    if (seoSettings.metaTitle && seoSettings.metaTitle.length > 60) {
      toast.error("Meta title should be 60 characters or less");
      return;
    }
    if (
      seoSettings.metaDescription &&
      seoSettings.metaDescription.length > 160
    ) {
      toast.error("Meta description should be 160 characters or less");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seo: seoSettings }),
      });
      if (response.ok) {
        toast.success("SEO defaults saved successfully!");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  // Enhanced keyword analysis with useMemo for performance
  const keywordAnalysis = useMemo(() => {
    if (!keywordText || !targetKeyword) {
      return {
        density: 0,
        wordCount: 0,
        keywordCount: 0,
        sentences: 0,
        readability: 0,
        avgWordsPerSentence: 0,
      };
    }

    const text = keywordText.toLowerCase();
    const keyword = targetKeyword.toLowerCase();

    // Word analysis
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const wordCount = words.length;

    // Keyword count (exact and partial matches)
    const keywordCount = words.filter((w) => w.includes(keyword)).length;

    // Density calculation
    const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

    // Sentence analysis
    const sentences = text
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;
    const avgWordsPerSentence = sentences > 0 ? wordCount / sentences : 0;

    // Simple readability score (Flesch Reading Ease approximation)
    // Higher score = easier to read (0-100 scale)
    const readability =
      sentences > 0
        ? Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence))
        : 0;

    return {
      density,
      wordCount,
      keywordCount,
      sentences,
      readability,
      avgWordsPerSentence,
    };
  }, [keywordText, targetKeyword]);

  const getDensityStatus = () => {
    const { density } = keywordAnalysis;
    if (density === 0)
      return {
        label: "No data",
        variant: "secondary" as const,
        icon: AlertCircle,
      };
    if (density > 2.5)
      return {
        label: "Too high",
        variant: "destructive" as const,
        icon: AlertCircle,
      };
    if (density >= 0.5)
      return {
        label: "Optimal",
        variant: "default" as const,
        icon: CheckCircle2,
      };
    return {
      label: "Too low",
      variant: "secondary" as const,
      icon: AlertCircle,
    };
  };

  const getReadabilityStatus = () => {
    const { readability } = keywordAnalysis;
    if (readability >= 60)
      return { label: "Easy", color: "text-green-600 dark:text-green-400" };
    if (readability >= 30)
      return {
        label: "Moderate",
        color: "text-yellow-600 dark:text-yellow-400",
      };
    return { label: "Difficult", color: "text-red-600 dark:text-red-400" };
  };

  const densityStatus = getDensityStatus();
  const readabilityStatus = getReadabilityStatus();

  // Character count helpers
  const titleLength = preview.title.length;
  const descriptionLength = preview.description.length;
  const settingsTitleLength = seoSettings.metaTitle.length;
  const settingsDescLength = seoSettings.metaDescription.length;

  const getCharCountColor = (length: number, max: number, optimal: number) => {
    if (length === 0) return "text-muted-foreground";
    if (length > max) return "text-destructive";
    if (length >= optimal) return "text-green-600 dark:text-green-400";
    return "text-yellow-600 dark:text-yellow-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SEO Tools</h1>
          <p className="text-muted-foreground mt-1">
            Optimize your site for search engines
          </p>
        </div>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="settings">
            <Globe className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Search className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="analyzer">
            <BarChart2 className="h-4 w-4 mr-2" />
            Analyzer
          </TabsTrigger>
        </TabsList>

        {/* Global SEO Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Global SEO Defaults
              </CardTitle>
              <CardDescription>
                Set default meta tags for your entire site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="metaTitle">Default Meta Title</Label>
                  <span
                    className={`text-xs font-medium ${getCharCountColor(
                      settingsTitleLength,
                      60,
                      50
                    )}`}
                  >
                    {settingsTitleLength}/60
                  </span>
                </div>
                <Input
                  id="metaTitle"
                  type="text"
                  value={seoSettings.metaTitle}
                  onChange={(e) =>
                    setSeoSettings({
                      ...seoSettings,
                      metaTitle: e.target.value,
                    })
                  }
                  placeholder="Your Site Name - Tagline"
                  maxLength={70}
                />
                <p className="text-xs text-muted-foreground">
                  Optimal: 50-60 characters. Displays in search results.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="metaDescription">
                    Default Meta Description
                  </Label>
                  <span
                    className={`text-xs font-medium ${getCharCountColor(
                      settingsDescLength,
                      160,
                      150
                    )}`}
                  >
                    {settingsDescLength}/160
                  </span>
                </div>
                <Textarea
                  id="metaDescription"
                  value={seoSettings.metaDescription}
                  onChange={(e) =>
                    setSeoSettings({
                      ...seoSettings,
                      metaDescription: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="A brief description of your site..."
                  maxLength={170}
                />
                <p className="text-xs text-muted-foreground">
                  Optimal: 150-160 characters. Appears below title in search.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleVerification">
                  Google Site Verification Code
                </Label>
                <Input
                  id="googleVerification"
                  type="text"
                  value={seoSettings.googleVerification}
                  onChange={(e) =>
                    setSeoSettings({
                      ...seoSettings,
                      googleVerification: e.target.value,
                    })
                  }
                  placeholder="google-site-verification=..."
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Get this from Google Search Console to verify ownership
                </p>
              </div>

              <Button
                onClick={saveSeoSettings}
                disabled={saving}
                className="w-full sm:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Defaults"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Google SERP Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Google Search Preview
              </CardTitle>
              <CardDescription>
                See how your page will appear in Google search results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="previewTitle">Page Title</Label>
                    <span
                      className={`text-xs font-medium ${getCharCountColor(
                        titleLength,
                        60,
                        50
                      )}`}
                    >
                      {titleLength}/60
                    </span>
                  </div>
                  <Input
                    id="previewTitle"
                    type="text"
                    value={preview.title}
                    onChange={(e) =>
                      setPreview({ ...preview, title: e.target.value })
                    }
                    placeholder="Page Title"
                    maxLength={70}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="previewDescription">Meta Description</Label>
                    <span
                      className={`text-xs font-medium ${getCharCountColor(
                        descriptionLength,
                        160,
                        150
                      )}`}
                    >
                      {descriptionLength}/160
                    </span>
                  </div>
                  <Textarea
                    id="previewDescription"
                    value={preview.description}
                    onChange={(e) =>
                      setPreview({ ...preview, description: e.target.value })
                    }
                    placeholder="Meta Description"
                    rows={3}
                    maxLength={170}
                  />
                </div>
              </div>

              {/* SERP Preview */}
              <div className="p-6 rounded-lg border bg-card">
                <div className="max-w-[600px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        Example Site
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {preview.url}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1 mb-1">
                    {preview.title || "Page Title"}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {preview.description ||
                      "Page meta description will appear here..."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keyword Density Analyzer Tab */}
        <TabsContent value="analyzer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                Content SEO Analyzer
              </CardTitle>
              <CardDescription>
                Analyze your content for SEO optimization and readability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={keywordText}
                      onChange={(e) => setKeywordText(e.target.value)}
                      placeholder="Paste your content here..."
                      rows={12}
                      className="resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="keyword">Target Keyword</Label>
                    <Input
                      id="keyword"
                      type="text"
                      value={targetKeyword}
                      onChange={(e) => setTargetKeyword(e.target.value)}
                      placeholder="e.g. nextjs"
                    />
                  </div>

                  {/* Keyword Density Card */}
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Keyword Density
                          </span>
                          <Badge
                            variant={densityStatus.variant}
                            className="gap-1"
                          >
                            <densityStatus.icon className="h-3 w-3" />
                            {densityStatus.label}
                          </Badge>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span
                            className={`text-4xl font-bold ${
                              keywordAnalysis.density > 2.5
                                ? "text-destructive"
                                : keywordAnalysis.density >= 0.5
                                ? "text-green-600 dark:text-green-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            {keywordAnalysis.density.toFixed(2)}%
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              Recommended
                            </span>
                            <span className="font-medium">0.5% - 2.5%</span>
                          </div>
                          <div className="h-2 bg-background rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                keywordAnalysis.density > 2.5
                                  ? "bg-destructive"
                                  : keywordAnalysis.density >= 0.5
                                  ? "bg-green-600"
                                  : "bg-muted-foreground"
                              }`}
                              style={{
                                width: `${Math.min(
                                  keywordAnalysis.density * 20,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content Statistics */}
                  {keywordText && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Content Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Type className="h-4 w-4" />
                            <span>Total Words</span>
                          </div>
                          <span className="font-medium">
                            {keywordAnalysis.wordCount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Hash className="h-4 w-4" />
                            <span>Keyword Count</span>
                          </div>
                          <span className="font-medium">
                            {keywordAnalysis.keywordCount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>Sentences</span>
                          </div>
                          <span className="font-medium">
                            {keywordAnalysis.sentences}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <BarChart2 className="h-4 w-4" />
                            <span>Avg Words/Sentence</span>
                          </div>
                          <span className="font-medium">
                            {keywordAnalysis.avgWordsPerSentence.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm pt-2 border-t">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            <span>Readability</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${readabilityStatus.color}`}
                            >
                              {readabilityStatus.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({keywordAnalysis.readability.toFixed(0)}/100)
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
