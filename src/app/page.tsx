"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { Projects } from "@/components/projects/Projects";
import { Skills } from "@/components/skills/Skills";
import { SkillRadar } from "@/components/skills/SkillRadar";
import { Timeline } from "@/components/timeline/Timeline";
import { Certifications } from "@/components/certifications/Certifications";
import { Testimonials } from "@/components/testimonials/Testimonials";
import { GitHubStats } from "@/components/github/GitHubStats";
import { ContributionHeatmap } from "@/components/github/ContributionHeatmap";
import { About } from "@/components/about/About";
import { ContactForm } from "@/components/contact/ContactForm";
import { AnimatedMesh } from "@/components/background/AnimatedMesh";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";
import { Terminal } from "@/components/terminal/Terminal";

export default function Home() {
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <AnimatedMesh />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1 relative z-10">
        <section data-cursor-theme="dark">
          <div className="reveal">
            <Hero />
          </div>
        </section>

        <div className="mx-auto max-w-[1150px] px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <section data-cursor-theme="dark">
          <div className="reveal">
            <Projects />
          </div>
        </section>

        <div className="mx-auto max-w-[1150px] px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <section data-cursor-theme="dark">
          <div className="reveal">
            <Skills />
          </div>
        </section>

        <div className="mx-auto max-w-[1150px] px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <section data-cursor-theme="dark">
          <div className="reveal">
            <SkillRadar />
          </div>
        </section>

        <div className="mx-auto max-w-[1150px] px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <section data-cursor-theme="dark">
          <div className="reveal">
            <Timeline />
          </div>
        </section>

        <div className="mx-auto max-w-[1150px] px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <section data-cursor-theme="dark">
          <div className="reveal">
            <Certifications />
          </div>
        </section>

        <div className="mx-auto max-w-[1150px] px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <section data-cursor-theme="dark">
          <div className="reveal">
            <Testimonials />
          </div>
        </section>

        <div className="mx-auto max-w-[1150px] px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <section data-cursor-theme="dark">
          <div className="reveal">
            <GitHubStats />
          </div>
        </section>

        <div className="mx-auto max-w-[1150px] px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <section data-cursor-theme="dark">
          <div className="reveal">
            <ContributionHeatmap />
          </div>
        </section>

        <div className="mx-auto max-w-[1150px] px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <section data-cursor-theme="dark">
          <div className="reveal">
            <About />
          </div>
        </section>

        <div className="mx-auto max-w-[1150px] px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <section data-cursor-theme="dark">
          <div className="reveal">
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <Terminal />
    </>
  );
}
