"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function FAQ({
  faqs = [],
  title = "Frequently Asked",
  subtitle = "Questions",
  imageSrc = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&h=1200&fit=crop",
  imageAlt = "FAQ Support",
}: FAQProps) {
  if (!faqs || faqs.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="wrapper text-center">
          <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">
            No FAQs Available
          </h3>
          <p className="text-muted-foreground">
            Check back soon for answers to common questions.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32 bg-muted/30 border-t border-border">
      <div className="wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-start">
          {/* Left Column: Image (Sticky) */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5 relative lg:sticky lg:top-24"
          >
            <div className="relative">
              {/* Decorative background */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl opacity-50" />
              
              {/* Image container */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className={cn(
                    "object-cover transition-all duration-700 ease-in-out",
                    "group-hover:scale-105"
                  )}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  priority
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute bottom-6 left-6 right-6"
                >
                  <div className="bg-background/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <HelpCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Need Help?
                        </p>
                        <p className="text-xs text-muted-foreground">
                          We're here to assist you
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Content */}
          <div className="lg:col-span-7">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Header */}
              <div className="mb-12 lg:mb-16">
                <motion.h2
                  variants={titleVariants}
                  className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-2 text-foreground"
                >
                  {title}
                </motion.h2>
                <motion.h2
                  variants={titleVariants}
                  className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground"
                >
                  {subtitle}
                </motion.h2>
                <motion.div
                  variants={itemVariants}
                  className="mt-4 h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>

              {/* FAQ Accordion */}
              <motion.div variants={itemVariants}>
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {faqs.slice(0, 7).map((faq, index) => (
                    <motion.div
                      key={index}
                      custom={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <AccordionItem
                        value={`item-${index}`}
                        className={cn(
                          "border-b border-border px-4 py-2 rounded-lg",
                          "transition-all duration-300",
                          "hover:bg-muted/50 hover:shadow-sm",
                          "data-[state=open]:bg-muted/70 data-[state=open]:shadow-md"
                        )}
                      >
                        <AccordionTrigger
                          className={cn(
                            "text-lg md:text-xl font-semibold py-6",
                            "hover:no-underline hover:text-primary",
                            "transition-colors text-left",
                            "group-hover:translate-x-1",
                            "[&[data-state=open]]:text-primary"
                          )}
                        >
                          <span className="flex items-start gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-1">
                              {index + 1}
                            </span>
                            <span className="flex-1">{faq.question}</span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent
                          className={cn(
                            "text-base md:text-lg text-muted-foreground",
                            "pb-6 pl-9 leading-relaxed"
                          )}
                        >
                          <div className="prose prose-sm max-w-none">
                            {faq.answer}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </motion.div>

              {/* Contact CTA */}
              <motion.div
                variants={itemVariants}
                className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Still have questions?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Can't find the answer you're looking for? Please contact our friendly team.
                    </p>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-hover transition-colors">
                      Get in Touch
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}