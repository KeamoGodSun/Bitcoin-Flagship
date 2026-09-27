import { isSupabaseConfigured, supabase, visitorId } from '@/lib/supabase';

export interface LessonProgress {
  score: number;
  total: number;
  answers: Record<string, string>;
  completedAt: string;
}

const STORAGE_KEY = 'bf_course_progress_v1';

type ProgressMap = Record<string, LessonProgress>;

export function loadProgress(): ProgressMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function completedLessonIds(): string[] {
  return Object.keys(loadProgress());
}

/**
 * Progress is stored in the browser first so the course works with no database
 * configured, then mirrored to Supabase when it is available.
 */
export async function saveLessonProgress(
  lessonId: string,
  answers: Record<string, string>,
  score: number,
  total: number
): Promise<void> {
  const entry: LessonProgress = { score, total, answers, completedAt: new Date().toISOString() };

  if (typeof window !== 'undefined') {
    const next: ProgressMap = { ...loadProgress(), [lessonId]: entry };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Private browsing can refuse writes; the quiz still works for this session.
    }
  }

  if (!isSupabaseConfigured()) return;
  const db = supabase();
  if (!db) return;

  const { error } = await db.from('course_progress').upsert(
    {
      lesson_id: lessonId,
      visitor_id: visitorId(),
      answers,
      score,
      completed_at: entry.completedAt,
    },
    { onConflict: 'lesson_id,visitor_id' }
  );

  if (error) {
    console.warn('Course progress was saved locally but not synced:', error.message);
  }
}
