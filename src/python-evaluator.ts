import type { PyodideAPI } from 'pyodide';
import type { Lesson, RunResult } from './types';

export function evaluateSubmission(
  pythonRuntime: PyodideAPI,
  submittedCode: string,
  lesson: Pick<Lesson, 'setup' | 'checks' | 'variants' | 'language'>,
): RunResult {
  const executionResult: RunResult = { output: '', checks: [] };
  let capturedCharacterCount = 0;
  const evaluationCases = [
    { label: '', setup: lesson.setup ?? '', checks: lesson.checks },
    ...(lesson.variants ?? []),
  ];
  for (const [caseIndex, evaluationCase] of evaluationCases.entries()) {
    let combinedOutput = '',
      standardOutput = '';
    const captureOutputLine = (line: string) => {
      capturedCharacterCount += line.length + 1;
      if (capturedCharacterCount > 64000) return;
      combinedOutput += line + '\n';
    };
    pythonRuntime.setStdout({
      batched: (line: string) => {
        if (capturedCharacterCount + line.length + 1 <= 64000) standardOutput += line + '\n';
        captureOutputLine(line);
      },
    });
    pythonRuntime.setStderr({ batched: captureOutputLine });
    pythonRuntime.runPython(
      'import sys as __mp_sys\nif "matplotlib.pyplot" in __mp_sys.modules:\n    __mp_sys.modules["matplotlib.pyplot"].close("all")',
    );
    const executionNamespace = pythonRuntime.runPython('dict()');
    try {
      pythonRuntime.runPython(evaluationCase.setup, {
        globals: executionNamespace,
        filename: 'uebungsdaten.py',
      });
      let pythonReturnValue;
      if (lesson.language === 'sql') {
        executionNamespace.set('__mp_query', submittedCode);
        pythonReturnValue = pythonRuntime.runPython(
          'result = [list(row) for row in conn.execute(__mp_query).fetchall()]\nprint(result)',
          { globals: executionNamespace, filename: 'deine_abfrage.sql' },
        );
      } else
        pythonReturnValue = pythonRuntime.runPython(submittedCode, {
          globals: executionNamespace,
          filename: 'deine_loesung.py',
        });
      if (pythonReturnValue && typeof pythonReturnValue.destroy === 'function')
        pythonReturnValue.destroy();
      if (capturedCharacterCount > 64000)
        throw new Error('Zu viel Ausgabe (64 KB). Entferne print aus großen Schleifen.');
      if (caseIndex === 0) executionResult.output = combinedOutput;
      for (const check of evaluationCase.checks) {
        const label = evaluationCase.label
          ? `${evaluationCase.label}: ${check.label}`
          : check.label;
        try {
          const actualValue =
            check.source === 'stdout'
              ? standardOutput.trimEnd()
              : JSON.parse(
                  pythonRuntime.runPython(
                    `import json as __mp_json\n__mp_json.dumps(${check.expression}, ensure_ascii=False, allow_nan=False)`,
                    { globals: executionNamespace, filename: 'pruefung.py' },
                  ),
                );
          executionResult.checks.push({
            label,
            passed: !check.raises && JSON.stringify(actualValue) === JSON.stringify(check.expected),
            actual: JSON.stringify(actualValue),
            expected: check.raises ?? JSON.stringify(check.expected),
          });
        } catch (error) {
          executionResult.checks.push({
            label,
            passed: !!check.raises && (error as { type?: string })?.type === check.raises,
            actual: String(error),
            expected: check.raises ?? JSON.stringify(check.expected),
          });
        }
      }
    } catch (error) {
      if (caseIndex === 0) {
        executionResult.output = combinedOutput;
        executionResult.error = String(error);
      } else
        executionResult.checks.push({
          label: evaluationCase.label,
          passed: false,
          actual: String(error),
          expected: 'Code funktioniert auch mit diesen Eingaben.',
        });
    } finally {
      if (caseIndex === 0) {
        try {
          executionResult.figures = JSON.parse(
            pythonRuntime.runPython(`import sys as __mp_sys, io as __mp_io, json as __mp_json, base64 as __mp_base64
__mp_images = []
if "matplotlib.pyplot" in __mp_sys.modules:
    __mp_plt = __mp_sys.modules["matplotlib.pyplot"]
    for __mp_number in __mp_plt.get_fignums()[:3]:
        __mp_buffer = __mp_io.BytesIO()
        __mp_plt.figure(__mp_number).savefig(__mp_buffer, format="svg", metadata={"Date": None})
        if len(__mp_buffer.getvalue()) <= 600000:
            __mp_images.append(__mp_base64.b64encode(__mp_buffer.getvalue()).decode())
    __mp_plt.close("all")
    __mp_sys.modules["matplotlib"].rcdefaults()
__mp_json.dumps(__mp_images)`),
          );
        } catch {
          executionResult.figures = [];
        }
      }
      executionNamespace.destroy();
    }
    if (capturedCharacterCount > 64000)
      executionResult.error = 'Zu viel Ausgabe (64 KB). Entferne print aus großen Schleifen.';
    if (executionResult.error) break;
  }
  return executionResult;
}
