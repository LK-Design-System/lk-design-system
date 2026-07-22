import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const componentsDir = path.join(root, 'components');
const srcDir = path.join(root, 'src');
const classificationPath = path.join(
  root,
  'docs',
  'references',
  'wds',
  'PUBLIC_EXPORT_CLASSIFICATION.json',
);
const roboticsExternalSurfacePath = path.join(
  root,
  'docs',
  'references',
  'package-split',
  'ROBOTICS_EXTERNAL_SURFACE.json',
);
const roboticsExternalPackage = '@lk-robotics/lds-robotics-ui';

const ownerLayers = ['core', 'theme', 'product', 'robotics'];

const groupOrder = [
  'brand',
  'buttons',
  'cards',
  'communication',
  'content',
  'data',
  'editor',
  'feedback',
  'forms',
  'icon',
  'layout',
  'navigation',
  'overlay',
  'robotics',
  'selection',
  'status',
  'viz',
];

const exportPattern = /^export\s+(?:function|const|let|var|class)\s+([A-Za-z_$][\w$]*)/gm;

function compareNames(a, b) {
  return a.localeCompare(b, 'en');
}

function compareGroups(a, b) {
  const ai = groupOrder.indexOf(a);
  const bi = groupOrder.indexOf(b);
  if (ai !== -1 || bi !== -1) {
    return (ai === -1 ? groupOrder.length : ai) - (bi === -1 ? groupOrder.length : bi)
      || compareNames(a, b);
  }
  return compareNames(a, b);
}

async function listComponentFiles() {
  const groups = await readdir(componentsDir, { withFileTypes: true });
  const groupNames = groups
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(compareGroups);

  const files = [];
  for (const group of groupNames) {
    const groupDir = path.join(componentsDir, group);
    const entries = (await readdir(groupDir, { withFileTypes: true }))
      .sort((a, b) => compareNames(a.name, b.name));
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.jsx')) {
        files.push({
          group,
          fileName: entry.name,
          fullPath: path.join(groupDir, entry.name),
          baseName: entry.name.slice(0, -'.jsx'.length),
        });
      }
    }
  }
  return files;
}

async function getNamedExports(file) {
  const source = await readFile(file.fullPath, 'utf8');
  const names = new Set();
  for (const match of source.matchAll(exportPattern)) {
    names.add(match[1]);
  }
  return [...names].sort(compareNames);
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function formatFile(file) {
  return toPosix(path.relative(root, file.fullPath));
}

function validateClassification(manifest, exportsByFile, externalRoboticsExports) {
  const errors = [];
  const groups = manifest?.groups;
  if (!Array.isArray(groups)) {
    throw new Error(
      `Invalid public export classification at ${toPosix(path.relative(root, classificationPath))}: `
        + 'expected a groups array.',
    );
  }

  const filesByExport = new Map();
  for (const file of exportsByFile) {
    for (const name of file.names) {
      const owners = filesByExport.get(name) ?? [];
      owners.push(file);
      filesByExport.set(name, owners);
    }
  }

  for (const [name, sourceFiles] of filesByExport) {
    if (sourceFiles.length > 1) {
      errors.push(
        `component export "${name}" is declared by multiple source files: `
          + sourceFiles.map(formatFile).join(', '),
      );
    }
  }

  const classificationsByExport = new Map();
  groups.forEach((group, groupIndex) => {
    const groupLabel = typeof group?.name === 'string' && group.name.length > 0
      ? group.name
      : `groups[${groupIndex}]`;
    const ownerLayer = group?.ownerLayer;

    if (!ownerLayers.includes(ownerLayer)) {
      errors.push(
        `${groupLabel} has invalid or missing ownerLayer "${String(ownerLayer)}"; `
          + `expected one of ${ownerLayers.join(', ')}`,
      );
    }

    if (!Array.isArray(group?.exports)) {
      errors.push(`${groupLabel} must define an exports array`);
      return;
    }

    group.exports.forEach((name, exportIndex) => {
      if (typeof name !== 'string' || name.length === 0) {
        errors.push(`${groupLabel}.exports[${exportIndex}] must be a non-empty string`);
        return;
      }

      const prior = classificationsByExport.get(name) ?? [];
      prior.push({ groupLabel, ownerLayer });
      classificationsByExport.set(name, prior);
    });
  });

  for (const [name, classifications] of classificationsByExport) {
    if (classifications.length > 1) {
      errors.push(
        `classification duplicates export "${name}" across: `
          + classifications.map(({ groupLabel }) => groupLabel).join(', '),
      );
    }
    if (!filesByExport.has(name) && !(classifications[0]?.ownerLayer === 'robotics' && externalRoboticsExports.has(name))) {
      errors.push(`classification contains stale export "${name}"`);
    }
  }

  for (const [name, sourceFiles] of filesByExport) {
    if (!classificationsByExport.has(name)) {
      errors.push(`classification is missing export "${name}" from ${formatFile(sourceFiles[0])}`);
    }
  }

  const ownerByExport = new Map();
  for (const [name, classifications] of classificationsByExport) {
    if (classifications.length === 1 && ownerLayers.includes(classifications[0].ownerLayer)) {
      ownerByExport.set(name, classifications[0].ownerLayer);
    }
  }

  for (const file of exportsByFile) {
    const assignments = file.names
      .map((name) => ({ name, ownerLayer: ownerByExport.get(name) }))
      .filter(({ ownerLayer }) => ownerLayer !== undefined);
    const fileOwnerLayers = [...new Set(assignments.map(({ ownerLayer }) => ownerLayer))];
    if (fileOwnerLayers.length > 1) {
      errors.push(
        `${formatFile(file)} assigns exports from one source file to multiple owner layers: `
          + assignments.map(({ name, ownerLayer }) => `${name}=${ownerLayer}`).join(', '),
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Public export classification validation failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):\n`
        + errors.map((error) => `- ${error}`).join('\n'),
    );
  }

  return ownerByExport;
}

function createEntryLines(files, declaration = false, externalSpecifiers = []) {
  const lines = [...header];
  for (const file of files) {
    const names = file.names.join(', ');
    const target = declaration ? file.baseName : file.fileName;
    const exportPath = toPosix(`../components/${file.group}/${target}`);
    lines.push(`export { ${names} } from '${exportPath}';`);
  }
  for (const specifier of externalSpecifiers) lines.push(`export * from '${specifier}';`);
  return `${lines.join('\n')}\n`;
}

const files = await listComponentFiles();
const exportsByFile = [];

const classification = JSON.parse(await readFile(classificationPath, 'utf8'));
const internalModulePaths = new Set(
  (classification.internalModules ?? []).map((module) => module.path),
);

for (const file of files) {
  if (internalModulePaths.has(formatFile(file))) continue;
  const names = await getNamedExports(file);
  if (names.length === 0) continue;
  exportsByFile.push({ ...file, names });
}
const roboticsExternalSurface = JSON.parse(await readFile(roboticsExternalSurfacePath, 'utf8'));
const roboticsExternalExports = new Set(
  (roboticsExternalSurface.entries ?? []).flatMap((entry) => entry.exports ?? []),
);
if (roboticsExternalSurface.package?.name !== roboticsExternalPackage || roboticsExternalExports.size === 0) {
  throw new Error(`Invalid Robotics external surface at ${toPosix(path.relative(root, roboticsExternalSurfacePath))}.`);
}
const ownerByExport = validateClassification(classification, exportsByFile, roboticsExternalExports);

const localRoboticsExports = new Set(
  exportsByFile
    .filter((file) => ownerByExport.get(file.names[0]) === 'robotics')
    .flatMap((file) => file.names),
);
if (localRoboticsExports.size > 0) {
  const mismatch = [...localRoboticsExports].filter((name) => !roboticsExternalExports.has(name))
    .concat([...roboticsExternalExports].filter((name) => !localRoboticsExports.has(name)));
  if (mismatch.length > 0) {
    throw new Error(`Robotics external surface drift: ${mismatch.sort(compareNames).join(', ')}.`);
  }
}

const header = [
  '// Auto-generated by scripts/generate-entry.mjs.',
  '// Do not edit this file directly.',
  '',
];

await mkdir(srcDir, { recursive: true });
const outputs = [
  {
    name: 'index',
    files: exportsByFile.filter((file) => ownerByExport.get(file.names[0]) !== 'robotics'),
    externalSpecifiers: [roboticsExternalPackage],
  },
  ...ownerLayers.map((ownerLayer) => ({
    name: ownerLayer,
    files: ownerLayer === 'robotics'
      ? []
      : exportsByFile.filter((file) => ownerByExport.get(file.names[0]) === ownerLayer),
    externalSpecifiers: ownerLayer === 'robotics' ? [roboticsExternalPackage] : [],
  })),
];

await Promise.all(outputs.flatMap(({ name, files: entryFiles, externalSpecifiers }) => [
  writeFile(path.join(srcDir, `${name}.js`), createEntryLines(entryFiles, false, externalSpecifiers), 'utf8'),
  writeFile(path.join(srcDir, `${name}.d.ts`), createEntryLines(entryFiles, true, externalSpecifiers), 'utf8'),
]));

const exportCount = exportsByFile.reduce((count, file) => count + file.names.length, 0);
const layerSummary = outputs
  .slice(1)
  .map(({ name, files: entryFiles }) => {
    const entryExportCount = entryFiles.reduce((count, file) => count + file.names.length, 0);
    return `${name}=${entryFiles.length} sources/${entryExportCount} exports`;
  })
  .join(', ');
console.log(
  `Generated ${exportsByFile.length} component source entries (${exportCount} named exports); ${layerSummary}.`,
);
