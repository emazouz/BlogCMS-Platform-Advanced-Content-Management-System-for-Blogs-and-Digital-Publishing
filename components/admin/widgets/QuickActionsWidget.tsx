// /components/admin/widgets/QuickActionsWidget.tsx
import Link from 'next/link';
import { Plus, Image, FolderTree, Settings, BarChart3, FileText, Users, Tags } from 'lucide-react';

const actions = [
  {
    title: 'New Post',
    description: 'Create a new blog post',
    href: '/admin/posts/new',
    icon: Plus,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
  },
  {
    title: 'Upload Media',
    description: 'Add images to library',
    href: '/admin/media/upload',
    icon: Image,
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
  },
  {
    title: 'Manage Categories',
    description: 'Organize your content',
    href: '/admin/categories',
    icon: FolderTree,
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
  },
  {
    title: 'View Analytics',
    description: 'Check site performance',
    href: '/admin/analytics',
    icon: BarChart3,
    color: 'bg-yellow-500',
    hoverColor: 'hover:bg-yellow-600',
  },
  {
    title: 'All Posts',
    description: 'View and manage posts',
    href: '/admin/posts',
    icon: FileText,
    color: 'bg-indigo-500',
    hoverColor: 'hover:bg-indigo-600',
  },
  {
    title: 'Subscribers',
    description: 'Manage email list',
    href: '/admin/subscribers',
    icon: Users,
    color: 'bg-pink-500',
    hoverColor: 'hover:bg-pink-600',
  },
  {
    title: 'Tags',
    description: 'Organize with tags',
    href: '/admin/tags',
    icon: Tags,
    color: 'bg-teal-500',
    hoverColor: 'hover:bg-teal-600',
  },
  {
    title: 'Settings',
    description: 'Configure your site',
    href: '/admin/settings',
    icon: Settings,
    color: 'bg-gray-500',
    hoverColor: 'hover:bg-gray-600',
  },
];

export function QuickActionsWidget() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-200"
            >
              <div className={`p-2 rounded-lg ${action.color} ${action.hoverColor} transition-colors`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition">
                  {action.title}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}