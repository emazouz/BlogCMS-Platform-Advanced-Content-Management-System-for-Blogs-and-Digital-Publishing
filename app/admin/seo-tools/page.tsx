"use client";

import { useState, useEffect } from "react";
import { Search, BarChart2, Globe, Save } from "lucide-react";

export default function SeoToolsPage() {
  const [loading, setLoading] = useState(true);
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
  const [density, setDensity] = useState(0);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (keywordText && targetKeyword) {
      const words = keywordText.toLowerCase().split(/\s+/);
      const count = words.filter((w) =>
        w.includes(targetKeyword.toLowerCase())
      ).length;
      setDensity((count / words.length) * 100);
    } else {
      setDensity(0);
    }
  }, [keywordText, targetKeyword]);

  const fetchSettings = async () => {
    try {
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
    } finally {
      setLoading(false);
    }
  };

  const saveSeoSettings = async () => {
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seo: seoSettings }),
      });
      if (response.ok) alert("SEO defaults saved!");
    } catch (error) {
      alert("Error saving settings");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SEO Tools</h1>
        <p className="text-gray-600 mt-1">
          Optimize your site for search engines
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Global SEO Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary-600" />
            Global SEO Defaults
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Meta Title
              </label>
              <input
                type="text"
                value={seoSettings.metaTitle}
                onChange={(e) =>
                  setSeoSettings({ ...seoSettings, metaTitle: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Meta Description
              </label>
              <textarea
                value={seoSettings.metaDescription}
                onChange={(e) =>
                  setSeoSettings({
                    ...seoSettings,
                    metaDescription: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Site Verification Code
              </label>
              <input
                type="text"
                value={seoSettings.googleVerification}
                onChange={(e) =>
                  setSeoSettings({
                    ...seoSettings,
                    googleVerification: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              />
            </div>
            <button
              onClick={saveSeoSettings}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
            >
              <Save className="h-4 w-4" />
              Save Defaults
            </button>
          </div>
        </div>

        {/* Google SERP Preview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-primary-600" />
            Google Search Preview
          </h2>
          <div className="space-y-4 mb-6">
            <input
              type="text"
              value={preview.title}
              onChange={(e) =>
                setPreview({ ...preview, title: e.target.value })
              }
              placeholder="Page Title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <textarea
              value={preview.description}
              onChange={(e) =>
                setPreview({ ...preview, description: e.target.value })
              }
              placeholder="Meta Description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="bg-white p-4 rounded border border-gray-100 shadow-sm">
            <div className="max-w-[600px] font-arial">
              <div className="text-sm text-[#202124] flex items-center mb-1">
                <div className="bg-gray-100 rounded-full p-1 mr-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <div className="text-[#202124] text-sm">Example Site</div>
                  <div className="text-[#5f6368] text-xs">{preview.url}</div>
                </div>
              </div>
              <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate">
                {preview.title || "Page Title"}
              </h3>
              <div className="text-sm text-[#4d5156] mt-1 leading-snug">
                {preview.description ||
                  "Page meta description will appear here..."}
              </div>
            </div>
          </div>
        </div>

        {/* Keyword Density Checker */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary-600" />
            Keyword Density Analyzer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <textarea
                value={keywordText}
                onChange={(e) => setKeywordText(e.target.value)}
                placeholder="Paste your content here..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Keyword
                </label>
                <input
                  type="text"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="e.g. nextjs"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">
                  Keyword Density
                </div>
                <div
                  className={`text-3xl font-bold ${
                    density > 2.5
                      ? "text-red-600"
                      : density > 0.5
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {density.toFixed(2)}%
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended density: 0.5% - 2.5%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
