import { afterEach, expect, it, vi } from 'vitest';
import { createRunner } from './runtime';
import { lessons } from './content';
class FakeWorker {
  onmessage: ((e: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;
  onmessageerror: (() => void) | null = null;
  terminated = false;
  postMessage(message: { type: string }) {
    if (message.type === 'init') queueMicrotask(() => this.emit({ type: 'ready' }));
  }
  terminate() {
    this.terminated = true;
  }
  emit(data: unknown) {
    this.onmessage?.({ data } as MessageEvent);
  }
}
afterEach(() => vi.useRealTimers());
it('ignoriert verspätete Fehler eines abgebrochenen Workers während eines neuen Versuchs', async () => {
  const workers: FakeWorker[] = [];
  const runner = createRunner({
    workerFactory: () => {
      const worker = new FakeWorker();
      workers.push(worker);
      return worker;
    },
  });
  const first = runner.run('pass', lessons[0]);
  const cancelled = expect(first).rejects.toThrow('abgebrochen');
  runner.cancel();
  await cancelled;
  const retry = runner.run('pass', lessons[0]).catch((error) => error);
  await Promise.resolve();
  await Promise.resolve();
  workers[0].onerror?.();
  workers[0].onmessageerror?.();
  workers[1].emit({ type: 'result', result: { output: 'neu', checks: [] } });
  expect(await retry).toEqual({ output: 'neu', checks: [] });
  runner.dispose();
});
it('liefert Python-Ergebnisse über die Worker-Grenze zurück', async () => {
  const worker = new FakeWorker();
  const runner = createRunner({ workerFactory: () => worker });
  const pending = runner.run('team = "Nordstadt"', lessons[0]);
  await Promise.resolve();
  await Promise.resolve();
  worker.emit({
    type: 'result',
    result: {
      output: 'Nordstadt\n',
      checks: [{ label: 'Team', passed: true, actual: 'Nordstadt', expected: 'Nordstadt' }],
    },
  });
  expect(await pending).toEqual({
    output: 'Nordstadt\n',
    checks: [{ label: 'Team', passed: true, actual: 'Nordstadt', expected: 'Nordstadt' }],
  });
  runner.dispose();
});
it('beendet Endlosschleifen und erlaubt danach einen neuen Versuch', async () => {
  vi.useFakeTimers();
  const workers: FakeWorker[] = [];
  const runner = createRunner({
    workerFactory: () => {
      const w = new FakeWorker();
      workers.push(w);
      return w;
    },
    executionTimeout: 50,
  });
  const pending = runner.run('while True: pass', lessons[0]);
  const rejected = expect(pending).rejects.toThrow('beendet');
  await vi.advanceTimersByTimeAsync(60);
  await rejected;
  expect(workers[0].terminated).toBe(true);
  const retry = runner.run('team = "Nordstadt"', lessons[0]);
  await vi.advanceTimersByTimeAsync(0);
  workers[0].emit({ type: 'result', result: { output: 'alt', checks: [] } });
  workers[1].emit({ type: 'result', result: { output: 'neu', checks: [] } });
  expect((await retry).output).toBe('neu');
  runner.dispose();
});
it('bricht Laden und Ausführung ab, ohne auf eine Worker-Antwort zu warten', async () => {
  const worker = new FakeWorker();
  const runner = createRunner({ workerFactory: () => worker });
  const pending = runner.run('pass', lessons[0]);
  const rejected = expect(pending).rejects.toThrow('abgebrochen');
  runner.cancel();
  await rejected;
  expect(worker.terminated).toBe(true);
});
it('behält eine geladene Laufzeit beim Bearbeiten zwischen zwei Versuchen', async () => {
  const factory = vi.fn(() => new FakeWorker());
  const runner = createRunner({ workerFactory: factory });
  const first = runner.run('pass', lessons[0]);
  await Promise.resolve();
  await Promise.resolve();
  const worker = factory.mock.results[0].value;
  worker.emit({ type: 'result', result: { output: '', checks: [] } });
  await first;
  runner.cancel();
  expect(worker.terminated).toBe(false);
  const second = runner.run('pass', lessons[0]);
  worker.emit({ type: 'result', result: { output: 'neu', checks: [] } });
  await second;
  expect(factory).toHaveBeenCalledTimes(1);
  runner.dispose();
  expect(worker.terminated).toBe(true);
});
it('meldet einen Ladefehler und kann beim nächsten Versuch neu laden', async () => {
  const worker = new FakeWorker();
  worker.postMessage = () => {};
  const runner = createRunner({ workerFactory: () => worker });
  const pending = runner.run('pass', lessons[0]);
  const rejected = expect(pending).rejects.toThrow('nicht geladen');
  worker.emit({ type: 'initError', error: '404' });
  await rejected;
  expect(worker.terminated).toBe(true);
});
