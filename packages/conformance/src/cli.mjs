#!/usr/bin/env node

import { cp, mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditStorybookMastheadCopy } from './storybook-masthead-copy.mjs';

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
  const commonValid = contract?.schemaVersion === 1
    && contract?.kind === 'lds-cross-repository-style-contract'
    && Array.isArray(contract?.lds?.packages)
    && contract.lds.packages.length > 0
    && typeof contract?.lds?.storybookMastheadCopy === 'string'
    && typeof profile?.repository === 'string'
    && typeof profile?.externalSurface === 'string'
    && typeof profile?.configFile === 'string'
    && Array.isArray(profile?.policyContracts)
    && Array.isArray(profile?.packageDependencies)
    && profile.packageDependencies.length > 0
    && Array.isArray(profile?.scanRoots)
    && profile.scanRoots.length > 0
    && Array.isArray(profile?.requiredStyleImports)
    && profile.requiredStyleImports.length > 0
    && typeof profile?.storybookPreview === 'string'
    && Array.isArray(profile?.localTokenDefinitions?.names)
    && Array.isArray(profile?.runtimeCustomProperties)
    && Array.isArray(profile?.inheritedRuntimeCustomProperties)
    && Array.isArray(profile?.rawColorPolicy?.forbiddenFormats)
    && Array.isArray(profile?.rawColorPolicy?.allowedZones)
    && validStories;
  const roboticsValid = profileName === 'robotics-ui'
    && profile?.package?.name
    && profile?.package?.version
    && profile?.focusOverride?.file
    && profile?.focusOverride?.provingStoryId;
  const lds3dValid = profileName === 'lds3d-ui'
    && profile?.workspacePackage?.manifest
    && profile?.workspacePackage?.name
    && profile?.workspacePackage?.version
    && profile?.compositionManifest
    && profile?.lockfile
    && Array.isArray(profile?.headlessPackages)
    && profile.headlessPackages.length > 0
    && Array.isArray(profile?.rawColorScanRoots)
    && profile.rawColorScanRoots.length > 0;
  if (!commonValid || (!roboticsValid && !lds3dValid)) {
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
    || !Array.isArray(surface?.inheritedRuntimeCustomProperties)
    || !Array.isArray(surface?.entries)) {
    throw new Error('Robotics external surface does not match the supported v2 shape.');
  }
  return surface;
}

function validatePolicyContractShape(policy, profileName) {
  const validEvidence = Array.isArray(policy?.evidence)
    && policy.evidence.length > 0
    && policy.evidence.every((entry) =>
      ['lds', 'consumer'].includes(entry?.root)
      && typeof entry?.file === 'string'
      && Array.isArray(entry?.contains)
      && entry.contains.length > 0
      && entry.contains.every((value) => typeof value === 'string' && value.length > 0)
      && (entry.excludes == null
        || (Array.isArray(entry.excludes)
          && entry.excludes.every((value) => typeof value === 'string' && value.length > 0))));
  const validDecision = policy?.decision?.maxVisibleBadges === 1
    && policy?.decision?.visualStyle === 'solid'
    && policy?.decision?.placement === 'attached-top-right'
    && policy?.decision?.accessibleStateRetention === 'all-raw-states'
    && policy?.decision?.renderers
    && Object.keys(policy.decision.renderers).length > 0;
  if (policy?.schemaVersion !== 1
    || policy?.kind !== 'lds-consumer-policy-contract'
    || policy?.profile !== profileName
    || typeof policy?.authority !== 'string'
    || !validDecision
    || !validEvidence) {
    throw new Error(`Policy contract does not match the supported v1 shape for ${profileName}.`);
  }
  return policy;
}

function validateLds3dSurfaceShape(surface) {
  if (surface?.schemaVersion !== 1
    || surface?.kind !== 'lds3d-external-public-surface'
    || !surface?.package?.name
    || !Array.isArray(surface?.upstreamTokenDependencies)
    || !Array.isArray(surface?.runtimeCustomProperties)
    || !Array.isArray(surface?.packages)) {
    throw new Error('LDS3D external surface does not match the supported v1 shape.');
  }
  return surface;
}

function contractDependencyDiagnostics(contract, profile, contractFile) {
  const canonicalVersions = new Map(
    contract.lds.packages.map((entry) => [entry.name, entry.version]),
  );
  const roboticsPackage = contract.profiles?.['robotics-ui']?.package;
  if (roboticsPackage?.name && roboticsPackage?.version) {
    canonicalVersions.set(roboticsPackage.name, roboticsPackage.version);
  }
  const diagnostics = [];
  for (const dependency of profile.packageDependencies) {
    const expectedVersion = canonicalVersions.get(dependency.name);
    if (!expectedVersion) {
      diagnostics.push(diagnostic('CONTRACT_DEPENDENCY_DRIFT', contractFile, `${dependency.name} has no canonical LDS package identity.`));
    } else if (dependency.version !== expectedVersion) {
      diagnostics.push(diagnostic('CONTRACT_DEPENDENCY_DRIFT', contractFile, `${dependency.name} must pin canonical version ${expectedVersion}; received ${dependency.version}.`));
    }
  }
  return diagnostics;
}

function localDependency(specifier) {
  return typeof specifier === 'string' && /^(?:file:|link:|workspace:|\.\.?[\\/])/.test(specifier);
}

async function runRoboticsCheck(options) {
  const root = path.resolve(options.root);
  const ldsRoot = path.resolve(options.ldsRoot);
  const contract = await readJson(path.resolve(options.contractPath));
  const profile = validateContractShape(contract, options.profile);
  const diagnostics = [];
  diagnostics.push(...contractDependencyDiagnostics(contract, profile, path.basename(options.contractPath)));
  const configPath = path.join(root, profile.configFile);

  if (!await exists(configPath)) {
    diagnostics.push(diagnostic('CONFIG_INVALID', profile.configFile, 'Conformance configuration is missing.'));
  } else {
    const config = await readJson(configPath);
    if (config.profile !== options.profile || config.contractVersion !== contract.schemaVersion || config.repository !== profile.repository) {
      diagnostics.push(diagnostic('CONFIG_INVALID', profile.configFile, 'Profile, repository, or contract version does not match the LDS contract.'));
    }
  }

  for (const policyContractFile of profile.policyContracts) {
    const policyPath = path.join(ldsRoot, policyContractFile);
    if (!await exists(policyPath)) {
      diagnostics.push(diagnostic('POLICY_CONTRACT_DRIFT', policyContractFile, 'LDS policy contract is missing.'));
      continue;
    }
    let policy;
    try {
      policy = validatePolicyContractShape(await readJson(policyPath), options.profile);
    } catch (error) {
      diagnostics.push(diagnostic('POLICY_CONTRACT_DRIFT', policyContractFile, error.message));
      continue;
    }
    for (const evidence of policy.evidence) {
      const evidenceRoot = evidence.root === 'lds' ? ldsRoot : root;
      const evidencePath = path.join(evidenceRoot, evidence.file);
      if (!await exists(evidencePath)) {
        diagnostics.push(diagnostic('POLICY_CONTRACT_DRIFT', evidence.file, `${policy.id} evidence file is missing.`));
        continue;
      }
      const evidenceSource = await readFile(evidencePath, 'utf8');
      for (const requiredText of evidence.contains) {
        if (!evidenceSource.includes(requiredText)) {
          diagnostics.push(diagnostic(
            'POLICY_CONTRACT_DRIFT',
            evidence.file,
            `${policy.id} is missing required evidence: ${requiredText}`,
          ));
        }
      }
      for (const forbiddenText of evidence.excludes || []) {
        const index = evidenceSource.indexOf(forbiddenText);
        if (index !== -1) {
          diagnostics.push(diagnostic(
            'POLICY_CONTRACT_DRIFT',
            evidence.file,
            `${policy.id} contains superseded policy text: ${forbiddenText}`,
            lineAt(evidenceSource, index),
          ));
        }
      }
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

  const mastheadCopy = await auditStorybookMastheadCopy({
    root,
    contractPath: path.join(ldsRoot, contract.lds.storybookMastheadCopy),
  });
  diagnostics.push(...mastheadCopy.findings.map((finding) =>
    diagnostic(finding.code, finding.file, finding.message, finding.line)
  ));

  const localNames = new Set(profile.localTokenDefinitions.names);
  const runtimeByName = new Map(profile.runtimeCustomProperties.map((entry) => [entry.name, entry]));
  const inheritedRuntimeByName = new Map(profile.inheritedRuntimeCustomProperties.map((entry) => [entry.name, entry]));
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
    if (inheritedRuntimeByName.has(definition.name)) {
      diagnostics.push(diagnostic(
        'INHERITED_RUNTIME_REDEFINITION',
        definition.file,
        `${definition.name} is provided by ${inheritedRuntimeByName.get(definition.name).package} and cannot be redefined in Robotics.`,
        definition.line,
      ));
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

  const declaredDependencyNames = new Set(profile.packageDependencies.map((entry) => entry.name));
  for (const [name, inherited] of inheritedRuntimeByName) {
    if (!declaredDependencyNames.has(inherited.package)) {
      diagnostics.push(diagnostic(
        'INHERITED_RUNTIME_SOURCE',
        inherited.definitionFile,
        `${name} names ${inherited.package}, but that package is not a declared Robotics dependency.`,
      ));
      continue;
    }
    const inheritedDefinitionPath = path.join(ldsRoot, inherited.definitionFile);
    if (!await exists(inheritedDefinitionPath)) {
      diagnostics.push(diagnostic(
        'INHERITED_RUNTIME_SOURCE',
        inherited.definitionFile,
        `${name} provider source is missing.`,
      ));
      continue;
    }
    const inheritedDefinitions = definitionsIn(
      await readFile(inheritedDefinitionPath, 'utf8'),
      slash(path.relative(ldsRoot, inheritedDefinitionPath)),
    ).filter((entry) => entry.name === name);
    if (inheritedDefinitions.length !== 1) {
      diagnostics.push(diagnostic(
        'INHERITED_RUNTIME_SOURCE',
        inherited.definitionFile,
        `${name} must have exactly one definition in its declared provider source.`,
      ));
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

  const knownProperties = new Set([
    ...ldsDefinitions.keys(),
    ...localNames,
    ...runtimeByName.keys(),
    ...inheritedRuntimeByName.keys(),
  ]);
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
  if (JSON.stringify([...surface.inheritedRuntimeCustomProperties].sort()) !== JSON.stringify([...inheritedRuntimeByName.keys()].sort())) {
    diagnostics.push(diagnostic('PUBLIC_SURFACE_MISMATCH', slash(path.relative(ldsRoot, surfacePath)), 'External-surface inherited runtime property list does not match the style contract.'));
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

function yamlKey(line) {
  const match = /^(\s*)(['"]?)(.+?)\2:\s*$/.exec(line);
  return match ? { indent: match[1].length, key: match[3] } : null;
}

function yamlBlock(lines, key, indent) {
  const start = lines.findIndex((line) => {
    const parsed = yamlKey(line);
    return parsed?.indent === indent && parsed.key === key;
  });
  if (start === -1) return [];
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    const parsed = yamlKey(lines[index]);
    if (parsed && parsed.indent <= indent) {
      end = index;
      break;
    }
  }
  return lines.slice(start + 1, end);
}

function yamlScalar(lines, key) {
  const pattern = new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`);
  for (const line of lines) {
    const match = pattern.exec(line);
    if (match) return match[1].replace(/^['"]|['"]$/g, '');
  }
  return null;
}

function isLdsPackage(name) {
  // LDS DOM UI packages only; the renamed @lk-robotics/lds-3d-* renderer
  // family shares the prefix but is not an LDS dependency.
  return name === '@lk-robotics/design-system-core'
    || (name.startsWith('@lk-robotics/lds-') && !name.startsWith('@lk-robotics/lds-3d'));
}

function sourceLdsImports(source) {
  const results = [];
  for (const match of stripComments(source).matchAll(/(?:from\s*|import\s*(?:\(\s*)?|require\s*\(\s*)['"](@lk-robotics\/(?:lds-[^'"]+|design-system-core)(?:\/[^'"]*)?)['"]/g)) {
    results.push({ name: match[1], index: match.index });
  }
  return results;
}

async function runLds3dCheck(options) {
  const root = path.resolve(options.root);
  const ldsRoot = path.resolve(options.ldsRoot);
  const contract = await readJson(path.resolve(options.contractPath));
  const profile = validateContractShape(contract, options.profile);
  const diagnostics = [];
  diagnostics.push(...contractDependencyDiagnostics(contract, profile, path.basename(options.contractPath)));

  const configPath = path.join(root, profile.configFile);
  if (!await exists(configPath)) {
    diagnostics.push(diagnostic('CONFIG_INVALID', profile.configFile, 'Conformance configuration is missing.'));
  } else {
    const config = await readJson(configPath);
    if (config.profile !== options.profile || config.contractVersion !== contract.schemaVersion || config.repository !== profile.repository) {
      diagnostics.push(diagnostic('CONFIG_INVALID', profile.configFile, 'Profile, repository, or contract version does not match the LDS contract.'));
    }
  }

  const workspaceManifestPath = path.join(root, profile.workspacePackage.manifest);
  const workspaceManifest = await readJson(workspaceManifestPath);
  if (workspaceManifest.name !== profile.workspacePackage.name || workspaceManifest.version !== profile.workspacePackage.version) {
    diagnostics.push(diagnostic('PACKAGE_IDENTITY', profile.workspacePackage.manifest, `Expected ${profile.workspacePackage.name}@${profile.workspacePackage.version}.`));
  }

  const compositionPath = path.join(root, profile.compositionManifest);
  const composition = await readJson(compositionPath);
  const dependencySections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  for (const expected of profile.packageDependencies) {
    const manifestPath = expected.manifest || profile.compositionManifest;
    const manifest = manifestPath === profile.compositionManifest ? composition : await readJson(path.join(root, manifestPath));
    const actual = manifest[expected.section]?.[expected.name];
    if (localDependency(actual)) {
      diagnostics.push(diagnostic('LOCAL_DEPENDENCY', manifestPath, `${expected.name} uses prohibited local source specifier ${actual}.`));
    } else if (actual !== expected.version) {
      diagnostics.push(diagnostic('DEPENDENCY_VERSION', manifestPath, `${expected.name} must be exactly ${expected.version} in ${expected.section}; received ${actual ?? 'missing'}.`));
    }
  }
  for (const section of dependencySections) {
    for (const [name, specifier] of Object.entries(composition[section] || {})) {
      if (name === '@lk-robotics/design-system-core') {
        diagnostics.push(diagnostic('DEPENDENCY_VERSION', profile.compositionManifest, `${name} is the retired aggregate package; consume the split LDS packages.`));
      } else if (isLdsPackage(name) && localDependency(specifier)) {
        diagnostics.push(diagnostic('LOCAL_DEPENDENCY', profile.compositionManifest, `${name} uses prohibited local source specifier ${specifier}.`));
      }
    }
  }

  const lockPath = path.join(root, profile.lockfile);
  if (!await exists(lockPath)) {
    diagnostics.push(diagnostic('LOCKFILE_DEPENDENCY', profile.lockfile, 'pnpm lockfile is missing.'));
  } else {
    const lockLines = (await readFile(lockPath, 'utf8')).split(/\r?\n/);
    const importerLines = yamlBlock(lockLines, profile.compositionManifest.replace(/\/package\.json$/, ''), 2);
    for (const expected of profile.packageDependencies) {
      const dependencyLines = yamlBlock(importerLines, expected.name, 6);
      const specifier = yamlScalar(dependencyLines, 'specifier');
      if (specifier !== expected.version) {
        diagnostics.push(diagnostic('LOCKFILE_DEPENDENCY', profile.lockfile, `${expected.name} lockfile specifier must be ${expected.version}; received ${specifier ?? 'missing'}.`));
      }
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
    if (localNames.has(definition.name)) continue;
    const runtime = runtimeByName.get(definition.name);
    if (runtime) {
      if (definition.file !== runtime.definitionFile) {
        diagnostics.push(diagnostic('RUNTIME_PROPERTY_LOCATION', definition.file, `${definition.name} must be defined only in ${runtime.definitionFile}.`, definition.line));
      }
      continue;
    }
    if (contract.lds.ownedTokenPrefixes.some((prefix) => definition.name.startsWith(prefix))) {
      diagnostics.push(diagnostic('TOKEN_NAMESPACE_REDEFINITION', definition.file, `${definition.name} is owned by LDS and cannot be defined in LDS3D.`, definition.line));
    } else {
      diagnostics.push(diagnostic('LOCAL_TOKEN_UNREGISTERED', definition.file, `${definition.name} is not an approved LDS3D scoped runtime property.`, definition.line));
    }
  }
  for (const [name, runtime] of runtimeByName) {
    const entries = definitionMap.get(name) || [];
    if (entries.length !== 1 || entries[0].file !== runtime.definitionFile) {
      diagnostics.push(diagnostic('RUNTIME_PROPERTY_LOCATION', runtime.definitionFile, `${name} must have exactly one scoped definition.`));
    }
  }

  const knownProperties = new Set([...ldsDefinitions.keys(), ...localNames, ...runtimeByName.keys()]);
  for (const reference of references) {
    if (!knownProperties.has(reference.name)) {
      diagnostics.push(diagnostic('UNDEFINED_CUSTOM_PROPERTY', reference.file, `${reference.name} is neither provided by LDS nor declared as an LDS3D runtime property.`, reference.line));
    }
  }

  const rawFiles = await collectFiles(root, profile.rawColorScanRoots);
  const rawSources = new Map();
  for (const absolute of rawFiles) {
    rawSources.set(slash(path.relative(root, absolute)), await readFile(absolute, 'utf8'));
  }
  const today = new Date().toISOString().slice(0, 10);
  const allowedRanges = new Map();
  for (const zone of profile.rawColorPolicy.allowedZones) {
    if (zone.reviewDate < today) diagnostics.push(diagnostic('RAW_COLOR_EXCEPTION_EXPIRED', zone.file, `Raw color allowance for ${zone.signature} expired on ${zone.reviewDate}.`));
    const source = stripComments(rawSources.get(zone.file) || '');
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
  for (const [relativeFile, rawSource] of rawSources) {
    const source = stripComments(rawSource);
    for (const { label, pattern } of rawPatterns) {
      for (const match of source.matchAll(pattern)) {
        if ((allowedRanges.get(relativeFile) || []).some((range) => match.index >= range.start && match.index < range.end)) continue;
        diagnostics.push(diagnostic('RAW_COLOR', relativeFile, `${label} color literal ${match[0]} must resolve through an LDS token in DOM composition.`, lineAt(source, match.index)));
      }
    }
  }

  for (const headless of profile.headlessPackages) {
    const manifest = await readJson(path.join(root, headless.manifest));
    for (const section of dependencySections) {
      for (const name of Object.keys(manifest[section] || {})) {
        if (isLdsPackage(name)) diagnostics.push(diagnostic('HEADLESS_LDS_DEPENDENCY', headless.manifest, `${manifest.name} must remain independent of ${name}.`));
      }
    }
    const headlessFiles = await collectFiles(root, headless.sourceRoots);
    for (const absolute of headlessFiles) {
      const relativeFile = slash(path.relative(root, absolute));
      const source = await readFile(absolute, 'utf8');
      for (const imported of sourceLdsImports(source)) {
        if (!isLdsPackage(imported.name.split('/').slice(0, 2).join('/'))) continue;
        diagnostics.push(diagnostic('HEADLESS_LDS_DEPENDENCY', relativeFile, `Headless source imports ${imported.name}.`, lineAt(source, imported.index)));
      }
    }
  }

  const surfacePath = path.join(ldsRoot, profile.externalSurface);
  const surface = validateLds3dSurfaceShape(await readJson(surfacePath));
  if (surface.package.name !== profile.workspacePackage.name
    || surface.package.version !== profile.workspacePackage.version
    || surface.package.repository !== profile.repository) {
    diagnostics.push(diagnostic('PUBLIC_SURFACE_MISMATCH', slash(path.relative(ldsRoot, surfacePath)), 'LDS3D surface workspace identity does not match the profile.'));
  }
  const declaredRuntime = surface.runtimeCustomProperties.map((entry) => typeof entry === 'string' ? entry : entry.name).sort();
  if (JSON.stringify(declaredRuntime) !== JSON.stringify([...runtimeByName.keys()].sort())) {
    diagnostics.push(diagnostic('PUBLIC_SURFACE_MISMATCH', slash(path.relative(ldsRoot, surfacePath)), 'LDS3D runtime custom property list does not match the profile.'));
  }
  for (const name of surface.upstreamTokenDependencies) {
    if (!ldsDefinitions.has(name)) diagnostics.push(diagnostic('UNDEFINED_CUSTOM_PROPERTY', slash(path.relative(ldsRoot, surfacePath)), `External-surface upstream token ${name} is not defined by LDS.`));
  }
  const declaredUpstream = new Set(surface.upstreamTokenDependencies);
  const usedUpstream = new Set(references.map((reference) => reference.name).filter((name) => ldsDefinitions.has(name)));
  const missingUpstream = [...usedUpstream].filter((name) => !declaredUpstream.has(name)).sort();
  const staleUpstream = [...declaredUpstream].filter((name) => !usedUpstream.has(name)).sort();
  if (missingUpstream.length || staleUpstream.length) {
    diagnostics.push(diagnostic('UPSTREAM_TOKEN_MANIFEST_DRIFT', slash(path.relative(ldsRoot, surfacePath)), `Upstream token manifest differs from LDS3D docs usage. Missing: ${missingUpstream.join(', ') || 'none'}. Unused: ${staleUpstream.join(', ') || 'none'}.`));
  }
  for (const expected of surface.packages) {
    const manifest = await readJson(path.join(root, expected.manifest));
    const actualExports = Object.keys(manifest.exports || {}).sort();
    if (manifest.name !== expected.name || manifest.version !== expected.version || JSON.stringify(actualExports) !== JSON.stringify([...expected.exports].sort())) {
      diagnostics.push(diagnostic('PUBLIC_SURFACE_MISMATCH', expected.manifest, `${expected.name} package identity or export keys differ from LDS3D_EXTERNAL_SURFACE.json.`));
    }
  }

  for (const story of profile.representativeStories) {
    const storyPath = path.join(root, story.source);
    const source = sources.get(story.source) ?? (await exists(storyPath) ? await readFile(storyPath, 'utf8') : '');
    const exportPattern = new RegExp(`export\\s+const\\s+${story.export}\\b`);
    if (!exportPattern.test(source)) diagnostics.push(diagnostic('REPRESENTATIVE_STORY_MISSING', story.source, `Representative story export ${story.export} is missing.`));
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
    }
  } else if (options.requireBuiltStories) {
    diagnostics.push(diagnostic('REPRESENTATIVE_STORY_MISSING', 'storybook-static/index.json', 'Built Storybook evidence was required but no index path was provided.'));
  }

  return diagnostics.sort((left, right) => left.code.localeCompare(right.code) || left.file.localeCompare(right.file) || (left.line || 0) - (right.line || 0));
}

async function runCheck(options) {
  return options.profile === 'lds3d-ui' ? runLds3dCheck(options) : runRoboticsCheck(options);
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
  const suites = [
    { casesFile: 'cases.json', consumer: 'robotics', profile: 'robotics-ui' },
    { casesFile: 'lds3d-cases.json', consumer: 'lds3d', profile: 'lds3d-ui' },
  ];
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'lds-conformance-'));
  try {
    for (const suite of suites) {
      const cases = await readJson(path.join(fixturesRoot, suite.casesFile));
      for (const fixture of cases) {
        const profile = fixture.profile || suite.profile;
        const consumer = fixture.consumer || suite.consumer;
        const caseRoot = path.join(temporaryRoot, `${profile}-${fixture.name}`);
        await cp(path.join(fixturesRoot, consumer), caseRoot, { recursive: true });
        const caseContractPath = path.join(caseRoot, 'contract.json');
        await cp(path.join(fixturesRoot, 'contract.json'), caseContractPath);
        for (const mutation of fixture.contractMutations || []) await applyFixtureMutation(caseRoot, mutation);
        for (const mutation of fixture.mutations || []) await applyFixtureMutation(caseRoot, mutation);
        const diagnostics = await runCheck({
          profile,
          root: caseRoot,
          ldsRoot: path.join(fixturesRoot, 'lds'),
          contractPath: caseContractPath,
          storybookIndex: 'storybook-static/index.json',
          requireBuiltStories: true,
        });
        const actual = [...new Set(diagnostics.map((entry) => entry.code))].sort();
        const expected = [...fixture.expectedCodes].sort();
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          printDiagnostics(diagnostics);
          throw new Error(`Fixture ${profile}/${fixture.name} expected ${expected.join(', ') || 'pass'} but received ${actual.join(', ') || 'pass'}.`);
        }
        console.log(`Fixture ${profile}/${fixture.name}: ${expected.join(', ') || 'pass'}`);
      }
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
    const profiles = args.profile ? [args.profile] : Object.keys(contract.profiles || {});
    if (profiles.length === 0) throw new Error('Contract does not expose any supported profiles.');
    for (const profile of profiles) validateContractShape(contract, profile);
    console.log(`Contract ${slash(contractPath)} exposes ${profiles.join(', ')} (schema v${contract.schemaVersion}).`);
    return;
  }
  if (command !== 'check') {
    throw new Error([
      'Usage:',
      '  lds-conformance check --profile <robotics-ui|lds3d-ui> --root <repo> [--lds-root <repo>] [--storybook-index <path>] [--require-built-stories]',
      '  lds-conformance verify-contract [--profile <robotics-ui|lds3d-ui>] [--contract <path>]',
      '  lds-conformance verify-fixtures',
    ].join('\n'));
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
