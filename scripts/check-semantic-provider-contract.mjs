import { createHash } from 'node:crypto';
import { access, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CONTRACT_VERSION = '1';
const CONTRACT_FILE = 'tokens/semantic-contract.json';
const ROBOTICS_ADAPTER = 'scripts/fixtures/semantic-provider-contract/robotics-adapter.json';
const FIXTURE_CASES = 'scripts/fixtures/semantic-provider-contract/cases.json';
const SOURCE_EXTENSIONS = new Set(['.css', '.js', '.jsx', '.mjs', '.ts', '.tsx']);
const ROBOTICS_SCAN_ROOTS = Object.freeze(['styles.css', 'tokens', 'dist']);

const INTERNAL_PACKAGES = [
  {
    id: 'core',
    packageRoot: 'packages/core',
    role: 'consumer',
    scanRoots: ['styles.css', 'tokens', 'src'],
  },
  {
    id: 'theme',
    packageRoot: 'packages/theme',
    role: 'provider',
    scanRoots: ['styles.css', 'tokens', 'src'],
    providerScanRoots: ['styles.css', 'tokens'],
  },
  {
    id: 'product',
    packageRoot: 'packages/product',
    role: 'consumer',
    scanRoots: ['styles.css', 'tokens', 'src'],
  },
];

function sorted(values) {
  return [...new Set(values)].sort();
}

function equalStrings(left, right) {
  return JSON.stringify(sorted(left)) === JSON.stringify(sorted(right));
}

function sortedUniqueCustomProperties(values) {
  return Array.isArray(values)
    && values.every((name) => /^--[a-z][a-z0-9-]*$/.test(name))
    && JSON.stringify(values) === JSON.stringify(sorted(values));
}

function uniqueCustomProperties(values) {
  return Array.isArray(values)
    && values.every((name) => /^--[a-z][a-z0-9-]*$/.test(name))
    && new Set(values).size === values.length;
}

function slash(value) {
  return value.replaceAll('\\', '/');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function readJson(target) {
  return JSON.parse(await readFile(target, 'utf8'));
}

function safeDescendant(directory, relativePath, label) {
  invariant(typeof relativePath === 'string' && relativePath.length > 0, `${label} must be a non-empty relative path.`);
  invariant(!relativePath.includes('\\'), `${label} must use forward slashes.`);
  const absolute = path.resolve(directory, relativePath);
  const relative = path.relative(directory, absolute);
  invariant(relative && !relative.startsWith('..') && !path.isAbsolute(relative), `${label} escapes ${slash(directory)}.`);
  return absolute;
}

async function walkFiles(target, output = []) {
  const stats = await stat(target);
  if (stats.isFile()) {
    output.push(target);
    return output;
  }
  for (const entry of await readdir(target, { withFileTypes: true })) {
    const absolute = path.join(target, entry.name);
    if (entry.isDirectory()) await walkFiles(absolute, output);
    else if (entry.isFile()) output.push(absolute);
  }
  return output;
}

function runtimeSourceFile(file) {
  if (!SOURCE_EXTENSIONS.has(path.extname(file))) return false;
  return !file.endsWith('.d.ts') && !file.endsWith('.map');
}

/**
 * Extract the custom-property contract from runtime source.
 *
 * A `var(--name)` without a fallback is required. A consumer-controlled axis
 * such as `var(--lds-button-height, <fallback>)` is intentionally optional and
 * therefore is not promoted into the provider interface. Nested fallback
 * references remain visible because their own `var(--name)` call is scanned.
 */
export function extractCustomPropertyContract(source) {
  const definitions = new Set();
  const requiredReferences = new Set();
  const allReferences = new Set();

  for (const match of source.matchAll(/(?:^|[;{])\s*(--[a-z][a-z0-9-]*)\s*:/gm)) {
    definitions.add(match[1]);
  }
  for (const match of source.matchAll(/['"`]--[a-z][a-z0-9-]*['"`]\s*:/g)) {
    const name = match[0].match(/--[a-z][a-z0-9-]*/)?.[0];
    if (name) definitions.add(name);
  }
  for (const match of source.matchAll(/var\(\s*(--[a-z][a-z0-9-]*)/g)) {
    allReferences.add(match[1]);
  }
  for (const match of source.matchAll(/var\(\s*(--[a-z][a-z0-9-]*)\s*\)/g)) {
    requiredReferences.add(match[1]);
  }

  return {
    definitions: sorted(definitions),
    requiredReferences: sorted(requiredReferences),
    allReferences: sorted(allReferences),
  };
}

export async function scanRuntimeContract(packageRoot, scanRoots) {
  const files = new Set();
  for (const relativeRoot of scanRoots) {
    const target = safeDescendant(packageRoot, relativeRoot, `scan root ${relativeRoot}`);
    invariant(await exists(target), `Semantic contract scan root is missing: ${slash(path.relative(process.cwd(), target))}.`);
    for (const file of await walkFiles(target)) {
      if (runtimeSourceFile(file)) files.add(file);
    }
  }

  const definitions = new Set();
  const requiredReferences = new Set();
  const allReferences = new Set();
  for (const file of [...files].sort()) {
    const extracted = extractCustomPropertyContract(await readFile(file, 'utf8'));
    extracted.definitions.forEach((name) => definitions.add(name));
    extracted.requiredReferences.forEach((name) => requiredReferences.add(name));
    extracted.allReferences.forEach((name) => allReferences.add(name));
  }

  return {
    files: [...files].map((file) => slash(path.relative(packageRoot, file))).sort(),
    definitions: sorted(definitions),
    requiredReferences: sorted(requiredReferences),
    allReferences: sorted(allReferences),
  };
}

function validateContractShape(contract, descriptor, manifest) {
  invariant(contract?.schemaVersion === 1, `${manifest.name}: semantic contract schemaVersion must be 1.`);
  invariant(contract?.kind === 'lds-semantic-token-package-contract', `${manifest.name}: semantic contract kind drift.`);
  invariant(contract?.contractVersion === CONTRACT_VERSION, `${manifest.name}: semantic contract version must be ${CONTRACT_VERSION}.`);
  invariant(contract?.role === descriptor.role, `${manifest.name}: semantic contract role must be ${descriptor.role}.`);
  invariant(contract?.package?.name === manifest.name, `${manifest.name}: semantic contract package name drift.`);
  invariant(contract?.package?.version === manifest.version, `${manifest.name}: semantic contract package version drift.`);
  invariant(contract?.requiresSemanticContractVersion === CONTRACT_VERSION, `${manifest.name}: requiresSemanticContractVersion must be ${CONTRACT_VERSION}.`);
  invariant(Array.isArray(contract?.scanRoots) && equalStrings(contract.scanRoots, descriptor.scanRoots), `${manifest.name}: semantic scan roots drift.`);
  invariant(
    Array.isArray(contract?.requiredVariables)
      && contract.requiredVariables.every((name) => /^--[a-z][a-z0-9-]*$/.test(name))
      && JSON.stringify(contract.requiredVariables) === JSON.stringify(sorted(contract.requiredVariables)),
    `${manifest.name}: requiredVariables must be sorted, unique custom-property names.`,
  );

  if (descriptor.role === 'provider') {
    invariant(contract.providesSemanticContractVersion === CONTRACT_VERSION, `${manifest.name}: providesSemanticContractVersion must be ${CONTRACT_VERSION}.`);
    invariant(Array.isArray(contract.providerScanRoots) && equalStrings(contract.providerScanRoots, descriptor.providerScanRoots), `${manifest.name}: provider scan roots drift.`);
    invariant(
      Array.isArray(contract.providedVariables)
        && contract.providedVariables.every((name) => /^--[a-z][a-z0-9-]*$/.test(name))
        && JSON.stringify(contract.providedVariables) === JSON.stringify(sorted(contract.providedVariables)),
      `${manifest.name}: providedVariables must be sorted, unique custom-property names.`,
    );
  } else {
    invariant(contract.providesSemanticContractVersion === undefined, `${manifest.name}: a consumer contract cannot provide a semantic version.`);
    invariant(contract.providedVariables === undefined, `${manifest.name}: a consumer contract cannot declare providedVariables.`);
  }
}

function validateManifestMetadata(manifest, contract, descriptor) {
  invariant(manifest.lds?.semanticContract === `./${CONTRACT_FILE}`, `${manifest.name}: lds.semanticContract must target ./${CONTRACT_FILE}.`);
  invariant(
    manifest.lds?.requiresSemanticContractVersion === contract.requiresSemanticContractVersion,
    `${manifest.name}: package metadata requiresSemanticContractVersion drift.`,
  );
  if (descriptor.role === 'provider') {
    invariant(
      manifest.lds?.providesSemanticContractVersion === contract.providesSemanticContractVersion,
      `${manifest.name}: package metadata providesSemanticContractVersion drift.`,
    );
  }
}

async function buildInternalRecord(root, descriptor, { requireManifestMetadata = true } = {}) {
  const packageRoot = safeDescendant(root, descriptor.packageRoot, `${descriptor.id} package root`);
  const manifest = await readJson(path.join(packageRoot, 'package.json'));
  const contract = await readJson(path.join(packageRoot, CONTRACT_FILE));
  validateContractShape(contract, descriptor, manifest);
  if (requireManifestMetadata) validateManifestMetadata(manifest, contract, descriptor);

  const scan = await scanRuntimeContract(packageRoot, contract.scanRoots);
  const requiredVariables = scan.requiredReferences.filter((name) => !scan.definitions.includes(name));
  invariant(
    equalStrings(contract.requiredVariables, requiredVariables),
    `${manifest.name}: required semantic variable manifest drift. Run node scripts/check-semantic-provider-contract.mjs --update-contracts.`,
  );

  if (descriptor.role === 'provider') {
    const providerScan = await scanRuntimeContract(packageRoot, contract.providerScanRoots);
    invariant(
      equalStrings(contract.providedVariables, providerScan.definitions),
      `${manifest.name}: provided semantic variable manifest drift. Run node scripts/check-semantic-provider-contract.mjs --update-contracts.`,
    );
  }

  return {
    id: descriptor.id,
    name: manifest.name,
    version: manifest.version,
    role: descriptor.role,
    requiresSemanticContractVersion: contract.requiresSemanticContractVersion,
    providesSemanticContractVersion: contract.providesSemanticContractVersion,
    requiredVariables: contract.requiredVariables,
    providedVariables: contract.providedVariables ?? [],
    definitions: scan.definitions,
  };
}

function validateRoboticsAdapterShape(adapter) {
  invariant(adapter?.schemaVersion === 1, 'Robotics semantic adapter schemaVersion must be 1.');
  invariant(adapter?.kind === 'lds-semantic-token-external-adapter', 'Robotics semantic adapter kind drift.');
  invariant(adapter?.contractVersion === CONTRACT_VERSION, `Robotics semantic adapter contractVersion must be ${CONTRACT_VERSION}.`);
  invariant(adapter?.requiresSemanticContractVersion === CONTRACT_VERSION, `Robotics requiresSemanticContractVersion must be ${CONTRACT_VERSION}.`);
  invariant(adapter?.package?.name === '@lk-design-system/lds-robotics-ui', 'Robotics semantic adapter package name drift.');
  invariant(
    Array.isArray(adapter.scanRoots)
      && JSON.stringify(adapter.scanRoots) === JSON.stringify(ROBOTICS_SCAN_ROOTS),
    `Robotics semantic adapter scanRoots must be ${ROBOTICS_SCAN_ROOTS.join(', ')}.`,
  );
  invariant(
    sortedUniqueCustomProperties(adapter.requiredVariables),
    'Robotics semantic adapter requiredVariables must be sorted, unique custom-property names.',
  );
  invariant(
    sortedUniqueCustomProperties(adapter.localDefinitions),
    'Robotics semantic adapter localDefinitions must be sorted, unique custom-property names.',
  );
  invariant(/^[0-9a-f]{64}$/.test(adapter.externalSurface?.sha256 ?? ''), 'Robotics external-surface SHA-256 is invalid.');
  invariant(/^[0-9a-f]{64}$/.test(adapter.vendoredArtifact?.sha256 ?? ''), 'Robotics vendored-artifact SHA-256 is invalid.');
}

export function validateRoboticsRuntimeAdapter(adapter, scan) {
  invariant(
    Array.isArray(scan?.requiredReferences) && Array.isArray(scan?.definitions),
    'Installed Robotics runtime scan must expose requiredReferences and definitions.',
  );
  const runtimeRequiredVariables = sorted(
    scan.requiredReferences.filter((name) => !scan.definitions.includes(name)),
  );
  const missingFromAdapter = runtimeRequiredVariables.filter((name) => !adapter.requiredVariables.includes(name));
  invariant(
    missingFromAdapter.length === 0,
    `Installed Robotics runtime has fallback-free variables missing from the semantic adapter: ${missingFromAdapter.join(', ')}.`,
  );
  invariant(
    equalStrings(scan.definitions, adapter.localDefinitions),
    `Installed Robotics local semantic definitions differ from the adapter: runtime=${sorted(scan.definitions).join(', ') || '(none)'}; adapter=${sorted(adapter.localDefinitions).join(', ') || '(none)'}.`,
  );
  return runtimeRequiredVariables;
}

async function buildRoboticsRecord(root) {
  const adapterPath = safeDescendant(root, ROBOTICS_ADAPTER, 'Robotics semantic adapter');
  const adapter = await readJson(adapterPath);
  validateRoboticsAdapterShape(adapter);

  const surfacePath = safeDescendant(root, adapter.externalSurface.path, 'Robotics external surface');
  const surfaceBytes = await readFile(surfacePath);
  invariant(sha256(surfaceBytes) === adapter.externalSurface.sha256, 'Robotics external-surface hash drift.');
  const surface = JSON.parse(surfaceBytes);
  invariant(
    uniqueCustomProperties(surface.upstreamTokenDependencies),
    'Robotics external-surface upstreamTokenDependencies must be unique custom-property names.',
  );
  invariant(
    uniqueCustomProperties(surface.localTokenDefinitions),
    'Robotics external-surface localTokenDefinitions must be unique custom-property names.',
  );
  invariant(surface.package?.name === adapter.package.name, 'Robotics adapter and external-surface package names differ.');
  invariant(surface.package?.version === adapter.package.version, 'Robotics adapter and external-surface package versions differ.');
  invariant(equalStrings(surface.upstreamTokenDependencies, adapter.requiredVariables), 'Robotics upstream semantic variable adapter drift.');
  invariant(equalStrings(surface.localTokenDefinitions, adapter.localDefinitions), 'Robotics local semantic definition adapter drift.');

  const artifactPath = safeDescendant(root, adapter.vendoredArtifact.path, 'Robotics vendored artifact');
  invariant(adapter.vendoredArtifact.path === surface.vendoredArtifact?.path, 'Robotics adapter and external-surface artifact paths differ.');
  invariant(adapter.vendoredArtifact.sha256 === surface.vendoredArtifact?.sha256, 'Robotics adapter and external-surface artifact hashes differ.');
  invariant(sha256(await readFile(artifactPath)) === adapter.vendoredArtifact.sha256, 'Robotics vendored-artifact hash drift.');

  const packageRoot = safeDescendant(root, 'node_modules/@lk-design-system/lds-robotics-ui', 'installed Robotics package');
  const manifest = await readJson(path.join(packageRoot, 'package.json'));
  invariant(manifest.name === adapter.package.name && manifest.version === adapter.package.version, 'Installed Robotics package identity differs from the semantic adapter.');
  const scan = await scanRuntimeContract(packageRoot, adapter.scanRoots);
  const runtimeRequiredVariables = validateRoboticsRuntimeAdapter(adapter, scan);

  return {
    id: 'robotics',
    name: adapter.package.name,
    version: adapter.package.version,
    role: 'consumer',
    requiresSemanticContractVersion: adapter.requiresSemanticContractVersion,
    requiredVariables: adapter.requiredVariables,
    runtimeRequiredVariables,
    providedVariables: [],
    definitions: scan.definitions,
  };
}

function diagnostic(code, message, details = {}) {
  return { code, message, ...details };
}

/** Validate an ordered package composition without relying on a browser. */
export function validateSemanticCombination(records, selectedIds, id = selectedIds.join('+')) {
  const byId = new Map(records.map((record) => [record.id, record]));
  const selected = selectedIds.map((selectedId) => {
    invariant(byId.has(selectedId), `${id}: unknown package ${selectedId}.`);
    return byId.get(selectedId);
  });
  const diagnostics = [];
  const providers = selected.filter((record) => record.role === 'provider');
  const consumers = selected.filter((record) => record.requiresSemanticContractVersion != null);

  if (consumers.length > 0 && providers.length === 0) {
    diagnostics.push(diagnostic(
      'LDS_THEME_PROVIDER_MISSING',
      `${id}: ${consumers.map((record) => record.name).join(', ')} require the LDS Theme semantic provider.`,
      { consumers: consumers.map((record) => record.id) },
    ));
  } else if (providers.length > 1) {
    diagnostics.push(diagnostic(
      'LDS_THEME_PROVIDER_AMBIGUOUS',
      `${id}: exactly one semantic provider is allowed; found ${providers.length}.`,
      { providers: providers.map((record) => record.id) },
    ));
  }

  if (providers.length === 1) {
    const provider = providers[0];
    const mismatches = consumers
      .filter((record) => record.requiresSemanticContractVersion !== provider.providesSemanticContractVersion)
      .map((record) => ({
        package: record.id,
        requires: record.requiresSemanticContractVersion,
        provides: provider.providesSemanticContractVersion,
      }));
    if (mismatches.length > 0) {
      diagnostics.push(diagnostic(
        'LDS_SEMANTIC_PROVIDER_VERSION_MISMATCH',
        `${id}: provider contract ${provider.providesSemanticContractVersion ?? '(missing)'} does not satisfy every consumer.`,
        { mismatches },
      ));
    }
  }

  const definitions = new Set(selected.flatMap((record) => record.definitions ?? []));
  const missingVariables = sorted(
    selected.flatMap((record) => record.requiredVariables ?? []).filter((name) => !definitions.has(name)),
  );
  if (missingVariables.length > 0) {
    diagnostics.push(diagnostic(
      'LDS_SEMANTIC_VARIABLE_MISSING',
      `${id}: ${missingVariables.length} required semantic variable(s) are unresolved.`,
      { variables: missingVariables },
    ));
  }

  return {
    id,
    packages: selectedIds,
    status: diagnostics.length === 0 ? 'valid' : 'invalid',
    diagnostics,
  };
}

export function verifyFixtureCases(fixture) {
  invariant(fixture?.schemaVersion === 1 && fixture?.kind === 'lds-semantic-provider-fixtures', 'Semantic provider fixture identity drift.');
  invariant(fixture.contractVersion === CONTRACT_VERSION, `Semantic provider fixtures must target contract ${CONTRACT_VERSION}.`);
  const records = Object.entries(fixture.packages).map(([id, record]) => ({ id, ...record }));
  const results = [];
  for (const fixtureCase of fixture.cases) {
    const result = validateSemanticCombination(records, fixtureCase.packages, fixtureCase.id);
    const actualCodes = result.diagnostics.map(({ code }) => code);
    invariant(result.status === fixtureCase.expect.status, `${fixtureCase.id}: expected ${fixtureCase.expect.status}, found ${result.status}.`);
    invariant(
      JSON.stringify(actualCodes) === JSON.stringify(fixtureCase.expect.diagnosticCodes),
      `${fixtureCase.id}: expected diagnostics ${fixtureCase.expect.diagnosticCodes.join(', ') || '(none)'}, found ${actualCodes.join(', ') || '(none)'}.`,
    );
    results.push(result);
  }
  return results;
}

async function writeInternalContracts(root) {
  for (const descriptor of INTERNAL_PACKAGES) {
    const packageRoot = safeDescendant(root, descriptor.packageRoot, `${descriptor.id} package root`);
    const manifest = await readJson(path.join(packageRoot, 'package.json'));
    const scan = await scanRuntimeContract(packageRoot, descriptor.scanRoots);
    const requiredVariables = scan.requiredReferences.filter((name) => !scan.definitions.includes(name));
    const contract = {
      schemaVersion: 1,
      kind: 'lds-semantic-token-package-contract',
      contractVersion: CONTRACT_VERSION,
      role: descriptor.role,
      package: { name: manifest.name, version: manifest.version },
      requiresSemanticContractVersion: CONTRACT_VERSION,
      ...(descriptor.role === 'provider' ? {
        providesSemanticContractVersion: CONTRACT_VERSION,
      } : {}),
      scanRoots: descriptor.scanRoots,
      requiredVariables,
      ...(descriptor.role === 'provider' ? {
        providerScanRoots: descriptor.providerScanRoots,
        providedVariables: (await scanRuntimeContract(packageRoot, descriptor.providerScanRoots)).definitions,
      } : {}),
    };
    await writeFile(path.join(packageRoot, CONTRACT_FILE), `${JSON.stringify(contract, null, 2)}\n`, 'utf8');
  }
}

export async function runSemanticProviderCheck(root = process.cwd(), options = {}) {
  if (options.updateContracts) await writeInternalContracts(root);

  const records = [];
  for (const descriptor of INTERNAL_PACKAGES) {
    records.push(await buildInternalRecord(root, descriptor, {
      requireManifestMetadata: !options.allowMissingManifestMetadata,
    }));
  }
  records.push(await buildRoboticsRecord(root));

  const fixture = await readJson(safeDescendant(root, FIXTURE_CASES, 'semantic provider fixtures'));
  const fixtureResults = verifyFixtureCases(fixture);
  const combinations = [
    validateSemanticCombination(records, ['core'], 'core-only'),
    validateSemanticCombination(records, ['core', 'theme'], 'core+theme'),
    validateSemanticCombination(records, ['core', 'theme', 'product'], 'core+theme+product'),
    validateSemanticCombination(records, ['core', 'theme', 'product', 'robotics'], 'core+theme+product+robotics'),
  ];

  const coreOnly = combinations[0];
  invariant(coreOnly.status === 'invalid', 'Core-only diagnostic fixture must fail.');
  invariant(
    JSON.stringify(coreOnly.diagnostics.map(({ code }) => code))
      === JSON.stringify(['LDS_THEME_PROVIDER_MISSING', 'LDS_SEMANTIC_VARIABLE_MISSING']),
    'Core-only diagnostic fixture must deterministically report missing Theme and unresolved semantic variables.',
  );
  for (const combination of combinations.slice(1)) {
    invariant(combination.status === 'valid', `${combination.id} semantic provider combination failed: ${combination.diagnostics.map(({ message }) => message).join(' ')}`);
  }

  return { contractVersion: CONTRACT_VERSION, records, fixtureResults, combinations };
}

async function main() {
  const updateContracts = process.argv.includes('--update-contracts');
  const allowMissingManifestMetadata = process.argv.includes('--allow-missing-manifest-metadata');
  const result = await runSemanticProviderCheck(process.cwd(), { updateContracts, allowMissingManifestMetadata });
  const coreOnlyMissing = result.combinations[0].diagnostics.find(({ code }) => code === 'LDS_SEMANTIC_VARIABLE_MISSING')?.variables.length ?? 0;
  console.log(
    `Semantic provider contract v${result.contractVersion} passed: Core-only deterministically reports Theme + ${coreOnlyMissing} unresolved variables; Core+Theme, Core+Theme+Product, and Core+Theme+Product+Robotics are valid; ${result.fixtureResults.length} positive/negative fixtures passed.`,
  );
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
