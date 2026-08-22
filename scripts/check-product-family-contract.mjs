import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contractPath = 'docs/references/architecture/PRODUCT_FAMILY_CONTRACT.json';
const entryPath = 'packages/product/src/index.js';
const packagePath = 'packages/product/package.json';
const packagedContractPath = 'packages/product/docs/product-family-contract.json';
const ownerAuthorityPath = 'docs/references/architecture/OWNER_AUTHORITY_CONTRACT.json';
const ownerAuthorityRef = `${ownerAuthorityPath}#domainDecisions`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalize(value) {
  return value.replaceAll('\\', '/').replace(/^\.\//, '');
}

function parsePublicSources(source) {
  const rows = [];
  const re = /export\s+\{\s*([^}]+?)\s*\}\s+from\s+['"]([^'"]+)['"]/g;
  for (const match of source.matchAll(re)) {
    const names = match[1]
      .split(',')
      .map((name) => name.trim().split(/\s+as\s+/i)[0])
      .filter(Boolean);
    rows.push({ names, source: normalize(match[2]) });
  }
  return rows;
}

const contract = JSON.parse(await readFile(path.join(root, contractPath), 'utf8'));
const packageManifest = JSON.parse(await readFile(path.join(root, packagePath), 'utf8'));
const packagedContract = JSON.parse(await readFile(path.join(root, packagedContractPath), 'utf8'));
const ownerAuthority = JSON.parse(await readFile(path.join(root, ownerAuthorityPath), 'utf8'));
const entry = await readFile(path.join(root, entryPath), 'utf8');

assert(contract.schemaVersion === 1, `${contractPath} must use schemaVersion 1.`);
assert(contract.status === 'active' && contract.authority === 'live', `${contractPath} must be the active live contract.`);
assert(contract.package === packageManifest.name, `${contractPath} package must match ${packagePath}.`);
assert(contract.layer === packageManifest.lds?.layer, `${contractPath} layer must match package metadata.`);
assert(contract.ownerBoundaryAuthority === ownerAuthorityRef, `${contractPath} must delegate cross-layer boundaries to ${ownerAuthorityRef}.`);
assert(packageManifest.lds?.familyContract === './docs/product-family-contract.json', `${packagePath} must point to its packaged family contract.`);
assert(JSON.stringify(packagedContract) === JSON.stringify(contract), `${packagedContractPath} must match ${contractPath}.`);
assert(Array.isArray(contract.families) && contract.families.length === 3, `${contractPath} must define Application, Operations and Workspace.`);

const familyIds = contract.families.map((family) => family.id);
assert(new Set(familyIds).size === familyIds.length, `${contractPath} family ids must be unique.`);
assert(JSON.stringify([...familyIds].sort()) === JSON.stringify(['application', 'operations', 'workspace']), `${contractPath} family ids must be application, operations and workspace.`);

const prefixRows = contract.families.flatMap((family) => (family.sourcePrefixes ?? []).map((prefix) => ({ family: family.id, prefix: normalize(prefix) })));
assert(prefixRows.length > 0, `${contractPath} must define sourcePrefixes.`);
for (const row of prefixRows) assert(row.prefix.startsWith('components/'), `${contractPath}: ${row.prefix} must be rooted at components/.`);
for (let index = 0; index < prefixRows.length; index += 1) {
  for (let other = index + 1; other < prefixRows.length; other += 1) {
    const left = prefixRows[index];
    const right = prefixRows[other];
    assert(!(left.prefix.startsWith(right.prefix) || right.prefix.startsWith(left.prefix)), `${contractPath}: overlapping source prefixes ${left.prefix} and ${right.prefix}.`);
  }
}

const rows = parsePublicSources(entry);
assert(rows.length > 0, `${entryPath} has no public exports.`);
const seenNames = new Set();
const familyCounts = new Map(familyIds.map((id) => [id, 0]));
const familyByExport = new Map();
const failures = [];
for (const row of rows) {
  for (const name of row.names) {
    assert(!seenNames.has(name), `${entryPath}: public export ${name} is listed more than once.`);
    seenNames.add(name);
  }
  const source = row.source.replace(/\.jsx?$/, '');
  const matches = prefixRows.filter(({ prefix }) => source.startsWith(prefix.replace(/\/$/, '')));
  const matchedFamilies = [...new Set(matches.map(({ family }) => family))];
  if (matchedFamilies.length !== 1) {
    failures.push(`${row.source}: expected exactly one Product family, found ${matchedFamilies.join(', ') || 'none'}.`);
    continue;
  }
  familyCounts.set(matchedFamilies[0], familyCounts.get(matchedFamilies[0]) + 1);
  for (const name of row.names) familyByExport.set(name, matchedFamilies[0]);
}
for (const [family, count] of familyCounts) {
  assert(count > 0, `${contractPath}: ${family} has no public Product source modules.`);
}
if (failures.length > 0) throw new Error(`Product family contract failed:\n${failures.sort().map((failure) => `- ${failure}`).join('\n')}`);

const boundaryFailures = [];
const productBoundaryDecisions = (ownerAuthority.domainDecisions ?? [])
  .filter((decision) => decision.ownerLayer === 'product');
assert(productBoundaryDecisions.length > 0, `${ownerAuthorityPath} must define Product boundary decisions.`);
for (const decision of productBoundaryDecisions) {
  if (!familyIds.includes(decision.productFamily)) {
    boundaryFailures.push(`${decision.id}: Product boundary must name one of ${familyIds.join(', ')}; found ${JSON.stringify(decision.productFamily)}.`);
    continue;
  }
  for (const exportName of decision.representativePublicExports ?? []) {
    const family = familyByExport.get(exportName);
    if (family !== decision.productFamily) {
      boundaryFailures.push(`${decision.id}: ${exportName} must belong to Product/${decision.productFamily}; found ${family || 'missing'}.`);
    }
  }
}
if (boundaryFailures.length > 0) {
  throw new Error(`Product owner boundary contract failed:\n${boundaryFailures.sort().map((failure) => `- ${failure}`).join('\n')}`);
}

console.log(`Validated Product family contract: ${rows.length} public source modules, ${seenNames.size} exports, families ${familyIds.join(', ')}, ${productBoundaryDecisions.length} cross-layer boundary decisions.`);
