// /components/admin/widgets/QuickActionsWidget.tsx
import Link from 'next/link';
import { 
  Plus, 
  Image, 
  FolderTree, 
  Settings, 
  BarChart3, 
  FileText, 
  Users, 
  Tags,
  type LucideIcon 
} from 'lucide-react';

// Types
interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  colorClasses: {
    bg: string;
    hover: string;
    text: string;
  };
}

interface ActionItemProps {
  action: QuickAction;
}

// Constants
const QUICK_ACTIONS: QuickAction[] = [
  {
    title: 'New Post',
    description: 'Create a new blog post',
    href: '/admin/posts/new',
    icon: Plus,
    colorClasses: {
      bg: 'bg-blue-500 dark:bg-blue-600',
      hover: 'group-hover:bg-blue-600 dark:group-hover:bg-blue-500',
      text: 'text-white',
    },
  },
  {
    title: 'Upload Media',
    description: 'Add images to library',
    href: '/admin/media/upload',
    icon: Image,
    colorClasses: {
      bg: 'bg-green-500 dark:bg-green-600',
      hover: 'group-hover:bg-green-600 dark:group-hover:bg-green-500',
      text: 'text-white',
    },
  },
  {
    title: 'Manage Categories',
    description: 'Organize your content',
    href: '/admin/categories',
    icon: FolderTree,
    colorClasses: {
      bg: 'bg-purple-500 dark:bg-purple-600',
      hover: 'group-hover:bg-purple-600 dark:group-hover:bg-purple-500',
      text: 'text-white',
    },
  },
  {
    title: 'View Analytics',
    description: 'Check site performance',
    href: '/admin/analytics',
    icon: BarChart3,
    colorClasses: {
      bg: 'bg-yellow-500 dark:bg-yellow-600',
      hover: 'group-hover:bg-yellow-600 dark:group-hover:bg-yellow-500',
      text: 'text-white',
    },
  },
  {
    title: 'All Posts',
    description: 'View and manage posts',
    href: '/admin/posts',
    icon: FileText,
    colorClasses: {
      bg: 'bg-indigo-500 dark:bg-indigo-600',
      hover: 'group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500',
      text: 'text-white',
    },
  },
  {
    title: 'Subscribers',
    description: 'Manage email list',
    href: '/admin/subscribers',
    icon: Users,
    colorClasses: {
      bg: 'bg-pink-500 dark:bg-pink-600',
      hover: 'group-hover:bg-pink-600 dark:group-hover:bg-pink-500',
      text: 'text-white',
    },
  },
  {
    title: 'Tags',
    description: 'Organize with tags',
    href: '/admin/tags',
    icon: Tags,
    colorClasses: {
      bg: 'bg-teal-500 dark:bg-teal-600',
      hover: 'group-hover:bg-teal-600 dark:group-hover:bg-teal-500',
      text: 'text-white',
    },
  },
  {
    title: 'Settings',
    description: 'Configure your site',
    href: '/admin/settings',
    icon: Settings,
    colorClasses: {
      bg: 'bg-gray-500 dark:bg-gray-600',
      hover: 'group-hover:bg-gray-600 dark:group-hover:bg-gray-500',
      text: 'text-white',
    },
  },
];

// Sub-components
function ActionIcon({ 
  icon: Icon, 
  colorClasses 
}: { 
  icon: LucideIcon; 
  colorClasses: QuickAction['colorClasses'];
}) {
  return (
    <div 
      className={`
        p-2 rounded-lg transition-colors
        ${colorClasses.bg} 
        ${colorClasses.hover}
      `}
      aria-hidden="true"
    >
      <Icon className={`h-5 w-5 ${colorClasses.text}`} />
    </div>
  );
}

function ActionContent({ 
  title, 
  description 
}: { 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
        {title}
      </p>
      <p className="text-xs text-muted-foreground truncate">
        {description}
      </p>
    </div>
  );
}

function ActionItem({ action }: ActionItemProps) {
  return (
    <Link
      href={action.href}
      className="
        flex items-center gap-3 p-3 rounded-lg 
        transition-all group
        border border-transparent 
        hover:bg-accent/50 
        hover:border-border
        focus-visible:outline-none 
        focus-visible:ring-2 
        focus-visible:ring-ring 
        focus-visible:ring-offset-2
      "
      aria-label={`${action.title}: ${action.description}`}
    >
      <ActionIcon 
        icon={action.icon} 
        colorClasses={action.colorClasses} 
      />
      <ActionContent 
        title={action.title} 
        description={action.description} 
      />
    </Link>
  );
}

// Main component
export function QuickActionsWidget() {
  return (
    <section className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Quick Actions
      </h2>
      
      <nav 
        className="grid grid-cols-1 gap-3"
        aria-label="Quick actions navigation"
      >
        {QUICK_ACTIONS.map((action) => (
          <ActionItem key={action.href} action={action} />
        ))}
      </nav>
    </section>
  );
}