import type { PyodideAPI } from 'pyodide';
import { evaluateSubmission } from './python-evaluator';
import type { RuntimeEvent, RuntimeRequest } from './runtime-protocol';
const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<RuntimeRequest>) => void) | null;
  postMessage: (message: RuntimeEvent) => void;
};
let pythonRuntime: PyodideAPI | undefined;
workerScope.onmessage = async (event) => {
  const request = event.data;
  if (request.type === 'init') {
    try {
      const indexURL = new URL(`${import.meta.env.BASE_URL}pyodide/`, self.location.origin).href;
      const pyodideLoader = (await import(
        /* @vite-ignore */ `${indexURL}pyodide.mjs`
      )) as typeof import('pyodide');
      pythonRuntime = await pyodideLoader.loadPyodide({
        indexURL,
        stdout: () => {},
        stderr: () => {},
      });
      pythonRuntime.setStdin({ error: true });
      workerScope.postMessage({ type: 'ready' });
    } catch (error) {
      workerScope.postMessage({ type: 'initError', error: String(error) });
    }
    return;
  }
  if (request.type !== 'run' || !pythonRuntime) return;
  try {
    const requestedPackages = (request.packages ?? []).filter((name: string) => name !== 'sqlite3');
    if (requestedPackages.length) {
      workerScope.postMessage({ type: 'loadingPackages' });
      await pythonRuntime.loadPackage(requestedPackages, { messageCallback: () => {} });
    }
    if (requestedPackages.includes('matplotlib'))
      pythonRuntime.runPython('import matplotlib\nmatplotlib.use("agg")');
    workerScope.postMessage({ type: 'executing' });
    const executionResult = evaluateSubmission(pythonRuntime, request.code, request);
    workerScope.postMessage({ type: 'result', result: executionResult });
  } catch (error) {
    workerScope.postMessage({
      type: 'result',
      result: {
        output: '',
        checks: [],
        error: 'Die Analyseumgebung konnte nicht vorbereitet werden. ' + String(error),
      },
    });
  }
};
