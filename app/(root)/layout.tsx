import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import TopNavBar from "@/components/layout/TopNavBar";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: {
    default: "BlogPlatform - Share Your Story",
    template: "%s | BlogPlatform",
  },
  description: "A high-performance blog platform for developers and creators.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "./",
  },
};

import { getNavbarCategories } from "@/lib/actions/category.actions";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getNavbarCategories();

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavBar />
      <Navbar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
