import type { PyodideAPI } from 'pyodide';
import { evaluateSubmission } from './python-evaluator';
import type { RuntimeEvent, RuntimeRequest } from './runtime-protocol';
const scope = self as unknown as {
  onmessage: ((event: MessageEvent<RuntimeRequest>) => void) | null;
  postMessage: (message: RuntimeEvent) => void;
};
let python: PyodideAPI | undefined;
scope.onmessage = async (event) => {
  const msg = event.data;
  if (msg.type === 'init') {
    try {
      const indexURL = new URL(`${import.meta.env.BASE_URL}pyodide/`, self.location.origin).href;
      const loader = (await import(
        /* @vite-ignore */ `${indexURL}pyodide.mjs`
      )) as typeof import('pyodide');
      python = await loader.loadPyodide({ indexURL, stdout: () => {}, stderr: () => {} });
      python.setStdin({ error: true });
      scope.postMessage({ type: 'ready' });
    } catch (error) {
      scope.postMessage({ type: 'initError', error: String(error) });
    }
    return;
  }
  if (msg.type !== 'run' || !python) return;
  try {
    const requested = (msg.packages ?? []).filter((name: string) => name !== 'sqlite3');
    if (requested.length) {
      scope.postMessage({ type: 'loadingPackages' });
      await python.loadPackage(requested, { messageCallback: () => {} });
    }
    if (requested.includes('matplotlib'))
      python.runPython('import matplotlib\nmatplotlib.use("agg")');
    scope.postMessage({ type: 'executing' });
    const result = evaluateSubmission(python, msg.code, msg);
    scope.postMessage({ type: 'result', result });
  } catch (error) {
    scope.postMessage({
      type: 'result',
      result: {
        output: '',
        checks: [],
        error: 'Die Analyseumgebung konnte nicht vorbereitet werden. ' + String(error),
      },
    });
  }
};
