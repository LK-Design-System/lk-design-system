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

// Reduced-motion handling does not have to live in the component file. A
// component may render a motion hook — `data-lds-connection-motion` — that the
// runtime CSS switches off inside a `prefers-reduced-motion` block, which is
// the cleaner arrangement when the keyframes are themselves declared there.
// Reading only the .jsx reported those components as unprotected while the
// escape hatch existed, so the runtime CSS is consulted too.
const reducedMotionCss = await readFile(path.join(root, 'tokens', 'components.css'), 'utf8');
const guardedHooks = new Set(
  [...reducedMotionCss.matchAll(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/g)]
    .flatMap(([, block]) => [...block.matchAll(/\[(data-[\w-]+)\]/g)].map((match) => match[1])),
);

const missingReducedMotion = [];
for (const absolute of await collect(path.join(root, 'components'))) {
  const source = await readFile(absolute, 'utf8');
  if (!/@keyframes|\banimation\s*:/.test(source)) continue;
  if (/prefers-reduced-motion/.test(source)) continue;
  if ([...guardedHooks].some((hook) => source.includes(hook))) continue;
  missingReducedMotion.push(path.relative(root, absolute).replaceAll('\\', '/'));
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
