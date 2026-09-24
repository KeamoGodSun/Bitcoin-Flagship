import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Palette,
  Megaphone,
  ArrowRight,
  Calendar,
  TrendingUp,
  Globe,
  Shield,
} from 'lucide-react';
import { eventCategories, events, blogPosts } from '@/lib/data';
import { DonateSection } from '@/components/donate-section';

const stats = [
  { value: '2,500+', label: 'Community Members' },
  { value: '48', label: 'Events Hosted' },
  { value: '12', label: 'Cities Reached' },
  { value: '6', label: 'Murals Painted' },
];

const pillars = [
  {
    icon: Users,
    title: 'Community',
    description: 'Local meetups that bring Bitcoiners together and welcome newcomers into the fold.',
  },
  {
    icon: GraduationCap,
    title: 'Education',
    description: 'Workshops and resources that make Bitcoin accessible to everyone, regardless of background.',
  },
  {
    icon: Palette,
    title: 'Public Art',
    description: 'Murals and billboards that put Bitcoin in the public eye and spark conversations.',
  },
  {
    icon: Megaphone,
    title: 'Campaigns',
    description: 'Coordinated social media efforts that amplify the Bitcoin message far and wide.',
  },
];

const feedPosts = [
  {
    handle: '@bitcoinflagship',
    time: '2h',
    text: 'Over 80 people at our first downtown meetup last night. The energy is real. Next one is already being planned. ₿',
    likes: '342',
    reposts: '87',
  },
  {
    handle: '@satoshi_fan',
    time: '5h',
    text: 'Just finished the Lightning workshop hosted by @bitcoinflagship. Made my first LN payment in person. Mind blown.',
    likes: '198',
    reposts: '41',
  },
  {
    handle: '@bitcoinflagship',
    time: '1d',
    text: 'Our mural in the River District is almost done. 40 feet of orange on a brick wall. Unveiling event Oct 20 — be there. ₿',
    likes: '521',
    reposts: '156',
  },
];

export default function Home() {
  const upcomingEvents = events.slice(0, 3);
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-bitcoin/20 blur-[120px] animate-glow-pulse" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-bitcoin/30 bg-bitcoin/10 px-4 py-1.5 text-sm font-medium text-bitcoin">
              <span className="flex h-2 w-2 rounded-full bg-bitcoin animate-pulse" />
              Grassroots Bitcoin Adoption
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Building the <span className="text-gradient-bitcoin">Bitcoin</span> future,
              <br className="hidden sm:block" /> one block at a time.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Bitcoin Flagship is a community-driven movement accelerating Bitcoin adoption through meetups, education, public art, and social campaigns.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-md bg-bitcoin px-8 py-3 text-base font-semibold text-background shadow-lg shadow-bitcoin/30 transition-all hover:bg-bitcoin-light hover:shadow-bitcoin/50"
              >
                Upcoming Events
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-8 py-3 text-base font-semibold text-foreground transition-all hover:border-bitcoin hover:text-bitcoin"
              >
                Our Mission
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-bitcoin sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Mission</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            We believe Bitcoin is the most important monetary invention in human history. Our mission is to make it accessible, understandable, and visible to everyone — not just those who already know about it.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            We do this by meeting people where they are: in their communities, in their classrooms, on their streets, and on their screens.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-bitcoin/50 hover:shadow-lg hover:shadow-bitcoin/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-bitcoin/10 text-bitcoin transition-colors group-hover:bg-bitcoin group-hover:text-background">
                <pillar.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{pillar.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Feed */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">From the Community</h2>
            <p className="mt-4 text-muted-foreground">Latest from our social feed on X / Twitter.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {feedPosts.map((post, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-background p-5 transition-all hover:border-bitcoin/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bitcoin text-background font-bold">
                      ₿
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{post.handle}</div>
                      <div className="text-xs text-muted-foreground">{post.time} ago</div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground">{post.text}</p>
                <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
                  <span>♡ {post.likes}</span>
                  <span>↻ {post.reposts}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-bitcoin transition-colors hover:text-bitcoin-light"
            >
              Follow us on X
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Upcoming Events</h2>
            <p className="mt-2 text-muted-foreground">Get involved. Show up. Stack sats.</p>
          </div>
          <Link
            href="/events"
            className="hidden items-center gap-2 text-sm font-semibold text-bitcoin hover:text-bitcoin-light sm:inline-flex"
          >
            View all events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {upcomingEvents.map((event) => {
            const cat = eventCategories.find((c) => c.id === event.category);
            return (
              <div
                key={event.title}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-bitcoin/50"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-bitcoin">
                  {cat && <cat.icon className="h-4 w-4" />}
                  <span dangerouslySetInnerHTML={{ __html: cat?.label ?? '' }} />
                </div>
                <h3 className="mt-3 text-lg font-semibold">{event.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" />
                    {event.location}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-bitcoin"
          >
            View all events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Featured Blog */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Latest Articles</h2>
              <p className="mt-2 text-muted-foreground">News, education, and community updates.</p>
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-2 text-sm font-semibold text-bitcoin hover:text-bitcoin-light sm:inline-flex"
            >
              Read the blog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-bitcoin/50"
              >
                <div className="text-xs font-medium text-bitcoin">{post.category}</div>
                <h3 className="mt-3 text-lg font-semibold group-hover:text-bitcoin transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span>·</span>
                  <span>{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Donate */}
      <DonateSection />

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-bitcoin/30 bg-gradient-to-br from-bitcoin/10 via-card to-card p-10 text-center sm:p-16">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-bitcoin/10 blur-[80px]" />
          <div className="relative">
            <Shield className="mx-auto h-12 w-12 text-bitcoin" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to join the movement?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Whether you are a Bitcoin veteran or just getting started, there is a place for you in the Bitcoin Flagship community.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-bitcoin px-8 py-3 text-base font-semibold text-background shadow-lg shadow-bitcoin/30 transition-all hover:bg-bitcoin-light"
            >
              Get in touch
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
