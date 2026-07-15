"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { animateSectionEntry } from "@/lib/anime";
import { useCursorState } from "@/components/cursor/CursorProvider";
import { StatCounter } from "@/components/ui/StatCounter";

const interests = [
  "Cybersecurity",
  "AI/ML",
  "Cloud Computing",
  "Open Source",
  "Photography",
  "Gaming",
];

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const cursorHandlers = useCursorState("link");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            animateSectionEntry("#about .about-content");
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1150px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          About Me
        </h2>
        <p className="text-muted-foreground max-w-xl text-sm mb-12">
          A bit about who I am and what drives me.
        </p>

        <div
          className="about-content grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start"
          style={{ opacity: 0 }}
        >
          {/* Headshot + quick info */}
          <div className="space-y-4">
            <div className="w-[240px] h-[280px] rounded-2xl overflow-hidden border border-border/60">
              <img
                src="https://iili.io/BJ9Bw4n.jpg"
                alt="Aryan Bhalsing"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-semibold text-lg">Aryan Bhalsing</h3>
              <p className="text-sm text-muted-foreground">CS Student at MITAOE, Pune</p>
              <a
                href="#contact"
                {...cursorHandlers}
                className="inline-block text-sm text-brand hover:text-brand/80 transition-colors"
              >
                Get in touch →
              </a>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-5">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I&apos;m a computer science student who likes building things that work well
                and are built to last. Most of my time goes into full-stack web development,
                AI/ML experiments, and cybersecurity tools.
              </p>
              <p>
                On GitHub, I&apos;ve shipped 30+ projects — from a hand-gesture virtual mouse
                with 16 stars, to a blockchain voting platform, to an NLP chatbot deployed
                on Render. I&apos;m a Developer Program Member and my goal is 365 projects
                in 365 days.
              </p>
              <p>
                When I&apos;m not coding, you&apos;ll find me gaming, taking photos, or exploring
                new places. I believe good software starts with understanding the people
                who use it.
              </p>
            </div>

            {/* Interests */}
            <div>
              <h4 className="text-sm font-medium mb-3">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="text-xs px-3 py-1.5 rounded-full bg-surface/80 border border-border/60 text-muted-foreground"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {[
                { target: 30, suffix: "+", label: "Repositories" },
                { target: 95, suffix: "+", label: "GitHub Stars" },
                { target: 15, suffix: "+", label: "Technologies" },
                { target: 365, suffix: "", label: "Projects Goal" },
              ].map((fact) => (
                <div key={fact.label} className="text-center p-3 rounded-xl bg-surface/60 border border-border/40">
                  <div className="font-heading text-xl font-bold text-foreground">
                    <StatCounter target={fact.target} suffix={fact.suffix} label="" duration={1200} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{fact.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
