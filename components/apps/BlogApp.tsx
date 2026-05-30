"use client";

import Link from "next/link";
import { allPosts } from "contentlayer/generated";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";

export function BlogApp(): JSX.Element {
  const posts = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-3">
      {posts.length === 0 ? (
        <p className="font-mono text-sm text-muted">No posts yet.</p>
      ) : (
        posts.map((post) => (
          <GlassCard key={post.slug} className="p-4">
            <Link href={post.url} className="group block">
              <h3 className="font-mono text-sm text-green group-hover:underline">
                {post.title}
              </h3>
              <p className="mt-1 text-xs text-muted">{post.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-mono text-xs text-muted">
                  {formatDate(post.date)}
                </span>
                <div className="flex gap-1">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="purple">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>
          </GlassCard>
        ))
      )}
    </div>
  );
}
