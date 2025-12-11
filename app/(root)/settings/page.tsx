"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Loader2,
  User,
  Bell,
  Shield,
  Save,
  Mail,
  Smartphone,
  Megaphone,
  AlertTriangle,
  Upload,
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    notificationPreferences: {
      email: true,
      push: true,
      marketing: false,
    },
    image: "",
  });

  useEffect(() => {
    fetchSettings();
  }, [session]);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/user/settings");
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.user.name || "",
          bio: data.user.bio || "",
          location: data.user.location || "",
          notificationPreferences: {
            email: data.user.notificationPreferences?.email ?? true,
            push: data.user.notificationPreferences?.push ?? true,
            marketing: data.user.notificationPreferences?.marketing ?? false,
          },
          image: data.user.image || "",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (section: string, field: string, value: any) => {
    if (section === "root") {
      setFormData((prev) => ({ ...prev, [field]: value }));
    } else if (section === "notificationPreferences") {
      setFormData((prev) => ({
        ...prev,
        notificationPreferences: {
          ...prev.notificationPreferences,
          [field]: value,
        },
      }));
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large (max 5MB)");
      return;
    }

    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const json = await res.json();
        setFormData((prev) => ({ ...prev, image: json.url }));
        toast.success("Image uploaded successfully");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to upload image");
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Settings updated successfully");
        update();
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-2">
            Settings
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your profile, preferences, and account security.
          </p>
        </div>

        <Tabs
          defaultValue="profile"
          className="w-full space-y-8"
          onValueChange={setActiveTab}
        >
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px] h-12 p-1 bg-muted/50 rounded-xl relative">
              <TabsTrigger
                value="profile"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Account</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <form
            onSubmit={handleSubmit}
            className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
          >
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid gap-6">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Public Profile</CardTitle>
                    <CardDescription>
                      This information will be displayed publicly on your
                      profile.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                          <AvatarImage
                            src={formData.image}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                            {formData.name?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          {isUploading ? (
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          ) : (
                            <Upload className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileSelect}
                          disabled={isUploading}
                        />
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <Label>Profile Picture</Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                          >
                            {isUploading
                              ? "Uploading..."
                              : "Upload New Picture"}
                          </Button>
                          {formData.image && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, image: "" }))
                              }
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <p className="text-[0.8rem] text-muted-foreground">
                          JPG, GIF or PNG. 5MB max.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleChange("root", "name", e.target.value)
                          }
                          className="bg-muted/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g. San Francisco, CA"
                          value={formData.location}
                          onChange={(e) =>
                            handleChange("root", "location", e.target.value)
                          }
                          className="bg-muted/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Share a little bit about yourself..."
                        className="resize-none min-h-[120px] bg-muted/30"
                        value={formData.bio}
                        onChange={(e) =>
                          handleChange("root", "bio", e.target.value)
                        }
                      />
                      <p className="text-[0.8rem] text-muted-foreground text-right">
                        {formData.bio?.length || 0}/500
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 divide-y">
                  <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-full text-primary mt-1">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor="email-notifs"
                          className="text-base font-medium"
                        >
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about your account activity and
                          security.
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="email-notifs"
                      checked={formData.notificationPreferences.email}
                      onCheckedChange={(checked) =>
                        handleChange(
                          "notificationPreferences",
                          "email",
                          checked
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-4 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-500/10 rounded-full text-blue-500 mt-1">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor="push-notifs"
                          className="text-base font-medium"
                        >
                          Push Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive real-time push notifications on your device.
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="push-notifs"
                      checked={formData.notificationPreferences.push}
                      onCheckedChange={(checked) =>
                        handleChange("notificationPreferences", "push", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-4 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-orange-500/10 rounded-full text-orange-500 mt-1">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor="marketing-notifs"
                          className="text-base font-medium"
                        >
                          Marketing Emails
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new features, tips, and special
                          offers.
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="marketing-notifs"
                      checked={formData.notificationPreferences.marketing}
                      onCheckedChange={(checked) =>
                        handleChange(
                          "notificationPreferences",
                          "marketing",
                          checked
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>
                    Review your account information and security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="flex gap-2">
                      <Input
                        value={session?.user?.email || ""}
                        disabled
                        className="bg-muted"
                      />
                      <Button variant="outline" disabled>
                        Change
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your email address is managed via your login provider.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/30 shadow-sm bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-destructive/80">
                    Irreversible actions related to your account.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-destructive/20 rounded-lg bg-background">
                    <div className="space-y-1">
                      <p className="font-medium text-destructive">
                        Delete Account
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data.
                      </p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Floating Save Button */}
            <div className="fixed bottom-8 right-8 z-50 animate-in fade-in zoom-in duration-300">
              <Button
                size="lg"
                className="shadow-xl rounded-full px-8 h-14 bg-primary text-primary-foreground hover:scale-105 transition-transform"
                disabled={isSaving}
                type="submit"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </div>
  );
}
