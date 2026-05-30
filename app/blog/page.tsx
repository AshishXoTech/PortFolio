import Link from "next/link";
import { allPosts } from "contentlayer/generated";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical articles by Ashish Kumar Jha on full-stack development.",
};

export default function BlogPage(): JSX.Element {
  const posts = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-block font-mono text-sm text-green hover:underline"
        >
          ← Back to AshishOS
        </Link>

        <h1 className="mb-2 font-mono text-3xl text-green">Blog</h1>
        <p className="mb-12 text-muted">
          Technical writing on full-stack development, hackathons, and DevOps.
        </p>

        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-lg border border-glass bg-glass p-6 backdrop-blur-glass"
            >
              <Link href={post.url} className="group">
                <h2 className="font-mono text-xl text-text group-hover:text-green">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-muted">{post.description}</p>
                <time
                  dateTime={post.date}
                  className="mt-3 block font-mono text-xs text-green"
                >
                  {formatDate(post.date)}
                </time>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
