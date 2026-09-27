import { notFound } from 'next/navigation';
import { LessonView } from '@/components/course/lesson-view';
import { getLesson, getNextLesson, getLessonPosition, publishedLevels } from '@/lib/course-data';

export function generateStaticParams() {
  return publishedLevels.flatMap((level) => level.lessons.map((lesson) => ({ level: level.id, lesson: lesson.id })));
}

export function generateMetadata({ params }: { params: { level: string; lesson: string } }) {
  const found = getLesson(params.level, params.lesson);
  if (!found) return { title: 'Lesson not found — Bitcoin Flagship' };
  return {
    title: `${found.lesson.title} — Learn Bitcoin`,
    description: found.lesson.blurb,
  };
}

export default function LessonPage({ params }: { params: { level: string; lesson: string } }) {
  const found = getLesson(params.level, params.lesson);
  if (!found) notFound();

  const { level, lesson } = found;
  const position = getLessonPosition(lesson.id);
  const next = getNextLesson(lesson.id);

  return (
    <LessonView
      level={level}
      lesson={lesson}
      position={position}
      next={next ? { href: `/learn/${next.levelId}/${next.lessonId}`, title: next.title } : undefined}
      parentHref={`/learn/${level.id}`}
    />
  );
}
