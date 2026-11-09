import type { Lesson, Runner, RunResult } from './types';
import type { RuntimeEvent, RuntimeRequest } from './runtime-protocol';

interface WorkerPort {
  onmessage: ((event: MessageEvent<RuntimeEvent>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  onmessageerror: ((event: MessageEvent) => void) | null;
  postMessage(message: RuntimeRequest): void;
  terminate(): void;
}
interface Options {
  workerFactory?: () => WorkerPort;
  startupTimeout?: number;
  executionTimeout?: number;
}
interface PendingExecution {
  resolve: (result: RunResult) => void;
  reject: (error: Error) => void;
  code: string;
  lesson: Lesson;
}
const EXECUTION_TIMEOUT =
  'Die Ausführung wurde nach dem Zeitlimit beendet. Prüfe deine Schleifen und versuche es erneut.';

/** One warm worker, one pending task; cancellation destroys the current generation. */
export function createRunner(options: Options = {}): Runner {
  let worker: WorkerPort | null = null;
  let pending: PendingExecution | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let ready = false;

  function stop(message: string) {
    clearTimeout(timer);
    worker?.terminate();
    worker = null;
    ready = false;
    const task = pending;
    pending = null;
    task?.reject(new Error(message));
  }

  function armTimeout(message: string, milliseconds: number) {
    clearTimeout(timer);
    timer = setTimeout(() => stop(message), milliseconds);
  }

  function armExecutionTimeout() {
    armTimeout(
      EXECUTION_TIMEOUT,
      options.executionTimeout ?? (pending?.lesson.packages?.length ? 15_000 : 5_000),
    );
  }

  function execute() {
    if (!worker || !pending) return;
    armExecutionTimeout();
    const { code, lesson } = pending;
    try {
      worker.postMessage({
        type: 'run',
        code,
        setup: lesson.setup ?? '',
        checks: lesson.checks,
        variants: lesson.variants,
        packages: lesson.packages,
        language: lesson.language,
      });
    } catch {
      stop('Die Aufgabe konnte nicht gestartet werden. Bitte erneut versuchen.');
    }
  }

  function receive(message: RuntimeEvent) {
    if (!pending) return;
    switch (message.type) {
      case 'ready':
        ready = true;
        execute();
        break;
      case 'loadingPackages':
        armTimeout(
          'Die Analysepakete konnten nicht rechtzeitig geladen werden. Bitte erneut versuchen.',
          120_000,
        );
        break;
      case 'executing':
        armExecutionTimeout();
        break;
      case 'initError':
        stop(
          'Python konnte nicht geladen werden. Prüfe die lokale Installation und versuche es erneut. ' +
            message.error,
        );
        break;
      case 'result': {
        clearTimeout(timer);
        const task = pending;
        pending = null;
        task.resolve(message.result);
        break;
      }
    }
  }

  function startWorker() {
    const instance: WorkerPort =
      options.workerFactory?.() ??
      new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module' });
    worker = instance;
    instance.onmessage = (event) => {
      if (worker === instance) receive(event.data);
    };
    // Errors can also arrive after terminate(); they must not stop a newer worker.
    instance.onerror = () => {
      if (worker === instance)
        stop(
          'Python ist unerwartet beendet worden. Deine Eingabe bleibt erhalten; versuche es erneut.',
        );
    };
    instance.onmessageerror = () => {
      if (worker === instance)
        stop('Die Python-Antwort konnte nicht gelesen werden. Bitte erneut versuchen.');
    };
    armTimeout(
      'Python braucht zu lange zum Laden. Bitte versuche es erneut.',
      options.startupTimeout ?? 30_000,
    );
    instance.postMessage({ type: 'init' });
  }

  return {
    run(code, lesson) {
      if (pending) return Promise.reject(new Error('Eine Aufgabe wird bereits ausgeführt.'));
      return new Promise<RunResult>((resolve, reject) => {
        pending = { resolve, reject, code, lesson };
        if (ready) {
          execute();
          return;
        }
        try {
          startWorker();
        } catch {
          stop(
            'Dieser Browser konnte den Python-Worker nicht starten. Bitte einen aktuellen Browser verwenden.',
          );
        }
      });
    },
    cancel() {
      if (pending) stop('Ausführung abgebrochen. Du kannst deinen Code ändern und erneut starten.');
    },
    dispose() {
      stop('Python wurde geschlossen.');
    },
  };
}
