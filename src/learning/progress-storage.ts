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
    const storedProgressJson = getRawProgress();
    return storedProgressJson === null ? emptyProgress() : importProgress(storedProgressJson);
  } catch {
    return emptyProgress();
  }
}

export function getStorageIssue(): string | null {
  const storedProgressJson = getRawProgress();
  if (storedProgressJson === null) return null;
  try {
    importProgress(storedProgressJson);
    return null;
  } catch {
    return 'Dein gespeicherter Fortschritt ist unlesbar. Er bleibt unverändert erhalten. Importiere ein Backup oder sichere die Originaldaten, bevor du diesen Lernstand stattdessen speicherst.';
  }
}

/** Invalid saved data is preserved unless recovery was explicitly requested. */
export function saveProgress(progress: Progress, replaceInvalidProgress = false): boolean {
  try {
    if (!replaceInvalidProgress && getStorageIssue()) return false;
    const serializedProgress = exportProgress(progress);
    importProgress(serializedProgress);
    localStorage.setItem(STORAGE_KEY, serializedProgress);
    return true;
  } catch {
    return false;
  }
}
