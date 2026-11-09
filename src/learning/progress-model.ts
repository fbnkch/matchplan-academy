import type { Lesson, LessonProgress, Progress } from '../types';

export const emptyProgress = (): Progress => ({
  version: 1,
  selectedLesson: 'anpfiff',
  lessons: {},
});

export function getLessonProgress(progress: Progress, lesson: Lesson): LessonProgress {
  return (
    progress.lessons[lesson.id] ?? {
      code: lesson.starter,
      hintLevel: 0,
      solutionViewed: false,
      passed: false,
      reflection: '',
    }
  );
}

export function getStatus(progress: LessonProgress | undefined): string {
  if (!progress) return 'Offen';
  if (!progress.passed) return 'In Arbeit';
  return progress.hintLevel > 0 || progress.solutionViewed
    ? 'Mit Hilfe geübt'
    : 'Selbstständig gelöst';
}
