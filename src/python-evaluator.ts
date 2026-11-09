import type { PyodideAPI } from 'pyodide';
import type { Lesson, RunResult } from './types';

export function evaluateSubmission(
  python: PyodideAPI,
  code: string,
  lesson: Pick<Lesson, 'setup' | 'checks' | 'variants' | 'language'>,
): RunResult {
  const result: RunResult = { output: '', checks: [] };
  let totalOutput = 0;
  const cases = [
    { label: '', setup: lesson.setup ?? '', checks: lesson.checks },
    ...(lesson.variants ?? []),
  ];
  for (const [index, testCase] of cases.entries()) {
    let output = '',
      stdout = '';
    const capture = (line: string) => {
      totalOutput += line.length + 1;
      if (totalOutput > 64000) return;
      output += line + '\n';
    };
    python.setStdout({
      batched: (line: string) => {
        if (totalOutput + line.length + 1 <= 64000) stdout += line + '\n';
        capture(line);
      },
    });
    python.setStderr({ batched: capture });
    python.runPython(
      'import sys as __mp_sys\nif "matplotlib.pyplot" in __mp_sys.modules:\n    __mp_sys.modules["matplotlib.pyplot"].close("all")',
    );
    const namespace = python.runPython('dict()');
    try {
      python.runPython(testCase.setup, { globals: namespace, filename: 'uebungsdaten.py' });
      let value;
      if (lesson.language === 'sql') {
        namespace.set('__mp_query', code);
        value = python.runPython(
          'result = [list(row) for row in conn.execute(__mp_query).fetchall()]\nprint(result)',
          { globals: namespace, filename: 'deine_abfrage.sql' },
        );
      } else value = python.runPython(code, { globals: namespace, filename: 'deine_loesung.py' });
      if (value && typeof value.destroy === 'function') value.destroy();
      if (totalOutput > 64000)
        throw new Error('Zu viel Ausgabe (64 KB). Entferne print aus großen Schleifen.');
      if (index === 0) result.output = output;
      for (const check of testCase.checks) {
        const label = testCase.label ? `${testCase.label}: ${check.label}` : check.label;
        try {
          const actual =
            check.source === 'stdout'
              ? stdout.trimEnd()
              : JSON.parse(
                  python.runPython(
                    `import json as __mp_json\n__mp_json.dumps(${check.expression}, ensure_ascii=False, allow_nan=False)`,
                    { globals: namespace, filename: 'pruefung.py' },
                  ),
                );
          result.checks.push({
            label,
            passed: !check.raises && JSON.stringify(actual) === JSON.stringify(check.expected),
            actual: JSON.stringify(actual),
            expected: check.raises ?? JSON.stringify(check.expected),
          });
        } catch (error) {
          result.checks.push({
            label,
            passed: !!check.raises && (error as { type?: string })?.type === check.raises,
            actual: String(error),
            expected: check.raises ?? JSON.stringify(check.expected),
          });
        }
      }
    } catch (error) {
      if (index === 0) {
        result.output = output;
        result.error = String(error);
      } else
        result.checks.push({
          label: testCase.label,
          passed: false,
          actual: String(error),
          expected: 'Code funktioniert auch mit diesen Eingaben.',
        });
    } finally {
      if (index === 0) {
        try {
          result.figures = JSON.parse(
            python.runPython(`import sys as __mp_sys, io as __mp_io, json as __mp_json, base64 as __mp_base64
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
          result.figures = [];
        }
      }
      namespace.destroy();
    }
    if (totalOutput > 64000)
      result.error = 'Zu viel Ausgabe (64 KB). Entferne print aus großen Schleifen.';
    if (result.error) break;
  }
  return result;
}
