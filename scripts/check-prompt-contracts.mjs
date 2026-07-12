import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const baselinePath = path.join(root, 'docs', 'references', 'quality', 'PROMPT_CONTRACT_BASELINE.json');
const update = process.argv.includes('--update-baseline');

async function collect(dir, suffix, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(absolute, suffix, out);
    else if (entry.isFile() && entry.name.endsWith(suffix)) out.push(absolute);
  }
  return out.sort();
}

const findings = { missingExample: [], missingSections: [], missingComponentInExample: [], brokenPaths: [] };
for (const jsxPath of await collect(path.join(root, 'components'), '.jsx')) {
  const rel = path.relative(root, jsxPath).replaceAll('\\', '/');
  const promptPath = jsxPath.slice(0, -4) + '.prompt.md';
  const promptRel = path.relative(root, promptPath).replaceAll('\\', '/');
  const [jsx, prompt] = await Promise.all([readFile(jsxPath, 'utf8'), readFile(promptPath, 'utf8').catch(() => '')]);
  const exports = [...jsx.matchAll(/^export\s+(?:function|const)\s+([A-Za-z_$][\w$]*)/gm)].map((match) => match[1]);
  const fences = [...prompt.matchAll(/```(?:jsx|tsx)?\s*([\s\S]*?)```/g)].map((match) => match[1]);
  if (!fences.length) findings.missingExample.push(promptRel);
  if ((prompt.match(/^##?\s+/gm) || []).length < 1 || (prompt.match(/^[-*]\s+/gm) || []).length < 2) findings.missingSections.push(promptRel);
  if (fences.length && exports.length && !exports.some((name) => fences.some((fence) => new RegExp(`<${name}\\b`).test(fence)))) {
    findings.missingComponentInExample.push(promptRel);
  }
  for (const match of prompt.matchAll(/`((?:components|stories|docs)\/[A-Za-z0-9_./ -]+)`/g)) {
    const candidate = match[1].replace(/[.,;:]$/, '');
    try { await access(path.join(root, candidate)); } catch { findings.brokenPaths.push(`${promptRel}:${candidate}`); }
  }
}
for (const values of Object.values(findings)) values.sort();

if (update) {
  await mkdir(path.dirname(baselinePath), { recursive: true });
  await writeFile(baselinePath, `${JSON.stringify({ schemaVersion: 1, findings }, null, 2)}\n`);
  console.log(`Updated prompt contract baseline: ${Object.entries(findings).map(([key, values]) => `${key}=${values.length}`).join(', ')}.`);
  process.exit(0);
}
const baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
const regressions = [];
for (const [category, values] of Object.entries(findings)) {
  const allowed = new Set(baseline.findings?.[category] || []);
  values.filter((value) => !allowed.has(value)).forEach((value) => regressions.push(`${category}: ${value}`));
}
if (regressions.length) throw new Error(`Prompt contract regressions detected:\n- ${regressions.join('\n- ')}`);
console.log('Validated prompt contract ratchet: 0 new missing examples, structure gaps, or broken repository paths.');
