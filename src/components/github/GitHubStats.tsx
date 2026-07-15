"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { animateSectionEntry } from "@/lib/anime";
import { GithubIcon } from "@/components/ui/SocialIcons";
import { GitFork, Star, Users, BookOpen } from "lucide-react";

interface GitHubProfile {
  public_repos: number;
  followers: number;
  following: number;
  bio: string;
  created_at: string;
}

export function GitHubStats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/users/iamaryanbhalsing")
      .then((res) => res.json())
      .then((data) => {
        if (data.public_repos !== undefined) {
          setProfile({
            public_repos: data.public_repos,
            followers: data.followers,
            following: data.following,
            bio: data.bio || "",
            created_at: data.created_at,
          });
        }
      })
      .catch(() => {
        setProfile({
          public_repos: 30,
          followers: 0,
          following: 0,
          bio: "Full-Stack Developer & AI Enthusiast",
          created_at: "2019-01-01T00:00:00Z",
        });
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            animateSectionEntry("#stats .stats-content");
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Repos",
      value: profile?.public_repos ?? "—",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Followers",
      value: profile?.followers ?? "—",
    },
    {
      icon: <Star className="h-5 w-5" />,
      label: "Stars",
      value: "95+",
    },
    {
      icon: <GitFork className="h-5 w-5" />,
      label: "Following",
      value: profile?.following ?? "—",
    },
  ];

  return (
    <section id="stats" ref={sectionRef} className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1150px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          GitHub Profile
        </h2>
        <p className="text-muted-foreground max-w-xl text-sm mb-12">
          Live stats from my GitHub account.
        </p>

        <div
          className="stats-content"
          style={{ opacity: 0 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-surface/90 border-border/60 backdrop-blur-md">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-brand/10 text-brand">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="font-heading text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Profile link */}
          <a
            href="https://github.com/iamaryanbhalsing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full text-sm font-medium bg-surface/90 border border-border/60 text-muted-foreground hover:text-foreground hover:border-brand/30 transition-all duration-300"
          >
            <GithubIcon className="h-4 w-4" />
            View GitHub Profile
          </a>
        </div>
      </div>
    </section>
  );
}
