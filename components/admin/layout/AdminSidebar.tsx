'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
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
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/admin', 
    icon: LayoutDashboard 
  },
  { 
    name: 'Posts', 
    href: '/admin/posts', 
    icon: FileText,
    badge: 'new',
  },
  { 
    name: 'Media', 
    href: '/admin/media', 
    icon: Image 
  },
  { 
    name: 'Categories', 
    href: '/admin/categories', 
    icon: FolderTree 
  },
  { 
    name: 'Tags', 
    href: '/admin/tags', 
    icon: Tags 
  },
  { 
    name: 'Comments', 
    href: '/admin/comments', 
    icon: MessageSquare,
    badge: '5',
  },
  { 
    name: 'Analytics', 
    href: '/admin/analytics', 
    icon: BarChart3 
  },
  { 
    name: 'AdSense', 
    href: '/admin/adsense', 
    icon: DollarSign 
  },
  { 
    name: 'Subscribers', 
    href: '/admin/subscribers', 
    icon: Users 
  },
  { 
    name: 'SEO Tools', 
    href: '/admin/seo-tools', 
    icon: Search 
  },
  { 
    name: 'Settings', 
    href: '/admin/settings', 
    icon: Settings 
  },
];

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-slate-800 px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold text-white">BlogCMS</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar space-y-1">
        {navigation.map((item) => {
          const isActive = 
            pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));
          
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                ${isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`
                  px-2 py-0.5 text-xs font-semibold rounded-full
                  ${item.badge === 'new' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                  }
                `}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-800 p-4">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-800 transition-colors"
          >
            {user?.image ? (
              <img
                src={user?.image}
                alt={user?.name || 'User'}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-700"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center ring-2 ring-slate-700">
                <span className="text-white font-semibold text-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
            )}
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-xs text-slate-400 truncate capitalize">
                {user?.role || 'Administrator'}
              </p>
            </div>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden">
              <Link
                href="/admin/settings/profile"
                className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                Profile Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
