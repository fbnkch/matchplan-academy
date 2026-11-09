import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { zipSync } from 'fflate';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const files = {};
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw Error('Symlinks are not included in hosting uploads.');
    if (entry.isDirectory()) {
      await collect(absolute);
      continue;
    }
    const name = path.relative(dist, absolute).split(path.sep).join('/');
    if (!entry.isFile() || name.startsWith('../')) throw Error('Invalid asset path.');
    const data = await readFile(absolute);
    if (data.length > 25 * 1024 * 1024)
      throw Error(`Cloudflare Pages file limit exceeded: ${name}`);
    if (/(^|\/)(\.env[^/]*|\.git)(\/|$)|\.map$|^Beispielprojekte\//i.test(name))
      throw Error(`Unexpected private/source asset: ${name}`);
    files[name] = data;
  }
}
await collect(dist);
for (const required of [
  'index.html',
  '_headers',
  'pyodide/pyodide.mjs',
  'pyodide/pyodide.asm.wasm',
])
  if (!files[required]) throw Error(`Missing asset: ${required}`);
if (Object.keys(files).length > 1000) throw Error('Too many assets for dashboard drag-and-drop.');
const output = path.join(root, 'hosting');
await mkdir(output, { recursive: true });
const archive = zipSync(files, { level: 6 });
await writeFile(path.join(output, 'matchplan-pages.zip'), archive);
const manifest = {
  provider: 'Cloudflare Pages',
  privateAccess:
    'NOT CONFIGURED: requires Cloudflare Access policy on production and preview hostnames',
  files: Object.entries(files).map(([name, data]) => ({
    name,
    size: data.length,
    sha256: createHash('sha256').update(data).digest('hex'),
  })),
  zipBytes: archive.length,
};
await writeFile(path.join(output, 'assets.json'), JSON.stringify(manifest, null, 2) + '\n');
const placeholder = zipSync({
  'index.html': new TextEncoder().encode(
    '<!doctype html><html lang="de"><meta charset="utf-8"><title>Matchplan wird eingerichtet</title><p>Diese Seite wird noch eingerichtet.</p></html>',
  ),
});
await writeFile(path.join(output, 'nur-einrichtung.zip'), placeholder);
console.log(
  `Prepared ${Object.keys(files).length} assets, ${archive.length} ZIP bytes. Not deployed. Login must be configured before uploading Matchplan.`,
);
