import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, GraduationCap, PenLine, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { courseLevels } from '@/lib/course-data';

const RESOURCES = [
  {
    level: 'Beginner',
    title: 'Bitcoin.org',
    url: 'https://bitcoin.org',
    note: 'Plain-language explainers, how to buy, and the basics of using it.',
  },
  {
    level: 'Money & Economics',
    title: 'FRED — Federal Reserve Economic Data',
    url: 'https://fred.stlouisfed.org',
    note: 'Check the numbers yourself. Consumer prices, money supply and policy rates for the United States, chartable and downloadable.',
  },
  {
    level: 'Money & Economics',
    title: 'Statistics South Africa — Consumer Price Index',
    url: 'https://www.statssa.gov.za/?cat=33',
    note: 'The official monthly inflation releases, including the basket weights that show where the average hides your own costs.',
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
    note: 'Chapter-by-chapter on how Bitcoin nodes actually work.',
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
  const live = courseLevels.filter((level) => level.published && level.lessons.length > 0);
  const unwritten = courseLevels.filter((level) => !level.published || level.lessons.length === 0);
  const totalQuestions = live.reduce(
    (sum, level) => sum + level.lessons.reduce((n, lesson) => n + lesson.questions.length, 0),
    0,
  );

  return (
    <div>
      <h2 className="flex items-center gap-2 text-2xl font-bold">
        <GraduationCap className="h-5 w-5 text-bitcoin" />
        Learn Bitcoin
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Every lesson ends in multiple-choice questions, and every option — right or wrong — comes with an explanation,
        so a bad guess still teaches you something. {live.length} levels are live now with{' '}
        {live.reduce((n, level) => n + level.lessons.length, 0)} lessons and {totalQuestions} questions between them.
      </p>

      {/* Live levels */}
      <div className="mt-8 space-y-4">
        {live.map((level) => {
          const questions = level.lessons.reduce((n, lesson) => n + lesson.questions.length, 0);
          const href = `/learn/${level.id}`;

          return (
            <div key={level.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{level.name}</h3>
                    <Badge
                      variant="secondary"
                      className="border-bitcoin/20 bg-bitcoin/5 text-bitcoin"
                    >
                      Live
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <ListChecks className="h-3 w-3" />
                      {level.lessons.length} lessons · {questions} questions
                    </span>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{level.blurb}</p>
                </div>

                <Link
                  href={href}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-bitcoin/40 bg-bitcoin/10 px-4 py-2 text-sm font-semibold text-bitcoin transition-all hover:bg-bitcoin hover:text-background"
                >
                  Start {level.name}
                </Link>
              </div>

              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {level.lessons.map((lesson, index) => (
                  <li key={lesson.id}>
                    <Link
                      href={`${href}/${lesson.id}`}
                      className="flex items-baseline gap-2 rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-sm transition-colors hover:border-bitcoin/40"
                    >
                      <span className="font-mono text-xs text-muted-foreground">
                        {index + 1}.{lesson.questions.length}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{lesson.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {lesson.minutes} min read · {lesson.questions.length} questions
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Levels that do not exist yet, stated plainly */}
      {unwritten.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-muted-foreground">Not written yet</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {unwritten.map((level) => (
              <div
                key={level.id}
                className="rounded-xl border border-dashed border-border bg-card/40 p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{level.name}</span>
                  <Badge
                    variant="secondary"
                    className="gap-1 border border-dashed border-border bg-transparent text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    <PenLine className="h-3 w-3" />
                    {level.lessons.length === 0 ? 'No lessons yet' : 'In review'}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{level.blurb}</p>
                <p className="mt-3 text-xs text-muted-foreground/80">
                  {level.lessons.length === 0
                    ? 'Nothing published here yet — the card is here so you know it is coming, not so you think there is a course to start.'
                    : 'Written but held back for sign-off.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

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
