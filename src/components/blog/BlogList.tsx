import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/app/blog/page";

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No posts yet. Check back soon!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
          <Card className="h-full bg-surface/90 border-border/60 backdrop-blur-md transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5">
            <CardContent className="p-5 flex flex-col gap-3 h-full">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <time>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</time>
              </div>

              <h3 className="font-heading text-lg font-semibold tracking-tight group-hover:text-brand transition-colors">
                {post.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {post.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs py-0.5 px-2 bg-brand/5 border-brand/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-1 text-xs text-brand font-medium pt-2 border-t border-border/40 mt-auto">
                Read more
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
