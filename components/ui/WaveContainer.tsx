"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface WaveContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: "teal" | "default";
}

export default function WaveContainer({
  children,
  className,
  variant = "teal",
}: WaveContainerProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className={className}>{children}</div>;

  const isDark = theme === "dark";

  return (
    <div className={cn("relative w-full overflow-hidden py-16", className)}>
      {/* Background/Overlay */}
      <div
        className={cn(
          "absolute inset-0 z-0",
          variant === "teal"
            ? "bg-gradient-to-br from-teal-900/5 to-teal-800/20 dark:from-teal-900/40 dark:to-teal-950"
            : "bg-muted/30"
        )}
      />

      {/* SVG Waves */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-multiply dark:mix-blend-soft-light">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back Wave */}
          <path
            fill={isDark ? "#115e59" : "#ccfbf1"} // teal-800 : teal-100
            fillOpacity="0.5"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="transition-all duration-500 ease-in-out"
          />
          {/* Front Wave */}
          <path
            fill={isDark ? "#0f766e" : "#99f6e4"} // teal-700 : teal-200
            fillOpacity="0.7"
            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,144C960,181,1056,235,1152,245.3C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">{children}</div>
    </div>
  );
}
