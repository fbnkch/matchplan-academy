import type { Lesson, RunResult } from './types';

export type ExecutionTask = Pick<Lesson, 'setup' | 'checks' | 'variants' | 'packages' | 'language'>;

/** Shared wire contract between the UI-side runner and the Python worker. */
export type RuntimeRequest = { type: 'init' } | ({ type: 'run'; code: string } & ExecutionTask);

export type RuntimeEvent =
  | { type: 'ready' }
  | { type: 'loadingPackages' }
  | { type: 'executing' }
  | { type: 'initError'; error: string }
  | { type: 'result'; result: RunResult };
