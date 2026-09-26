import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, GraduationCap, PenLine } from 'lucide-react';

const LEVELS = [
  {
    name: 'Beginner',
    blurb: 'What Bitcoin is, how to buy it, how to store it, and how to spend it safely.',
    lessons: 3,
  },
  {
    name: 'Intermediate',
    blurb: 'Wallets, nodes, Lightning, mempool fees, and keeping your keys yours.',
    lessons: 3,
  },
  {
    name: 'Advanced',
    blurb: 'Script, consensus, coin selection, privacy, and how the network actually settles.',
    lessons: 3,
  },
];

const RESOURCES = [
  {
    level: 'Beginner',
    title: 'Bitcoin.org',
    url: 'https://bitcoin.org',
    note: 'Plain-language explainers, how to buy, and the basics of using it.',
  },
  {
    level: 'Intermediate',
    title: 'Mastering Bitcoin',
    url: 'https://masteringbitcoin.org',
    note: 'Free online book covering wallets, transactions, and the network in depth.',
  },
  {
    level: 'Intermediate',
    title: 'Learn Bitcoin',
    url: 'https://learnbitcoin.org',
    note: 'Hands-on Lightning practice, including a playground and channel setup.',
  },
  {
    level: 'Advanced',
    title: 'Bitcoin Optech',
    url: 'https://bitcoinops.org',
    note: 'Chapter-by-chapters on how Bitcoin nodes actually work.',
  },
  {
    level: 'Advanced',
    title: 'Bitcoin Developer Guide',
    url: 'https://developer.bitcoin.org',
    note: 'Reference material for building on the protocol.',
  },
  {
    level: 'Advanced',
    title: 'Lightning Engineering',
    url: 'https://docs.lightning.engineering',
    note: 'How the Lightning Network and LND operate, from the people who build them.',
  },
  {
    level: 'Advanced',
    title: 'BIPs',
    url: 'https://bips.xyz',
    note: 'The proposals themselves. Dense, but the source of truth.',
  },
];

export function LearnHub() {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-2xl font-bold">
        <GraduationCap className="h-5 w-5 text-bitcoin" />
        Learn Bitcoin
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Two tracks: a curated list of trusted outside courses that are live now, and our own in-site courses with
        multiple-choice questions that are still being written up for sign-off.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {LEVELS.map((level) => (
          <div key={level.name} className="rounded-xl border border-dashed border-border bg-card/40 p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold">{level.name}</h3>
              <Badge
                variant="secondary"
                className="gap-1 border border-dashed border-border bg-transparent text-[10px] uppercase tracking-wider text-muted-foreground"
              >
                <PenLine className="h-3 w-3" />
                Outline in review
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{level.blurb}</p>
            <p className="mt-3 text-xs text-muted-foreground/80">
              {level.lessons} lessons · {level.lessons * 5} questions planned
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-lg border border-dashed border-border bg-card/40 p-4 text-sm text-muted-foreground">
        Nothing half-written goes live: each lesson ships with its questions, correct answers, and a plain-language
        explanation for every option, so a wrong guess teaches something too.
      </p>

      <h3 className="mt-10 text-lg font-semibold">Trusted courses, live now</h3>
      <ul className="mt-4 space-y-3">
        {RESOURCES.map((resource) => (
          <li key={resource.url}>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-bitcoin/40"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{resource.title}</span>
                  <Badge variant="secondary" className="border border-bitcoin/20 bg-bitcoin/5 text-bitcoin">
                    {resource.level}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{resource.note}</p>
              </div>
              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-bitcoin" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
