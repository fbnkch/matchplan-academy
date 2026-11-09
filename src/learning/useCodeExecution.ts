import { useEffect, useRef, useState } from 'react';
import { createRunner } from '../runtime';
import type { Lesson, Runner, RunResult } from '../types';

/** Owns the worker lifetime and drops responses from cancelled or previous runs. */
export function useCodeExecution() {
  const runner = useRef<Runner | null>(null);
  const generation = useRef(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    runner.current = createRunner();
    return () => {
      generation.current++;
      runner.current?.dispose();
      runner.current = null;
    };
  }, []);

  function stop() {
    generation.current++;
    runner.current?.cancel();
    setBusy(false);
  }

  async function run(code: string, lesson: Lesson): Promise<RunResult | undefined> {
    const ticket = ++generation.current;
    setBusy(true);
    setResult(null);
    setError('');
    try {
      if (!runner.current)
        throw new Error('Die Python-Umgebung ist noch nicht bereit. Bitte erneut versuchen.');
      const response = await runner.current.run(code, lesson);
      if (ticket !== generation.current) return;
      setResult(response);
      return response;
    } catch (cause) {
      if (ticket === generation.current)
        setError(
          cause instanceof Error
            ? cause.message
            : 'Die Ausführung ist fehlgeschlagen. Bitte erneut versuchen.',
        );
    } finally {
      if (ticket === generation.current) setBusy(false);
    }
  }

  function clear() {
    stop();
    setResult(null);
    setError('');
  }

  return { busy, result, error, setError, run, stop, clear };
}
