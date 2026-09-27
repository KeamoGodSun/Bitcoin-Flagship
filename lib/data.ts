import {
  Users,
  GraduationCap,
  Palette,
  Megaphone,
  type LucideIcon,
} from 'lucide-react';

export type EventCategory = 'meetups' | 'education' | 'murals' | 'campaigns';

export interface EventItem {
  id: string;
  title: string;
  /** ISO calendar date, YYYY-MM-DD. Drives the calendar, timeline, and .ics export. */
  date: string;
  /** Optional ISO end date for multi-day events. */
  endDate?: string;
  location: string;
  description: string;
  category: EventCategory;
  /** Program id from lib/programs.ts — decides which wallet receives the donation. */
  programId: string;
}

export interface EventCategoryMeta {
  id: EventCategory;
  label: string;
  icon: LucideIcon;
  description: string;
}

export function parseEventDate(event: EventItem | string): Date {
  const raw = typeof event === 'string' ? event : event.date;
  return new Date(raw);
}

export function eventDateKey(date: Date): string {
  return date.toLocaleDateString('en-CA');
}

export function sortEventsByDate(items: EventItem[]): EventItem[] {
  return [...items].sort(
    (a, b) => parseEventDate(a).getTime() - parseEventDate(b).getTime()
  );
}

export function eventsByDate(items: EventItem[]): Map<string, EventItem[]> {
  const map = new Map<string, EventItem[]>();
  for (const event of sortEventsByDate(items)) {
    const key = eventDateKey(parseEventDate(event));
    const bucket = map.get(key);
    if (bucket) bucket.push(event);
    else map.set(key, [event]);
  }
  return map;
}

export const eventCategories: EventCategoryMeta[] = [
  {
    id: 'meetups',
    label: 'Meetups',
    icon: Users,
    description: 'Regular community gatherings where Bitcoiners connect, share ideas, and welcome newcomers.',
  },
  {
    id: 'education',
    label: 'Educational Programs',
    icon: GraduationCap,
    description: 'Workshops and courses covering everything from the basics of self-custody to advanced Lightning Network topics.',
  },
  {
    id: 'murals',
    label: 'Murals & Billboards',
    icon: Palette,
    description: 'Public art and billboard campaigns bringing Bitcoin visibility to the streets of major cities.',
  },
  {
    id: 'campaigns',
    label: 'Social Media Campaigns',
    icon: Megaphone,
    description: 'Coordinated online campaigns to amplify the Bitcoin message across social platforms.',
  },
];

export const events: EventItem[] = [
  {
    id: 'monthly-meetup-oct',
    title: 'Monthly Bitcoin Meetup — Downtown',
    date: '2026-10-12',
    location: 'Downtown Community Center',
    description:
      'Our flagship monthly meetup featuring a guest speaker, open Q&A, and networking. All levels welcome.',
    category: 'meetups',
    programId: 'meet-ups',
  },
  {
    id: 'beginners-night-oct',
    title: 'Bitcoin Beginners Night',
    date: '2026-10-26',
    location: 'Central Library, Room 3B',
    description:
      'A relaxed, jargon-free introduction to Bitcoin. Bring a friend who keeps asking you about it.',
    category: 'meetups',
    programId: 'meet-ups',
  },
  {
    id: 'lightning-workshop-nov',
    title: 'Lightning Network Hands-On Workshop',
    date: '2026-11-03',
    location: 'Innovation Hub, Tech District',
    description:
      'Set up your own Lightning node, open channels, and make your first on-chain payment in person.',
    category: 'education',
    programId: 'lightning-bootcamp',
  },
  {
    id: 'self-custody-masterclass-nov',
    title: 'Self-Custody & Security Masterclass',
    date: '2026-11-17',
    location: 'Online (Zoom)',
    description:
      'Learn hardware wallet setup, multisig configurations, and best practices for securing your stack.',
    category: 'education',
    programId: 'trezor-academy',
  },
  {
    id: 'mural-unveiling-oct',
    title: 'Bitcoin Mural Unveiling — River District',
    date: '2026-10-20',
    location: 'River District Wall, 4th & Main',
    description:
      'Join us for the unveiling of our largest mural yet — a 40-foot celebration of sound money.',
    category: 'murals',
    programId: 'murals-billboards',
  },
  {
    id: 'billboard-launch-nov',
    title: 'Highway Billboard Campaign Launch',
    date: '2026-11-01',
    location: 'I-95 Corridor',
    description:
      'Three billboards go live along the highway corridor. Come help us celebrate and document the launch.',
    category: 'murals',
    programId: 'murals-billboards',
  },
  {
    id: 'stacksats-recap-oct',
    title: '#StackSatsSeptember Recap Campaign',
    date: '2026-10-01',
    location: 'Online — X / Twitter',
    description:
      'A month-long social media campaign sharing stories from first-time dollar-cost averagers.',
    category: 'campaigns',
    programId: 'social-campaigns',
  },
  {
    id: 'whitepaper-thunderclap-oct',
    title: 'Bitcoin Whitepaper Day Thunderclap',
    date: '2026-10-31',
    location: 'Online — All Platforms',
    description:
      'Coordinated post storm celebrating the Bitcoin whitepaper anniversary. Sign up to participate.',
    category: 'campaigns',
    programId: 'social-campaigns',
  },
];

export interface CommunityPost {
  id: string;
  author: string;
  handle: string;
  date: string;
  content: string;
  tags: string[];
  /**
   * No likes or sats fields on purpose. Counts are read from the database at
   * render time, so a number can never be baked into a fixture and then shown
   * to visitors as if people had done it.
   */
  /** Placeholder story kept for layout only. Real posts come from the database. */
  sample?: boolean;
}

export const communityPosts: CommunityPost[] = [
  {
    id: 'c1',
    author: 'Naledi K',
    handle: '@naledistacks',
    date: 'Sep 04, 2026',
    content:
      '27th birthday down. 27% of my 27 target stacked today. The birthday "gift to self" — I DCA, run my own node, and I finally taught my mom how to verify a transaction onchain. She watched the block explorer like it was magic. It kind of is.',
    tags: ['First steps', 'Node running'],
    sample: true,
  },
  {
    id: 'c2',
    author: 'Thabo M',
    handle: '@thabo_runs_ln',
    date: 'Sep 02, 2026',
    content:
      'Opened my first Lightning channel on mainnet after last month’s workshop. Paid for coffee with a 0-fee chained payment from my phone. Settled in under a second while the barista blinked. Lightning is not the future — it’s Tuesday.',
    tags: ['Lightning', 'Node running'],
    sample: true,
  },
  {
    id: 'c3',
    author: 'Sipho N',
    handle: '@sipho_via_coldcard',
    date: 'Aug 30, 2026',
    content:
      'Moved everything off the exchange into self-custody. The 3 weeks of reading and the paranoid re-checks of my seed phrase were worth it. Cold storage feels like freedom you can actually touch. Stay humble, stack sats.',
    tags: ['Self-custody'],
    sample: true,
  },
  {
    id: 'c4',
    author: 'Karabo B',
    handle: '@karabo_dca',
    date: 'Aug 26, 2026',
    content:
      'My employer asked how I’d like part of my salary — I asked for sats with a smile. They didn’t say no. Teaching my team one meme-able Bitcoin idea per week. Adoption is a conversation, not an event.',
    tags: ['Education', 'DCA'],
    sample: true,
  },
  {
    id: 'c5',
    author: 'Lerato D',
    handle: '@lerato_paints_orange',
    date: 'Aug 21, 2026',
    content:
      'Painted my first Bitcoin mural corner during the River District unveiling. A stranger stopped to ask "what’s that symbol?" — that question is the whole mission. 20 minutes later she was asking how to buy her first 5 percent.',
    tags: ['Murals', 'Public art'],
    sample: true,
  },
];

export interface Merchant {
  id: string;
  name: string;
  category: string;
  area: string;
  /** What they accept, e.g. "Lightning + on-chain". */
  payment: string;
  /** Lightning address or payment link, when published. */
  lightning?: string;
  website?: string;
  /** One line on what they actually sell. */
  note: string;
  /**
   * How we know this entry is real.
   *
   * 'verified' means someone on the team has confirmed the business trades
   * sats. 'claimed' means the owner listed themselves and we have not checked
   * yet. Nothing goes in here unlabelled, because a directory that mixes
   * invented shops in with real ones is worse than an empty one.
   */
  standing: 'verified' | 'claimed';
}

/**
 * Intentionally empty until real entries land.
 *
 * These used to hold three placeholder businesses with made-up Lightning
 * addresses. They read as real shops, which is exactly the problem: a visitor
 * would have copied `coffee@bitcoinflagship.com` and sent money into a void.
 * Add entries here only for businesses that actually exist, and set `standing`
 * to match how far we have verified them.
 */
export const merchants: Merchant[] = [];

/**
 * Sample rows used only to review the directory's layout.
 *
 * These are not businesses. They are never merged into `merchants`, and the
 * store only renders them when the URL carries `?sample=1`, where every card is
 * badged SAMPLE and the page says so above the grid. That keeps the design
 * review possible without ever putting a made-up shop in front of a visitor.
 */
export const sampleMerchants: Merchant[] = [
  {
    id: 's1',
    name: 'Sample name here',
    category: 'Food & drink',
    area: 'Suburb name',
    payment: 'Lightning',
    lightning: 'name@domain.example',
    note: 'One line on what they actually sell, in the same voice a shopkeeper would use.',
    standing: 'verified',
  },
  {
    id: 's2',
    name: 'Another sample business',
    category: 'Art & printing',
    area: 'City centre',
    payment: 'On-chain',
    website: 'https://example.com',
    note: 'Shows the on-chain variant with a website link and no Lightning address.',
    standing: 'verified',
  },
  {
    id: 's3',
    name: 'Longer business name to test truncation',
    category: 'Services',
    area: 'Suburb name',
    payment: 'Lightning + on-chain',
    lightning: 'a-much-longer-name@domain.example',
    note: 'Used to check that long names, long addresses and the two payment badges all hold their line.',
    standing: 'claimed',
  },
  {
    id: 's4',
    name: 'Sample food spot',
    category: 'Food & drink',
    area: 'Harbour',
    payment: 'Lightning',
    note: 'No Lightning address and no website, so the card renders without the address row.',
    standing: 'claimed',
  },
  {
    id: 's5',
    name: 'Sample hardware shop',
    category: 'Hardware',
    area: 'City centre',
    payment: 'On-chain',
    website: 'https://example.org',
    note: 'Second category row, used to confirm the category filter has more than one group to switch between.',
    standing: 'verified',
  },
  {
    id: 's6',
    name: 'Sample education provider',
    category: 'Education',
    area: 'Online',
    payment: 'Lightning',
    lightning: 'teach@domain.example',
    note: 'Online-only entry, to check an area value that is not a physical suburb.',
    standing: 'claimed',
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-bitcoin-adoption-matters',
    title: 'Why Bitcoin Adoption Matters in 2026',
    excerpt:
      'As inflation erodes savings worldwide, Bitcoin offers a permissionless alternative. Here is why grassroots adoption is the most important trend of the decade.',
    date: 'Sep 28, 2026',
    author: 'Satoshi Fan',
    category: 'Education',
    content: [
      'Bitcoin adoption is no longer a fringe conversation. In 2026, we are seeing nation-states, corporations, and everyday individuals recognizing Bitcoin as a savings technology and a medium of exchange.',
      'The core value proposition is simple: Bitcoin is money that cannot be inflated. There will only ever be 21 million coins. This scarcity, combined with its decentralized network, makes it a unique tool for preserving purchasing power over time.',
      'But adoption is not just about price. It is about freedom. Bitcoin gives people the ability to hold their own wealth without relying on a bank, a government, or any third party. That is a profound shift in the relationship between individuals and money.',
      'At Bitcoin Flagship, our mission is to accelerate this adoption at the grassroots level. Through meetups, education, public art, and social campaigns, we are helping people understand and use Bitcoin in their daily lives.',
    ],
  },
  {
    slug: 'first-meetup-recap',
    title: 'Recap: Our First Downtown Bitcoin Meetup',
    excerpt:
      'Over 80 Bitcoiners showed up to our inaugural meetup. Here is what happened, what we learned, and what is next.',
    date: 'Sep 15, 2026',
    author: 'Community Team',
    category: 'Community',
    content: [
      'When we announced our first downtown meetup, we hoped for 30 attendees. Over 80 people showed up — a clear sign that the community is hungry for in-person Bitcoin events.',
      'The evening kicked off with a presentation on the basics of Bitcoin, followed by a lively Q&A session. Questions ranged from "how does mining actually work?" to "what hardware wallet should I buy?" — exactly the kind of curiosity we hoped to foster.',
      'The highlight of the night was the networking. Dozens of first-time attendees connected with experienced Bitcoiners, and several people set up their first wallets on the spot with help from community members.',
      'We are already planning the next meetup. If you missed this one, do not worry — there will be plenty more opportunities to connect.',
    ],
  },
  {
    slug: 'lightning-network-explained',
    title: 'The Lightning Network Explained Simply',
    excerpt:
      'Bitcoin is great for storing value, but what about buying coffee? The Lightning Network makes instant, low-cost payments possible.',
    date: 'Aug 30, 2026',
    author: 'Satoshi Fan',
    category: 'Education',
    content: [
      'The Lightning Network is a second-layer payment protocol built on top of Bitcoin. It enables near-instant, low-fee transactions by opening payment channels between parties.',
      'Think of it like a tab at a bar. Instead of settling every drink individually on the blockchain (slow and expensive), you open a channel, make many small transactions off-chain, and only settle the final balance on-chain when you are done.',
      'This makes Lightning ideal for everyday payments — coffee, groceries, tips, and microtransactions that would be impractical on the base layer.',
      'At our upcoming Lightning workshop, you will set up your own node, open channels, and make real payments. No prior experience needed — just bring a laptop and curiosity.',
    ],
  },
  {
    slug: 'mural-project-launch',
    title: 'Painting the Town Orange: Our Mural Project Launches',
    excerpt:
      'We are bringing Bitcoin to the streets. Our first mural goes up next month, and we want you involved.',
    date: 'Aug 10, 2026',
    author: 'Community Team',
    category: 'Projects',
    content: [
      'Art has always been a powerful tool for spreading ideas. That is why we are launching a mural project to bring Bitcoin imagery to public spaces across the city.',
      'Our first mural — a 40-foot piece in the River District — will celebrate the concept of sound money. Local artists have already submitted designs, and the community voted on the winning concept.',
      'But this is more than just paint on a wall. Each mural location becomes a meeting point, a conversation starter, and a visible signal that Bitcoin is here and it is for everyone.',
      'We are looking for volunteers to help with painting, documentation, and organizing the unveiling events. Get in touch if you want to be part of it.',
    ],
  },
];
