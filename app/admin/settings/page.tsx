"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Globe,
  Share2,
  Code,
  Layout,
  Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    siteUrl: "",
    socials: {
      twitter: "",
      facebook: "",
      instagram: "",
      linkedin: "",
      github: "",
    },
    scripts: {
      header: "",
      footer: "",
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (data.settings) {
        setSettings({
          siteName: data.settings.siteName || "",
          siteDescription: data.settings.siteDescription || "",
          siteUrl: data.settings.siteUrl || "",
          socials: {
            twitter: data.settings.socials?.twitter || "",
            facebook: data.settings.socials?.facebook || "",
            instagram: data.settings.socials?.instagram || "",
            linkedin: data.settings.socials?.linkedin || "",
            github: data.settings.socials?.github || "",
          },
          scripts: {
            header: data.settings.scripts?.header || "",
            footer: data.settings.scripts?.footer || "",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section: string, field: string, value: string) => {
    if (section === "root") {
      setSettings((prev) => ({ ...prev, [field]: value }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof typeof prev] as any),
          [field]: value,
        },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <span className="sr-only">Loading settings...</span>
        <p className="text-muted-foreground mt-4">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your site details and preferences
          </p>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="general">
            <Layout className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="social">
            <Share2 className="h-4 w-4 mr-2" />
            Social
          </TabsTrigger>
          <TabsTrigger value="scripts">
            <Code className="h-4 w-4 mr-2" />
            Scripts
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                General Information
              </CardTitle>
              <CardDescription>
                Basic information about your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  type="text"
                  value={settings.siteName}
                  onChange={(e) =>
                    handleChange("root", "siteName", e.target.value)
                  }
                  placeholder="My Awesome Blog"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) =>
                    handleChange("root", "siteDescription", e.target.value)
                  }
                  rows={3}
                  placeholder="A brief description of your site..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) =>
                    handleChange("root", "siteUrl", e.target.value)
                  }
                  placeholder="https://example.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Social Media Links
              </CardTitle>
              <CardDescription>
                Connect your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(settings.socials).map((platform) => (
                <div key={platform} className="space-y-2">
                  <Label htmlFor={platform} className="capitalize">
                    {platform}
                  </Label>
                  <Input
                    id={platform}
                    type="url"
                    value={
                      settings.socials[
                        platform as keyof typeof settings.socials
                      ]
                    }
                    onChange={(e) =>
                      handleChange("socials", platform, e.target.value)
                    }
                    placeholder={`https://${platform}.com/username`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Scripts Tab */}
        <TabsContent value="scripts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Custom Scripts
              </CardTitle>
              <CardDescription>
                Add custom scripts for analytics, tracking, or other
                integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="headerScripts">
                  Header Scripts (GTM, Analytics)
                </Label>
                <Textarea
                  id="headerScripts"
                  value={settings.scripts.header}
                  onChange={(e) =>
                    handleChange("scripts", "header", e.target.value)
                  }
                  rows={8}
                  placeholder="<script>...</script>"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Scripts added here will be injected into the &lt;head&gt;
                  section
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerScripts">Footer Scripts</Label>
                <Textarea
                  id="footerScripts"
                  value={settings.scripts.footer}
                  onChange={(e) =>
                    handleChange("scripts", "footer", e.target.value)
                  }
                  rows={8}
                  placeholder="<script>...</script>"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Scripts added here will be injected before the closing
                  &lt;/body&gt; tag
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
