"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { skillCategories } from "@/config/skills";
import { animateSkills } from "@/lib/anime";
import { SkillBar } from "./SkillBar";

const CATEGORY_COLORS: Record<string, string> = {
  Languages: "#38BDF8",
  "Frameworks & Libraries": "#22C55E",
  "Security & OSINT": "#f59e0b",
  "Tools & Platforms": "#818cf8",
};

export function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            animateSkills("[data-skill-badge]");
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1150px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          Skills & Technologies
        </h2>
        <p className="text-muted-foreground max-w-xl text-sm mb-12">
          Proficiency based on real project work across 30+ GitHub repositories.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((cat) => (
            <Card key={cat.title} className="bg-surface/90 border-border/60 backdrop-blur-md" data-skill-badge>
              <CardContent className="p-6">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider mb-5 text-muted-foreground">
                  {cat.title}
                </h3>
                <div className="space-y-4">
                  {cat.skills.map((skill, i) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      proficiency={skill.proficiency}
                      color={CATEGORY_COLORS[cat.title] || "#38BDF8"}
                      delay={i * 80}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
