import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const baselinePath = path.join(root, 'docs', 'references', 'quality', 'MOTION_HYGIENE_BASELINE.json');
const update = process.argv.includes('--update-baseline');

async function collect(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(absolute, out);
    else if (entry.isFile() && entry.name.endsWith('.jsx')) out.push(absolute);
  }
  return out.sort();
}

const missingReducedMotion = [];
for (const absolute of await collect(path.join(root, 'components'))) {
  const source = await readFile(absolute, 'utf8');
  if (!/@keyframes|\banimation\s*:/.test(source)) continue;
  if (!/prefers-reduced-motion/.test(source)) {
    missingReducedMotion.push(path.relative(root, absolute).replaceAll('\\', '/'));
  }
}

if (update) {
  await mkdir(path.dirname(baselinePath), { recursive: true });
  await writeFile(baselinePath, `${JSON.stringify({ schemaVersion: 1, missingReducedMotion }, null, 2)}\n`);
  console.log(`Updated motion hygiene baseline with ${missingReducedMotion.length} animated components lacking reduced-motion handling.`);
  process.exit(0);
}
const baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
const allowed = new Set(baseline.missingReducedMotion || []);
const regressions = missingReducedMotion.filter((file) => !allowed.has(file));
if (regressions.length) throw new Error(`New animation without reduced-motion handling:\n- ${regressions.join('\n- ')}`);
console.log(`Validated motion hygiene ratchet: ${missingReducedMotion.length} known files, 0 new reduced-motion gaps.`);
