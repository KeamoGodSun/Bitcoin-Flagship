'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, Circle } from 'lucide-react';
import { loadProgress } from '@/lib/course-progress';
import { cn } from '@/lib/utils';

interface LessonLink {
  id: string;
  title: string;
  href: string;
  minutes: number;
}

function useCompleted(): Set<string> {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  useEffect(() => {
    setCompleted(new Set(Object.keys(loadProgress())));
  }, []);
  return completed;
}

export function CourseProgressList({ lessons }: { lessons: LessonLink[] }) {
  const completed = useCompleted();
  const done = lessons.filter((lesson) => completed.has(lesson.id)).length;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">
          {done} of {lessons.length} complete
        </p>
        <p className="text-xs text-muted-foreground">Saved in this browser</p>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-bitcoin transition-all"
          style={{ width: `${lessons.length ? (done / lessons.length) * 100 : 0}%` }}
        />
      </div>

      <ul className="mt-5 space-y-2">
        {lessons.map((lesson, index) => {
          const isDone = completed.has(lesson.id);
          return (
            <li key={lesson.id}>
              <Link
                href={lesson.href}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-lg border p-4 transition-colors',
                  isDone ? 'border-bitcoin/30 bg-bitcoin/5' : 'border-border hover:border-bitcoin/40'
                )}
              >
                <div className="flex min-w-0 items-start gap-3">
                  {isDone ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-bitcoin" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/50" />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium">
                      {index + 1}. {lesson.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {lesson.minutes} min read · {isDone ? 'completed' : 'not started'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function CourseProgressSummary({
  lessonIds,
  totalLessons,
  totalQuestions,
}: {
  lessonIds: string[];
  totalLessons: number;
  totalQuestions: number;
}) {
  const completed = useCompleted();
  const done = lessonIds.filter((id) => completed.has(id)).length;

  return (
    <div className="rounded-2xl border border-bitcoin/30 bg-bitcoin/5 p-5">
      <p className="text-sm font-semibold uppercase tracking-wider text-bitcoin">Your progress</p>
      <p className="mt-2 text-2xl font-bold">
        {done} of {totalLessons} lessons
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {totalQuestions} questions in total. No account needed — this is stored in your browser, and there is no
        leaderboard and no certificate.
      </p>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
        <div
          className="h-full rounded-full bg-bitcoin transition-all"
          style={{ width: `${totalLessons ? (done / totalLessons) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
}
