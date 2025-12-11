"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  Trash2,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Notification {
  _id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Poll every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(
          data.notifications.filter((n: Notification) => !n.read).length
        );
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const markAsRead = async (id?: string) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        if (id) {
          setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, read: true } : n))
          );
        } else {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          toast.success("All notifications marked as read");
        }
        setUnreadCount((prev) => (id ? Math.max(0, prev - 1) : 0));
      }
    } catch (error) {
      toast.error("Failed to update notification");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNotification = async (id?: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const url = id ? `/api/notifications?id=${id}` : "/api/notifications";
      const res = await fetch(url, { method: "DELETE" });

      if (res.ok) {
        if (id) {
          setNotifications((prev) => prev.filter((n) => n._id !== id));
          // Recalculate unread count if we deleted an unread one
          const wasUnread =
            notifications.find((n) => n._id === id)?.read === false;
          if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
          toast.success("Notification removed");
        } else {
          setNotifications([]);
          setUnreadCount(0);
          toast.success("All notifications cleared");
        }
      }
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                title="Mark all as read"
                onClick={() => markAsRead()}
                disabled={isLoading}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive"
                title="Clear all"
                onClick={(e) => deleteNotification(undefined, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={cn(
                    "flex gap-3 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer relative group",
                    !notification.read && "bg-muted/20"
                  )}
                  onClick={() => {
                    setIsOpen(false);
                    // Mark as read locally to update UI immediately
                    if (!notification.read) {
                      markAsRead(notification._id);
                    }
                  }}
                >
                  <Link
                    href={`/notifications/${notification._id}`}
                    className="absolute inset-0 z-10"
                  >
                    <span className="sr-only">View details</span>
                  </Link>
                  <div className="mt-1 relative z-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <p
                        className={cn(
                          "text-sm font-medium leading-none",
                          !notification.read && "font-bold"
                        )}
                      >
                        {notification.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    {notification.link && (
                      <Link
                        href={notification.link}
                        className="text-xs text-primary hover:underline block pt-1"
                      >
                        View details
                      </Link>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 absolute top-2 right-2 transition-opacity z-20"
                    onClick={(e) => deleteNotification(notification._id, e)}
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
