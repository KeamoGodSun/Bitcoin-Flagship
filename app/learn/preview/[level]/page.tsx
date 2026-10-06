import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { draftLevels } from '@/lib/course-data';

export const metadata: Metadata = {
  title: 'Draft review',
  robots: { index: false, follow: false },
};

export default function DraftReviewIndex({ params }: { params: { level: string } }) {
  const level = draftLevels.find((candidate) => candidate.id === params.level);
  if (!level) notFound();

  const questionCount = level.lessons.reduce((total, lesson) => total + lesson.questions.length, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">Unpublished drafts</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Written for review and not yet part of the published course. This page is unlisted and excluded from search
          engines. It disappears automatically once {level.name} is published.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          On a deployed site these URLs are behind a shared password, so if you can read this you are reviewing, not
          reading a leak.
        </p>
      </div>

      <h1 className="mt-8 text-3xl font-bold tracking-tight">{level.name} drafts</h1>
      <p className="mt-2 text-muted-foreground">
        {level.lessons.length} lesson{level.lessons.length === 1 ? '' : 's'} written, {questionCount} question
        {questionCount === 1 ? '' : 's'} so far.
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{level.blurb}</p>

      <ul className="mt-8 space-y-3">
        {level.lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={`/learn/preview/${level.id}/${lesson.id}`}
              className="block rounded-xl border border-border bg-card/40 p-5 transition-colors hover:border-bitcoin/40"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold">{lesson.title}</h2>
                <Badge variant="secondary" className="text-xs">
                  {lesson.minutes} min
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {lesson.questions.length} questions
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{lesson.blurb}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 space-y-2 border-t border-border/60 pt-6 text-sm text-muted-foreground">
        {draftLevels
          .filter((candidate) => candidate.id !== level.id)
          .map((candidate) => (
            <Link key={candidate.id} href={`/learn/preview/${candidate.id}`} className="block hover:text-foreground">
              {candidate.name} drafts
            </Link>
          ))}
      </div>
    </div>
  );
}
