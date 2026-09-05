import Link from 'next/link';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { blogPosts } from '@/lib/data';

export const metadata = {
  title: 'Blog — Bitcoin Flagship',
  description: 'Articles, education, and community updates from Bitcoin Flagship.',
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-bitcoin/15 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              The <span className="text-gradient-bitcoin">Blog</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Education, community updates, and thoughts on Bitcoin adoption.
            </p>
          </div>
        </div>
      </section>

      {/* Featured post */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href={`/blog/${featured.slug}`}
          className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-bitcoin/50"
        >
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[240px] bg-gradient-to-br from-bitcoin/20 via-bitcoin/5 to-background">
              <div className="flex h-full min-h-[240px] items-center justify-center">
                <span className="text-8xl font-bold text-bitcoin/30">₿</span>
              </div>
            </div>
            <div className="p-8 lg:p-10">
              <div className="inline-flex items-center rounded-full bg-bitcoin/10 px-3 py-1 text-xs font-semibold text-bitcoin">
                Featured · {featured.category}
              </div>
              <h2 className="mt-4 text-2xl font-bold group-hover:text-bitcoin transition-colors">
                {featured.title}
              </h2>
              <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {featured.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {featured.date}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* All posts */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold">All Articles</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[featured, ...rest].map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-bitcoin/50 hover:shadow-lg hover:shadow-bitcoin/5"
            >
              <div className="text-xs font-medium text-bitcoin">{post.category}</div>
              <h3 className="mt-3 text-lg font-semibold group-hover:text-bitcoin transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span>·</span>
                  <span>{post.date}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-bitcoin opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
