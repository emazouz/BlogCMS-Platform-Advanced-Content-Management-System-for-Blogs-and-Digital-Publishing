"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Package2, ChevronDown } from "lucide-react";

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
  DialogTrigger,
} from "@/components/ui/dialog";
import MegaMenuContent from "./MegaMenuContent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import NotificationDropdown from "../notifications/NotificationDropdown";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobilePostsOpen, setIsMobilePostsOpen] = React.useState(false);

  const isActive = (path: string) => pathname === path;

  const moreLinks = [
    { href: "/testimonials", label: "Testimonials" },
    { href: "/contact-us", label: "Contact" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
  ];



  console.log(session);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="wrapper flex h-14 items-center justify-between relative">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Package2 className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block text-xl">
              Dev<span className="text-primary">Blog</span>
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation via NavigationMenu */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className={cn(
              "transition-colors hover:text-foreground/80",
              isActive("/") ? "text-foreground" : "text-foreground/60"
            )}
          >
            Home
          </Link>

          {/* Posts Mega Menu - CSS Hover */}
          <div className="group">
            <Link
              href="/posts"
              className={cn(
                "cursor-pointer transition-colors hover:text-foreground/80 flex items-center gap-1 py-4",
                isActive("/posts") ? "text-foreground" : "text-foreground/60"
              )}
            >
              Posts
            </Link>
            <div className="absolute inset-x-0 top-full hidden group-hover:block pt-2">
              <div className="bg-popover border text-popover-foreground shadow-md rounded-md p-0">
                <MegaMenuContent />
              </div>
            </div>
          </div>

          <Link
            href="/categories"
            className={cn(
              "transition-colors hover:text-foreground/80",
              isActive("/categories") ? "text-foreground" : "text-foreground/60"
            )}
          >
            Categories
          </Link>

          <Link
            href="/about-us"
            className={cn(
              "transition-colors hover:text-foreground/80",
              isActive("/about-us") ? "text-foreground" : "text-foreground/60"
            )}
          >
            About
          </Link>

          {/* Pages Dropdown - CSS Hover */}
          <div className="group relative">
            <div
              className={cn(
                "cursor-pointer transition-colors hover:text-foreground/80 flex items-center gap-1 py-4",
                moreLinks.some((l) => isActive(l.href))
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Pages
            </div>
            <div className="absolute right-0 top-full hidden group-hover:block pt-2 w-[200px]">
              <div className="bg-popover border text-popover-foreground shadow-md rounded-md p-1 min-w-[200px] flex flex-col">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                      isActive(link.href) && "font-semibold text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Icon Trigger */}
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
              </DialogHeader>
              <div className="flex items-center space-x-2 py-4">
                <Search className="h-4 w-4 text-muted-foreground opacity-50 absolute left-8" />
                <Input
                  type="search"
                  placeholder="Search posts..."
                  className="pl-8"
                  autoFocus
                  // Add actual search logic here or form submission
                />
              </div>
            </DialogContent>
          </Dialog>

          {session && <NotificationDropdown />}
          <ModeToggle />

          {/* User Auth */}
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
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-500 cursor-pointer"
                  onClick={() => signOut()}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="pr-0 w-[80vw] sm:w-[350px] overflow-y-auto"
            >
              <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              {/* Mobile Menu Content */}
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Package2 className="h-6 w-6" />
                <span className="font-bold text-xl">
                  Dev<span className="text-primary">Blog</span>
                </span>
              </Link>
              <div className="flex flex-col space-y-3 mt-4">
                <Link
                  href="/"
                  className={cn(
                    "block px-2 py-1 text-lg",
                    isActive("/")
                      ? "font-medium text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Home
                </Link>

                {/* Mobile Posts Section */}
                <div className="px-2">
                  <button
                    onClick={() => setIsMobilePostsOpen(!isMobilePostsOpen)}
                    className={cn(
                      "flex items-center justify-between w-full py-1 text-lg",
                      isActive("/posts")
                        ? "font-medium text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Posts
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isMobilePostsOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isMobilePostsOpen && (
                    <div className="mt-2 pl-2 border-l-2">
                      <MegaMenuContent />
                    </div>
                  )}
                </div>

                <Link
                  href="/categories"
                  className={cn(
                    "block px-2 py-1 text-lg",
                    isActive("/categories")
                      ? "font-medium text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Categories
                </Link>

                <Link
                  href="/about-us"
                  className={cn(
                    "block px-2 py-1 text-lg",
                    isActive("/about-us")
                      ? "font-medium text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  About
                </Link>

                <div className="border-t my-2 pt-2">
                  <p className="px-2 text-sm font-medium text-muted-foreground mb-2">
                    More
                  </p>
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "block px-2 py-1 text-base",
                        isActive(link.href)
                          ? "font-medium text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  {!session ? (
                    <Button asChild className="w-full">
                      <Link href="/auth/login">Login</Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2"
                      onClick={() => signOut()}
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
