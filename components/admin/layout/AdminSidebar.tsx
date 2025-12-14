"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Image,
  FolderTree,
  Tags,
  MessageSquare,
  BarChart3,
  DollarSign,
  Users,
  Settings,
  Search,
  LogOut,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Posts", href: "/admin/posts", icon: FileText, badge: "new" },
  { name: "Media", href: "/admin/media", icon: Image },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Tags", href: "/admin/tags", icon: Tags },
  {
    name: "Comments",
    href: "/admin/comments",
    icon: MessageSquare,
    badge: "5",
  },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "AdSense", href: "/admin/adsense", icon: DollarSign },
  { name: "Subscribers", href: "/admin/subscribers", icon: Users },
  { name: "SEO Tools", href: "/admin/seo-tools", icon: Search },
  { name: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const navItemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

const userMenuVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 20, stiffness: 300 },
  },
  exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } },
};

const badgeVariants = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: { type: "spring", damping: 15, stiffness: 400, delay: 0.2 },
  },
  hover: { scale: 1.1, transition: { duration: 0.2 } },
};

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
  className?: string;
}

export function SidebarContent({ user, className }: AdminSidebarProps) {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className={cn("flex flex-col h-full bg-card", className)}>
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex h-16 shrink-0 items-center border-b border-slate-800 px-6"
      >
        <Link href="/admin" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
          >
            <span className="text-lg font-bold text-white">B</span>
          </motion.div>
          <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
            BlogCMS
          </span>
        </Link>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        <div className="space-y-1">
          {navigation.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  custom={index}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {/* Active indicator line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-white"
                      transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 300,
                      }}
                    />
                  )}

                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 12, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                    </motion.div>
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <motion.span
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                        item.badge === "new"
                          ? "bg-emerald-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {item.badge}
                    </motion.span>
                  )}

                  {/* Hover effect overlay */}
                  {!isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-5"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="shrink-0 border-t border-slate-800 p-4">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-slate-800"
          >
            {user?.image ? (
              <motion.img
                whileHover={{ scale: 1.1 }}
                src={user.image}
                alt={user.name || "User"}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-700"
              />
            ) : (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 ring-2 ring-slate-700 shadow-lg"
              >
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </span>
              </motion.div>
            )}
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name || "Admin"}
              </p>
              <p className="truncate text-xs capitalize text-slate-400">
                {user?.role || "Administrator"}
              </p>
            </div>
            <motion.div
              animate={{ rotate: showUserMenu ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </motion.div>
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                variants={userMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl z-50"
              >
                <Link href="/admin/settings?tab=profile">
                  <motion.div
                    whileHover={{
                      backgroundColor: "rgba(51, 65, 85, 0.5)",
                      x: 4,
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-300 transition-colors cursor-pointer"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{
                    backgroundColor: "rgba(51, 65, 85, 0.5)",
                    x: 4,
                  }}
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-400 transition-colors hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  return (
    <div className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 flex-col">
      <SidebarContent user={user} />
    </div>
  );
}
