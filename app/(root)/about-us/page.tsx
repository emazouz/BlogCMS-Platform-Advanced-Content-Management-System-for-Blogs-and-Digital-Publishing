import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ArrowRight,
  Globe,
  Laptop,
  PenTool,
  Zap,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import RapidGrowth from "@/components/home/RapidGrowth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Belief {
  id: string;
  title: string;
  description: string;
  icon: any;
  iconColor: string;
  className: string;
  large?: boolean;
  wide?: boolean;
}

const BELIEFS: Belief[] = [
  {
    id: "speed",
    title: "Speed is a Feature",
    description:
      "We obsess over millisecond latency. Information should flow instantly. A fast site is a respectful site.",
    icon: Zap,
    iconColor: "text-primary",
    className:
      "md:col-span-2 row-span-1 md:row-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white",
    large: true,
  },
  {
    id: "design",
    title: "Design is Invisible",
    description: "Great design gets out of the way. Content is king.",
    icon: Laptop,
    iconColor: "text-blue-500",
    className: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    id: "global",
    title: "Global Citizenship",
    description: "Stories have no borders. We build for the world.",
    icon: Globe,
    iconColor: "text-green-500",
    className: "bg-green-50 dark:bg-green-950/30",
  },
  {
    id: "truth",
    title: "Truth in Writing",
    description:
      "In an era of AI-generated fluff, we champion authenticity and the unique, imperfect, wonderful human voice.",
    icon: PenTool,
    iconColor: "text-orange-600",
    className: "md:col-span-2 bg-zinc-50 dark:bg-zinc-900/50",
    wide: true,
  },
];

const TIMELINE = [
  {
    id: "inception",
    title: "Inception",
    year: "2023",
    description:
      "It started as a frustration. Blogs were too slow. We wrote the first line of code in different timezones.",
    isActive: true,
  },
  {
    id: "launch",
    title: "The Launch",
    year: "2024",
    description:
      'We launched v1 to a small group of beta testers. The feedback was unanimous: "Finally, a blog that just works."',
    isActive: false,
  },
  {
    id: "community",
    title: "Global Community",
    year: "2025",
    description:
      "Today, we are home to thousands of writers. We've introduced monetization and a global network.",
    isActive: false,
  },
] as const;

const TEAM_MEMBERS = [
  {
    id: "alex",
    name: "Alex Rivera",
    role: "Founder & CEO",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bio: "Former journalist turned developer. Obsessed with typography and clean code.",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    id: "sarah",
    name: "Sarah Chen",
    role: "Head of Content",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Believes every story deserves to be heard. Champion of underrepresented voices.",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    id: "jordan",
    name: "Jordan Smith",
    role: "Lead Engineer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    bio: "Architect of the platform. If it's not sub-100ms, it's not fast enough.",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
] as const;

const FAQ_ITEMS = [
  {
    id: "become-author",
    question: "How do I become an author?",
    answer:
      'It\'s simple. Click on "Create Account" or "Become an Author" in the menu. Once you verify your email, you can start drafting your first story immediately.',
  },
  {
    id: "free-publish",
    question: "Is it free to publish?",
    answer:
      "Yes! Publishing on our platform is completely free. We believe in democratizing access to digital publishing. We also offer premium features for power users.",
  },
  {
    id: "monetize",
    question: "Can I monetize my content?",
    answer:
      "Absolutely. We have a built-in monetization program. Once you hit certain readership milestones, you can enable ad revenue sharing or paid subscriptions for your readers.",
  },
  {
    id: "ownership",
    question: "Who owns the content I post?",
    answer:
      "You do. Always. You grant us a license to display it, but you retain full copyright and ownership of your work. You can export or delete it at any time.",
  },
] as const;

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-white">
      <HeroSection />
      <RapidGrowth />
      <MissionVisionSection />
      <BeliefsSection />
      <TimelineSection />
      <TeamSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative h-[60vh] md:h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden mb-12">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=800&fit=crop"
          alt="About Us - Team collaboration"
          fill
          sizes="100vw"
          className="object-cover brightness-[0.3]"
          priority
        />
      </div>

      <div className="relative z-10 wrapper text-center text-white pt-10">
        <Badge
          variant="outline"
          className="mb-6 mx-auto w-fit text-sm tracking-widest uppercase border-white/20 text-white px-4 py-1"
        >
          Our Manifesto
        </Badge>

        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 drop-shadow-lg">
          CRAFTING
          <br />
          DIGITAL
          <br />
          STORIES.
        </h1>

        <p className="text-xl md:text-2xl text-zinc-200 max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-md">
          We are a collective of writers, developers, and dreamers building the
          future of digital publishing. Fast, beautiful, and unapologetically
          human.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 h-12 text-base bg-white text-black hover:bg-white/90"
          >
            <Link href="/posts">
              Start Reading
              <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 h-12 text-base border-white text-white hover:bg-white hover:text-black bg-transparent"
          >
            <Link href="/contact-us">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function BeliefsSection() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <header className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Our Core Beliefs
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The principles that guide every decision we make.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {BELIEFS.map((belief) =>
            belief.large ? (
              <LargeBeliefCard key={belief.id} belief={belief} />
            ) : belief.wide ? (
              <WideBeliefCard key={belief.id} belief={belief} />
            ) : (
              <BeliefCard key={belief.id} belief={belief} />
            )
          )}
        </div>
      </div>
    </section>
  );
}

function LargeBeliefCard({ belief }: { belief: Belief }) {
  const Icon = belief.icon;
  return (
    <article
      className={cn(
        belief.className,
        "rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group"
      )}
    >
      <div
        className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors"
        aria-hidden="true"
      />
      <Icon
        className={cn("w-12 h-12 relative z-10", belief.iconColor)}
        aria-hidden="true"
      />
      <div className="relative z-10">
        <h3 className="text-3xl font-bold mb-4">{belief.title}</h3>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
          {belief.description}
        </p>
      </div>
    </article>
  );
}

function WideBeliefCard({ belief }: { belief: Belief }) {
  const Icon = belief.icon;
  return (
    <article
      className={cn(
        belief.className,
        "border border-border/50 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8 group hover:border-primary/20 transition-colors"
      )}
    >
      <div className="bg-orange-100 dark:bg-orange-900/20 p-6 rounded-2xl group-hover:rotate-6 transition-transform duration-300">
        <Icon
          className={cn("w-10 h-10", belief.iconColor)}
          aria-hidden="true"
        />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-3">{belief.title}</h3>
        <p className="text-muted-foreground text-lg">{belief.description}</p>
      </div>
    </article>
  );
}

function BeliefCard({ belief }: { belief: Belief }) {
  const Icon = belief.icon;
  return (
    <article
      className={cn(
        "p-8 rounded-3xl flex flex-col justify-between border border-border/50 hover:shadow-xl transition-all duration-300",
        belief.className
      )}
    >
      <div className="mb-4">
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center shadow-sm">
          <Icon className={belief.iconColor} aria-hidden="true" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">{belief.title}</h3>
        <p className="text-muted-foreground">{belief.description}</p>
      </div>
    </article>
  );
}

function TimelineSection() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="wrapper">
        <h2 className="text-3xl font-bold mb-16 text-center">Our Journey</h2>
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {TIMELINE.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ item }: { item: (typeof TIMELINE)[number] }) {
  return (
    <article className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
        <div
          className={cn(
            "rounded-full",
            item.isActive
              ? "w-3 h-3 bg-primary animate-pulse"
              : "w-2 h-2 bg-muted-foreground"
          )}
        />
      </div>
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-6 rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between space-x-2 mb-1">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">
            {item.title}
          </h3>
          <time
            className={cn(
              "font-mono text-xs",
              item.isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            {item.year}
          </time>
        </div>
        <p className="text-slate-500 text-sm">{item.description}</p>
      </div>
    </article>
  );
}

function TeamSection() {
  return (
    <section className="py-24">
      <div className="wrapper">
        <header className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Meet the Minds
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The diverse group of thinkers and tinkerers behind the screen.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <TeamMember key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamMember({ member }: { member: (typeof TEAM_MEMBERS)[number] }) {
  return (
    <article className="group text-center">
      <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-background shadow-xl group-hover:scale-105 transition-transform duration-300">
        <Image
          src={member.image}
          alt={`${member.name} - ${member.role}`}
          fill
          sizes="192px"
          className="object-cover"
        />
      </div>
      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
      <p className="text-primary font-medium text-sm mb-3 uppercase tracking-wider">
        {member.role}
      </p>
      <p className="text-muted-foreground leading-relaxed px-4">{member.bio}</p>
      <div className="mt-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-8 h-8"
          asChild
        >
          <a
            href={member.social.twitter}
            aria-label={`${member.name}'s Twitter`}
          >
            <Twitter className="w-4 h-4" aria-hidden="true" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-8 h-8"
          asChild
        >
          <a
            href={member.social.linkedin}
            aria-label={`${member.name}'s LinkedIn`}
          >
            <Linkedin className="w-4 h-4" aria-hidden="true" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-8 h-8"
          asChild
        >
          <a href={member.social.github} aria-label={`${member.name}'s GitHub`}>
            <Github className="w-4 h-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </article>
  );
}

function FAQSection() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="wrapper max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-center">
          Common Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function MissionVisionSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="wrapper max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Mission */}
          <article className="relative p-10 rounded-3xl bg-card border border-border shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute top-0 left-0 w-20 h-20 bg-primary/10 rounded-br-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To democratize digital publishing by providing a platform where
                every voice can be heard, every story can be told, and every
                writer can thrive. We believe in the power of words to inspire,
                educate, and connect people across the globe.
              </p>
            </div>
          </article>

          {/* Vision */}
          <article className="relative p-10 rounded-3xl bg-card border border-border shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-bl-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Our Vision
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To become the world's most trusted and innovative blogging
                platform, where quality content meets cutting-edge technology.
                We envision a future where writers are empowered with the tools
                they need to create, share, and monetize their work seamlessly.
              </p>
            </div>
          </article>
        </div>

        {/* Core Values */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-10">
            Our Core Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h4 className="font-semibold mb-2">Authenticity</h4>
              <p className="text-sm text-muted-foreground">
                We value genuine voices and original content
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h4 className="font-semibold mb-2">Innovation</h4>
              <p className="text-sm text-muted-foreground">
                Constantly pushing boundaries in technology
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h4 className="font-semibold mb-2">Community</h4>
              <p className="text-sm text-muted-foreground">
                Building connections between writers and readers
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h4 className="font-semibold mb-2">Excellence</h4>
              <p className="text-sm text-muted-foreground">
                Delivering the highest quality experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="wrapper max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Start Your Journey?
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Join thousands of writers who are already sharing their stories with
          the world. Create your account today and start publishing in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full px-8 h-14 text-lg">
            <Link href="/auth/signup">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 h-14 text-lg"
          >
            <Link href="/posts">Explore Content</Link>
          </Button>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          No credit card required • Free forever • Cancel anytime
        </p>
      </div>
    </section>
  );
}
