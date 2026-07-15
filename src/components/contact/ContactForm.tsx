"use client";

import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowUpRight } from "lucide-react";
import { animateSectionEntry } from "@/lib/anime";
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from "@/components/ui/SocialIcons";
import { useCursorState } from "@/components/cursor/CursorProvider";

export function ContactForm() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const cursorHandlers = useCursorState("link");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            animateSectionEntry("#contact .contact-content");
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const links = [
    {
      label: "Email",
      value: "aryanbhalsing7090@gmail.com",
      href: "mailto:aryanbhalsing7090@gmail.com",
      icon: <Mail className="h-4 w-4" />,
    },
    {
      label: "GitHub",
      value: "iamaryanbhalsing",
      href: "https://github.com/iamaryanbhalsing",
      icon: <GithubIcon className="h-4 w-4" />,
    },
    {
      label: "LinkedIn",
      value: "iamaryanbhalsing",
      href: "https://linkedin.com/in/iamaryanbhalsing",
      icon: <LinkedinIcon className="h-4 w-4" />,
    },
    {
      label: "LeetCode",
      value: "iamaryanbhalsing",
      href: "https://leetcode.com/iamaryanbhalsing",
      icon: <LeetCodeIcon className="h-4 w-4" />,
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1150px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          Get In Touch
        </h2>
        <p className="text-muted-foreground max-w-xl text-sm mb-12">
          Open to internships, freelance work, and collaborative projects. Let&apos;s connect.
        </p>

        <div
          className="contact-content max-w-2xl"
          style={{ opacity: 0 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                {...cursorHandlers}
                className="group"
              >
                <Card className="h-full bg-surface/90 border-border/60 backdrop-blur-md transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5">
                  <CardContent className="p-5 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-brand/10 text-brand shrink-0">
                      {link.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground mb-0.5">{link.label}</p>
                      <p className="text-sm font-medium truncate group-hover:text-brand transition-colors">
                        {link.value}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors shrink-0 mt-1" />
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
