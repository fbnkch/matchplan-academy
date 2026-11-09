import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const lock = JSON.parse(await readFile(new URL('package-lock.json', root), 'utf8'));
const notices = [
  'Matchplan Academy: third-party JavaScript runtime notices',
  'Generated from the locked production dependencies. Development tools are not deployed.',
];
for (const [directory, entry] of Object.entries(lock.packages)) {
  if (!directory || entry.dev) continue;
  const folder = new URL(directory + '/', root);
  const info = JSON.parse(await readFile(new URL('package.json', folder), 'utf8'));
  notices.push(`\n===== ${info.name} ${info.version} (${info.license ?? 'see license'}) =====`);
  if (info.name === 'pyodide') {
    notices.push(
      'Unmodified Pyodide; source: https://github.com/pyodide/pyodide/tree/314.0.7',
      await readFile(new URL('public/licenses/pyodide-MPL-2.0.txt', root), 'utf8'),
    );
    continue;
  }
  const files = (await readdir(folder, { withFileTypes: true })).filter(
    (file) => file.isFile() && /^(licen[cs]e|copying|notice)([.-]|$)/i.test(file.name),
  );
  if (!files.length) throw new Error(`Missing distributed license for ${info.name}`);
  for (const file of files) notices.push(await readFile(new URL(file.name, folder), 'utf8'));
}
await mkdir(new URL('public/licenses/', root), { recursive: true });
await writeFile(new URL('public/licenses/npm.txt', root), notices.join('\n') + '\n');
