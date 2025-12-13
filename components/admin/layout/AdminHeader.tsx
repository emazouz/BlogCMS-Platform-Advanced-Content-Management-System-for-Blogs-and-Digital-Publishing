"use client";

import { Bell, Search, ExternalLink, Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
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
import { SidebarContent } from "@/components/admin/layout/AdminSidebar";

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

// Mock notifications - replace with actual API call
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: 'New comment on "Getting Started"',
    time: "2 minutes ago",
  },
  {
    id: "2",
    title: "New subscriber joined",
    time: "1 hour ago",
  },
  {
    id: "3",
    title: "Daily analytics report ready",
    time: "3 hours ago",
  },
];

export function AdminHeader({ user }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const notificationRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    console.log("Searching for:", searchQuery);
    // TODO: Implement search functionality
  };

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

  const getInitials = (name?: string | null): string => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 shadow shadow-foreground/50 bg-background px-4 sm:px-6 lg:px-8">
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
          <SidebarContent user={user} />
        </SheetContent>
      </Sheet>

      {/* Search Bar - Desktop */}
      <form
        onSubmit={handleSearch}
        className="flex-1 max-w-2xl hidden md:block"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, media, pages..."
            className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg text-sm focus:ring-2 focus:ring-ring focus:border-input transition bg-background hover:bg-accent/50 focus:bg-background"
            aria-label="Search"
          />
        </div>
      </form>

      {/* Search Icon - Mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-muted-foreground"
        aria-label="Search"
        onClick={() => {
          // TODO: Open mobile search modal
          console.log("Open mobile search");
        }}
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
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
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
            <span
              className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"
              aria-label="Unread notifications"
            />
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-popover rounded-lg shadow-xl border border-border overflow-hidden z-50">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {MOCK_NOTIFICATIONS.length > 0 ? (
                  MOCK_NOTIFICATIONS.map((notification, index) => (
                    <button
                      key={notification.id}
                      className={`w-full text-left p-4 hover:bg-accent/50 transition-colors ${
                        index !== MOCK_NOTIFICATIONS.length - 1
                          ? "border-b border-border"
                          : ""
                      }`}
                      onClick={() => {
                        console.log("Notification clicked:", notification.id);
                        // TODO: Handle notification click
                      }}
                    >
                      <p className="text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
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
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={handleSignOut}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
