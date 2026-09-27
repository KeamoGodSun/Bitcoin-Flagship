import Link from 'next/link';
import { ArrowRight, GraduationCap, PenLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CourseProgressSummary } from '@/components/course/progress';
import { courseLevels, publishedLevels } from '@/lib/course-data';

export const metadata = {
  title: 'Learn Bitcoin — Bitcoin Flagship',
  description:
    'Free in-site Bitcoin courses: the basics for beginners, then money and economics with sourced current figures, all with instant-feedback multiple-choice questions and no accounts required.',
};

export default function LearnIndexPage() {
  const lessonIds = publishedLevels.flatMap((level) => level.lessons.map((lesson) => lesson.id));
  const totalLessons = lessonIds.length;
  const totalQuestions = publishedLevels.reduce(
    (total, level) => total + level.lessons.reduce((sum, lesson) => sum + lesson.questions.length, 0),
    0
  );

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-bitcoin/15 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-bitcoin/30 bg-bitcoin/10 px-4 py-1.5 text-xs font-semibold text-bitcoin">
              <GraduationCap className="h-3.5 w-3.5" /> Free · No account needed
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Learn <span className="text-gradient-bitcoin">Bitcoin</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Start with the basics for people who have never held a satoshi, then go deeper into what money is, how the
              schools of economics disagree, and what the current inflation figures actually say. Every lesson ends with
              multiple-choice questions that explain every answer — including the ones you get wrong.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {courseLevels.map((level) => {
            const questions = level.lessons.reduce(
              (sum, lesson) => sum + lesson.questions.length,
              0
            );
            const card = (
              <div
                className={`flex h-full flex-col rounded-2xl border p-6 transition-colors ${
                  level.published
                    ? 'border-border hover:border-bitcoin/50'
                    : 'border-dashed border-border bg-card/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xl font-bold">{level.name}</h2>
                  {level.published ? (
                    <Badge variant="secondary" className="border-bitcoin/20 bg-bitcoin/5 text-bitcoin">
                      {level.lessons.length} lessons
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="gap-1 border border-dashed border-border bg-transparent text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      <PenLine className="h-3 w-3" />
                      Next up
                    </Badge>
                  )}
                </div>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{level.blurb}</p>
                <p className="mt-4 text-xs text-muted-foreground/80">
                  {level.published
                    ? `${questions} questions with instant feedback`
                    : 'Outline written, lessons in review'}
                </p>
              </div>
            );

            return level.published ? (
              <Link key={level.id} href={`/learn/${level.id}`}>
                {card}
              </Link>
            ) : (
              <div key={level.id}>{card}</div>
            );
          })}
        </div>

        <div className="mt-10">
          <CourseProgressSummary
            lessonIds={lessonIds}
            totalLessons={totalLessons}
            totalQuestions={totalQuestions}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link href="/learn/level-1">
              Start Level 1
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/learn/level-2">
              Money &amp; Economics
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/community?tab=learn">Trusted outside courses</Link>
          </Button>
        </div>

        <p className="mt-8 rounded-lg border border-dashed border-border bg-card/40 p-4 text-sm text-muted-foreground">
          Nothing half-written goes live. Each lesson ships with its questions, correct answers, and a plain-language
          explanation for every option, so a wrong guess teaches something too. Lessons that quote current figures
          carry their sources and the date they were checked, so you can check them yourself.
        </p>
      </section>
    </div>
  );
}
