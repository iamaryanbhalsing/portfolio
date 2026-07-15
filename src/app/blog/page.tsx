import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogList } from "@/components/blog/BlogList";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

function getPosts(): BlogPost[] {
  const contentDir = path.join(process.cwd(), "content/blog");
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
      const { data } = matter(raw);
      return {
        slug: file.replace(".mdx", ""),
        title: data.title || "Untitled",
        date: data.date || "",
        description: data.description || "",
        tags: data.tags || [],
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function BlogPage() {
  const posts = getPosts();

  return (
    <section id="blog" className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1150px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          Blog
        </h2>
        <p className="text-muted-foreground max-w-xl text-sm mb-12">
          Thoughts on development, security, and building things.
        </p>

        <BlogList posts={posts} />
      </div>
    </section>
  );
}
