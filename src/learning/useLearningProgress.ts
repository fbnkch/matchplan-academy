import { useEffect, useState } from 'react';
import type { Progress } from '../types';
import { getStorageIssue, loadProgress, saveProgress } from './progress-storage';

/** React owns synchronization; the codec and storage modules have no UI dependency. */
export function useLearningProgress() {
  const [progress, setProgress] = useState(loadProgress);
  const [storageIssue, setStorageIssue] = useState(getStorageIssue);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    if (!storageIssue) setStorageError(!saveProgress(progress));
  }, [progress, storageIssue]);

  function replaceProgress(imported: Progress) {
    setProgress(imported);
    setStorageIssue(null);
    setStorageError(!saveProgress(imported, true));
  }

  function recoverProgress() {
    const saved = saveProgress(progress, true);
    if (saved) setStorageIssue(null);
    setStorageError(!saved);
  }

  return { progress, setProgress, storageIssue, storageError, replaceProgress, recoverProgress };
}
