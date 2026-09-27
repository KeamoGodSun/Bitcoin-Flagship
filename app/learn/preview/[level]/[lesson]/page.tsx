import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LessonView } from '@/components/course/lesson-view';
import { getDraftLesson, draftLevels, courseLevels } from '@/lib/course-data';

/**
 * Review route for lessons that are written but deliberately unpublished.
 *
 * The rule is the inverse of the publish flag: this route renders a lesson
 * only while its level is NOT published, and returns 404 the moment that level
 * is turned on. So a promoted lesson disappears from here on its own, and
 * nothing half-finished is ever reachable from site navigation.
 */
export const dynamic = 'force-static';

export function generateStaticParams() {
  return draftLevels.flatMap((level) => level.lessons.map((lesson) => ({ level: level.id, lesson: lesson.id })));
}

export default function DraftLessonPage({ params }: { params: { level: string; lesson: string } }) {
  const found = getDraftLesson(params.level, params.lesson);
  if (!found) notFound();

  const { level, lesson } = found;
  const siblings = level.lessons;
  const index = siblings.findIndex((candidate) => candidate.id === lesson.id);
  const next = siblings[index + 1];

  return (
    <LessonView
      level={level}
      lesson={lesson}
      isDraft
      next={next ? { href: `/learn/preview/${level.id}/${next.id}`, title: next.title } : undefined}
      parentHref={`/learn/preview/${level.id}`}
    />
  );
}

export function generateMetadata({ params }: { params: { level: string; lesson: string } }): Metadata {
  const found = getDraftLesson(params.level, params.lesson);
  if (!found) return { title: 'Draft not found' };
  return { title: `DRAFT — ${found.lesson.title}`, robots: { index: false, follow: false } };
}
