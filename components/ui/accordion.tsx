"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-border/60", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-6 font-medium transition-all hover:bg-muted/30 hover:px-2 -mx-2 rounded-sm [&[data-state=open]>div>svg.plus]:rotate-90 [&[data-state=open]>div>svg.plus]:opacity-0 [&[data-state=open]>div>svg.minus]:rotate-0 [&[data-state=open]>div>svg.minus]:opacity-100",
        className
      )}
      {...props}
    >
      <span className="text-lg tracking-tight">{children}</span>
      <div className="relative h-4 w-4 shrink-0 overflow-hidden">
        <Plus className="plus absolute h-4 w-4 transition-all duration-300 ease-in-out opacity-100 rotate-0" />
        <Minus className="minus absolute h-4 w-4 transition-all duration-300 ease-in-out opacity-0 -rotate-90" />
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-base transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div
      className={cn(
        "pb-6 pt-0 text-muted-foreground leading-relaxed",
        className
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
