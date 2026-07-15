"use client";

import { useEffect, useState } from "react";

export function useActiveSection(selector = "section[data-cursor-theme]") {
  const [activeTheme, setActiveTheme] = useState<string>("dark");

  useEffect(() => {
    const sections = document.querySelectorAll(selector);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const theme = entry.target.getAttribute("data-cursor-theme");
            if (theme) setActiveTheme(theme);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [selector]);

  return activeTheme;
}
