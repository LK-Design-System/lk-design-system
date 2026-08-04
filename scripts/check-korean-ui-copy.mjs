import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  contractVersion,
  hydrateFixtureCatalog,
  verifyCopyCatalog,
} from './korean-ui-copy-contract.mjs';

const root = process.cwd();
const schemaPath = path.join(root, 'docs', 'references', 'quality', 'KOREAN_UI_COPY_CONTRACT.schema.json');
const defaultBaselinePath = path.join(root, 'docs', 'references', 'quality', 'KOREAN_UI_COPY_BASELINE.json');
const fixtureRoot = path.join(root, 'scripts', 'fixtures', 'korean-ui-copy');

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

function schemaFindings(validate) {
  return (validate.errors || []).map((error) => ({
    code: 'COPY_SCHEMA',
    copySet: error.instancePath || '/',
    detail: error.message || 'schema validation failed',
    fingerprint: `COPY_SCHEMA:${error.instancePath || '/'}:${error.keyword}`,
  }));
}

function validateCatalog(validate, catalog) {
  if (!validate(catalog)) return schemaFindings(validate);
  return verifyCopyCatalog(catalog);
}

function findingCodes(findings) {
  return [...new Set(findings.map(({ code }) => code))].sort();
}

async function verifyFixtures(validate) {
  const positive = hydrateFixtureCatalog(await readJson(path.join(fixtureRoot, 'positive.json')));
  const positiveFindings = validateCatalog(validate, positive);
  if (positiveFindings.length > 0) {
    throw new Error(`Positive Korean UI copy fixture failed:\n${JSON.stringify(positiveFindings, null, 2)}`);
  }

  const negative = await readJson(path.join(fixtureRoot, 'negative.json'));
  for (const fixture of negative.cases) {
    const catalog = hydrateFixtureCatalog(fixture.catalog);
    const actual = findingCodes(validateCatalog(validate, catalog));
    const expected = [...fixture.expectedCodes].sort();
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Negative fixture ${fixture.name} expected ${expected.join(', ')} but received ${actual.join(', ') || 'pass'}.`);
    }
  }
  console.log(`Validated Korean UI copy fixtures: 1 positive catalog, ${negative.cases.length} negative cases.`);
}

const schema = await readJson(schemaPath);
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);
await verifyFixtures(validate);

const catalogArgument = argument('--catalog');
const baselinePath = path.resolve(argument('--baseline') || defaultBaselinePath);
const baseline = await readJson(baselinePath);
if (baseline.schemaVersion !== 1 || baseline.contractVersion !== contractVersion || !Array.isArray(baseline.knownFindings)) {
  throw new Error(`Unsupported Korean UI copy baseline: ${path.relative(root, baselinePath)}`);
}

if (!catalogArgument) {
  if (process.argv.includes('--update-baseline')) {
    await writeFile(baselinePath, `${JSON.stringify({
      ...baseline,
      contractVersion,
      knownFindings: [],
    }, null, 2)}\n`, 'utf8');
    console.log('Updated the LDS Korean UI copy baseline with 0 deterministic findings.');
    process.exit(0);
  }
  console.log(`Validated Korean UI copy contract v${contractVersion} and an empty LDS finding baseline.`);
  process.exit(0);
}

const catalogPath = path.resolve(catalogArgument);
const catalog = await readJson(catalogPath);
const findings = validateCatalog(validate, catalog);
if (process.argv.includes('--update-baseline')) {
  await mkdir(path.dirname(baselinePath), { recursive: true });
  await writeFile(baselinePath, `${JSON.stringify({
    schemaVersion: 1,
    contractVersion,
    mode: 'new-findings-only',
    description: `Known deterministic findings for ${path.relative(root, catalogPath).replaceAll('\\', '/')}.`,
    knownFindings: findings.map(({ fingerprint }) => fingerprint).sort(),
  }, null, 2)}\n`, 'utf8');
  console.log(`Updated Korean UI copy baseline with ${findings.length} deterministic findings.`);
  process.exit(0);
}

const known = new Set(baseline.knownFindings);
const regressions = findings.filter(({ fingerprint }) => !known.has(fingerprint));
if (regressions.length > 0) {
  throw new Error(`Korean UI copy regressions detected:\n${regressions.map((item) => `- [${item.code}] ${item.copySet} ${item.detail}`).join('\n')}`);
}
console.log(`Validated Korean UI copy catalog: ${catalog.copySets?.length || 0} copy sets, ${findings.length} known findings, 0 new regressions.`);
