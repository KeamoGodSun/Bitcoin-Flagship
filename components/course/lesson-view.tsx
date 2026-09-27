import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Clock, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Quiz } from '@/components/course/quiz';
import type { Lesson, Level } from '@/lib/course-data';

/**
 * The single renderer for a lesson body, shared by the published route and the
 * draft review route. Kept in one place so a lesson looks identical when it is
 * being reviewed as it will when it ships.
 */
export function LessonView({
  level,
  lesson,
  position,
  next,
  isDraft = false,
  parentHref,
}: {
  level: Level;
  lesson: Lesson;
  position?: { index: number; total: number };
  next?: { href: string; title: string };
  isDraft?: boolean;
  parentHref: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {isDraft ? (
        <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
          <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
            Unpublished draft, not part of the published course
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This page exists so the lesson can be read and marked up before it ships. It is deliberately unlisted and
            excluded from search engines. It is not signed off, and the figures below are dated to the review shown on
            each source.
          </p>
        </div>
      ) : null}

      <Link
        href={parentHref}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {isDraft ? `Back to ${level.name} drafts` : level.name}
      </Link>

      <article className="mt-6">
        <header>
          <div className="flex flex-wrap items-center gap-3">
            {position ? (
              <Badge variant="secondary" className="border-bitcoin/20 bg-bitcoin/5 text-bitcoin">
                Lesson {position.index} of {position.total}
              </Badge>
            ) : null}
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {lesson.minutes} min read
            </span>
            <Badge variant="secondary" className="text-xs">
              {lesson.questions.length} questions
            </Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{lesson.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{lesson.blurb}</p>
        </header>

        <div className="mt-10 space-y-10">
          {lesson.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
              <div className="mt-3 space-y-4">
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex} className="leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.points && section.points.length > 0 ? (
                <ul className="mt-5 space-y-3">
                  {section.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bitcoin" />
                      <span className="min-w-0">{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.table ? (
                <figure className="mt-6 overflow-x-auto rounded-xl border border-border bg-card/40">
                  <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {section.table.head.map((cell) => (
                          <th
                            key={cell}
                            scope="col"
                            className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                          >
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-border/50 last:border-0">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className={`px-4 py-3 align-top ${
                                cellIndex === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {section.table.note ? (
                    <figcaption className="border-t border-border/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                      {section.table.note}
                    </figcaption>
                  ) : null}
                </figure>
              ) : null}
            </section>
          ))}
        </div>

        {lesson.tryIt.length > 0 ? (
          <section className="mt-10 rounded-2xl border border-bitcoin/30 bg-bitcoin/5 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Lightbulb className="h-5 w-5 text-bitcoin" />
              Try it yourself
            </h2>
            <ul className="mt-3 space-y-2">
              {lesson.tryIt.map((item, index) => (
                <li key={index} className="text-sm leading-relaxed text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {lesson.sources && lesson.sources.length > 0 ? (
          <section className="mt-10 rounded-2xl border border-border bg-card/40 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="h-5 w-5 text-bitcoin" />
              Sources
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Every figure in this lesson is dated, and these are the primary sources behind it. Follow the links and
              check the numbers rather than trusting the summary, including ours.
            </p>
            <ul className="mt-4 space-y-4">
              {lesson.sources.map((source) => (
                <li key={source.url} className="text-sm">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-bitcoin hover:underline"
                  >
                    {source.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <p className="mt-1 leading-relaxed text-muted-foreground">{source.detail}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground/80">
              Source links were last checked by the course source checker. Statistics move, so confirm a number is still
              current before you rely on it.
            </p>
          </section>
        ) : null}

        <div className="mt-12">
          <Quiz lessonId={lesson.id} questions={lesson.questions} nextLesson={next} />
        </div>

        <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6">
          <Link
            href={parentHref}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All {level.name} lessons
          </Link>
          {next ? (
            <Link href={next.href} className="inline-flex items-center gap-2 text-sm font-medium text-bitcoin hover:underline">
              Next: {next.title}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </nav>
      </article>
    </div>
  );
}
