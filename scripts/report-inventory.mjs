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

function exportedNamesFromEntry(source) {
  const names = [];
  for (const match of source.matchAll(/^export\s+\{\s*([^}]+?)\s*\}\s+from\s+'\.\.\/components\/([^']+?)\.jsx';$/gm)) {
    names.push(...match[1].split(',').map((item) => item.trim().split(/\s+as\s+/)[0]));
  }
  return names;
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
  const internalModulePaths = new Set((classification.internalModules || []).map((row) => row.path));
  const componentJsx = (await collect('components', (rel) => rel.endsWith('.jsx'))).filter(
    (rel) => !internalModulePaths.has(rel),
  );
  const componentDts = (await collect('components', (rel) => rel.endsWith('.d.ts'))).filter(
    (rel) => !internalModulePaths.has(rel.replace(/\.d\.ts$/, '.jsx')),
  );
  const groups = await readdir(path.join(root, 'components'), { withFileTypes: true });
  const srcIndex = await read('src/index.js');
  const entryExports = srcIndex.split('\n').filter((line) => line.startsWith('export {'));
  const namedPublicExports = new Set(exportedNamesFromEntry(srcIndex));
  const storybook = await getStorybookCounts();

  return {
    componentImplementations: componentJsx.length,
    componentTypeContracts: componentDts.length,
    componentEntryExports: entryExports.length,
    namedPublicExports: namedPublicExports.size,
    componentGroups: groups.filter((entry) => entry.isDirectory()).length,
    storybook,
  };
}

async function checkDocs(counts) {
  assert(counts.storybook, 'storybook-static/index.json is required. Run build:storybook before check:inventory.');

  const expectations = [
    ['readme.md', `${counts.storybook.public}개 story`],
    ['readme.md', `${counts.componentEntryExports}개의 React 컴포넌트 소스 파일`],
    ['docs/REPOSITORY_INVENTORY.md', `React 컴포넌트 소스 파일: ${counts.componentImplementations}개`],
    ['docs/REPOSITORY_INVENTORY.md', `공개 named export: ${counts.namedPublicExports}개`],
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

  assert(missing.length === 0, `Inventory documentation is stale:\n${missing.join('\n')}`);
}

function printTable(counts) {
  const rows = [
    ['Component implementations', counts.componentImplementations],
    ['Component type contracts', counts.componentTypeContracts],
    ['Component entry exports', counts.componentEntryExports],
    ['Named public exports', counts.namedPublicExports],
    ['Component groups', counts.componentGroups],
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

if (args.has('--check-docs')) await checkDocs(counts);

if (args.has('--json')) console.log(JSON.stringify(counts, null, 2));
else printTable(counts);
