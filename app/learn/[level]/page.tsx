import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CourseProgressList } from '@/components/course/progress';
import { getLevel, publishedLevels } from '@/lib/course-data';

export function generateStaticParams() {
  return publishedLevels.map((level) => ({ level: level.id }));
}

export function generateMetadata({ params }: { params: { level: string } }) {
  const level = getLevel(params.level);
  if (!level || !level.published) return { title: 'Course not found — Bitcoin Flagship' };
  return {
    title: `${level.name} — Learn Bitcoin`,
    description: level.blurb,
  };
}

export default function LevelPage({ params }: { params: { level: string } }) {
  const level = getLevel(params.level);
  if (!level || !level.published) notFound();

  const questions = level.lessons.reduce((sum, lesson) => sum + lesson.questions.length, 0);
  const lessons = level.lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    minutes: lesson.minutes,
    href: `/learn/${level.id}/${lesson.id}`,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All courses
      </Link>

      <div className="mt-6">
        <Badge variant="secondary" className="border-bitcoin/20 bg-bitcoin/5 text-bitcoin">
          Level {level.id.replace('level-', '')}
        </Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{level.name}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{level.blurb}</p>
        <p className="mt-2 text-sm text-muted-foreground/80">
          {level.lessons.length} lessons · {questions} questions
        </p>
      </div>

      <div className="mt-10">
        <CourseProgressList lessons={lessons} />
      </div>
    </div>
  );
}
