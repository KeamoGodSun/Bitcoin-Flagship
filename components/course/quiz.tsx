'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronRight, RotateCcw, XCircle } from 'lucide-react';
import type { QuizQuestion } from '@/lib/course-data';
import { loadProgress, saveLessonProgress } from '@/lib/course-progress';
import { cn } from '@/lib/utils';

interface NextLessonLink {
  href: string;
  title: string;
}

interface QuizProps {
  lessonId: string;
  questions: QuizQuestion[];
  nextLesson?: NextLessonLink;
}

export function Quiz({ lessonId, questions, nextLesson }: QuizProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const [previous, setPrevious] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => {
    const stored = loadProgress()[lessonId];
    if (stored) setPrevious({ score: stored.score, total: stored.total });
  }, [lessonId]);

  const question = questions[index];
  const chosenId = question ? answers[question.id] : undefined;
  const chosen = question?.options.find((option) => option.id === chosenId);
  const correctOption = question?.options.find((option) => option.correct);
  const isAnswered = Boolean(chosenId);

  const score = useMemo(
    () =>
      questions.reduce(
        (total, current) =>
          total + (answers[current.id] === current.options.find((option) => option.correct)?.id ? 1 : 0),
        0
      ),
    [answers, questions]
  );

  function choose(optionId: string) {
    if (isAnswered) return;
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);
    if (index === questions.length - 1) {
      const finalScore = questions.reduce(
        (total, current) =>
          total + (next[current.id] === current.options.find((option) => option.correct)?.id ? 1 : 0),
        0
      );
      void saveLessonProgress(lessonId, next, finalScore, questions.length);
    }
  }

  function advance() {
    if (index === questions.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((current) => current + 1);
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setFinished(false);
  }

  if (finished) {
    const perfect = score === questions.length;
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <Badge
          variant="secondary"
          className={cn(
            'uppercase tracking-wider',
            perfect ? 'border-bitcoin/30 bg-bitcoin/10 text-bitcoin' : 'border-border'
          )}
        >
          Lesson complete
        </Badge>
        <h3 className="mt-3 text-2xl font-bold">
          {score} of {questions.length} correct
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {perfect
            ? 'Clean sweep. Every wrong answer was still worth reading, so read them anyway.'
            : 'Nothing is locked and nothing is scored against you. Re-read the explanations above, then try again if it helps the idea stick.'}
        </p>

        <div className="mt-4 space-y-2">
          {questions.map((current, currentIndex) => {
            const answer = answers[current.id];
            const right = current.options.find((option) => option.correct);
            const picked = current.options.find((option) => option.id === answer);
            const wasRight = answer === right?.id;
            return (
              <div key={current.id} className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
                {wasRight ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bitcoin" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                )}
                <div className="min-w-0 text-sm">
                  <p className="font-medium">
                    {currentIndex + 1}. {current.prompt}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {picked ? `You chose: ${picked.label}. ` : ''}
                    {!wasRight && right ? `Correct answer: ${right.label}. ` : ''}
                    {(wasRight ? picked : right)?.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="outline" onClick={restart}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake
          </Button>
          {nextLesson ? (
            <Button asChild>
              <Link href={nextLesson.href}>
                Next lesson
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/learn">Back to courses</Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-bold">Check yourself</h3>
        {previous ? (
          <Badge variant="secondary" className="border-bitcoin/20 bg-bitcoin/5 text-bitcoin">
            Completed before: {previous.score}/{previous.total}
          </Badge>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Question {index + 1} of {questions.length}. Feedback is instant, and every option explains itself.
      </p>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-bitcoin transition-all"
          style={{ width: `${((index + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <p className="mt-6 font-medium">{question.prompt}</p>

      <div className="mt-4 space-y-2">
        {question.options.map((option) => {
          const isChosen = option.id === chosenId;
          const showAsCorrect = isAnswered && option.correct;
          const showAsWrong = isAnswered && isChosen && !option.correct;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => choose(option.id)}
              disabled={isAnswered}
              className={cn(
                'flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
                !isAnswered && 'border-border hover:border-bitcoin/50 hover:bg-bitcoin/5',
                !isAnswered && 'cursor-pointer',
                isAnswered && !showAsCorrect && !showAsWrong && 'border-border/50 opacity-60',
                showAsCorrect && 'border-bitcoin bg-bitcoin/10',
                showAsWrong && 'border-destructive bg-destructive/10'
              )}
            >
              <span>{option.label}</span>
              {showAsCorrect ? <CheckCircle2 className="h-4 w-4 shrink-0 text-bitcoin" /> : null}
              {showAsWrong ? <XCircle className="h-4 w-4 shrink-0 text-destructive" /> : null}
            </button>
          );
        })}
      </div>

      {isAnswered && chosen ? (
        <div
          className={cn(
            'mt-4 rounded-lg border p-4 text-sm',
            chosen.correct ? 'border-bitcoin/40 bg-bitcoin/5' : 'border-destructive/40 bg-destructive/5'
          )}
        >
          <p className="font-semibold">{chosen.correct ? 'Correct.' : 'Not quite.'}</p>
          <p className="mt-1 text-muted-foreground">{chosen.explanation}</p>
          {!chosen.correct && correctOption ? (
            <p className="mt-2 text-muted-foreground">
              <span className="font-medium text-foreground">The right answer is &ldquo;{correctOption.label}&rdquo;.</span>{' '}
              {correctOption.explanation}
            </p>
          ) : null}
        </div>
      ) : null}

      {isAnswered ? (
        <Button className="mt-5" onClick={advance}>
          {index === questions.length - 1 ? 'See result' : 'Next question'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
