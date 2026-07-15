"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { certifications } from "@/config/certifications";
import { animateSectionEntry } from "@/lib/anime";
import { useCursorState } from "@/components/cursor/CursorProvider";
import {
  Brain,
  BarChart3,
  Shield,
  Terminal,
  ExternalLink,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  brain: <Brain className="h-5 w-5" />,
  chart: <BarChart3 className="h-5 w-5" />,
  shield: <Shield className="h-5 w-5" />,
  terminal: <Terminal className="h-5 w-5" />,
};

export function Certifications() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const cursorHandlers = useCursorState("link");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            animateSectionEntry("#certifications .cert-content");
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="certifications" ref={sectionRef} className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1150px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          Certifications
        </h2>
        <p className="text-muted-foreground max-w-xl text-sm mb-12">
          Professional certifications and course completions.
        </p>

        <div
          className="cert-content grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ opacity: 0 }}
        >
          {certifications.map((cert) => (
            <a
              key={cert.id}
              href={cert.url || "#"}
              target={cert.url ? "_blank" : undefined}
              rel={cert.url ? "noopener noreferrer" : undefined}
              {...cursorHandlers}
              className="group"
            >
              <Card className="h-full bg-surface/90 border-border/60 backdrop-blur-md transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5">
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="p-2.5 rounded-xl bg-brand/10 text-brand w-fit">
                    {ICON_MAP[cert.icon] || <Shield className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-semibold tracking-tight leading-snug group-hover:text-brand transition-colors">
                      {cert.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{cert.issuer}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                    <span className="text-xs text-muted-foreground">{cert.date}</span>
                    {cert.url && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-brand transition-colors" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
