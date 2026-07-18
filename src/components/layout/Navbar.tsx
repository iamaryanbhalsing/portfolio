"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeProvider";
import { AccentPicker } from "@/components/ui/AccentPicker";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = document.querySelectorAll("section[id]");
      const scrollPos = window.scrollY + 120;

      sections.forEach((section) => {
        const el = section as HTMLElement;
        const top = el.offsetTop;
        const height = el.offsetHeight;
        const id = section.getAttribute("id") || "";
        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSection(id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 shadow-lg shadow-background/50 border-b border-border"
          : "bg-background/80 backdrop-blur-md border-b border-border/50"
      }`}
    >
      <div className="mx-auto max-w-[1150px] px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          <Link href="#hero" className="flex items-center gap-2.5 group">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-brand to-brandSecondary shadow-lg shadow-brand/50 group-hover:scale-110 transition-transform" />
            <span className="font-heading font-semibold text-sm tracking-tight">
              Aryan Bhalsing
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`relative py-1 transition-colors hover:text-foreground ${
                    activeSection === link.href.slice(1)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-foreground transition-all duration-300 ${
                      activeSection === link.href.slice(1)
                        ? "w-full"
                        : "w-0"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <AccentPicker />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          </div>
        </nav>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border/50 mt-2 pt-4">
            <ul className="flex flex-col items-center gap-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`transition-colors hover:text-foreground ${
                      activeSection === link.href.slice(1)
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
