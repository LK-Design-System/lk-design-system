import { access, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath } from 'node:url';
import {
  canonicalSnapshotFromDocumentationManifest,
  canonicalSnapshotMode,
} from './robotics-canonical-snapshot.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const artifactRoot = path.join(repositoryRoot, 'visual-artifacts');
const npmCommand = process.platform === 'win32' ? process.execPath : 'npm';
const npmPrefixArguments = process.platform === 'win32'
  ? [path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js')]
  : [];

const workspaces = [
  { id: 'core', name: '@lk-design-system/lds-core', layer: 'core', implementation: true, docsOrigin: 'https://lk-design-system.github.io/lk-design-system/' },
  { id: 'theme', name: '@lk-design-system/lds-theme', layer: 'theme', implementation: true, docsOrigin: 'https://lk-design-system.github.io/lk-design-system/' },
  { id: 'product', name: '@lk-design-system/lds-product', layer: 'product', implementation: true, docsOrigin: 'https://lk-design-system.github.io/lk-design-system/' },
  {
    id: 'robotics',
    name: '@lk-design-system/lds-robotics-ui',
    layer: 'robotics',
    implementation: true,
    external: true,
    docsOrigin: 'https://lk-design-system.github.io/lk-design-system-robotics/',
  },
];
const selectOnly = process.argv.includes('--select-only');
const documentationExports = {
  './package.json': './package.json',
  './design-system.json': './docs/manifest.json',
  './llms.txt': './docs/llms.txt',
  './adoption-checklist.json': './docs/adoption-checklist.json',
  './docs/*': './docs/*',
};
const requiredDocumentationFiles = [
  'README.md',
  'docs/manifest.json',
  'docs/llms.txt',
  'docs/adoption-checklist.json',
  'docs/adoption-report.schema.json',
  'docs/LDS_UI_ADOPTION_CONTRACT.schema.json',
];
const coreSupportedFacades = {
  'brand-authoring': {
    targets: { types: './dist/brand-authoring.d.ts', import: './dist/brand-authoring.js' },
    runtime: [
      'LK_LOGO_COLORS',
      'LK_LOGO_USAGE',
      'LK_LOGO_VIEWBOX',
      'LK_PATHS',
      'ROBOTICS_INLINE_TRANSFORM',
      'ROBOTICS_PATHS',
    ],
  },
  'component-authoring': {
    targets: { types: './dist/component-authoring.d.ts', import: './dist/component-authoring.js' },
    runtime: [
      'FieldLabel',
      'FieldMessage',
      'FieldStack',
      'FieldStatusIcon',
      'STATUS_TONE_STYLE',
      'componentVars',
      'embeddedBandStyle',
      'fieldBackground',
      'fieldBorderColor',
      'fieldTypography',
      'formatValueWithUnit',
      'getUnitSeparator',
      'isAttachedUnit',
      'mergeIds',
      'normalizeBoundedValue',
      'normalizeStatusTone',
      'normalizeUnit',
      'normalizeValueText',
      'partClassName',
      'partStyle',
      'statusToneStyle',
      'useFieldMetadata',
      'useMergedRefs',
    ],
  },
  density: {
    targets: { types: './dist/density.d.ts', import: './dist/density.js' },
    runtime: ['ComponentDensityScope', 'useResolvedControlSize', 'useResolvedDensity'],
  },
  headless: {
    targets: { types: './dist/headless.d.ts', import: './dist/headless.js' },
    runtime: ['useMenuKeyboard', 'useSubmenuBranch'],
  },
  platform: {
    targets: { types: './dist/platform.d.ts', import: './dist/platform.js' },
    runtime: [
      'OverlayPortal',
      'OverlayRuntimeContext',
      'OverlayRuntimeProvider',
      'anchoredPanelStyle',
      'appendAriaReference',
      'findOverlayTrigger',
      'inlineFloatingStyle',
      'useControllableOpen',
      'useDialogFocus',
      'useFloatingPosition',
      'useLightDismiss',
      'useOverlayLayer',
      'useOverlayRuntime',
    ],
  },
};
const coreDeniedInternalSubpaths = [
  './components/internal/*',
  './components/private/*',
  './components/brand/lk-logo-paths',
  './components/forms/field-shared',
  './components/overlay/anchored-overlay',
  './components/overlay/overlay-platform',
  './components/overlay/anchored-panel-style',
  './components/overlay/dialog-focus',
  './components/selection/pill-chip-style',
  './components/status/status-presentation',
];
const roboticsExternalSurface = await readJson(path.join(
  repositoryRoot,
  'docs',
  'references',
  'package-split',
  'ROBOTICS_EXTERNAL_SURFACE.json',
));
const canonicalAdoptionContract = await readJson(path.join(
  repositoryRoot,
  'docs',
  'references',
  'adoption',
  'LDS_UI_ADOPTION_CONTRACT.json',
));
const workspaceRootManifest = await readJson(path.join(repositoryRoot, 'package.json'));

function withoutReferenceProjection(contract) {
  return {
    ...contract,
    facets: (contract.facets ?? []).map((facet) => ({ ...facet, references: [] })),
    componentMapping: { ...contract.componentMapping, references: [] },
  };
}

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function optionValue(name) {
  const direct = process.argv.indexOf(name);
  if (direct >= 0) {
    invariant(process.argv[direct + 1] && !process.argv[direct + 1].startsWith('--'), `${name} requires a path.`);
    return process.argv[direct + 1];
  }
  const prefix = `${name}=`;
  const value = process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length);
  if (value !== undefined) invariant(value, `${name} requires a path.`);
  return value;
}

function strictArtifactDescendant(value) {
  const absolute = path.resolve(repositoryRoot, value);
  const relative = path.relative(artifactRoot, absolute);
  invariant(
    relative && !relative.startsWith('..') && !path.isAbsolute(relative),
    `Refusing to use an output path outside or equal to visual-artifacts: ${value}`,
  );
  return absolute;
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    let executable = command;
    let executableArgs = args;
    if (process.platform === 'win32' && /\.(?:cmd|bat)$/i.test(command)) {
      const quote = (value) => {
        const text = String(value);
        return /[\s&|<>^]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
      };
      executable = process.env.ComSpec || 'cmd.exe';
      executableArgs = ['/d', '/s', '/c', [command, ...args.map(quote)].join(' ')];
    }
    const child = spawn(executable, executableArgs, {
      cwd: options.cwd ?? repositoryRoot,
      env: { ...process.env, ...options.env },
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(
        `${command} ${args.join(' ')} exited with code ${code}.\n${stderr || stdout}`.trim(),
      ));
    });
  });
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

async function walkFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkFiles(full));
    else files.push(full);
  }
  return files;
}

async function inventory(directory) {
  const files = await walkFiles(directory);
  const rows = [];
  let bytes = 0;
  for (const file of files.sort((left, right) => left.localeCompare(right))) {
    const contents = await readFile(file);
    const relative = path.relative(directory, file).replaceAll('\\', '/');
    bytes += contents.byteLength;
    rows.push(`${relative}|${contents.byteLength}|${createHash('sha256').update(contents).digest('hex')}`);
  }
  return {
    fileCount: files.length,
    bytes,
    sha256: createHash('sha256').update(rows.join('\n')).digest('hex'),
  };
}

async function sourceCommit() {
  const { stdout } = await run('git', ['rev-parse', 'HEAD']);
  const commit = stdout.trim();
  invariant(/^[a-f0-9]{40}$/.test(commit), `git rev-parse HEAD returned an invalid commit: ${commit}`);
  return commit;
}

function normalizeArchivePath(file) {
  return file.replaceAll('\\', '/').replace(/^package\//, '');
}

function exportTargets(value, conditions = {}) {
  if (typeof value === 'string') return [{ condition: 'default', target: value }];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  return Object.entries(value).flatMap(([condition, nested]) => (
    exportTargets(nested, conditions).map((entry) => ({ ...entry, condition }))
  ));
}

function wildcardPattern(target) {
  const escaped = normalizeArchivePath(target)
    .replace(/^\.\//, '')
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replaceAll('*', '(.+)');
  return new RegExp(`^${escaped}$`);
}

function matchesForTarget(files, target) {
  const normalized = normalizeArchivePath(target).replace(/^\.\//, '');
  if (!normalized.includes('*')) return files.has(normalized) ? [normalized] : [];
  const pattern = wildcardPattern(normalized);
  return [...files].filter((file) => pattern.test(file));
}

function assertExportFiles(workspace, manifest, files) {
  invariant(manifest.exports && typeof manifest.exports === 'object', `${workspace.id}: exports map is missing.`);
  for (const [subpath, value] of Object.entries(manifest.exports)) {
    for (const { condition, target } of exportTargets(value)) {
      const matches = matchesForTarget(files, target);
      invariant(
        matches.length > 0,
        `${workspace.id}: export ${subpath} (${condition}) promises ${target}, but the tarball has no matching file.`,
      );
    }
  }
}

function assertImplementationContract(workspace, manifest, files) {
  const serializedExports = JSON.stringify(manifest.exports);
  invariant(!serializedExports.includes('"require"'), `${workspace.id}: implementation exports must not expose CommonJS.`);
  invariant(![...files].some((file) => file.endsWith('.cjs')), `${workspace.id}: implementation tarball contains CommonJS output.`);
  invariant(manifest.exports?.['.']?.import && manifest.exports?.['.']?.types, `${workspace.id}: root ESM/types exports are required.`);
  invariant(
    manifest.exports?.['./components/*']?.import && manifest.exports?.['./components/*']?.types,
    `${workspace.id}: deep component ESM/types exports are required.`,
  );
  if (workspace.id === 'core') {
    for (const [facade, { targets }] of Object.entries(coreSupportedFacades)) {
      invariant(
        isDeepStrictEqual(manifest.exports?.[`./${facade}`], targets),
        `core: ./${facade} must expose its exact ESM/types targets.`,
      );
    }
    for (const subpath of coreDeniedInternalSubpaths) {
      invariant(manifest.exports?.[subpath] === null, `core: ${subpath} must explicitly deny private implementation access.`);
    }
  }
}

async function assertSemanticContract(workspace, manifest, files, workspaceDirectory) {
  if (workspace.external) return;
  const semanticTarget = './tokens/semantic-contract.json';
  const semanticFile = semanticTarget.replace(/^\.\//, '');
  invariant(manifest.lds?.semanticContract === semanticTarget, `${workspace.id}: lds.semanticContract must target ${semanticTarget}.`);
  invariant(manifest.lds?.requiresSemanticContractVersion === '1', `${workspace.id}: lds.requiresSemanticContractVersion must be 1.`);
  if (files) invariant(files.has(semanticFile), `${workspace.id}: semantic contract is absent from the tarball.`);
  const contract = await readJson(path.join(workspaceDirectory, semanticFile));
  const expectedRole = workspace.id === 'theme' ? 'provider' : 'consumer';
  invariant(contract.schemaVersion === 1, `${workspace.id}: semantic contract schemaVersion must be 1.`);
  invariant(contract.kind === 'lds-semantic-token-package-contract', `${workspace.id}: semantic contract kind is invalid.`);
  invariant(contract.contractVersion === '1', `${workspace.id}: semantic contract version must be 1.`);
  invariant(contract.role === expectedRole, `${workspace.id}: semantic contract role must be ${expectedRole}.`);
  invariant(
    isDeepStrictEqual(contract.package, { name: manifest.name, version: manifest.version }),
    `${workspace.id}: semantic contract package identity or version drift.`,
  );
  invariant(
    contract.requiresSemanticContractVersion === manifest.lds.requiresSemanticContractVersion,
    `${workspace.id}: semantic consumer version differs between package metadata and contract.`,
  );
  invariant(Array.isArray(contract.requiredVariables), `${workspace.id}: semantic contract requiredVariables must be an array.`);
  if (expectedRole === 'provider') {
    invariant(manifest.lds.providesSemanticContractVersion === '1', 'theme: lds.providesSemanticContractVersion must be 1.');
    invariant(
      contract.providesSemanticContractVersion === manifest.lds.providesSemanticContractVersion,
      'theme: semantic provider version differs between package metadata and contract.',
    );
    invariant(Array.isArray(contract.providedVariables), 'theme: semantic contract providedVariables must be an array.');
  } else {
    invariant(manifest.lds.providesSemanticContractVersion === undefined, `${workspace.id}: consumers must not claim a semantic provider version.`);
    invariant(contract.providesSemanticContractVersion === undefined, `${workspace.id}: consumer contract must not claim a provider version.`);
  }
}

function assertDocumentationContract(workspace, manifest, files) {
  const externalDocs = workspace.external ? roboticsExternalSurface.documentation : null;
  const requiredFiles = workspace.external
    ? ['README.md', 'AGENTS.md', 'CLAUDE.md', 'llms.txt', ...Object.values(externalDocs.files).map(({ path: file }) => file), ...externalDocs.domainDocuments.map(({ path: file }) => file)]
    : requiredDocumentationFiles;
  for (const file of requiredFiles) {
    invariant(files.has(file), `${workspace.id}: generated package documentation is missing ${file}.`);
  }
  const documentationTargets = workspace.external ? {
    './package.json': './package.json',
    './design-system.json': `./${externalDocs.files.manifest.path}`,
    './llms.txt': `./${externalDocs.files.llms.path}`,
    './adoption-checklist.json': `./${externalDocs.files.checklist.path}`,
    './docs/*': `./${path.posix.dirname(externalDocs.files.manifest.path)}/*`,
  } : documentationExports;
  const packageInstructions = workspace.external ? ['README.md', 'AGENTS.md', 'CLAUDE.md', 'llms.txt'] : ['README.md'];
  for (const file of packageInstructions) {
    invariant(manifest.files?.includes(file), `${workspace.id}: files must include ${file}.`);
  }
  const bundleRoot = workspace.external ? path.posix.dirname(externalDocs.files.manifest.path) : 'docs';
  invariant(
    manifest.files?.some((entry) => entry === bundleRoot || bundleRoot.startsWith(`${entry.replace(/\/$/, '')}/`)),
    `${workspace.id}: files must cover ${bundleRoot}.`,
  );
  for (const [subpath, target] of Object.entries(documentationTargets)) {
    invariant(manifest.exports?.[subpath] === target, `${workspace.id}: ${subpath} must export ${target}.`);
  }
  invariant(manifest.lds?.schemaVersion === 1, `${workspace.id}: lds.schemaVersion must be 1.`);
  invariant(manifest.lds?.layer === workspace.layer, `${workspace.id}: lds.layer must be ${workspace.layer}.`);
  for (const [field, target] of Object.entries({
    manifest: workspace.external ? `./${externalDocs.files.manifest.path}` : './docs/manifest.json',
    llms: workspace.external ? `./${externalDocs.files.llms.path}` : './docs/llms.txt',
    adoptionChecklist: workspace.external ? `./${externalDocs.files.checklist.path}` : './docs/adoption-checklist.json',
    adoptionReportSchema: workspace.external ? `./${externalDocs.files.reportSchema.path}` : './docs/adoption-report.schema.json',
  })) {
    invariant(manifest.lds?.[field] === target, `${workspace.id}: lds.${field} must target ${target}.`);
    invariant(files.has(target.replace(/^\.\//, '')), `${workspace.id}: lds.${field} target is absent from the tarball.`);
  }
  invariant(
    manifest.lds?.storybook?.startsWith(workspace.docsOrigin),
    `${workspace.id}: lds.storybook must expose the live documentation.`,
  );
  invariant(manifest.homepage === manifest.lds.storybook, `${workspace.id}: homepage must match lds.storybook.`);
}

function firstStaticSubpath(files, directory) {
  const prefix = `${directory}/`;
  const file = [...files].find((candidate) => candidate.startsWith(prefix) && !candidate.endsWith('/'));
  invariant(file, `core: no ${directory} file was packed for static path smoke testing.`);
  return file;
}

function packageExportForSubpath(manifest, subpath) {
  if (Object.hasOwn(manifest.exports ?? {}, subpath)) return manifest.exports[subpath];
  const patterns = Object.entries(manifest.exports ?? {})
    .filter(([key]) => key.includes('*'))
    .filter(([key]) => {
      const pattern = new RegExp(`^${key
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replaceAll('*', '(.+)')}$`);
      return pattern.test(subpath);
    })
    .sort(([left], [right]) => (
      right.replaceAll('*', '').length - left.replaceAll('*', '').length
      || right.length - left.length
    ));
  return patterns[0]?.[1];
}

function firstDeepComponent(files, manifest) {
  const file = [...files]
    .filter((candidate) => candidate.startsWith('dist/components/') && candidate.endsWith('.js'))
    .sort()
    .find((candidate) => {
      const deepSubpath = candidate.slice('dist/'.length, -'.js'.length);
      return packageExportForSubpath(manifest, `./${deepSubpath}`) != null;
    });
  invariant(file, 'No compiled deep component ESM file was packed.');
  return file.slice('dist/'.length, -'.js'.length);
}

async function packWorkspace(workspace, destination) {
  const workspaceDirectory = workspace.external
    ? path.join(repositoryRoot, 'node_modules', ...workspace.name.split('/'))
    : path.join(repositoryRoot, 'packages', workspace.id);
  const manifest = await readJson(path.join(workspaceDirectory, 'package.json'));
  invariant(manifest.name === workspace.name, `${workspace.id}: expected package name ${workspace.name}, received ${manifest.name}.`);

  const { stdout } = await run(
    npmCommand,
    [...npmPrefixArguments, 'pack', '--json', '--ignore-scripts', '--pack-destination', destination],
    {
      cwd: workspaceDirectory,
      env: { npm_config_cache: path.join(path.dirname(destination), 'npm-cache') },
    },
  );
  let result;
  try {
    [result] = JSON.parse(stdout);
  } catch (error) {
    throw new Error(`${workspace.id}: npm pack did not return valid JSON: ${error.message}\n${stdout}`);
  }
  invariant(result?.filename, `${workspace.id}: npm pack did not report a tarball filename.`);
  const files = new Set((result.files ?? []).map(({ path: file }) => normalizeArchivePath(file)));
  invariant(files.size > 0, `${workspace.id}: npm pack reported an empty tarball.`);
  invariant(![...files].some((file) => file === 'src' || file.startsWith('src/')), `${workspace.id}: raw src files leaked into the tarball.`);
  assertExportFiles(workspace, manifest, files);
  assertImplementationContract(workspace, manifest, files);
  assertDocumentationContract(workspace, manifest, files);
  await assertSemanticContract(workspace, manifest, files, workspaceDirectory);

  return {
    ...workspace,
    manifest,
    files,
    tarball: path.join(destination, result.filename),
    deepSubpath: firstDeepComponent(files, manifest),
  };
}

async function linkRuntimePeer(consumerDirectory, peerName) {
  const source = path.join(repositoryRoot, 'node_modules', peerName);
  await access(source);
  const destination = path.join(consumerDirectory, 'node_modules', peerName);
  await rm(destination, { force: true, recursive: true });
  await symlink(source, destination, process.platform === 'win32' ? 'junction' : 'dir');
}

async function resolveLocalModule(fromFile, specifier) {
  const direct = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [direct, `${direct}.js`, path.join(direct, 'index.js')];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next valid ESM resolution candidate.
    }
  }
  throw new Error(`Unable to resolve packed Select dependency ${specifier} from ${fromFile}.`);
}

async function readLocalModuleGraph(entryFile, visited = new Set()) {
  const normalized = path.resolve(entryFile);
  if (visited.has(normalized)) return '';
  visited.add(normalized);
  const source = await readFile(normalized, 'utf8');
  const relativeImports = [
    ...source.matchAll(/\b(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"](\.[^'"]+)['"]/g),
  ].map((match) => match[1]);
  const dependencies = await Promise.all(relativeImports.map(async (specifier) => (
    readLocalModuleGraph(await resolveLocalModule(normalized, specifier), visited)
  )));
  return [source, ...dependencies].join('\n');
}

async function readCssImportGraph(entryFile, visited = new Set()) {
  const normalized = path.resolve(entryFile);
  if (visited.has(normalized)) return '';
  visited.add(normalized);
  const source = await readFile(normalized, 'utf8');
  const relativeImports = [
    ...source.matchAll(/@import\s+(?:url\()?['"](\.[^'"]+\.css)['"][^;]*;/g),
  ].map((match) => match[1]);
  const dependencies = await Promise.all(relativeImports.map((specifier) => (
    readCssImportGraph(path.resolve(path.dirname(normalized), specifier), visited)
  )));
  return [source, ...dependencies].join('\n');
}

function cssCustomProperties(source) {
  return new Set([...source.matchAll(/(?<![A-Za-z0-9-])(--[A-Za-z0-9-]+)\s*:/g)].map((match) => match[1]));
}

function cssVariableReferences(source) {
  return [...source.matchAll(/var\(\s*(--[A-Za-z0-9-]+)(?:\s*,[^)]*)?\)/g)].map((match) => ({
    name: match[1],
    hasFallback: match[0].includes(','),
  }));
}

async function assertPackedSelectTokenContract(packed, consumerDirectory) {
  const core = packed.find(({ id }) => id === 'core');
  const theme = packed.find(({ id }) => id === 'theme');
  invariant(core && theme, 'Packed Select token contract requires the Core and Theme packages.');

  const installedCore = path.join(consumerDirectory, 'node_modules', ...core.name.split('/'));
  const installedTheme = path.join(consumerDirectory, 'node_modules', ...theme.name.split('/'));
  const selectSource = await readLocalModuleGraph(
    path.join(installedCore, 'dist', 'components', 'forms', 'Select.js'),
  );
  invariant(selectSource.includes('listbox') && selectSource.includes('option'), 'Packed Core Select must retain its listbox and option implementation.');

  const css = [
    await readCssImportGraph(path.join(installedCore, 'styles.css')),
    await readCssImportGraph(path.join(installedTheme, 'styles.css')),
  ].join('\n');
  const definitions = cssCustomProperties(css);
  const unresolved = [...new Set(
    cssVariableReferences(selectSource)
      .filter(({ name, hasFallback }) => !hasFallback && !definitions.has(name))
      .map(({ name }) => name),
  )].sort();
  invariant(
    unresolved.length === 0,
    `Packed Core Select references fallback-free CSS variables missing from Core + Theme styles: ${unresolved.join(', ')}.`,
  );
  console.log(`Validated packed Select token contract: ${definitions.size} Core + Theme tokens cover the Select module graph.`);
}

async function installPackedDependencies(packed, consumerDirectory) {
  const localDependencies = Object.fromEntries(packed.map(({ name, tarball }) => [
    name,
    `file:${path.relative(consumerDirectory, tarball).replaceAll('\\', '/')}`,
  ]));
  const includesLockedRobotics = packed.some(({ id }) => id === 'robotics');
  await writeFile(
    path.join(consumerDirectory, 'package.json'),
    `${JSON.stringify({
      name: 'lds-workspace-artifact-smoke',
      private: true,
      type: 'module',
      dependencies: localDependencies,
      ...(includesLockedRobotics ? {
        // The locked external Robotics package was published against an older
        // Core/Product release. This smoke is about the candidate package set
        // as one unit, so keep those edges local and registry-independent.
        overrides: {
          '@lk-design-system/lds-core': '$@lk-design-system/lds-core',
          '@lk-design-system/lds-product': '$@lk-design-system/lds-product',
        },
      } : {}),
    }, null, 2)}\n`,
  );
  await writeFile(
    path.join(consumerDirectory, '.npmrc'),
    await readFile(path.join(repositoryRoot, '.npmrc'), 'utf8'),
  );
  await run(
    npmCommand,
    [...npmPrefixArguments, 'install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund', '--legacy-peer-deps'],
    {
      cwd: consumerDirectory,
      env: { npm_config_cache: path.join(path.dirname(consumerDirectory), 'npm-cache') },
    },
  );
  await linkRuntimePeer(consumerDirectory, 'react');
  await linkRuntimePeer(consumerDirectory, 'react-dom');
}

async function assertInstalledDocumentation(packed, consumerDirectory) {
  for (const workspace of packed) {
    const installedRoot = path.join(consumerDirectory, 'node_modules', ...workspace.name.split('/'));
    const installedManifest = await readJson(path.join(installedRoot, 'package.json'));
    await assertSemanticContract(workspace, installedManifest, null, installedRoot);
    const bundleRoot = workspace.external
      ? path.posix.dirname(roboticsExternalSurface.documentation.files.manifest.path)
      : 'docs';
    const docsRoot = path.join(installedRoot, ...bundleRoot.split('/'));
    const docsManifest = await readJson(path.join(docsRoot, 'manifest.json'));
    invariant(
      isDeepStrictEqual(docsManifest.package, {
        name: workspace.name,
        version: installedManifest.version,
        layer: workspace.layer,
      }),
      `${workspace.id}: installed documentation identity or version drift.`,
    );

    const documentFiles = (await walkFiles(docsRoot))
      .map((file) => path.relative(docsRoot, file).replaceAll('\\', '/'))
      .filter((file) => file !== 'manifest.json')
      .sort();
    const records = docsManifest.documents ?? [];
    invariant(
      isDeepStrictEqual(documentFiles, records.map(({ path: file }) => file).sort()),
      `${workspace.id}: installed documentation manifest file set drift.`,
    );
    for (const record of records) {
      const contents = await readFile(path.join(docsRoot, record.path));
      invariant(
        createHash('sha256').update(contents).digest('hex') === record.sha256,
        `${workspace.id}: installed docs/${record.path} hash drift.`,
      );
    }

    if (!workspace.external) {
      for (const [resource, expectedInventory] of Object.entries(docsManifest.resources ?? {})) {
        invariant(
          isDeepStrictEqual(expectedInventory, await inventory(path.join(installedRoot, resource))),
          `${workspace.id}: installed ${resource} inventory does not match docs/manifest.json.`,
        );
      }
    }
    const checklistPath = workspace.external
      ? path.join(installedRoot, roboticsExternalSurface.documentation.files.checklist.path)
      : path.join(docsRoot, 'adoption-checklist.json');
    const adoptionContract = await readJson(checklistPath);
    invariant(
      adoptionContract.$schema === './LDS_UI_ADOPTION_CONTRACT.schema.json',
      `${workspace.id}: installed adoption contract has a non-resolvable schema link.`,
    );
    await access(path.resolve(path.dirname(checklistPath), adoptionContract.$schema));

    if (workspace.external) {
      invariant(
        roboticsExternalSurface.schemaVersion === 3
          && roboticsExternalSurface.package?.name === workspace.name
          && roboticsExternalSurface.package?.version === installedManifest.version
          && roboticsExternalSurface.package?.refStatus === installedManifest.lds?.refStatus,
        'robotics: installed package identity differs from the v3 external surface.',
      );
      const documentation = roboticsExternalSurface.documentation;
      const installedCanonical = canonicalSnapshotFromDocumentationManifest(docsManifest);
      const snapshotMode = canonicalSnapshotMode({
        currentRef: `lds-v${workspaceRootManifest.version}`,
        canonicalRef: installedCanonical.source.ref,
        surfacePackageRefStatus: roboticsExternalSurface.package.refStatus,
        installedPackageRefStatus: installedManifest.lds?.refStatus,
      });
      invariant(
        isDeepStrictEqual(installedCanonical, documentation.canonicalContract),
        'robotics: installed canonical LDS snapshot differs from the external surface.',
      );
      const declared = [
        ...Object.values(documentation.files),
        ...documentation.domainDocuments,
      ];
      for (const record of declared) {
        const target = path.resolve(installedRoot, record.path);
        const relative = path.relative(installedRoot, target);
        invariant(relative && !relative.startsWith('..') && !path.isAbsolute(relative), `robotics: unsafe declared documentation path ${record.path}.`);
        const bytes = await readFile(target);
        invariant(createHash('sha256').update(bytes).digest('hex') === record.sha256, `robotics: external-surface hash drift for ${record.path}.`);
      }
      invariant(
        isDeepStrictEqual(docsManifest.publicDocs, documentation.publicDocs),
        'robotics: documentation manifest public URLs differ from the external surface.',
      );
      invariant(
        isDeepStrictEqual(docsManifest.source?.canonicalAdoption, {
          kind: documentation.canonicalContract.kind,
          version: documentation.canonicalContract.contractVersion,
          source: documentation.canonicalContract.source,
          snapshotManifestSha256: documentation.canonicalContract.snapshotManifestSha256,
        }),
        'robotics: documentation manifest canonical source differs from the external surface.',
      );
      invariant(
        isDeepStrictEqual(docsManifest.source?.robotics, {
          repository: roboticsExternalSurface.package.repository,
          ref: `v${roboticsExternalSurface.package.version}`,
          refStatus: roboticsExternalSurface.package.refStatus,
        }),
        'robotics: documentation manifest Robotics source differs from the external surface.',
      );
      invariant(
        isDeepStrictEqual(docsManifest.resources, {
          tokens: {
            path: `./${path.posix.relative(bundleRoot, documentation.files.tokenManifest.path)}`,
            sha256: documentation.files.tokenManifest.sha256,
          },
          domainSymbols: {
            path: `./${path.posix.relative(bundleRoot, documentation.files.domainSymbolRegistry.path)}`,
            sha256: documentation.files.domainSymbolRegistry.sha256,
          },
        }),
        'robotics: documentation resource records differ from the external surface.',
      );
      const expectedDomainDocuments = documentation.domainDocuments.map((record) => ({
        path: path.posix.relative(bundleRoot, record.path),
        sha256: record.sha256,
      }));
      const actualDomainDocuments = (docsManifest.domain?.documents ?? []).map((record) => ({
        path: record.path,
        sha256: record.sha256,
      }));
      invariant(
        isDeepStrictEqual(actualDomainDocuments, expectedDomainDocuments),
        'robotics: documentation domain records differ from the external surface.',
      );
      invariant(
        records.find(({ path: file }) => file === 'shared/manifest.json')?.sha256
          === documentation.canonicalContract.snapshotManifestSha256,
        'robotics: upstream snapshot manifest hash differs from the canonical documentation source.',
      );
      if (snapshotMode === 'current') {
        const currentManifestBytes = await readFile(path.join(repositoryRoot, 'packages/core/docs/manifest.json'));
        invariant(
          createHash('sha256').update(currentManifestBytes).digest('hex')
            === documentation.canonicalContract.snapshotManifestSha256,
          'robotics: current-ref snapshot differs from the current Core documentation manifest.',
        );
      }
      invariant(
        isDeepStrictEqual(
          withoutReferenceProjection(adoptionContract),
          withoutReferenceProjection(canonicalAdoptionContract),
        ),
        'robotics: installed adoption checklist decisions differ from the canonical contract.',
      );
      const references = [
        ...(adoptionContract.facets ?? []).flatMap((facet) => facet.references ?? []),
        ...(adoptionContract.componentMapping?.references ?? []),
      ];
      for (const reference of references) {
        invariant(
          typeof reference === 'string' && !reference.startsWith('@') && !/^https?:/.test(reference),
          `robotics: adoption checklist must be self-contained (${reference}).`,
        );
        const target = path.resolve(docsRoot, reference);
        const relative = path.relative(installedRoot, target);
        invariant(relative && !relative.startsWith('..') && !path.isAbsolute(relative), `robotics: checklist reference escapes the package (${reference}).`);
        await access(target);
      }
      const reportExample = await readJson(path.join(installedRoot, documentation.files.reportExample.path));
      invariant(reportExample.$schema === './adoption-report.schema.json', 'robotics: report example schema link must be package-relative.');
      const canonicalBytes = await readFile(path.join(repositoryRoot, documentation.canonicalContract.source.path));
      invariant(
        createHash('sha256').update(canonicalBytes).digest('hex') === documentation.canonicalContract.source.sha256,
        'robotics: canonical adoption source hash differs from the external surface.',
      );
    }
  }
  console.log('Validated installed package semantic metadata, documentation hashes, relative schema links, and computed token/asset inventories.');
}

async function smokeDocumentationResolution(packed, consumerDirectory) {
  const packageNames = packed.map(({ name }) => name);
const smoke = `
import { access, readFile } from 'node:fs/promises';

const packageNames = ${JSON.stringify(packageNames)};
const entrypoints = [
  ['package.json', true],
  ['design-system.json', true],
  ['llms.txt', false],
  ['adoption-checklist.json', true],
  ['docs/adoption-report.schema.json', true],
  ['docs/adoption-report.example.json', true],
];
for (const packageName of packageNames) {
  const packageEntrypoints = packageName === '@lk-design-system/lds-robotics-ui'
    ? [...entrypoints,
      ['docs/adoption-config.schema.json', true],
      ['docs/tokens/manifest.json', true],
      ['docs/domain-symbol-registry.json', true]]
    : entrypoints;
  for (const [subpath, json] of packageEntrypoints) {
    const url = new URL(import.meta.resolve(\`${'${packageName}'}/\${subpath}\`));
    await access(url);
    const contents = await readFile(url, 'utf8');
    if (json) JSON.parse(contents);
    else if (!contents.trim()) throw new Error(\`${'${packageName}'}/\${subpath} is empty.\`);
  }
  const checklistUrl = new URL(import.meta.resolve(\`${'${packageName}'}/adoption-checklist.json\`));
  const checklist = JSON.parse(await readFile(checklistUrl, 'utf8'));
  const references = [
    ...checklist.facets.flatMap((facet) => facet.references),
    ...checklist.componentMapping.references,
  ];
  for (const reference of references) {
    if (/^https:\\/\\//.test(reference)) continue;
    const referenceUrl = reference.startsWith('@')
      ? new URL(import.meta.resolve(reference))
      : new URL(reference, checklistUrl);
    await access(referenceUrl);
  }
}
console.log('package documentation resolution smoke passed');
`;
  const smokeFile = path.join(consumerDirectory, 'documentation-smoke.mjs');
  await writeFile(smokeFile, smoke.trimStart());
  const { stdout } = await run(process.execPath, [smokeFile], { cwd: consumerDirectory });
  invariant(stdout.includes('package documentation resolution smoke passed'), 'Documentation resolution smoke did not reach its success marker.');
}

async function smokeSupportedCoreFacades(packed, consumerDirectory) {
  const core = packed.find(({ id }) => id === 'core');
  invariant(core, 'Core package is required for the supported facade smoke.');
  const smoke = `
import { access, readFile } from 'node:fs/promises';

const core = ${JSON.stringify(core.name)};
const contracts = ${JSON.stringify(coreSupportedFacades)};
const manifestUrl = new URL(import.meta.resolve(core + '/package.json'));
const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
for (const [facade, contract] of Object.entries(contracts)) {
  const subpath = './' + facade;
  const target = manifest.exports?.[subpath];
  if (JSON.stringify(target) !== JSON.stringify(contract.targets)) {
    throw new Error(subpath + ' packed export target drift.');
  }
  const declarationUrl = new URL(target.types, manifestUrl);
  await access(declarationUrl);
  const declaration = await readFile(declarationUrl, 'utf8');
  if (!/\\bexport\\b/.test(declaration)) throw new Error(subpath + ' packed type target is empty.');
  const runtime = await import(core + '/' + facade);
  const actual = Object.keys(runtime).sort();
  if (JSON.stringify(actual) !== JSON.stringify(contract.runtime)) {
    throw new Error(subpath + ' packed runtime exports drift: ' + actual.join(', ') + '.');
  }
}
console.log('supported Core facade packed runtime and type resolution smoke passed');
`;
  const smokeFile = path.join(consumerDirectory, 'supported-facade-smoke.mjs');
  await writeFile(smokeFile, smoke.trimStart());
  const { stdout } = await run(process.execPath, [smokeFile], { cwd: consumerDirectory });
  invariant(
    stdout.includes('supported Core facade packed runtime and type resolution smoke passed'),
    'Supported Core facade smoke did not reach its success marker.',
  );
}

async function smokePackedSelect(packed, consumerDirectory) {
  await installPackedDependencies(packed, consumerDirectory);
  await assertInstalledDocumentation(packed, consumerDirectory);
  await smokeDocumentationResolution(packed, consumerDirectory);
  await smokeSupportedCoreFacades(packed, consumerDirectory);
  await assertPackedSelectTokenContract(packed, consumerDirectory);
}

async function smokeConsumer(packed, consumerDirectory) {
  await installPackedDependencies(packed, consumerDirectory);
  await assertInstalledDocumentation(packed, consumerDirectory);
  await smokeDocumentationResolution(packed, consumerDirectory);
  await smokeSupportedCoreFacades(packed, consumerDirectory);
  await assertPackedSelectTokenContract(packed, consumerDirectory);

  // Static subpath resolution used to be exercised through the compatibility
  // facade because it packed every resource. Core carries the same three
  // resource kinds, so it is the reference now.
  const core = packed.find(({ id }) => id === 'core');
  const tokenFile = firstStaticSubpath(core.files, 'tokens');
  const assetFile = firstStaticSubpath(core.files, 'assets');
  const smoke = `
import { access } from 'node:fs/promises';

const packages = ${JSON.stringify(packed.map(({ name, deepSubpath }) => ({ name, deepSubpath })))};
for (const item of packages) {
  await import(item.name);
  await import(\`${'${item.name}'}/\${item.deepSubpath}\`);
}

const core = ${JSON.stringify(core.name)};
for (const subpath of ${JSON.stringify(['styles.css', tokenFile, assetFile])}) {
  const resolved = import.meta.resolve(\`${'${core}'}/\${subpath}\`);
  await access(new URL(resolved));
}
console.log('workspace artifact consumer smoke passed');
`;
  const smokeFile = path.join(consumerDirectory, 'smoke.mjs');
  await writeFile(smokeFile, smoke.trimStart());
  const { stdout } = await run(process.execPath, [smokeFile], { cwd: consumerDirectory });
  invariant(stdout.includes('workspace artifact consumer smoke passed'), 'Consumer smoke did not reach its success marker.');
}

async function main() {
  await mkdir(artifactRoot, { recursive: true });
  const outputValue = optionValue('--output-dir');
  const persistent = outputValue !== undefined;
  const runDirectory = persistent
    ? strictArtifactDescendant(outputValue)
    : await mkdtemp(path.join(artifactRoot, 'workspace-artifacts-'));
  if (persistent) {
    await rm(runDirectory, { recursive: true, force: true, maxRetries: 3 });
    await mkdir(runDirectory, { recursive: true });
  }
  const tarballDirectory = path.join(runDirectory, 'tarballs');
  const consumerDirectory = path.join(runDirectory, 'consumer');
  await mkdir(tarballDirectory, { recursive: true });
  await mkdir(consumerDirectory, { recursive: true });

  let completed = false;
  try {
    const packed = [];
    const selectedWorkspaces = selectOnly
      ? workspaces.filter(({ id }) => id === 'core' || id === 'theme')
      : workspaces;
    for (const workspace of selectedWorkspaces) packed.push(await packWorkspace(workspace, tarballDirectory));
    if (selectOnly) {
      await smokePackedSelect(packed, consumerDirectory);
      completed = true;
      console.log('Packed Core + Theme smoke passed: tarballs install together, documentation exports resolve with verified hashes, and Select token coverage is complete.');
      return;
    }
    await smokeConsumer(packed, consumerDirectory);
    if (persistent) {
      const packages = [];
      for (const item of packed) {
        const bytes = await readFile(item.tarball);
        packages.push({
          id: item.id,
          name: item.name,
          version: item.manifest.version,
          file: `tarballs/${path.basename(item.tarball)}`,
          size: bytes.byteLength,
          sha256: createHash('sha256').update(bytes).digest('hex'),
          source: item.external ? 'locked-external-package' : 'workspace',
        });
      }
      const manifest = {
        schemaVersion: 1,
        kind: 'lds-workspace-package-set',
        sourceCommit: await sourceCommit(),
        packages,
      };
      await writeFile(path.join(runDirectory, 'package-set.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
      await rm(consumerDirectory, { recursive: true, force: true, maxRetries: 3 });
      await rm(path.join(runDirectory, 'npm-cache'), { recursive: true, force: true, maxRetries: 3 });
      invariant(
        JSON.stringify((await readdir(runDirectory)).sort()) === JSON.stringify(['package-set.json', 'tarballs']),
        'Persistent package-set output must contain only package-set.json and tarballs/.',
      );
      console.log(`Preserved verified LDS workspace package set: ${path.relative(repositoryRoot, runDirectory).replaceAll('\\', '/')}`);
    }
    completed = true;
    console.log('LDS package set verified: Core/Theme/Product ESM+types, generated adoption documentation, the locked external Robotics tarball, and isolated consumer smoke passed.');
  } finally {
    if (!persistent || !completed) {
      const relative = path.relative(artifactRoot, runDirectory);
      invariant(relative && !relative.startsWith('..') && !path.isAbsolute(relative), 'Refusing to clean an artifact path outside visual-artifacts.');
      await rm(runDirectory, { recursive: true, force: true, maxRetries: 3 });
    }
  }
}

main().catch((error) => {
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
});
