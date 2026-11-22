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
    slug: 'africa-free-routing-lightning-bootcamp-jhb',
    title: 'Recap: Africa Free Routing Lightning Bootcamp (Johannesburg Edition)',
    excerpt:
      'A hands-on Lightning bootcamp in Johannesburg focused on routing, channels, and real payments — part of the wider Africa Free Routing programme.',
    date: 'Oct 12, 2026',
    author: 'Education Team',
    category: 'Education',
    content: [
      'The Africa Free Routing Lightning Bootcamp landed in Johannesburg with a simple goal: move Lightning from theory into practice. Alongside the wider Africa Free Routing programme, the Johannesburg edition gave participants a working understanding of how payments find their way across the network.',
      'The session focused on the mechanics that matter day to day — running a node, opening and managing channels, understanding liquidity, and making real payments rather than relying on diagrams. Each step was framed around the decisions a person actually faces when they run Lightning themselves.',
      'That practical focus is what makes a bootcamp different from a lecture. Questions about fees, channel capacity, and failed payments were worked through in the open, so newcomers could see how experienced operators think about the same problems.',
      'Bootcamps like this sit alongside the Au∞₿ La₿s curriculum and our self-custody workshops under the Education wallet. The Johannesburg edition adds another group of people who can not only use Lightning, but explain and maintain it in their own communities.',
    ],
  },
  {
    slug: 'building-bitcoin-sisonke-mohlakeng-merchants',
    title: 'Building Bitcoin Sisonke: Lessons from Onboarding Mohlakeng Merchants',
    excerpt:
      'What we learned working with local merchants and the Bitcoin Mohlakeng Society to grow a circular economy in Mohlakeng, Randfontein.',
    date: 'Sep 15, 2026',
    author: 'Community Team',
    category: 'Community',
    content: [
      'Bitcoin Sisonke is a grassroots circular economy in Mohlakeng, Randfontein. The idea is straightforward: connect everyday residents with local merchants who accept Bitcoin, so sats earned in the community can be spent in the community.',
      'A recent community and merchant mini-tour, hosted with the Bitcoin Mohlakeng Society and Student of Bitcoin, put that idea in front of the people who make it work — the shop owners and residents who decide whether a payment is genuinely useful.',
      'The main lesson is that onboarding is relationship work. Merchants want to know how a payment will land, how it can be checked, and what happens when something goes wrong. Clear answers and patient, in-person help matter more than a good slogan.',
      'The Bitcoin Mohlakeng Society was the first group to bring Bitcoin classes to the township, and that foundation shows. Collaborations like the mini-tour keep the focus on practical use rather than speculation — the measure of success is a resident paying a merchant and both sides feeling comfortable with it.',
    ],
  },
  {
    slug: 'empowering-women-in-business-with-sovereign-technology',
    title: 'Empowering Women in Business with Sovereign Technology',
    excerpt:
      'The Blooming Women Empowerment Conference brings women in business and startups together around tools that make financial sovereignty practical.',
    date: 'Dec 05, 2026',
    author: 'Events Team',
    category: 'Events',
    content: [
      'The Blooming Women Empowerment Conference is an annual gathering in Gauteng that celebrates women in business and startups who are driving change in their communities. It is also a place where sovereign technology stops being an abstract idea and becomes a practical business tool.',
      'For entrepreneurs, the appeal of Bitcoin and other open technologies is control: who holds the money, who can move it, and who gets to set the terms. The conference creates room to talk about those questions alongside the everyday realities of running a business.',
      'We are supporting this work through the Events & Conferences Wallet, alongside meetups, movie nights, and game days. In-person spaces are where curiosity turns into understanding, and where a first conversation can become a lasting relationship with the community.',
      'Our role is to help with what we do best — education, tooling, and access — while the conference leads on the stories that matter. When women business owners adopt sovereign technology on their own terms, the effect reaches well beyond a single transaction.',
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
