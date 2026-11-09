import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import './prepare-notices.mjs';
const root = new URL('../', import.meta.url);
const source = new URL('node_modules/pyodide/', root),
  target = new URL('public/pyodide/', root);
const info = JSON.parse(await readFile(new URL('package.json', source), 'utf8'));
if (info.version !== '314.0.7') throw new Error('Unexpected Pyodide version');
await mkdir(target, { recursive: true });
for (const file of [
  'pyodide.mjs',
  'pyodide.asm.mjs',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json',
])
  await copyFile(new URL(file, source), new URL(file, target));
const lock = JSON.parse(await readFile(new URL('pyodide-lock.json', source), 'utf8'));
const needed = new Set();
function include(name) {
  if (needed.has(name)) return;
  const pkg = lock.packages[name];
  if (!pkg) throw new Error(`Unknown Python package: ${name}`);
  needed.add(name);
  pkg.depends.forEach(include);
}
['numpy', 'pandas', 'scikit-learn', 'matplotlib'].forEach(include);
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const packages = [...needed];
for (let start = 0; start < packages.length; start += 4) {
  const results = await Promise.allSettled(
    packages.slice(start, start + 4).map(async (name) => {
      const pkg = lock.packages[name],
        file = new URL(pkg.file_name, target);
      try {
        const cached = await readFile(file);
        if (hash(cached) === pkg.sha256) return;
      } catch {}
      console.log(`Python-Paket laden: ${name} ${pkg.version}`);
      const response = await fetch(
        `https://cdn.jsdelivr.net/pyodide/v314.0.7/full/${pkg.file_name}`,
        { signal: AbortSignal.timeout(120000) },
      );
      if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (hash(bytes) !== pkg.sha256)
        throw new Error(`${name}: SHA-256 stimmt nicht mit dem Paketmanifest überein.`);
      await writeFile(file, bytes);
    }),
  );
  for (const result of results) if (result.status === 'rejected') throw result.reason;
}
console.log(
  `Python-Laufzeit 314.0.7 und ${packages.length} geprüfte Analysepakete lokal vorbereitet.`,
);
