"use client";

import { FileDown } from "lucide-react";
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from "@/components/ui/SocialIcons";

export function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/50">
      <div className="mx-auto max-w-[1150px] px-4">
        <p>
          &copy; {new Date().getFullYear()} Aryan Bhalsing &middot; All Rights
          Reserved
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <a
            href="https://linkedin.com/in/iamaryanbhalsing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/iamaryanbhalsing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href="https://leetcode.com/iamaryanbhalsing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <LeetCodeIcon className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/iamaryanbhalsing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <FileDown className="h-4 w-4" />
            <span className="text-xs">Resume</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
