#!/usr/bin/env node

import { cp, mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const cliDirectory = path.dirname(fileURLToPath(import.meta.url));
const packageDirectory = path.resolve(cliDirectory, '..');
const workspaceRoot = path.resolve(packageDirectory, '..', '..');
const defaultContractPath = path.join(workspaceRoot, 'docs', 'references', 'package-split', 'CROSS_REPOSITORY_STYLE_CONTRACT.json');
const sourceExtensions = new Set(['.css', '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx']);
const ignoredDirectories = new Set(['node_modules', 'dist', 'storybook-static', 'coverage', '.git']);

function slash(value) {
  return value.replaceAll('\\', '/');
}

function lineAt(source, index) {
  return source.slice(0, index).split('\n').length;
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/.*$/gm, (match, prefix) => `${prefix}${' '.repeat(Math.max(0, match.length - prefix.length))}`);
}

function normalizeValue(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function diagnostic(code, file, message, line) {
  return { code, file: slash(file), line: line || undefined, message };
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(root, entries, output = []) {
  for (const entry of entries) {
    const absolute = path.resolve(root, entry);
    if (!await exists(absolute)) continue;
    const metadata = await stat(absolute);
    if (metadata.isFile()) {
      if (sourceExtensions.has(path.extname(absolute))) output.push(absolute);
      continue;
    }
    for (const child of await readdir(absolute, { withFileTypes: true })) {
      if (child.isDirectory() && ignoredDirectories.has(child.name)) continue;
      const relativeChild = path.relative(root, path.join(absolute, child.name));
      if (child.isDirectory()) await collectFiles(root, [relativeChild], output);
      else if (child.isFile() && sourceExtensions.has(path.extname(child.name))) output.push(path.join(absolute, child.name));
    }
  }
  return [...new Set(output)].sort();
}

function definitionsIn(source, relativeFile) {
  const clean = stripComments(source);
  const definitions = [];
  if (relativeFile.endsWith('.css')) {
    for (const match of clean.matchAll(/(--[A-Za-z0-9_-]*[A-Za-z0-9_])(?![A-Za-z0-9_-])\s*:\s*([^;}]+?)\s*(?:;|(?=\}))/g)) {
      definitions.push({ name: match[1], value: normalizeValue(match[2]), file: relativeFile, line: lineAt(clean, match.index) });
    }
  }
  for (const match of clean.matchAll(/['"](--[A-Za-z0-9_-]*[A-Za-z0-9_])(?![A-Za-z0-9_-])['"]\s*:/g)) {
    if (!definitions.some((entry) => entry.name === match[1] && entry.line === lineAt(clean, match.index))) {
      definitions.push({ name: match[1], value: '', file: relativeFile, line: lineAt(clean, match.index) });
    }
  }
  return definitions;
}

function referencesIn(source, relativeFile) {
  const clean = stripComments(source);
  return [...clean.matchAll(/var\(\s*(--[A-Za-z0-9_-]*[A-Za-z0-9_])(?![A-Za-z0-9_-])/g)].map((match) => ({
    name: match[1],
    file: relativeFile,
    line: lineAt(clean, match.index),
  }));
}

function parsePublicExports(source) {
  const entries = [];
  for (const match of source.matchAll(/export\s*\{([^}]+)\}\s*from\s*['"]\.\/([^'"]+)['"]/g)) {
    const sourcePath = match[2].replace(/\.(?:js|jsx|ts|tsx)$/, '');
    for (const item of match[1].split(',')) {
      const parts = item.trim().split(/\s+as\s+/);
      if (parts[0]) entries.push(`${sourcePath}::${parts.at(-1)}`);
    }
  }
  return entries.sort();
}

function parseArgs(argv) {
  const result = { positional: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith('--')) {
      result.positional.push(value);
      continue;
    }
    const key = value.slice(2);
    if (key === 'require-built-stories') result[key] = true;
    else result[key] = argv[++index];
  }
  return result;
}

function validateContractShape(contract, profileName) {
  const profile = contract?.profiles?.[profileName];
  const validStories = Array.isArray(profile?.representativeStories)
    && profile.representativeStories.length > 0
    && profile.representativeStories.every((story) => /^[0-9]+x[0-9]+$/.test(story.viewport));
  if (contract?.schemaVersion !== 1
    || contract?.kind !== 'lds-cross-repository-style-contract'
    || !Array.isArray(contract?.lds?.packages)
    || contract.lds.packages.length === 0
    || !Array.isArray(profile?.localTokenDefinitions?.names)
    || !Array.isArray(profile?.runtimeCustomProperties)
    || !validStories) {
    throw new Error(`Contract does not expose supported profile ${profileName}.`);
  }
  return profile;
}

function validateSurfaceShape(surface) {
  if (surface?.schemaVersion !== 2
    || surface?.kind !== 'lds-robotics-external-public-surface'
    || !surface?.package?.name
    || !Array.isArray(surface?.upstreamTokenDependencies)
    || !Array.isArray(surface?.localTokenDefinitions)
    || !Array.isArray(surface?.entries)) {
    throw new Error('Robotics external surface does not match the supported v2 shape.');
  }
  return surface;
}

function localDependency(specifier) {
  return typeof specifier === 'string' && /^(?:file:|link:|workspace:|\.\.?[\\/])/.test(specifier);
}

async function runCheck(options) {
  const root = path.resolve(options.root);
  const ldsRoot = path.resolve(options.ldsRoot);
  const contract = await readJson(path.resolve(options.contractPath));
  const profile = validateContractShape(contract, options.profile);
  const diagnostics = [];
  const configPath = path.join(root, profile.configFile);

  if (!await exists(configPath)) {
    diagnostics.push(diagnostic('CONFIG_INVALID', profile.configFile, 'Conformance configuration is missing.'));
  } else {
    const config = await readJson(configPath);
    if (config.profile !== options.profile || config.contractVersion !== contract.schemaVersion || config.repository !== profile.repository) {
      diagnostics.push(diagnostic('CONFIG_INVALID', profile.configFile, 'Profile, repository, or contract version does not match the LDS contract.'));
    }
  }

  const packagePath = path.join(root, 'package.json');
  const packageJson = await readJson(packagePath);
  if (packageJson.name !== profile.package.name || packageJson.version !== profile.package.version) {
    diagnostics.push(diagnostic('PACKAGE_IDENTITY', 'package.json', `Expected ${profile.package.name}@${profile.package.version}.`));
  }

  const dependencySections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  const localDependencyNames = new Set();
  for (const section of dependencySections) {
    for (const [name, specifier] of Object.entries(packageJson[section] || {})) {
      if (!localDependency(specifier)) continue;
      localDependencyNames.add(name);
      diagnostics.push(diagnostic('LOCAL_DEPENDENCY', 'package.json', `${name} uses prohibited local source specifier ${specifier}.`));
    }
  }
  for (const expected of profile.packageDependencies) {
    const actual = packageJson[expected.section]?.[expected.name];
    if (!localDependencyNames.has(expected.name) && actual !== expected.version) {
      diagnostics.push(diagnostic('DEPENDENCY_VERSION', 'package.json', `${expected.name} must be exactly ${expected.version} in ${expected.section}; received ${actual ?? 'missing'}.`));
    }
  }

  const lockPath = path.join(root, 'package-lock.json');
  if (await exists(lockPath)) {
    const lockSource = await readFile(lockPath, 'utf8');
    if (/"(?:file:|link:)[^"]*"/.test(lockSource)) {
      diagnostics.push(diagnostic('LOCAL_DEPENDENCY', 'package-lock.json', 'Lockfile contains a file: or link: dependency.'));
    }
  }

  const previewPath = path.join(root, profile.storybookPreview);
  if (!await exists(previewPath)) {
    diagnostics.push(diagnostic('STYLE_IMPORT_ORDER', profile.storybookPreview, 'Storybook preview is missing.'));
  } else {
    const previewSource = await readFile(previewPath, 'utf8');
    const imports = [...previewSource.matchAll(/import\s+['"]([^'"]+\.css)['"];?/g)].map((match) => match[1]);
    const relevant = imports.filter((entry) => profile.requiredStyleImports.includes(entry));
    const exact = JSON.stringify(relevant) === JSON.stringify(profile.requiredStyleImports)
      && profile.requiredStyleImports.every((entry) => imports.filter((candidate) => candidate === entry).length === 1);
    if (!exact) diagnostics.push(diagnostic('STYLE_IMPORT_ORDER', profile.storybookPreview, `Expected one import each in this order: ${profile.requiredStyleImports.join(' -> ')}.`));
  }

  const ldsFiles = await collectFiles(ldsRoot, contract.lds.tokenSources);
  const ldsDefinitions = new Map();
  for (const absolute of ldsFiles) {
    const relativeFile = slash(path.relative(ldsRoot, absolute));
    const source = await readFile(absolute, 'utf8');
    for (const definition of definitionsIn(source, relativeFile)) {
      if (!ldsDefinitions.has(definition.name)) ldsDefinitions.set(definition.name, definition);
    }
  }

  const scanFiles = await collectFiles(root, profile.scanRoots);
  const sources = new Map();
  const definitions = [];
  const references = [];
  for (const absolute of scanFiles) {
    const relativeFile = slash(path.relative(root, absolute));
    const source = await readFile(absolute, 'utf8');
    sources.set(relativeFile, source);
    definitions.push(...definitionsIn(source, relativeFile));
    references.push(...referencesIn(source, relativeFile));
  }

  const localNames = new Set(profile.localTokenDefinitions.names);
  const runtimeByName = new Map(profile.runtimeCustomProperties.map((entry) => [entry.name, entry]));
  const definitionMap = new Map();
  for (const definition of definitions) {
    if (!definitionMap.has(definition.name)) definitionMap.set(definition.name, []);
    definitionMap.get(definition.name).push(definition);
    if (localNames.has(definition.name)) {
      if (definition.file !== profile.localTokenDefinitions.file) {
        diagnostics.push(diagnostic('LOCAL_TOKEN_LOCATION', definition.file, `${definition.name} must be defined only in ${profile.localTokenDefinitions.file}.`, definition.line));
      }
      continue;
    }
    const runtime = runtimeByName.get(definition.name);
    if (runtime) {
      if (definition.file !== runtime.definitionFile) {
        diagnostics.push(diagnostic('RUNTIME_PROPERTY_LOCATION', definition.file, `${definition.name} must be defined only in ${runtime.definitionFile}.`, definition.line));
      }
      continue;
    }
    if (contract.lds.ownedTokenPrefixes.some((prefix) => definition.name.startsWith(prefix))) {
      diagnostics.push(diagnostic('TOKEN_NAMESPACE_REDEFINITION', definition.file, `${definition.name} is owned by LDS and cannot be defined in Robotics.`, definition.line));
    } else {
      diagnostics.push(diagnostic('LOCAL_TOKEN_UNREGISTERED', definition.file, `${definition.name} is not registered as a Robotics token or scoped runtime property.`, definition.line));
    }
  }

  for (const name of localNames) {
    const entries = definitionMap.get(name) || [];
    if (entries.length === 0) diagnostics.push(diagnostic('LOCAL_TOKEN_MISSING', profile.localTokenDefinitions.file, `${name} is declared by the contract but is not defined.`));
    if (entries.length > 1) diagnostics.push(diagnostic('LOCAL_TOKEN_LOCATION', profile.localTokenDefinitions.file, `${name} is defined more than once.`));
    for (const entry of entries) {
      const valueReferences = referencesIn(entry.value, entry.file);
      if (valueReferences.length === 0) {
        diagnostics.push(diagnostic('LOCAL_TOKEN_PROVENANCE', entry.file, `${name} must resolve through an LDS semantic token.`, entry.line));
      }
      for (const reference of valueReferences) {
        if (!profile.localTokenDefinitions.allowedReferencePrefixes.some((prefix) => reference.name.startsWith(prefix)) || !ldsDefinitions.has(reference.name)) {
          diagnostics.push(diagnostic('LOCAL_TOKEN_PROVENANCE', entry.file, `${name} references unapproved or undefined upstream token ${reference.name}.`, entry.line));
        }
      }
    }
  }

  for (const [name, runtime] of runtimeByName) {
    const entries = definitionMap.get(name) || [];
    if (entries.length !== 1 || entries[0].file !== runtime.definitionFile) {
      diagnostics.push(diagnostic('RUNTIME_PROPERTY_LOCATION', runtime.definitionFile, `${name} must have exactly one scoped definition.`));
    }
  }

  const mirrorPath = path.join(ldsRoot, profile.localTokenDefinitions.compatibilityMirror);
  if (!await exists(mirrorPath)) {
    diagnostics.push(diagnostic('TOKEN_MIRROR_DRIFT', profile.localTokenDefinitions.compatibilityMirror, 'LDS compatibility token mirror is missing.'));
  } else {
    const mirrorDefinitions = new Map(definitionsIn(await readFile(mirrorPath, 'utf8'), slash(path.relative(ldsRoot, mirrorPath))).map((entry) => [entry.name, entry]));
    for (const name of localNames) {
      const local = definitionMap.get(name)?.[0];
      const mirror = mirrorDefinitions.get(name);
      if (!local || !mirror || local.value !== mirror.value) {
        diagnostics.push(diagnostic('TOKEN_MIRROR_DRIFT', profile.localTokenDefinitions.file, `${name} differs from LDS compatibility mirror ${profile.localTokenDefinitions.compatibilityMirror}.`, local?.line));
      }
    }
  }

  const knownProperties = new Set([...ldsDefinitions.keys(), ...localNames, ...runtimeByName.keys()]);
  for (const reference of references) {
    if (!knownProperties.has(reference.name)) {
      diagnostics.push(diagnostic('UNDEFINED_CUSTOM_PROPERTY', reference.file, `${reference.name} is neither provided by LDS nor declared locally.`, reference.line));
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const allowedRanges = new Map();
  for (const zone of profile.rawColorPolicy.allowedZones) {
    if (zone.reviewDate < today) diagnostics.push(diagnostic('RAW_COLOR_EXCEPTION_EXPIRED', zone.file, `Raw color allowance for ${zone.signature} expired on ${zone.reviewDate}.`));
    const source = stripComments(sources.get(zone.file) || '');
    const ranges = [];
    let cursor = 0;
    while (cursor <= source.length) {
      const start = source.indexOf(zone.signature, cursor);
      if (start === -1) break;
      ranges.push({ start, end: start + zone.signature.length });
      cursor = start + zone.signature.length;
    }
    if (ranges.length !== zone.expectedOccurrences) {
      diagnostics.push(diagnostic('RAW_COLOR_EXCEPTION_STALE', zone.file, `Expected ${zone.expectedOccurrences} occurrence(s) of approved expression ${zone.signature}; found ${ranges.length}.`));
    }
    if (!allowedRanges.has(zone.file)) allowedRanges.set(zone.file, []);
    allowedRanges.get(zone.file).push(...ranges);
  }
  const rawPatterns = [];
  if (profile.rawColorPolicy.forbiddenFormats.includes('hex')) rawPatterns.push({ label: 'hex', pattern: /#[0-9a-fA-F]{3,8}\b/g });
  if (profile.rawColorPolicy.forbiddenFormats.includes('rgb')) rawPatterns.push({ label: 'rgb', pattern: /\brgba?\s*\(/gi });
  if (profile.rawColorPolicy.forbiddenFormats.includes('hsl')) rawPatterns.push({ label: 'hsl', pattern: /\bhsla?\s*\(/gi });
  if (profile.rawColorPolicy.forbiddenFormats.includes('named-white-black')) rawPatterns.push({ label: 'named', pattern: /(?<![-\w])(white|black)(?![-\w])/gi });
  for (const [relativeFile, rawSource] of sources) {
    const source = stripComments(rawSource);
    for (const { label, pattern } of rawPatterns) {
      for (const match of source.matchAll(pattern)) {
        if ((allowedRanges.get(relativeFile) || []).some((range) => match.index >= range.start && match.index < range.end)) continue;
        diagnostics.push(diagnostic('RAW_COLOR', relativeFile, `${label} color literal ${match[0]} must resolve through an LDS token.`, lineAt(source, match.index)));
      }
    }
  }

  const surfacePath = path.join(ldsRoot, profile.externalSurface);
  const surface = validateSurfaceShape(await readJson(surfacePath));
  if (surface.package.name !== profile.package.name || surface.package.version !== profile.package.version || surface.package.repository !== profile.repository) {
    diagnostics.push(diagnostic('PUBLIC_SURFACE_MISMATCH', slash(path.relative(ldsRoot, surfacePath)), 'External-surface package identity does not match the profile.'));
  }
  if (JSON.stringify([...surface.localTokenDefinitions].sort()) !== JSON.stringify([...localNames].sort())) {
    diagnostics.push(diagnostic('PUBLIC_SURFACE_MISMATCH', slash(path.relative(ldsRoot, surfacePath)), 'External-surface local token list does not match the style contract.'));
  }
  for (const name of surface.upstreamTokenDependencies) {
    if (!ldsDefinitions.has(name)) diagnostics.push(diagnostic('UNDEFINED_CUSTOM_PROPERTY', slash(path.relative(ldsRoot, surfacePath)), `External-surface upstream token ${name} is not defined by LDS.`));
  }
  const declaredUpstream = new Set(surface.upstreamTokenDependencies);
  const usedUpstream = new Set(references
    .map((reference) => reference.name)
    .filter((name) => ldsDefinitions.has(name) && !localNames.has(name) && !runtimeByName.has(name)));
  const missingUpstream = [...usedUpstream].filter((name) => !declaredUpstream.has(name)).sort();
  const staleUpstream = [...declaredUpstream].filter((name) => !usedUpstream.has(name)).sort();
  if (missingUpstream.length || staleUpstream.length) {
    diagnostics.push(diagnostic(
      'UPSTREAM_TOKEN_MANIFEST_DRIFT',
      slash(path.relative(ldsRoot, surfacePath)),
      `Upstream token manifest differs from Robotics usage. Missing: ${missingUpstream.join(', ') || 'none'}. Unused: ${staleUpstream.join(', ') || 'none'}.`,
    ));
  }
  const expectedExports = surface.entries.flatMap((entry) => entry.exports.map((name) => `${entry.source}::${name}`)).sort();
  const indexPath = path.join(root, 'src', 'index.js');
  const actualExports = parsePublicExports(await readFile(indexPath, 'utf8'));
  if (JSON.stringify(expectedExports) !== JSON.stringify(actualExports)) {
    diagnostics.push(diagnostic('PUBLIC_SURFACE_MISMATCH', 'src/index.js', 'Public exports differ from ROBOTICS_EXTERNAL_SURFACE.json.'));
  }

  for (const story of profile.representativeStories) {
    const source = sources.get(story.source) ?? (await exists(path.join(root, story.source)) ? await readFile(path.join(root, story.source), 'utf8') : '');
    const exportPattern = new RegExp(`export\\s+const\\s+${story.export}\\b`);
    if (!exportPattern.test(source)) diagnostics.push(diagnostic('REPRESENTATIVE_STORY_MISSING', story.source, `Representative story export ${story.export} is missing.`));
  }

  const focusSource = sources.get(profile.focusOverride.file) ?? '';
  if (focusSource.includes(profile.focusOverride.declaration)
    && !profile.representativeStories.some((story) => story.id === profile.focusOverride.provingStoryId)) {
    diagnostics.push(diagnostic('FOCUS_EVIDENCE_MISSING', profile.focusOverride.file, `Focus suppression requires proving story ${profile.focusOverride.provingStoryId}.`));
  }

  if (options.storybookIndex) {
    const storybookIndexPath = path.resolve(root, options.storybookIndex);
    if (!await exists(storybookIndexPath)) {
      diagnostics.push(diagnostic('REPRESENTATIVE_STORY_MISSING', slash(path.relative(root, storybookIndexPath)), 'Built Storybook index is missing.'));
    } else {
      const storybookIndex = await readJson(storybookIndexPath);
      const storyIds = new Set(Object.keys(storybookIndex.entries || storybookIndex.stories || {}));
      for (const story of profile.representativeStories) {
        if (!storyIds.has(story.id)) diagnostics.push(diagnostic('REPRESENTATIVE_STORY_MISSING', options.storybookIndex, `Built Storybook is missing ${story.id}.`));
      }
      if (focusSource.includes(profile.focusOverride.declaration) && !storyIds.has(profile.focusOverride.provingStoryId)) {
        diagnostics.push(diagnostic('FOCUS_EVIDENCE_MISSING', options.storybookIndex, `Built Storybook is missing focus proof ${profile.focusOverride.provingStoryId}.`));
      }
    }
  } else if (options.requireBuiltStories) {
    diagnostics.push(diagnostic('REPRESENTATIVE_STORY_MISSING', 'storybook-static/index.json', 'Built Storybook evidence was required but no index path was provided.'));
  }

  return diagnostics.sort((left, right) => left.code.localeCompare(right.code) || left.file.localeCompare(right.file) || (left.line || 0) - (right.line || 0));
}

function printDiagnostics(diagnostics) {
  for (const item of diagnostics) {
    const location = item.line ? `${item.file}:${item.line}` : item.file;
    console.error(`[${item.code}] ${location} ${item.message}`);
  }
}

async function applyFixtureMutation(root, mutation) {
  const target = path.join(root, mutation.file);
  if (mutation.delete) {
    await rm(target, { force: true });
    return;
  }
  const source = await readFile(target, 'utf8');
  if (mutation.append != null) await writeFile(target, `${source}${mutation.append}`, 'utf8');
  else if (mutation.replace != null) {
    if (!source.includes(mutation.replace)) throw new Error(`Fixture mutation did not find ${mutation.replace} in ${mutation.file}.`);
    await writeFile(target, source.replace(mutation.replace, mutation.with ?? ''), 'utf8');
  }
}

async function verifyFixtures() {
  const fixturesRoot = path.join(packageDirectory, 'fixtures');
  const cases = await readJson(path.join(fixturesRoot, 'cases.json'));
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'lds-conformance-'));
  try {
    for (const fixture of cases) {
      const caseRoot = path.join(temporaryRoot, fixture.name);
      await cp(path.join(fixturesRoot, 'robotics'), caseRoot, { recursive: true });
      for (const mutation of fixture.mutations || []) await applyFixtureMutation(caseRoot, mutation);
      const diagnostics = await runCheck({
        profile: 'robotics-ui',
        root: caseRoot,
        ldsRoot: path.join(fixturesRoot, 'lds'),
        contractPath: path.join(fixturesRoot, 'contract.json'),
        storybookIndex: 'storybook-static/index.json',
        requireBuiltStories: true,
      });
      const actual = [...new Set(diagnostics.map((entry) => entry.code))].sort();
      const expected = [...fixture.expectedCodes].sort();
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        printDiagnostics(diagnostics);
        throw new Error(`Fixture ${fixture.name} expected ${expected.join(', ') || 'pass'} but received ${actual.join(', ') || 'pass'}.`);
      }
      console.log(`Fixture ${fixture.name}: ${expected.join(', ') || 'pass'}`);
    }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args.positional[0];
  if (command === 'verify-fixtures') {
    await verifyFixtures();
    return;
  }
  if (command === 'verify-contract') {
    const contractPath = path.resolve(args.contract || defaultContractPath);
    const contract = await readJson(contractPath);
    validateContractShape(contract, args.profile || 'robotics-ui');
    console.log(`Contract ${slash(contractPath)} exposes Robotics profile schema v${contract.schemaVersion}.`);
    return;
  }
  if (command !== 'check') {
    throw new Error('Usage: lds-conformance check --profile robotics-ui --root <repo> [--lds-root <repo>] [--storybook-index <path>] [--require-built-stories]');
  }
  const profile = args.profile || 'robotics-ui';
  const root = path.resolve(args.root || process.cwd());
  const diagnostics = await runCheck({
    profile,
    root,
    ldsRoot: path.resolve(args['lds-root'] || workspaceRoot),
    contractPath: path.resolve(args.contract || defaultContractPath),
    storybookIndex: args['storybook-index'] || null,
    requireBuiltStories: Boolean(args['require-built-stories']),
  });
  if (diagnostics.length) {
    printDiagnostics(diagnostics);
    process.exitCode = 1;
    return;
  }
  console.log(`LDS conformance passed for ${slash(root)} (${profile}, contract v1).`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
