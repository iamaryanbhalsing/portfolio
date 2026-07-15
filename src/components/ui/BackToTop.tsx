"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useCursorState } from "@/components/cursor/CursorProvider";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const cursorHandlers = useCursorState("button");

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      {...cursorHandlers}
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      } bg-surface/80 border border-border/60 backdrop-blur-md hover:border-brand/50 hover:shadow-lg hover:shadow-brand/20`}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5 text-brand" />
    </button>
  );
}
