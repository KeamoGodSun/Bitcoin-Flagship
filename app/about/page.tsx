import Link from 'next/link';
import { Target, Eye, Heart, Zap, Users, ArrowRight } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Permissionless',
    description: 'Bitcoin does not ask for permission. Neither do we. Anyone can join, participate, and contribute.',
  },
  {
    icon: Users,
    title: 'Community-First',
    description: 'We are built by volunteers, funded by donations, and driven by people who care about the future of money.',
  },
  {
    icon: Zap,
    title: 'Action-Oriented',
    description: 'We do not just talk about adoption. We paint walls, run workshops, and show up in person.',
  },
  {
    icon: Eye,
    title: 'Open &amp; Transparent',
    description: 'Our plans, finances, and decisions are public. We are accountable to the community we serve.',
  },
];

const timeline = [
  {
    year: '2024',
    title: 'The Idea',
    description: 'A small group of Bitcoiners started meeting at a local coffee shop, frustrated by the lack of grassroots Bitcoin activity in the city.',
  },
  {
    year: '2025',
    title: 'First Meetups',
    description: 'Monthly meetups grew from 10 people to over 80. We launched our first educational workshop and painted our first mural.',
  },
  {
    year: '2026',
    title: 'Going Regional',
    description: 'Bitcoin Flagship expanded to 12 cities, launched billboard campaigns, and built a coordinated social media presence.',
  },
];

const team = [
  { name: 'Alex Nakamoto', role: 'Founder &amp; Community Lead', bio: 'Bitcoin maximalist since 2017. Organizes meetups and leads community strategy.' },
  { name: 'Jordan Rivers', role: 'Education Director', bio: 'Former teacher turned Bitcoin educator. Designs and runs all workshop programs.' },
  { name: 'Sam Carter', role: 'Creative &amp; Murals', bio: 'Street artist and designer. Coordinates mural projects and billboard campaigns.' },
  { name: 'Riley Chen', role: 'Social Media Lead', bio: 'Manages our online presence and coordinates social media campaigns across platforms.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-bitcoin/15 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              About <span className="text-gradient-bitcoin">Bitcoin Flagship</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We are a grassroots community on a mission to accelerate Bitcoin adoption — one meetup, one workshop, one mural at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold">Our Story</h2>
          <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Bitcoin Flagship started in 2024 as a handful of Bitcoiners meeting at a coffee shop, frustrated that their city had no visible Bitcoin community. They decided to change that.
            </p>
            <p>
              What began as a monthly meetup quickly grew into something bigger. People showed up with questions, with ideas, and with energy. Within a year, we were running educational workshops, painting murals, and launching social media campaigns that reached thousands.
            </p>
            <p>
              Today, Bitcoin Flagship operates in 12 cities and is entirely volunteer-run. We are not a company, we are not funded by venture capital, and we do not sell anything. We are a community of people who believe Bitcoin matters and want to help others understand why.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-bitcoin/10 text-bitcoin">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Mission</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                To accelerate Bitcoin adoption by making it accessible, understandable, and visible to everyone — through community events, education, public art, and coordinated social campaigns.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-bitcoin/10 text-bitcoin">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Vision</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                A world where Bitcoin is understood and used by everyday people — not just investors and technologists. A world where sound money is a cultural norm, not a niche interest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">What We Value</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-bitcoin/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-bitcoin/10 text-bitcoin transition-colors group-hover:bg-bitcoin group-hover:text-background">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold" dangerouslySetInnerHTML={{ __html: value.title }} />
              <p className="mt-2 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: value.description }} />
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Our Journey</h2>
          <div className="mt-12 space-y-8">
            {timeline.map((item, i) => (
              <div key={item.year} className="relative flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bitcoin text-background font-bold text-sm">
                    {item.year}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="mt-2 h-full w-px bg-border" />
                  )}
                </div>
                <div className="pb-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">The Team</h2>
        <p className="mt-4 text-center text-muted-foreground">Volunteers who keep the movement running.</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-bitcoin/50"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-bitcoin/10 text-2xl font-bold text-bitcoin">
                {member.name.charAt(0)}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-bitcoin" dangerouslySetInnerHTML={{ __html: member.role }} />
              <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-bitcoin/30 bg-gradient-to-br from-bitcoin/10 via-card to-card p-10 text-center sm:p-16">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-bitcoin/10 blur-[80px]" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Want to get involved?</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              We are always looking for volunteers, speakers, artists, and community builders.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-bitcoin px-8 py-3 text-base font-semibold text-background shadow-lg shadow-bitcoin/30 transition-all hover:bg-bitcoin-light"
            >
              Reach out
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
