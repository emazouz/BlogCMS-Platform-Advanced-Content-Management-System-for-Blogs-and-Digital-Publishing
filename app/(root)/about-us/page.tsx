import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Globe,
  Laptop,
  PenTool,
  Zap,
  Users,
  Trophy,
  Coffee,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-white">
      {/* 1. HERO SECTION: Split Layout with Massive Typography */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="wrapper">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left: Typography */}
            <div className="lg:w-1/2 relative z-10">
              <Badge
                variant="outline"
                className="mb-8 text-sm tracking-widest uppercase border-primary/20 text-primary px-4 py-1"
              >
                Our Manifesto
              </Badge>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
                CRAFTING
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  DIGITAL
                </span>
                <br />
                STORIES.
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed mb-10">
                We are a collective of writers, developers, and dreamers
                building the future of digital publishing. Fast, beautiful, and
                unapologetically human.
              </p>
              <div className="flex gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 h-12 text-base"
                >
                  <Link href="/posts">Start Reading</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="rounded-full px-8 h-12 text-base"
                >
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>

            {/* Right: Abstract Graphic / Image Placeholder */}
            <div className="lg:w-1/2 relative">
              <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 border border-border/50 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                </div>
                {/* Decorative Grid Lines */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION: Impact Numbers */}
      <section className="py-12 border-y border-border/40 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard
              number="10k+"
              label="Daily Readers"
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard
              number="500+"
              label="Published Authors"
              icon={<PenTool className="w-5 h-5" />}
            />
            <StatCard
              number="1M+"
              label="Words Written"
              icon={<Trophy className="w-5 h-5" />}
            />
            <StatCard
              number="∞"
              label="Coffees Consumed"
              icon={<Coffee className="w-5 h-5" />}
            />
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID SECTION: Our Beliefs */}
      <section className="py-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Our Core Beliefs
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Large Card */}
            <div className="md:col-span-2 row-span-1 md:row-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />
              <Zap className="w-12 h-12 text-primary relative z-10" />
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">Speed is a Feature</h3>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                  We obsess over millisecond latency. Information should flow
                  instantly. A fast site is a respectful site.
                </p>
              </div>
            </div>

            {/* Standard Card */}
            <BentoCard
              title="Design is Invisible"
              description="Great design gets out of the way. Content is king."
              icon={<Laptop className="w-8 h-8 text-blue-500" />}
              className="bg-blue-50 dark:bg-blue-950/30"
            />

            {/* Standard Card */}
            <BentoCard
              title="Global Citizenship"
              description="Stories have no borders. We build for the world."
              icon={<Globe className="w-8 h-8 text-green-500" />}
              className="bg-green-50 dark:bg-green-950/30"
            />

            {/* Wide Card */}
            <div className="md:col-span-2 bg-zinc-50 dark:bg-zinc-900/50 border border-border/50 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8 group hover:border-primary/20 transition-colors">
              <div className="bg-orange-100 dark:bg-orange-900/20 p-6 rounded-2xl group-hover:rotate-6 transition-transform duration-300">
                <PenTool className="w-10 h-10 text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Truth in Writing</h3>
                <p className="text-muted-foreground text-lg">
                  In an era of AI-generated fluff, we champion authenticity and
                  the unique, imperfect, wonderful human voice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TIMELINE SECTION: Visual Track */}
      <section className="py-24 bg-muted/20">
        <div className="wrapper">
          <h2 className="text-3xl font-bold mb-16 text-center">Our Journey</h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {/* Timeline Item 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    Inception
                  </div>
                  <time className="font-mono text-xs text-primary">2023</time>
                </div>
                <div className="text-slate-500 text-sm">
                  It started as a frustration. Blogs were too slow. We wrote the
                  first line of code in different timezones.
                </div>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    The Launch
                  </div>
                  <time className="font-mono text-xs text-muted-foreground">
                    2024
                  </time>
                </div>
                <div className="text-slate-500 text-sm">
                  We launched v1 to a small group of beta testers. The feedback
                  was unanimous: "Finally, a blog that just works."
                </div>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    Global Community
                  </div>
                  <time className="font-mono text-xs text-muted-foreground">
                    2025
                  </time>
                </div>
                <div className="text-slate-500 text-sm">
                  Today, we are home to thousands of writers. We've introduced
                  monetization and a global network.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MINIMAL FOOTER CTA */}
      <section className="py-32 wrapper text-center">
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8">
          READY TO
          <br />
          WRITE?
        </h2>
        <div className="flex justify-center">
          <Link
            href="/auth/register"
            className="group flex items-center gap-4 text-2xl font-bold border-b-4 border-primary hover:text-primary transition-colors pb-1"
          >
            Create Account{" "}
            <ArrowRight className="h-8 w-8 transition-transform group-hover:translate-x-2 text-primary" />
          </Link>
        </div>
      </section>
      
    </div>
  );
}

function StatCard({
  number,
  label,
  icon,
}: {
  number: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="text-center group">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-3xl font-black mb-1">{number}</div>
      <div className="text-sm text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function BentoCard({
  title,
  description,
  icon,
  className,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "p-8 rounded-3xl flex flex-col justify-between border border-border/50 hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      <div className="mb-4">
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center shadow-sm">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
