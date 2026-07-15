"use client";

import { useEffect, useRef } from "react";
import { animateTyping } from "@/lib/anime";

interface TypingTextProps {
  strings: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function TypingText({
  strings,
  typeSpeed = 80,
  deleteSpeed = 40,
  pauseDuration = 2000,
  className = "",
}: TypingTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const cleanup = animateTyping(el, strings, typeSpeed, deleteSpeed, pauseDuration);
    return cleanup;
  }, [strings, typeSpeed, deleteSpeed, pauseDuration]);

  return (
    <span className={className}>
      <span ref={textRef} />
      <span className="inline-block w-[2px] h-[1em] bg-brand ml-0.5 align-middle terminal-cursor blink" />
    </span>
  );
}
