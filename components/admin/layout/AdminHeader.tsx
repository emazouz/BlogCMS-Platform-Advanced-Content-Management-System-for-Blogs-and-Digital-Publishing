"use client";

import {
  Bell,
  Search,
  ExternalLink,
  Menu,
  Moon,
  Sun,
  Command,
  FileText,
  Image as ImageIcon,
  Settings,
  Users,
  BarChart3,
  MessageSquare,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { SidebarContent } from "@/components/admin/layout/AdminSidebar";
import type {
  AdminStats,
  AdminNotification,
} from "@/lib/actions/admin-stats.actions";

// Types
interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
  stats: AdminStats;
  notifications: AdminNotification[];
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  keywords: string[];
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "new-post",
    title: "New Post",
    description: "Create a new blog post",
    icon: FileText,
    href: "/admin/posts/new",
    keywords: ["post", "create", "write", "new", "article"],
  },
  {
    id: "posts",
    title: "All Posts",
    description: "View and manage posts",
    icon: FileText,
    href: "/admin/posts",
    keywords: ["posts", "articles", "blog", "manage"],
  },
  {
    id: "media",
    title: "Media Library",
    description: "Upload and manage media",
    icon: ImageIcon,
    href: "/admin/media",
    keywords: ["media", "images", "upload", "files", "gallery"],
  },
  {
    id: "comments",
    title: "Comments",
    description: "Manage comments",
    icon: MessageSquare,
    href: "/admin/comments",
    keywords: ["comments", "feedback", "moderate"],
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "View site statistics",
    icon: BarChart3,
    href: "/admin/analytics",
    keywords: ["analytics", "stats", "statistics", "traffic", "views"],
  },
  {
    id: "subscribers",
    title: "Subscribers",
    description: "Manage email subscribers",
    icon: Users,
    href: "/admin/subscribers",
    keywords: ["subscribers", "email", "newsletter", "users"],
  },
  {
    id: "settings",
    title: "Settings",
    description: "Configure your site",
    icon: Settings,
    href: "/admin/settings",
    keywords: ["settings", "config", "preferences", "options"],
  },
];

// Utility functions
function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getNotificationIcon(type: AdminNotification["type"]) {
  const icons = {
    comment: MessageSquare,
    subscriber: Users,
    report: BarChart3,
    post: FileText,
  };
  return icons[type] || Bell;
}

// Sub-components
function NotificationItem({
  notification,
  onClick,
}: {
  notification: AdminNotification;
  onClick: () => void;
}) {
  const Icon = getNotificationIcon(notification.type);

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 hover:bg-accent/50 transition-colors
        border-b border-border last:border-0
        ${!notification.read ? "bg-accent/20" : ""}
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
          p-2 rounded-lg mt-0.5
          ${notification.read ? "bg-muted" : "bg-primary/10"}
        `}
        >
          <Icon
            className={`h-3.5 w-3.5 ${
              notification.read ? "text-muted-foreground" : "text-primary"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm ${
              notification.read
                ? "text-muted-foreground"
                : "text-foreground font-medium"
            }`}
          >
            {notification.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {notification.time}
          </p>
        </div>
        {!notification.read && (
          <div
            className="w-2 h-2 rounded-full bg-primary mt-2"
            aria-label="Unread"
          />
        )}
      </div>
    </button>
  );
}

function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredActions = searchQuery
    ? QUICK_ACTIONS.filter(
        (action) =>
          action.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchQuery.toLowerCase())
          ) || action.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : QUICK_ACTIONS;

  const handleActionClick = (href: string) => {
    router.push(href);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for actions..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            <button
              onClick={onClose}
              className="p-1 hover:bg-accent rounded transition-colors"
              aria-label="Close command palette"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {filteredActions.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No results found for "{searchQuery}"
              </div>
            ) : (
              <div className="p-2">
                {filteredActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action.href)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {action.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Quick navigation</span>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-background border border-border rounded text-xs font-mono">
                  Ctrl
                </kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-background border border-border rounded text-xs font-mono">
                  K
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component
export function AdminHeader({
  user,
  stats,
  notifications: initialNotifications,
}: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [notifications, setNotifications] =
    useState<AdminNotification[]>(initialNotifications);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showNotifications]);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
      if (e.key === "Escape") {
        setShowCommandPalette(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleNotificationClick = (notification: AdminNotification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );

    // Navigate if link exists
    if (notification.link) {
      window.location.href = notification.link;
    }

    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 shadow shadow-foreground/50 bg-background px-4 sm:px-6 lg:px-8 border-b border-border">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 border-r-slate-800 bg-slate-900 w-64 text-white"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SidebarContent user={user} stats={stats} />
          </SheetContent>
        </Sheet>

        {/* Command Palette Trigger - Desktop */}
        <button
          onClick={() => setShowCommandPalette(true)}
          className="flex-1 max-w-2xl hidden md:flex items-center gap-3 px-4 py-2.5 border border-input rounded-lg text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors group"
        >
          <Search className="h-4 w-4" />
          <span>Quick search...</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="px-2 py-0.5 bg-muted border border-border rounded text-xs font-mono">
              ⌘K
            </kbd>
          </div>
        </button>

        {/* Search Icon - Mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground"
          aria-label="Search"
          onClick={() => setShowCommandPalette(true)}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } mode`}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-popover rounded-lg shadow-xl border border-border overflow-hidden z-50">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:text-primary/80 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClick={() => handleNotificationClick(notification)}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-border text-center">
                  <Link
                    href="/admin/notifications"
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* View Site */}
          <Button
            variant="ghost"
            asChild
            className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span>View Site</span>
            </Link>
          </Button>

          {/* User Menu */}
          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name || "User avatar"}
                    />
                    <AvatarFallback>
                      {getInitials(session.user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings?tab=profile">Profile</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={handleSignOut}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
    </>
  );
}
