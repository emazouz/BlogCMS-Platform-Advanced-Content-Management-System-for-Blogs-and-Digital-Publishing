"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  Trash2,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  _id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      const data = await response.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id?: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { id, read: true } : { read: true }),
      });

      if (response.ok) {
        if (id) {
          setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, read: true } : n))
          );
        } else {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteNotification = async (id?: string) => {
    if (
      !confirm(id ? "Delete this notification?" : "Delete ALL notifications?")
    ) {
      return;
    }

    try {
      const url = id ? `/api/notifications?id=${id}` : "/api/notifications";

      const response = await fetch(url, {
        method: "DELETE",
      });

      if (response.ok) {
        if (id) {
          setNotifications((prev) => prev.filter((n) => n._id !== id));
        } else {
          setNotifications([]);
        }
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary-600" />
            Notifications
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your system alerts and updates
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => markAsRead()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition"
          >
            <Check className="h-4 w-4" />
            Mark all read
          </button>
          <button
            onClick={() => deleteNotification()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
          >
            <Trash2 className="h-4 w-4" />
            Clear all
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`text-sm font-medium px-3 py-1.5 rounded-md transition ${
              filter === "all"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`text-sm font-medium px-3 py-1.5 rounded-md transition ${
              filter === "unread"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Unread
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 flex gap-4 hover:bg-gray-50 transition ${
                  !notification.read ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3
                        className={`text-sm font-medium ${
                          !notification.read ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-md transition"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {notification.link && (
                    <a
                      href={notification.link}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block"
                    >
                      View details →
                    </a>
                  )}
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium mt-2 ml-4"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
