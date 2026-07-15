"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/config/testimonials";
import { animateSectionEntry } from "@/lib/anime";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useCursorState } from "@/components/cursor/CursorProvider";

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const [current, setCurrent] = useState(0);
  const cursorHandlers = useCursorState("link");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            animateSectionEntry("#testimonials .testimonial-content");
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section id="testimonials" ref={sectionRef} className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1150px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          What People Say
        </h2>
        <p className="text-muted-foreground max-w-xl text-sm mb-12">
          Feedback from collaborators and mentors.
        </p>

        <div
          className="testimonial-content max-w-2xl mx-auto"
          style={{ opacity: 0 }}
        >
          <Card className="bg-surface/90 border-border/60 backdrop-blur-md relative overflow-hidden">
            <CardContent className="p-8">
              <Quote className="h-8 w-8 text-brand/20 mb-4" />

              <p className="text-lg text-foreground leading-relaxed mb-6 min-h-[100px]">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-heading font-bold text-sm">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role} · {t.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    {...cursorHandlers}
                    className="p-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-brand/30 transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={next}
                    {...cursorHandlers}
                    className="p-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-brand/30 transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-brand w-6" : "bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
