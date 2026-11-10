import { useEffect, useRef, useState } from 'react';
import { createRunner } from '../runtime';
import type { Lesson, Runner, RunResult } from '../types';

/** Owns the worker lifetime and drops responses from cancelled or previous runs. */
export function useCodeExecution() {
  const runnerRef = useRef<Runner | null>(null);
  const executionGenerationRef = useRef(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    runnerRef.current = createRunner();
    return () => {
      executionGenerationRef.current++;
      runnerRef.current?.dispose();
      runnerRef.current = null;
    };
  }, []);

  function stop() {
    executionGenerationRef.current++;
    runnerRef.current?.cancel();
    setBusy(false);
  }

  async function run(code: string, lesson: Lesson): Promise<RunResult | undefined> {
    const executionGeneration = ++executionGenerationRef.current;
    setBusy(true);
    setResult(null);
    setError('');
    try {
      if (!runnerRef.current)
        throw new Error('Die Python-Umgebung ist noch nicht bereit. Bitte erneut versuchen.');
      const executionResult = await runnerRef.current.run(code, lesson);
      if (executionGeneration !== executionGenerationRef.current) return;
      setResult(executionResult);
      return executionResult;
    } catch (cause) {
      if (executionGeneration === executionGenerationRef.current)
        setError(
          cause instanceof Error
            ? cause.message
            : 'Die Ausführung ist fehlgeschlagen. Bitte erneut versuchen.',
        );
    } finally {
      if (executionGeneration === executionGenerationRef.current) setBusy(false);
    }
  }

  function clear() {
    stop();
    setResult(null);
    setError('');
  }

  return { busy, result, error, setError, run, stop, clear };
}
