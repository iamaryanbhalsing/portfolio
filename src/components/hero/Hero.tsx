"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, ChevronDown, Download, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from "@/components/ui/SocialIcons";
import { animateHeroIntro, animateHeroParallax } from "@/lib/anime";
import { useCursorState } from "@/components/cursor/CursorProvider";
import { useMousePosition } from "@/hooks/useMousePosition";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { StatCounter } from "@/components/ui/StatCounter";
import { TypingText } from "@/components/ui/TypingText";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useRef<HTMLAnchorElement>(null);
  const cursorHandlers = useCursorState("link");
  const prefersReducedMotion = usePrefersReducedMotion();
  const isTouchDevice = useIsTouchDevice();
  const { subscribe } = useMousePosition();

  // Intro animation + parallax
  useEffect(() => {
    animateHeroIntro("#hero");
    const cleanup = animateHeroParallax("#hero");
    return cleanup;
  }, []);

  // 3D tilt on profile photo
  useEffect(() => {
    if (prefersReducedMotion || isTouchDevice) return;
    const unsubscribe = subscribe(({ x, y }) => {
      const el = photoRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;
      el.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    });
    return () => { unsubscribe(); };
  }, [prefersReducedMotion, isTouchDevice, subscribe]);

  // Magnetic pull on primary CTA
  useEffect(() => {
    if (prefersReducedMotion || isTouchDevice) return;
    const unsubscribe = subscribe(({ x, y }) => {
      const el = primaryBtnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;
      const dist = Math.sqrt((x - btnX) ** 2 + (y - btnY) ** 2);
      if (dist < 100) {
        const pull = (1 - dist / 100) * 8;
        el.style.transform = `translate(${((x - btnX) * pull) / 100}px, ${((y - btnY) * pull) / 100}px)`;
      } else {
        el.style.transform = "";
      }
    });
    return () => { unsubscribe(); };
  }, [prefersReducedMotion, isTouchDevice, subscribe]);

  // Reset photo tilt on mouse leave
  const resetPhotoTilt = () => {
    const el = photoRef.current;
    if (el) el.style.transform = "perspective(500px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  };

  // Floating particles
  useEffect(() => {
    if (prefersReducedMotion || isTouchDevice) return;
    const container = heroRef.current;
    if (!container) return;

    const particles = Array.from({ length: 10 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      el: document.createElement("div"),
    }));

    particles.forEach((p) => {
      p.el.className = "hero-particle";
      container.appendChild(p.el);
    });

    let raf: number;
    function tick() {
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 100) p.vx *= -1;
        if (p.y < 0 || p.y > 100) p.vy *= -1;
        p.el.style.left = `${p.x}%`;
        p.el.style.top = `${p.y}%`;
      });
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      particles.forEach((p) => p.el.remove());
    };
  }, [prefersReducedMotion, isTouchDevice]);

  return (
    <section id="hero" ref={heroRef} className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background gradient blob */}
      <div className="hero-bg absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-brand/8 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
        {/* Profile photo with glow ring + availability badge + 3D tilt */}
        <div className="mb-8 hero-badge">
          <div className="relative inline-block">
            <div
              ref={photoRef}
              className="w-28 h-28 rounded-full p-[2px] bg-gradient-to-br from-brand to-brandSecondary mx-auto transition-transform duration-150 ease-out"
              style={{ transformStyle: "preserve-3d" }}
              onMouseLeave={resetPhotoTilt}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-background">
                <img
                  src="https://iili.io/BJ9Bw4n.jpg"
                  alt="Aryan Bhalsing"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Glow ring */}
            <div className="hero-photo-glow" aria-hidden="true" />
            {/* Availability indicator */}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-background/90 border border-border px-2.5 py-0.5 text-xs text-foreground backdrop-blur-sm whitespace-nowrap z-10">
              <span className="hero-availability-dot h-2 w-2 rounded-full bg-green-500 inline-block" />
              Open to work
            </span>
          </div>
        </div>

        {/* Name — letter-by-letter animated reveal */}
        <h1 className="hero-title font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-4 animated-gradient-text">
          Aryan Bhalsing
        </h1>

        {/* Value proposition — typing animation */}
        <p className="hero-subtitle text-lg sm:text-xl text-muted-foreground max-w-[600px] mx-auto mb-8 leading-relaxed">
          <TypingText
            strings={[
              "Full-Stack Developer & AI Enthusiast",
              "Cybersecurity Explorer",
              "Open Source Contributor",
              "Building secure, scalable systems",
            ]}
            typeSpeed={70}
            deleteSpeed={35}
            pauseDuration={2500}
          />
          <span className="block text-base mt-2 text-muted-foreground/70">
            CS student at MIT Academy of Engineering, Pune.
          </span>
        </p>

        {/* Primary CTAs — magnetic pull on first button */}
        <div className="hero-cta flex flex-wrap items-center justify-center gap-4 mb-6">
          <a
            ref={primaryBtnRef}
            href="#projects"
            {...cursorHandlers}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-medium text-sm uppercase tracking-wider bg-gradient-to-r from-brand to-brandSecondary text-background hover:shadow-lg hover:shadow-brand/30 transition-all duration-300"
          >
            View Projects
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/iamaryanbhalsing"
            target="_blank"
            rel="noopener noreferrer"
            {...cursorHandlers}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-medium text-sm uppercase tracking-wider border border-border bg-background/80 backdrop-blur-sm hover:bg-muted hover:border-brand/50 text-foreground transition-all duration-300"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
        </div>

        {/* Secondary row — LinkedIn, LeetCode, Email, Resume */}
        <div className="hero-cta flex flex-wrap items-center justify-center gap-3 mb-12">
          <a
            href="https://linkedin.com/in/iamaryanbhalsing"
            target="_blank"
            rel="noopener noreferrer"
            {...cursorHandlers}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 font-medium text-xs uppercase tracking-wider border border-border bg-background/60 backdrop-blur-sm hover:bg-muted hover:border-brand/40 text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            <LinkedinIcon className="h-3.5 w-3.5" />
            LinkedIn
          </a>
          <a
            href="https://leetcode.com/iamaryanbhalsing"
            target="_blank"
            rel="noopener noreferrer"
            {...cursorHandlers}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 font-medium text-xs uppercase tracking-wider border border-border bg-background/60 backdrop-blur-sm hover:bg-muted hover:border-brand/40 text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            <LeetCodeIcon className="h-3.5 w-3.5" />
            LeetCode
          </a>
          <a
            href="mailto:aryanbhalsing@gmail.com"
            {...cursorHandlers}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 font-medium text-xs uppercase tracking-wider border border-border bg-background/60 backdrop-blur-sm hover:bg-muted hover:border-brand/40 text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </a>
          <a
            href="/resume.pdf"
            download
            {...cursorHandlers}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 font-medium text-xs uppercase tracking-wider border border-border bg-background/60 backdrop-blur-sm hover:bg-muted hover:border-brand/40 text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            <Download className="h-3.5 w-3.5" />
            Resume
          </a>
        </div>

        {/* Quick stats — glass cards */}
        <div className="hero-meta flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="glass rounded-xl px-5 py-3 text-center">
            <StatCounter target={30} suffix="+" label="Repos" delay={800} />
          </div>
          <div className="glass rounded-xl px-5 py-3 text-center">
            <StatCounter target={95} suffix="+" label="Stars" delay={950} />
          </div>
          <div className="glass rounded-xl px-5 py-3 text-center">
            <StatCounter target={6} suffix="+" label="Tech" delay={1100} />
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <p className="hero-hint text-xs text-muted-foreground/40 mt-4 opacity-0">
          Press <kbd className="px-1.5 py-0.5 rounded border border-border/60 bg-surface/40 font-mono text-[10px]">Ctrl</kbd>{" "}
          + <kbd className="px-1.5 py-0.5 rounded border border-border/60 bg-surface/40 font-mono text-[10px]">`</kbd>{" "}
          to open terminal
        </p>
      </div>

      {/* Scroll indicator — fades out on scroll via parallax */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="h-6 w-6 text-muted-foreground/50" />
      </div>

      {/* Hero-to-section gradient transition */}
      <div className="hero-section-transition" aria-hidden="true" />
    </section>
  );
}
