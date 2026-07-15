"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { projects, PROJECT_CATEGORIES, type Project, type ProjectCategory } from "@/config/projects";
import { animateProjectCards } from "@/lib/anime";
import { GithubIcon } from "@/components/ui/SocialIcons";
import { useCursorContext } from "@/components/cursor/CursorProvider";

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { setCursorState } = useCursorContext();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    setCursorState("default");
  }, [setCursorState]);

  return (
    <article
      className="project-card group"
      data-project-card
      data-category={project.category}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setCursorState("project")}
        onMouseLeave={handleMouseLeave}
        style={{ willChange: "transform", transformStyle: "preserve-3d" }}
      >
        <Card className="h-full bg-surface/90 border-border/60 backdrop-blur-md overflow-hidden transition-shadow duration-500 hover:shadow-xl hover:shadow-brand/10 hover:border-brand/30">
          <div className="relative h-48 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            {project.flagship && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-brand/90 text-background text-[10px] uppercase tracking-wider border-0">
                  Featured
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-5 flex flex-col gap-3 flex-1">
            <h3 className="font-heading text-lg font-semibold tracking-tight">
              {project.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <Badge
                  key={tag.label}
                  variant="secondary"
                  className="text-xs py-0.5 px-2 bg-brand/5 border-brand/20"
                >
                  {tag.label}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
              <span className="text-xs text-muted-foreground">
                {project.highlight}
              </span>
              <div className="flex gap-2">
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand border border-brand/30 hover:bg-brand/20 transition-all"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Live
                  </a>
                )}
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-background/80 border border-border hover:border-brand/50 hover:text-foreground transition-all"
                  >
                    <GithubIcon className="h-3 w-3" />
                    Code
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | "all">("all");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            animateProjectCards("[data-project-card]");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!animated.current) return;

    const cards = document.querySelectorAll("[data-project-card]");
    cards.forEach((card) => {
      const el = card as HTMLElement;
      const category = el.dataset.category;
      const show = activeFilter === "all" || category === activeFilter;

      if (show) {
        el.style.display = "";
        el.style.opacity = "0";
        el.style.transform = "scale(0.95)";
        requestAnimationFrame(() => {
          el.style.transition = "opacity 0.3s ease, transform 0.3s ease";
          el.style.opacity = "1";
          el.style.transform = "scale(1)";
        });
      } else {
        el.style.transition = "opacity 0.2s ease, transform 0.2s ease";
        el.style.opacity = "0";
        el.style.transform = "scale(0.95)";
        setTimeout(() => {
          el.style.display = "none";
        }, 200);
      }
    });
  }, [activeFilter]);

  return (
    <section id="projects" ref={sectionRef} className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1150px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          Featured Projects
        </h2>
        <p className="text-muted-foreground max-w-xl text-sm mb-8">
          A selection of projects from my GitHub — spanning AI, security, full-stack, and cloud.
        </p>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-10">
          {PROJECT_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === cat.key
                  ? "bg-brand text-background shadow-lg shadow-brand/20"
                  : "bg-surface/80 border border-border/60 text-muted-foreground hover:text-foreground hover:border-brand/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
