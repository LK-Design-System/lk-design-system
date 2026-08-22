import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const args = new Set(process.argv.slice(2));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function exists(rel) {
  try {
    await stat(path.join(root, rel));
    return true;
  } catch {
    return false;
  }
}

async function read(rel) {
  return readFile(path.join(root, rel), 'utf8');
}

async function collect(dirRel, predicate, out = []) {
  const dir = path.join(root, dirRel);
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = path.join(dirRel, entry.name).replaceAll('\\', '/');
    if (entry.isDirectory()) await collect(rel, predicate, out);
    else if (entry.isFile() && predicate(rel)) out.push(rel);
  }
  return out.sort();
}

function entryStatsFromSource(source) {
  const entryExports = source
    .split('\n')
    .filter((line) => line.startsWith('export {'));
  const names = [];
  const entryRows = [];
  for (const line of entryExports) {
    const match = line.match(/^export\s+\{\s*([^}]+?)\s*\}\s+from\s+['"]([^'"]+)['"];$/);
    assert(match, `Unsupported generated entry syntax: ${line}`);
    const rowNames = match[1].split(',').map((item) => item.trim().split(/\s+as\s+/)[0]);
    names.push(...rowNames);
    const normalizedPath = match[2].replace(/^(?:\.\.\/|\.\/)(?=components\/)/, '');
    entryRows.push({ path: normalizedPath, names: rowNames });
  }
  return {
    sourceEntries: entryExports.length,
    namedExports: new Set(names).size,
    entryRows,
    sourcePaths: new Set(entryRows.map((entry) => entry.path)),
    exportNames: new Set(names),
  };
}

function assertSameSet(label, actual, expected) {
  const missing = [...expected].filter((value) => !actual.has(value));
  const extra = [...actual].filter((value) => !expected.has(value));
  assert(missing.length === 0 && extra.length === 0, `${label} drifted; missing=${missing.join(',') || 'none'}; extra=${extra.join(',') || 'none'}.`);
}

async function getStorybookCounts() {
  if (!(await exists('storybook-static/index.json'))) return null;
  const index = JSON.parse(await read('storybook-static/index.json'));
  const stories = Object.values(index.entries || {}).filter((entry) => entry.type === 'story');
  const publicStories = stories.filter((entry) => Array.isArray(entry.tags) && entry.tags.includes('dev'));
  const hiddenStories = stories.filter((entry) => !publicStories.includes(entry));
  const visualParityStories = stories.filter((entry) => Array.isArray(entry.tags) && entry.tags.includes('visual-parity'));
  const implementationStories = stories.filter((entry) => entry.importPath !== './stories/Audit.data.jsx');

  return {
    total: stories.length,
    public: publicStories.length,
    hidden: hiddenStories.length,
    visualParity: visualParityStories.length,
    implementation: implementationStories.length,
  };
}

async function getCounts() {
  const classification = JSON.parse(await read('docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json'));
  const workspaceManifest = JSON.parse(await read('package.json'));
  const roboticsExternalSurface = JSON.parse(
    await read('docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.json'),
  );
  const ownerApiDecisions = JSON.parse(
    await read('docs/references/architecture/R3B_OWNER_API_DECISIONS.json'),
  );
  // Internal engine modules (components/internal/*, overlay/forms shared engines)
  // carry their own .d.ts contracts but are not public components, so exclude
  // them by stem: the classification lists both .js and .jsx internal modules.
  const internalModuleStems = new Set(
    (classification.internalModules || []).map((row) => row.path.replace(/\.(jsx|js)$/, '')),
  );
  const componentJsx = (await collect('components', (rel) => rel.endsWith('.jsx'))).filter(
    (rel) => !internalModuleStems.has(rel.replace(/\.jsx$/, '')),
  );
  const componentDts = (await collect('components', (rel) => rel.endsWith('.d.ts'))).filter(
    (rel) => !internalModuleStems.has(rel.replace(/\.d\.ts$/, '')),
  );
  const groups = await readdir(path.join(root, 'components'), { withFileTypes: true });
  const srcIndex = await read('src/index.js');
  const workspaceEntry = entryStatsFromSource(srcIndex);
  const packages = {};
  const packageSurfaces = {};
  for (const layer of ['core', 'theme', 'product']) {
    const manifest = JSON.parse(await read(`packages/${layer}/package.json`));
    const entry = entryStatsFromSource(await read(`packages/${layer}/src/index.js`));
    packageSurfaces[layer] = entry;
    packages[layer] = {
      name: manifest.name,
      version: manifest.version,
      private: manifest.private === true,
      registry: manifest.publishConfig?.registry ?? null,
      access: manifest.publishConfig?.access ?? null,
      sourceEntries: entry.sourceEntries,
      namedExports: entry.namedExports,
    };
  }
  const pathOwners = new Map();
  const exportOwners = new Map();
  for (const [layer, surface] of Object.entries(packageSurfaces)) {
    for (const entry of surface.entryRows) {
      const owners = pathOwners.get(entry.path) ?? new Set();
      owners.add(layer);
      pathOwners.set(entry.path, owners);
      for (const name of entry.names) {
        const nameOwners = exportOwners.get(name) ?? new Set();
        nameOwners.add(layer);
        exportOwners.set(name, nameOwners);
      }
    }
  }
  const projectedSourcePaths = new Set(pathOwners.keys());
  const projectedExportNames = new Set(exportOwners.keys());
  assertSameSet('Generated owner-package source union', projectedSourcePaths, workspaceEntry.sourcePaths);
  assertSameSet('Generated owner-package export union', projectedExportNames, workspaceEntry.exportNames);

  const approvedCompatibilityExports = new Set(
    ownerApiDecisions.decisions
      .filter((decision) => decision.decision === 'move-now' && decision.ownerLayer === 'core')
      .flatMap((decision) => decision.subjects)
      .filter((subject) => workspaceEntry.exportNames.has(subject)),
  );
  const compatibilityExports = new Set(
    [...exportOwners].filter(([, owners]) => owners.size > 1).map(([name]) => name),
  );
  const approvedCompatibilityPaths = new Set(
    workspaceEntry.entryRows
      .filter((entry) => entry.names.some((name) => approvedCompatibilityExports.has(name)))
      .map((entry) => entry.path),
  );
  const compatibilityPaths = new Set(
    [...pathOwners].filter(([, owners]) => owners.size > 1).map(([entryPath]) => entryPath),
  );
  assertSameSet('Product compatibility export projection', compatibilityExports, approvedCompatibilityExports);
  assertSameSet('Product compatibility source projection', compatibilityPaths, approvedCompatibilityPaths);
  for (const name of compatibilityExports) {
    assert([...exportOwners.get(name)].sort().join(',') === 'core,product', `${name} compatibility export must exist only in Core and Product.`);
  }
  for (const entryPath of compatibilityPaths) {
    assert([...pathOwners.get(entryPath)].sort().join(',') === 'core,product', `${entryPath} compatibility source must exist only in Core and Product.`);
  }
  const roboticsEntries = roboticsExternalSurface.entries ?? [];
  const roboticsNamedExports = new Set(roboticsEntries.flatMap((entry) => entry.exports ?? []));
  const storybook = await getStorybookCounts();

  return {
    workspace: {
      name: workspaceManifest.name,
      version: workspaceManifest.version,
      private: workspaceManifest.private === true,
      exportedSubpaths: Object.keys(workspaceManifest.exports ?? {}),
    },
    packages,
    packageProjection: {
      uniqueSourceEntries: projectedSourcePaths.size,
      uniqueNamedExports: projectedExportNames.size,
      compatibilitySourceEntries: compatibilityPaths.size,
      compatibilityNamedExports: compatibilityExports.size,
    },
    robotics: {
      name: roboticsExternalSurface.package?.name,
      version: roboticsExternalSurface.package?.version,
      repository: roboticsExternalSurface.package?.repository,
      refStatus: roboticsExternalSurface.package?.refStatus,
      sourceEntries: roboticsEntries.length,
      namedExports: roboticsNamedExports.size,
    },
    componentImplementations: componentJsx.length,
    componentTypeContracts: componentDts.length,
    componentEntryExports: workspaceEntry.sourceEntries,
    namedPublicExports: workspaceEntry.namedExports,
    componentGroups: groups.filter((entry) => entry.isDirectory()).length,
    storybook,
  };
}

async function checkDocs(counts) {
  assert(counts.storybook, 'storybook-static/index.json is required. Run build:storybook before check:inventory.');

  // Keep volatile inventory totals in generated/audited registers. The root
  // README is a stable discovery surface and must not drift every time a story
  // or component entry is added.
  const expectations = [
    ['docs/REPOSITORY_INVENTORY.md', `워크스페이스 orchestrator: \`${counts.workspace.name}@${counts.workspace.version}\` · \`private: true\``],
    ['docs/REPOSITORY_INVENTORY.md', `Core: \`${counts.packages.core.name}@${counts.packages.core.version}\` · source entry ${counts.packages.core.sourceEntries}개 · named export ${counts.packages.core.namedExports}개`],
    ['docs/REPOSITORY_INVENTORY.md', `Theme: \`${counts.packages.theme.name}@${counts.packages.theme.version}\` · source entry ${counts.packages.theme.sourceEntries}개 · named export ${counts.packages.theme.namedExports}개`],
    ['docs/REPOSITORY_INVENTORY.md', `Product: \`${counts.packages.product.name}@${counts.packages.product.version}\` · source entry ${counts.packages.product.sourceEntries}개 · named export ${counts.packages.product.namedExports}개`],
    ['docs/REPOSITORY_INVENTORY.md', `로컬 owner-package canonical unique surface: source entry ${counts.componentEntryExports}개 · named export ${counts.namedPublicExports}개`],
    ['docs/REPOSITORY_INVENTORY.md', `Product deprecated compatibility projection: source entry ${counts.packageProjection.compatibilitySourceEntries}개 · named export ${counts.packageProjection.compatibilityNamedExports}개`],
    ['docs/REPOSITORY_INVENTORY.md', `외부 Robotics: \`${counts.robotics.name}@${counts.robotics.version}\` · source entry ${counts.robotics.sourceEntries}개 · named export ${counts.robotics.namedExports}개`],
    ['docs/REPOSITORY_INVENTORY.md', `Storybook 전체 story: ${counts.storybook.total}개`],
    ['docs/REPOSITORY_INVENTORY.md', `Storybook public story: ${counts.storybook.public}개`],
    ['docs/REPOSITORY_INVENTORY.md', `숨김 visual parity story: ${counts.storybook.visualParity}개`],
    ['docs/REPOSITORY_INVENTORY.md', `visual inventory React story: ${counts.storybook.implementation}개`],
    ['docs/REPOSITORY_INVENTORY.md', `접근성 guard 검사 대상 implementation story: ${counts.storybook.implementation}개`],
    ['docs/VISUAL_PARITY_LEDGER.md', `| React component entry exports | ${counts.componentEntryExports} |`],
    ['docs/VISUAL_PARITY_LEDGER.md', `| Named public exports | ${counts.namedPublicExports} |`],
    ['docs/VISUAL_PARITY_LEDGER.md', `| Storybook public stories | ${counts.storybook.public} |`],
    ['docs/VISUAL_PARITY_LEDGER.md', `| Storybook hidden visual parity stories | ${counts.storybook.visualParity} |`],
    ['docs/VISUAL_PARITY_LEDGER.md', `| Visual inventory React stories | ${counts.storybook.implementation} |`],
    ['docs/VISUAL_PARITY_LEDGER.md', `| Accessibility checked implementation stories | ${counts.storybook.implementation} |`],
    ['stories/Audit.data.jsx', `value="${counts.componentEntryExports}"`],
    ['stories/CardsExtended.shared.jsx', `<Stat value="${counts.componentEntryExports}" label="구현 검증"`],
    ['stories/CardsExtended.shared.jsx', `<Stat value="${counts.storybook.public}" label="공개 스토리"`],
  ];

  const missing = [];
  for (const [file, snippet] of expectations) {
    const source = await read(file);
    if (!source.includes(snippet)) missing.push(`${file}: missing ${snippet}`);
  }

  const inventory = await read('docs/REPOSITORY_INVENTORY.md');
  for (const staleSnippet of [
    '@lk-design-system/design-system-core',
    '루트 aggregate export:',
    'Robotics compatibility entry:',
    'Robotics compatibility shim',
    './robotics',
    'dist/robotics',
    '배포 정책은 현재 `private: true`이며 내부 Git 소비',
  ]) {
    if (inventory.includes(staleSnippet)) {
      missing.push(`docs/REPOSITORY_INVENTORY.md: stale ${staleSnippet}`);
    }
  }

  assert(missing.length === 0, `Inventory documentation is stale:\n${missing.join('\n')}`);
}

function printTable(counts) {
  const rows = [
    ['Component implementations', counts.componentImplementations],
    ['Component type contracts', counts.componentTypeContracts],
    ['Component entry exports', counts.componentEntryExports],
    ['Named public exports', counts.namedPublicExports],
    ['Component groups', counts.componentGroups],
    ['Core source entries', counts.packages.core.sourceEntries],
    ['Core named exports', counts.packages.core.namedExports],
    ['Theme source entries', counts.packages.theme.sourceEntries],
    ['Theme named exports', counts.packages.theme.namedExports],
    ['Product source entries', counts.packages.product.sourceEntries],
    ['Product named exports', counts.packages.product.namedExports],
    ['Product compatibility source entries', counts.packageProjection.compatibilitySourceEntries],
    ['Product compatibility named exports', counts.packageProjection.compatibilityNamedExports],
    ['External Robotics source entries', counts.robotics.sourceEntries],
    ['External Robotics named exports', counts.robotics.namedExports],
  ];

  if (counts.storybook) {
    rows.push(
      ['Storybook stories', counts.storybook.total],
      ['Storybook public stories', counts.storybook.public],
      ['Storybook hidden stories', counts.storybook.hidden],
      ['Hidden visual parity stories', counts.storybook.visualParity],
      ['Implementation stories', counts.storybook.implementation]
    );
  }

  const width = Math.max(...rows.map(([label]) => label.length));
  for (const [label, value] of rows) console.log(`${label.padEnd(width)}  ${value}`);
}

const counts = await getCounts();

assert(
  counts.componentImplementations === counts.componentTypeContracts &&
    counts.componentImplementations === counts.componentEntryExports,
  `Component implementation/type/export counts differ: ${counts.componentImplementations}/${counts.componentTypeContracts}/${counts.componentEntryExports}`
);
assert(
  counts.workspace.private && counts.workspace.exportedSubpaths.length === 0,
  'The workspace root must remain a private orchestrator without consumer export subpaths.',
);
assert(
  Object.values(counts.packages).every(
    (ownerPackage) =>
      !ownerPackage.private &&
      ownerPackage.version === counts.workspace.version &&
      ownerPackage.registry === 'https://npm.pkg.github.com' &&
      ownerPackage.access === 'restricted',
  ),
  'Core, Theme, and Product must remain publishable restricted GitHub Packages at the workspace version.',
);
assert(
  counts.packageProjection.uniqueSourceEntries === counts.componentEntryExports
    && counts.packageProjection.uniqueNamedExports === counts.namedPublicExports,
  'Generated owner-package canonical union must equal the generated local workspace entry.',
);
assert(
  counts.robotics.name === '@lk-design-system/lds-robotics-ui' && counts.robotics.refStatus === 'published',
  'The Robotics inventory must come from the published external surface contract.',
);

if (args.has('--check-docs')) await checkDocs(counts);

if (args.has('--json')) console.log(JSON.stringify(counts, null, 2));
else printTable(counts);
