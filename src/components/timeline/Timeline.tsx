"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { education, experience, type TimelineEntry } from "@/config/timeline";
import { animateTimeline } from "@/lib/anime";

function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  return (
    <div className="relative" data-timeline-node style={{ opacity: 0 }}>
      {entry.current && (
        <div className="absolute -left-2 top-6 w-3 h-3 rounded-full bg-brandSecondary timeline-node-current z-10" />
      )}
      <Card className="bg-surface/90 border-border/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 neon-border hover:shadow-xl hover:shadow-brand/5">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
            <div>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">
                {entry.role}
              </h3>
              <p className="text-xs text-muted-foreground">{entry.company}</p>
            </div>
            <div className="flex items-center gap-2">
              {entry.current && (
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider bg-brandSecondary/10 text-brandSecondary border-brandSecondary/30">
                  Current
                </Badge>
              )}
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {entry.period}
              </span>
            </div>
          </div>

          {entry.description && (
            <p className="text-sm text-muted-foreground mb-2">{entry.description}</p>
          )}

          {entry.tags && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] uppercase tracking-wider">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {entry.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            animateTimeline("[data-timeline-line]", "[data-timeline-node]");
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-16 lg:py-20">
      <div className="mx-auto max-w-[1150px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold uppercase tracking-wider mb-1">
          Experience &amp; Education
        </h2>
        <p className="text-muted-foreground max-w-xl text-sm mb-10">
          Academic milestones from MITAOE and hands-on experiences that shaped
          my engineering mindset.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span
                className="inline-block w-8 h-0.5 bg-gradient-to-r from-brand to-brandSecondary"
                data-timeline-line
                style={{ transformOrigin: "left", transform: "scaleX(0)" }}
              />
              Education
            </h3>
            {education.map((entry, i) => (
              <TimelineCard key={i} entry={entry} index={i} />
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span
                className="inline-block w-8 h-0.5 bg-gradient-to-r from-brand to-brandSecondary"
                data-timeline-line
                style={{ transformOrigin: "left", transform: "scaleX(0)" }}
              />
              Experience
            </h3>
            {experience.map((entry, i) => (
              <TimelineCard key={i} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
