"use client";

import { Bell, Search, Plus, ExternalLink, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8 shadow-sm">
      {/* Mobile Menu Button */}
      <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
        <Menu className="h-5 w-5" />
      </button>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, media, pages..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition bg-gray-50 focus:bg-white"
          />
        </div>
      </form>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">
                    New comment on "Getting Started"
                  </p>
                  <p className="text-xs text-gray-600 mt-1">2 minutes ago</p>
                </div>
                <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">
                    New subscriber joined
                  </p>
                  <p className="text-xs text-gray-600 mt-1">1 hour ago</p>
                </div>
                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">
                    Daily analytics report ready
                  </p>
                  <p className="text-xs text-gray-600 mt-1">3 hours ago</p>
                </div>
              </div>
              <div className="p-3 border-t border-gray-200 text-center">
                <Link
                  href="/admin/notifications"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* View Site */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          <ExternalLink className="h-4 w-4" />
          <span>View Site</span>
        </Link>

        {/* New Post Button */}
        <Link href="/admin/posts/new">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition shadow-sm">
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">New Post</span>
          </button>
        </Link>
      </div>
    </header>
  );
}
