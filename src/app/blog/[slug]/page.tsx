import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const contentDir = path.join(process.cwd(), "content/blog");
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    title: data.title || "Untitled",
    date: data.date || "",
    description: data.description || "",
    tags: (data.tags as string[]) || [],
    content,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[700px] px-4 text-center">
          <h1 className="font-heading text-3xl font-bold mb-4">Post not found</h1>
          <Link href="/blog" className="text-brand hover:underline">
            Back to blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[700px] px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <article>
          <header className="mb-8">
            <h1 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight mb-3">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <time>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
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
          </header>

          <div className="prose prose-invert prose-sm max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-p:text-muted-foreground prose-a:text-brand prose-code:text-brand prose-pre:bg-surface prose-pre:border prose-pre:border-border/60">
            <MDXRemote source={post.content} />
          </div>
        </article>
      </div>
    </section>
  );
}
