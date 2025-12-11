"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Bell, Send, Trash2 } from "lucide-react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  recipient?: string;
  type: string;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    recipientId: "",
    type: "info",
    link: "",
    broadcast: false,
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      // Silent error
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(
          formData.broadcast
            ? "Broadcast sent successfully"
            : "Notification sent successfully"
        );
        setFormData({
          title: "",
          message: "",
          recipientId: "",
          type: "info",
          link: "",
          broadcast: false,
        });
        fetchNotifications();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to send notification");
      }
    } catch (error) {
      toast.error("Failed to send notification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/notifications?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Deleted");
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (!session || session.user.role !== "admin") {
    return <div className="p-8 text-center text-red-500">Unauthorized</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Notification
            </CardTitle>
            <CardDescription>
              Send alerts to users or broadcast to everyone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Notification Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Notification content..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(val) =>
                      setFormData({ ...formData, type: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link (Optional)</Label>
                  <Input
                    id="link"
                    placeholder="/posts/..."
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <Checkbox
                    id="broadcast"
                    checked={formData.broadcast}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        broadcast: checked as boolean,
                        recipientId: "",
                      })
                    }
                  />
                  <Label
                    htmlFor="broadcast"
                    className="font-semibold cursor-pointer"
                  >
                    Broadcast to ALL Users
                  </Label>
                </div>
              </div>

              {!formData.broadcast && (
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient ID</Label>
                  <Input
                    id="recipient"
                    placeholder="User ID (e.g. 65c...)"
                    value={formData.recipientId}
                    onChange={(e) =>
                      setFormData({ ...formData, recipientId: e.target.value })
                    }
                    required={!formData.broadcast}
                  />
                  <p className="text-xs text-muted-foreground">
                    Copy ID from the Users page.
                  </p>
                </div>
              )}

              <Button className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Notification"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* History / List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest notifications sent (showing yours).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No notifications found
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{n.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {n.message}
                      </p>
                      <div className="flex gap-2 text-[10px] items-center text-muted-foreground">
                        <span
                          className={`px-1.5 py-0.5 rounded-full capitalize text-white
                                            ${
                                              n.type === "error"
                                                ? "bg-red-500"
                                                : n.type === "warning"
                                                ? "bg-yellow-500"
                                                : n.type === "success"
                                                ? "bg-green-500"
                                                : "bg-blue-500"
                                            }
                                        `}
                        >
                          {n.type}
                        </span>
                        <span>
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={() => handleDelete(n._id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
