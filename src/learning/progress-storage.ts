import type { Progress } from '../types';
import { exportProgress, importProgress } from './progress-codec';
import { emptyProgress } from './progress-model';

const STORAGE_KEY = 'matchplan-academy-v1';

export function getRawProgress(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function loadProgress(): Progress {
  try {
    const raw = getRawProgress();
    return raw === null ? emptyProgress() : importProgress(raw);
  } catch {
    return emptyProgress();
  }
}

export function getStorageIssue(): string | null {
  const raw = getRawProgress();
  if (raw === null) return null;
  try {
    importProgress(raw);
    return null;
  } catch {
    return 'Dein gespeicherter Fortschritt ist unlesbar. Er bleibt unverändert erhalten. Importiere ein Backup oder sichere die Originaldaten, bevor du diesen Lernstand stattdessen speicherst.';
  }
}

/** Invalid saved data is preserved unless recovery was explicitly requested. */
export function saveProgress(progress: Progress, replaceInvalid = false): boolean {
  try {
    if (!replaceInvalid && getStorageIssue()) return false;
    const serialized = exportProgress(progress);
    importProgress(serialized);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch {
    return false;
  }
}
