"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Newsletter } from "../shared/Newsletter";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-8">
      <div className="wrapper">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                BlogPlatform
              </span>
            </Link>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              A modern platform for sharing your thoughts and connecting with
              the world. Built with the latest tech stack for optimal
              performance.
            </p>
            <div className="flex gap-4">
              <SocialLink
                href="https://twitter.com"
                icon={<Twitter size={18} />}
                label="Twitter"
              />
              <SocialLink
                href="https://github.com"
                icon={<Github size={18} />}
                label="GitHub"
              />
              <SocialLink
                href="https://linkedin.com"
                icon={<Linkedin size={18} />}
                label="LinkedIn"
              />
              <SocialLink
                href="https://instagram.com"
                icon={<Instagram size={18} />}
                label="Instagram"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
              Explore
            </h4>
            <ul className="space-y-3">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/about-us">About Us</FooterLink>
              <FooterLink href="/posts">Articles</FooterLink>
              <FooterLink href="/categories">Categories</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
              Legal
            </h4>
            <ul className="space-y-3">
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
              <FooterLink href="/cookie-policy">Cookie Policy</FooterLink>
              <FooterLink href="/guidelines">Community Guidelines</FooterLink>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-6">
            <Newsletter variant="footer" />
          </div>
        </div>

        <Separator className="bg-zinc-200 dark:bg-zinc-800" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 text-sm text-zinc-500 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} BlogPlatform. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Sitemap
            </Link>
            <Link
              href="#"
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              RSS Feed
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300"
      aria-label={label}
    >
      {icon}
    </Link>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 transition-all duration-200 inline-block"
      >
        {children}
      </Link>
    </li>
  );
}
