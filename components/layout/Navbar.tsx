"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Search,
  X,
  ChevronDown,
  Home,
  Newspaper,
  Grid,
  FileText,
  LogIn,
  UserPlus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import NotificationDropdown from "../notifications/NotificationDropdown";

import { NavbarCategory } from "@/lib/actions/category.actions";

interface NavbarProps {
  categories?: NavbarCategory[];
}

export default function Navbar({ categories = [] }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] =
    React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Scroll detection for navbar style
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const moreLinks = [
    { href: "/testimonials", label: "Testimonials", icon: FileText },
    { href: "/about-us", label: "About Us", icon: FileText },
    { href: "/contact-us", label: "Contact", icon: FileText },
    { href: "/privacy-policy", label: "Privacy Policy", icon: FileText },
    { href: "/terms-of-service", label: "Terms of Service", icon: FileText },
  ];

  const featuredCategories = categories.slice(0, 6);
  const hasMoreCategories = categories.length > 6;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg shadow-sm"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="wrapper">
        {/* Main Navbar */}
        <div className="flex h-16 items-center justify-between">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 w-full">
            <Link
              href="/"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground flex items-center gap-2",
                isActive("/")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            <Link
              href="/posts"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground flex items-center gap-2",
                isActive("/posts")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Newspaper className="h-4 w-4" />
              All Posts
            </Link>

            {/* Categories Mega Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "font-medium flex items-center gap-1",
                    pathname.startsWith("/categories") &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  <Grid className="h-4 w-4" />
                  Categories
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[600px] p-4" align="start">
                <div className="grid grid-cols-2 gap-2">
                  {featuredCategories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/categories/${category.slug}`}
                      className="group p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm group-hover:text-primary transition-colors">
                          {category.name}
                        </span>
                        {category.postCount && (
                          <Badge variant="secondary" className="text-xs">
                            {category.postCount}
                          </Badge>
                        )}
                      </div>
                      {category.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
                {hasMoreCategories && (
                  <div className="mt-3 pt-3 border-t">
                    <Link
                      href="/categories"
                      className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                    >
                      View all categories →
                    </Link>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Pages Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium flex items-center gap-1"
                >
                  Pages
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "w-full cursor-pointer",
                        isActive(link.href) && "font-semibold text-primary"
                      )}
                    >
                      <link.icon className="h-4 w-4 mr-2" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center justify-between w-full space-x-2">
           {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[350px] overflow-y-auto p-0"
              >
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

                {/* Mobile Header */}
                <div className="p-6 border-b">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-lg">
                        D
                      </span>
                    </div>
                    <span className="font-bold text-xl">
                      Dev<span className="text-primary">Blog</span>
                    </span>
                  </Link>
                </div>

                {/* Mobile Navigation */}
                <nav className="p-4 space-y-1">
                  <Link
                    href="/"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive("/")
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Link>

                  <Link
                    href="/posts"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive("/posts")
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Newspaper className="h-4 w-4" />
                    All Posts
                  </Link>

                  {/* Mobile Categories */}
                  <div>
                    <button
                      onClick={() =>
                        setIsMobileCategoriesOpen(!isMobileCategoriesOpen)
                      }
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        pathname.startsWith("/categories")
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Grid className="h-4 w-4" />
                        Categories
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isMobileCategoriesOpen && "rotate-180"
                        )}
                      />
                    </button>
                    {isMobileCategoriesOpen && (
                      <div className="mt-1 ml-7 space-y-1 border-l-2 border-border pl-3">
                        {categories.map((category) => (
                          <Link
                            key={category._id}
                            href={`/categories/${category.slug}`}
                            className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {category.name}
                            {category.postCount && (
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs"
                              >
                                {category.postCount}
                              </Badge>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile Pages */}
                  <div className="pt-4 border-t space-y-1">
                    <p className="px-3 text-xs font-semibold text-muted-foreground mb-2">
                      PAGES
                    </p>
                    {moreLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive(link.href)
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Mobile Auth */}
                <div className="p-4 border-t mt-auto">
                  {!session ? (
                    <div className="space-y-2">
                      <Button asChild className="w-full" size="sm">
                        <Link href="/auth/login">
                          <LogIn className="h-4 w-4 mr-2" />
                          Login
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        <Link href="/auth/signup">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => signOut()}
                    >
                      Log out
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
         
          <div className="flex items-center justify-end w-full space-x-2">
              {/* Search */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="h-9 w-9"
              >
                <Search className="h-6 w-6" />
                <span className="sr-only">Search</span>
              </Button>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Search Posts</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search for posts, topics..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!searchQuery.trim()}>
                      Search
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Notifications (if logged in) */}
            {session && <NotificationDropdown />}

            {/* Theme Toggle */}
            <ModeToggle />

            {/* User Menu / Auth Buttons */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || ""}
                      />
                      <AvatarFallback>
                        {session.user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings?tab=profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => signOut()}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/signup">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>




          </div>
        </div>
      </div>
    </header>
  );
}
