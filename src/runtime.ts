import type { Lesson, Runner, RunResult } from './types';
import type { RuntimeEvent, RuntimeRequest } from './runtime-protocol';

interface WorkerPort {
  onmessage: ((event: MessageEvent<RuntimeEvent>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  onmessageerror: ((event: MessageEvent) => void) | null;
  postMessage(message: RuntimeRequest): void;
  terminate(): void;
}
interface RunnerOptions {
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
export function createRunner(options: RunnerOptions = {}): Runner {
  let pythonWorker: WorkerPort | null = null;
  let pendingExecution: PendingExecution | null = null;
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  let isRuntimeReady = false;

  function terminateWorker(message: string) {
    clearTimeout(timeoutHandle);
    pythonWorker?.terminate();
    pythonWorker = null;
    isRuntimeReady = false;
    const settledExecution = pendingExecution;
    pendingExecution = null;
    settledExecution?.reject(new Error(message));
  }

  function scheduleTimeout(message: string, milliseconds: number) {
    clearTimeout(timeoutHandle);
    timeoutHandle = setTimeout(() => terminateWorker(message), milliseconds);
  }

  function scheduleExecutionTimeout() {
    scheduleTimeout(
      EXECUTION_TIMEOUT,
      options.executionTimeout ?? (pendingExecution?.lesson.packages?.length ? 15_000 : 5_000),
    );
  }

  function sendPendingExecution() {
    if (!pythonWorker || !pendingExecution) return;
    scheduleExecutionTimeout();
    const { code, lesson } = pendingExecution;
    try {
      pythonWorker.postMessage({
        type: 'run',
        code,
        setup: lesson.setup ?? '',
        checks: lesson.checks,
        variants: lesson.variants,
        packages: lesson.packages,
        language: lesson.language,
      });
    } catch {
      terminateWorker('Die Aufgabe konnte nicht gestartet werden. Bitte erneut versuchen.');
    }
  }

  function handleWorkerMessage(message: RuntimeEvent) {
    if (!pendingExecution) return;
    switch (message.type) {
      case 'ready':
        isRuntimeReady = true;
        sendPendingExecution();
        break;
      case 'loadingPackages':
        scheduleTimeout(
          'Die Analysepakete konnten nicht rechtzeitig geladen werden. Bitte erneut versuchen.',
          120_000,
        );
        break;
      case 'executing':
        scheduleExecutionTimeout();
        break;
      case 'initError':
        terminateWorker(
          'Python konnte nicht geladen werden. Prüfe die lokale Installation und versuche es erneut. ' +
            message.error,
        );
        break;
      case 'result': {
        clearTimeout(timeoutHandle);
        const settledExecution = pendingExecution;
        pendingExecution = null;
        settledExecution.resolve(message.result);
        break;
      }
    }
  }

  function startWorker() {
    const workerInstance: WorkerPort =
      options.workerFactory?.() ??
      new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module' });
    pythonWorker = workerInstance;
    workerInstance.onmessage = (event) => {
      if (pythonWorker === workerInstance) handleWorkerMessage(event.data);
    };
    // Errors can also arrive after terminate(); they must not stop a newer worker.
    workerInstance.onerror = () => {
      if (pythonWorker === workerInstance)
        terminateWorker(
          'Python ist unerwartet beendet worden. Deine Eingabe bleibt erhalten; versuche es erneut.',
        );
    };
    workerInstance.onmessageerror = () => {
      if (pythonWorker === workerInstance)
        terminateWorker('Die Python-Antwort konnte nicht gelesen werden. Bitte erneut versuchen.');
    };
    scheduleTimeout(
      'Python braucht zu lange zum Laden. Bitte versuche es erneut.',
      options.startupTimeout ?? 30_000,
    );
    workerInstance.postMessage({ type: 'init' });
  }

  return {
    run(code, lesson) {
      if (pendingExecution)
        return Promise.reject(new Error('Eine Aufgabe wird bereits ausgeführt.'));
      return new Promise<RunResult>((resolve, reject) => {
        pendingExecution = { resolve, reject, code, lesson };
        if (isRuntimeReady) {
          sendPendingExecution();
          return;
        }
        try {
          startWorker();
        } catch {
          terminateWorker(
            'Dieser Browser konnte den Python-Worker nicht starten. Bitte einen aktuellen Browser verwenden.',
          );
        }
      });
    },
    cancel() {
      if (pendingExecution)
        terminateWorker('Ausführung abgebrochen. Du kannst deinen Code ändern und erneut starten.');
    },
    dispose() {
      terminateWorker('Python wurde geschlossen.');
    },
  };
}
