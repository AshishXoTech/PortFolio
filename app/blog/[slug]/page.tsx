import Link from "next/link";
import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: { slug: string };
}

export function generateStaticParams(): { slug: string }[] {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = allPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps): JSX.Element {
  const post = allPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="mb-8 inline-block font-mono text-sm text-green hover:underline"
        >
          ← Back to Blog
        </Link>

        <header className="mb-8">
          <h1 className="font-mono text-3xl text-green">{post.title}</h1>
          <p className="mt-2 text-muted">{post.description}</p>
          <time
            dateTime={post.date}
            className="mt-4 block font-mono text-xs text-muted"
          >
            {formatDate(post.date)}
          </time>
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-purple/30 bg-purple/10 px-2 py-0.5 font-mono text-xs text-purple"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-invert max-w-none rounded-lg border border-glass bg-glass p-8 backdrop-blur-glass">
          <p className="text-text">{post.body.raw}</p>
        </div>
      </article>
    </main>
  );
}
