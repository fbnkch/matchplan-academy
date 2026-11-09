import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const directory = path.join(root, 'hosting', `vercel-${stamp}`);
const files = [];
const headerText = await readFile(path.join(root, 'public/_headers'), 'utf8');
const headers = headerText
  .split(/\r?\n/)
  .filter((line) => line.startsWith('  '))
  .map((line) => {
    const separator = line.indexOf(':');
    if (separator < 0) throw Error('Invalid header');
    return { key: line.slice(0, separator).trim(), value: line.slice(separator + 1).trim() };
  });
const config = {
  version: 2,
  framework: null,
  buildCommand: '',
  outputDirectory: '.',
  headers: [{ source: '/(.*)', headers }],
};
async function copy(relative = '') {
  const source = path.join(root, 'dist', relative);
  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw Error('Unexpected symlink');
    const next = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      await copy(next);
      continue;
    }
    if (!entry.isFile() || entry.name === '_headers') continue;
    if (/(^|[\\/])\.env|\.map$/i.test(next)) throw Error('Unexpected source/private asset');
    const bytes = await readFile(path.join(root, 'dist', next));
    await mkdir(path.dirname(path.join(directory, 'site', next)), { recursive: true });
    await writeFile(path.join(directory, 'site', next), bytes);
    files.push({
      name: next.split(path.sep).join('/'),
      bytes: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    });
  }
}
await copy();
if (
  !files.some((file) => file.name === 'index.html') ||
  !files.some((file) => file.name === 'pyodide/pyodide.asm.wasm')
)
  throw Error('Missing site/runtime');
await writeFile(path.join(directory, 'site/vercel.json'), JSON.stringify(config, null, 2) + '\n');
await mkdir(path.join(directory, 'setup'));
await writeFile(path.join(directory, 'setup/vercel.json'), JSON.stringify(config, null, 2) + '\n');
await writeFile(
  path.join(directory, 'setup/index.html'),
  '<!doctype html><html lang="de"><meta charset="utf-8"><title>Matchplan</title><p>Die private Website wird eingerichtet.</p></html>',
);
await writeFile(
  path.join(directory, 'manifest.json'),
  JSON.stringify(
    {
      provider: 'Vercel Hobby',
      access:
        'NOT CONFIGURED: enable Vercel Authentication for All Deployments before uploading site/',
      files,
    },
    null,
    2,
  ) + '\n',
);
console.log(
  JSON.stringify({
    directory,
    assets: files.length,
    bytes: files.reduce((sum, file) => sum + file.bytes, 0),
    deployed: false,
  }),
);
