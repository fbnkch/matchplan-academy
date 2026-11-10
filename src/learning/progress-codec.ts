import type { LessonProgress, Progress, ProjectProgress } from '../types';

export const PROGRESS_LIMITS = {
  backup: 64_000_000,
  code: 100_000,
  reflection: 50_000,
  report: 100_000,
  projectNotes: 50_000,
  studyNotes: 20_000,
  studyChapters: 100,
} as const;

type RecordValue = Record<string, unknown>;
function isRecord(value: unknown): value is RecordValue {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
function isText(value: unknown, limit: number): value is string {
  return typeof value === 'string' && value.length <= limit;
}
function isValidProgressId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[a-z0-9-]{1,80}$/.test(value) &&
    !['__proto__', 'constructor', 'prototype'].includes(value)
  );
}
function isValidStudyId(value: unknown): value is string {
  return typeof value === 'string' && /^study-[a-z0-9-]{1,70}$/.test(value);
}
function rejectInvalidBackup(): never {
  throw new Error('Ungültiges Backup. Bitte eine unveränderte Matchplan-JSON-Datei auswählen.');
}

function readLessonProgress(value: unknown): Record<string, LessonProgress> {
  if (!isRecord(value)) return rejectInvalidBackup();
  const lessons: Record<string, LessonProgress> = Object.create(null);
  for (const [id, draft] of Object.entries(value)) {
    if (
      !isValidProgressId(id) ||
      !isRecord(draft) ||
      !isText(draft.code, PROGRESS_LIMITS.code) ||
      !isText(draft.reflection, PROGRESS_LIMITS.reflection) ||
      typeof draft.hintLevel !== 'number' ||
      !Number.isInteger(draft.hintLevel) ||
      draft.hintLevel < 0 ||
      draft.hintLevel > 10 ||
      typeof draft.solutionViewed !== 'boolean' ||
      typeof draft.passed !== 'boolean'
    )
      return rejectInvalidBackup();
    lessons[id] = {
      code: draft.code,
      reflection: draft.reflection,
      hintLevel: draft.hintLevel,
      solutionViewed: draft.solutionViewed,
      passed: draft.passed,
    };
  }
  return lessons;
}

function readProjectProgress(value: unknown): Record<string, ProjectProgress> {
  if (!isRecord(value)) return rejectInvalidBackup();
  const projects: Record<string, ProjectProgress> = Object.create(null);
  for (const [id, draft] of Object.entries(value)) {
    if (
      !isValidProgressId(id) ||
      !isRecord(draft) ||
      !isText(draft.report, PROGRESS_LIMITS.report) ||
      !isText(draft.notes, PROGRESS_LIMITS.projectNotes) ||
      typeof draft.reviewed !== 'boolean' ||
      !Array.isArray(draft.milestones) ||
      draft.milestones.length > 50 ||
      !draft.milestones.every(
        (item): item is string => typeof item === 'string' && /^[a-z0-9-]{1,80}$/.test(item),
      ) ||
      (draft.completedAt !== undefined &&
        (typeof draft.completedAt !== 'string' || !Number.isFinite(Date.parse(draft.completedAt))))
    )
      return rejectInvalidBackup();
    projects[id] = {
      report: draft.report,
      notes: draft.notes,
      reviewed: draft.reviewed,
      milestones: [...new Set(draft.milestones)],
      ...(typeof draft.completedAt === 'string' ? { completedAt: draft.completedAt } : {}),
    };
  }
  return projects;
}

function readStudyProgress(value: unknown): NonNullable<Progress['study']> {
  if (
    !isRecord(value) ||
    !isRecord(value.notes) ||
    !Array.isArray(value.completed) ||
    value.completed.length > PROGRESS_LIMITS.studyChapters ||
    Object.keys(value.notes).length > PROGRESS_LIMITS.studyChapters ||
    !value.completed.every(isValidStudyId)
  )
    return rejectInvalidBackup();
  const notes: Record<string, string> = Object.create(null);
  for (const [id, text] of Object.entries(value.notes)) {
    if (!isValidStudyId(id) || !isText(text, PROGRESS_LIMITS.studyNotes))
      return rejectInvalidBackup();
    notes[id] = text;
  }
  return { notes, completed: [...new Set(value.completed)] };
}

/** The same validation protects imported backups and everything written locally. */
export function importProgress(text: string): Progress {
  if (text.length > PROGRESS_LIMITS.backup)
    throw new Error('Die Datei ist zu groß (maximal 64 MB).');
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return rejectInvalidBackup();
  }
  if (!isRecord(value) || value.version !== 1 || typeof value.selectedLesson !== 'string')
    return rejectInvalidBackup();
  return {
    version: 1,
    selectedLesson: value.selectedLesson,
    lessons: readLessonProgress(value.lessons),
    ...(value.projects !== undefined ? { projects: readProjectProgress(value.projects) } : {}),
    ...(value.study !== undefined ? { study: readStudyProgress(value.study) } : {}),
  };
}

export function exportProgress(progress: Progress): string {
  return JSON.stringify(progress, null, 2);
}
