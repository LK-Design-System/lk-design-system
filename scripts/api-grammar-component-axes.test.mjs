import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checker = path.join(root, 'scripts/check-api-grammar.mjs');
const canonical = JSON.parse(await readFile(path.join(root, 'docs/references/quality/API_GRAMMAR_COMPONENT_AXES.json'), 'utf8'));
const baseline = { schemaVersion: 1, findings: { nonstandardSizeValues: [], nonstandardToneValues: [], nonstandardAccessibleNameProps: [], incompleteControlledTriads: [], eventFirstOnChange: [] } };
const fixture = await mkdtemp(path.join(tmpdir(), 'lds-api-size-axes-'));
assert(path.resolve(fixture).startsWith(path.resolve(tmpdir()) + path.sep), 'Fixture cleanup must stay inside temp root');
let passed = 0;
async function put(file, value) { const target = path.join(fixture, file); await mkdir(path.dirname(target), { recursive: true }); await writeFile(target, value); }
try {
  for (const item of canonical.sizeAxes[0].evidence) await put(item.path, await readFile(path.join(root, item.path)));
  const cases = [
    ['approved component-owned Table xs', 0, {}],
    ['standard Table sizes need no exception', 0, { table: "export interface TableProps { size?: 'sm' | 'md'; }", decision: r => { r.sizeAxes = []; } }],
    ['unregistered Table xs rejected', 1, { decision: r => { r.sizeAxes = []; } }, 'TableProps:size=xs'],
    ['another component cannot borrow Table xs', 1, { other: "export interface OtherProps { size?: 'xs'; }" }, 'OtherProps:size=xs'],
    ['unregistered Table xxs rejected', 1, { table: "export interface TableProps { size?: 'xs' | 'xxs'; }" }, 'TableProps:size=xxs'],
    ['tone ratchet preserved', 1, { table: "export interface TableProps { size?: 'xs'; tone?: 'purple'; }" }, 'nonstandardToneValues'],
    ['accessible-name ratchet preserved', 1, { table: "export interface TableProps { size?: 'xs'; accessibleLabel?: string; }" }, 'nonstandardAccessibleNameProps'],
    ['controlled-triad ratchet preserved', 1, { table: "export interface TableProps { size?: 'xs'; value?: string; }" }, 'incompleteControlledTriads'],
    ['event-first signature ratchet preserved', 1, { table: "export interface TableProps { size?: 'xs'; onChange?: (event: Event) => void; }" }, 'eventFirstOnChange'],
    ['existing historical baseline still applies', 0, { other: "export interface OtherProps { size?: 'legacy'; }", debt: r => r.findings.nonstandardSizeValues.push('components/data/Other.d.ts#OtherProps:size=legacy') }],
    ['missing rationale rejected', 1, { decision: r => { r.sizeAxes[0].rationale = ''; } }, 'Invalid, unapproved'],
    ['unapproved decision rejected', 1, { decision: r => { r.sizeAxes[0].status = 'proposed'; } }, 'Invalid, unapproved'],
    ['wrong owner rejected', 1, { decision: r => { r.sizeAxes[0].owner = 'consumer'; } }, 'Invalid, unapproved'],
    ['missing evidence rejected', 1, { decision: r => { r.sizeAxes[0].evidence = []; } }, 'Invalid, unapproved'],
    ['missing evidence marker rejected', 1, { decision: r => { r.sizeAxes[0].evidence[0].contains = 'not present'; } }, 'Missing component-owned'],
    ['duplicate decision rejected', 1, { decision: r => r.sizeAxes.push(structuredClone(r.sizeAxes[0])) }, 'Invalid, unapproved'],
    ['removed public axis cannot leave stale approval', 1, { table: "export interface TableProps { size?: 'sm'; }" }, 'Invalid, unapproved'],
    ['evidence path escape rejected', 1, { decision: r => { r.sizeAxes[0].evidence[0].path = '../outside'; } }, 'Invalid, unapproved'],
    ['non-size decision rejected', 1, { decision: r => { r.sizeAxes[0].finding = 'components/data/Table.d.ts#TableProps:tone=purple'; } }, 'Invalid, unapproved'],
    ['unknown register schema rejected', 1, { decision: r => { r.schemaVersion = 2; } }, 'Invalid component-owned'],
  ];
  for (const [name, expected, options, diagnostic] of cases) {
    const register = structuredClone(canonical), debt = structuredClone(baseline);
    options.decision?.(register); options.debt?.(debt);
    await put('components/data/Table.d.ts', options.table ?? "export interface TableProps { size?: 'xs' | 'sm' | 'md'; }");
    await put('components/data/Other.d.ts', options.other ?? 'export interface OtherProps {}');
    await put('docs/references/quality/API_GRAMMAR_COMPONENT_AXES.json', JSON.stringify(register));
    await put('docs/references/quality/API_GRAMMAR_BASELINE.json', JSON.stringify(debt));
    const result = spawnSync(process.execPath, [checker], { cwd: fixture, env: process.env, encoding: 'utf8', timeout: 15000, windowsHide: true });
    const output = (result.stdout ?? '') + (result.stderr ?? '');
    assert.equal(result.status, expected, `${name}: ${output}`);
    if (diagnostic) assert(output.includes(diagnostic), `${name}: diagnostic missing: ${output}`);
    assert.deepEqual(JSON.parse(await readFile(path.join(fixture, 'docs/references/quality/API_GRAMMAR_BASELINE.json'), 'utf8')), debt, `${name}: checker wrote baseline`);
    passed++; console.log(`PASS ${name}`);
  }
  console.log(`Validated ${passed} real CLI API grammar fixtures; no global xs allowance or baseline mutation.`);
} finally { await rm(fixture, { recursive: true, force: true }); }
