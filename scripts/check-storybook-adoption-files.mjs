import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
async function collectFiles(directory, prefix = '') {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) output.push(...await collectFiles(path.join(directory, entry.name), relative));
    else if (entry.isFile()) output.push(relative);
  }
  return output.sort();
}

const bundles = [
  { packageId: 'core', deployedPrefix: '' },
  { packageId: 'theme', deployedPrefix: 'packages/theme' },
  { packageId: 'product', deployedPrefix: 'packages/product' },
];
const pairs = [];
let projectedFileCount = 0;
for (const bundle of bundles) {
  const packageDocsRoot = path.join(root, 'packages', bundle.packageId, 'docs');
  const files = await collectFiles(packageDocsRoot);
  projectedFileCount += files.length;
  for (const relative of files) {
    pairs.push([
      path.posix.join('packages', bundle.packageId, 'docs', relative),
      path.posix.join('storybook-static', bundle.deployedPrefix, relative),
    ]);
  }
}
pairs.push(['packages/core/docs/manifest.json', 'storybook-static/design-system.json']);
pairs.push(['packages/core/docs/LDS_UI_ADOPTION_CONTRACT.schema.json', 'storybook-static/schemas/lds-ui-adoption-contract.schema.json']);
pairs.push(['packages/core/docs/adoption-report.schema.json', 'storybook-static/schemas/lds-ui-adoption-report.schema.json']);
pairs.push(['packages/core/docs/adoption-config.schema.json', 'storybook-static/schemas/lds-ui-adoption-config.schema.json']);
pairs.push(['packages/core/docs/adoption-workflow-evidence.schema.json', 'storybook-static/schemas/lds-ui-adoption-workflow-evidence.schema.json']);

const workflowEvidenceSchema = JSON.parse(await readFile(path.join(root, 'packages/core/docs/adoption-workflow-evidence.schema.json'), 'utf8'));
if (workflowEvidenceSchema.$id !== 'https://lk-design-system.github.io/lk-design-system/schemas/lds-ui-adoption-workflow-evidence.schema.json') {
  throw new Error('Workflow evidence schema $id must match its canonical Storybook Pages alias.');
}

for (const [sourcePath, deployedPath] of pairs) {
  let source;
  let deployed;
  try {
    [source, deployed] = await Promise.all([
      readFile(path.join(root, sourcePath)),
      readFile(path.join(root, deployedPath)),
    ]);
  } catch (error) {
    throw new Error(`Missing Storybook adoption surface for ${sourcePath}: ${error.message}`);
  }
  if (!source.equals(deployed)) {
    throw new Error(`Storybook adoption surface drift: ${deployedPath} must match ${sourcePath}.`);
  }
}

const staticRoot = path.join(root, 'storybook-static');
async function assertDeployedReference(reference, baseFile, owner) {
  if (/^https?:\/\//.test(reference)) return;
  let target;
  if (reference.startsWith('@lk-design-system/lds-core/docs/')) {
    target = path.join(staticRoot, reference.slice('@lk-design-system/lds-core/docs/'.length));
  } else if (reference.startsWith('@')) {
    throw new Error(`${owner} uses an unsupported public package reference: ${reference}.`);
  } else {
    target = path.resolve(path.dirname(baseFile), reference.split(/[?#]/, 1)[0]);
  }
  const relative = path.relative(staticRoot, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`${owner} escapes the Storybook public base: ${reference}.`);
  }
  await access(target).catch(() => {
    throw new Error(`${owner} has an unresolved Storybook reference: ${reference}.`);
  });
}

for (const bundle of bundles) {
  const deployedRoot = path.join(staticRoot, bundle.deployedPrefix);
  const checklistFile = path.join(deployedRoot, 'adoption-checklist.json');
  const checklist = JSON.parse(await readFile(checklistFile, 'utf8'));
  await assertDeployedReference(checklist.$schema, checklistFile, `${bundle.packageId} checklist schema`);
  const references = [
    ...checklist.facets.flatMap((facet) => facet.references),
    ...checklist.componentMapping.references,
  ];
  for (const reference of references) {
    await assertDeployedReference(reference, checklistFile, `${bundle.packageId} checklist`);
  }
  const exampleFile = path.join(deployedRoot, 'adoption-report.example.json');
  const example = JSON.parse(await readFile(exampleFile, 'utf8'));
  await assertDeployedReference(example.$schema, exampleFile, `${bundle.packageId} report example schema`);
}

console.log(`Validated ${projectedFileCount} files across four Storybook adoption bundles plus canonical aliases.`);
