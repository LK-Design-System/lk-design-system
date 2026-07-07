import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.resolve(process.argv[2] || process.env.WDS_ICON_SOURCE || 'C:/Users/MSI/Downloads/Icon');
const assetsRoot = path.join(repoRoot, 'assets', 'icons');
const componentFile = path.join(repoRoot, 'components', 'icon', 'Icon.jsx');
const typesFile = path.join(repoRoot, 'components', 'icon', 'Icon.d.ts');

const LEGACY_LINE_OPEN = '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
const LEGACY_LINE_CLOSE = '</g>';
const NAV_ALIASES = new Map([
  ['navigation-career', 'nav-career'],
  ['navigation-menu', 'nav-menu'],
  ['navigation-mypage', 'nav-mypage'],
  ['navigation-recruit', 'nav-recruit'],
  ['navigation-social', 'nav-social'],
  ['shape', 'nav-shape'],
]);

const ROBOTICS_LEGACY_ORDER = [
  'robot',
  'joystick',
  'waypoint',
  'route',
  'zone',
  'layers',
  'lidar',
  'battery',
  'battery-charging',
  'gauge',
  'signal',
  'crosshair',
  'map',
  'cpu',
  'volume-x',
  'maximize',
  'pause',
  'volume-2',
];

function toPosix(value) {
  return value.replaceAll(path.sep, '/');
}

function toKebab(value) {
  return value
    .replace(/^Name=/, '')
    .replace(/\.[^.]+$/, '')
    .split(',')[0]
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function iconNameFor(filePath, usedNames) {
  const rel = path.relative(sourceRoot, filePath);
  const folder = rel.split(path.sep)[0];
  const base = toKebab(path.basename(filePath));
  let name = base;

  if (folder === 'Navigation') {
    name = NAV_ALIASES.get(base) || `nav-${base.replace(/^navigation-/, '')}`;
  } else if (folder === 'Color') {
    name = `color-${base}`;
  }

  let candidate = name;
  let index = 2;
  while (usedNames.has(candidate)) {
    candidate = `${name}-${index}`;
    index += 1;
  }
  usedNames.add(candidate);
  return candidate;
}

async function collectFiles(dir, predicate, output = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) await collectFiles(fullPath, predicate, output);
    else if (entry.isFile() && predicate(fullPath)) output.push(fullPath);
  }
  return output.sort((a, b) => a.localeCompare(b, 'en'));
}

function normalizeMonoColor(svg) {
  return svg
    .replace(/\s(fill|stroke)=["'](?:#171719|#000|#000000|black|rgb\(23,\s*23,\s*25\))["']/gi, ' $1="currentColor"')
    .replace(/\s(color)=["'](?:#171719|#000|#000000|black|rgb\(23,\s*23,\s*25\))["']/gi, ' $1="currentColor"');
}

function normalizeSvg(svg, colorMode) {
  const trimmed = svg
    .replace(/<\?xml[^>]*>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
  const normalized = colorMode === 'monochrome' ? normalizeMonoColor(trimmed) : trimmed;
  const match = normalized.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/i);
  if (!match) throw new Error('Invalid SVG: missing <svg> root.');
  const attrs = match[1];
  const body = match[2].trim();
  const viewBox = attrs.match(/\bviewBox=(["'])(.*?)\1/i)?.[2] || '0 0 24 24';
  return { svg: `<svg${attrs}>${body}</svg>\n`, viewBox, body };
}

function objectLiteralFrom(source, constName) {
  const marker = `const ${constName} = `;
  const start = source.indexOf(marker);
  if (start < 0) return {};
  let i = start + marker.length;
  while (source[i] !== '{' && i < source.length) i += 1;
  if (source[i] !== '{') return {};

  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let end = i; end < source.length; end += 1) {
    const char = source[end];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return Function(`return (${source.slice(i, end + 1)});`)();
      }
    }
  }
  return {};
}

async function readLegacyIcons() {
  try {
    const source = await readFile(componentFile, 'utf8');
    const lineIcons = objectLiteralFrom(source, 'LINE_ICONS');
    const fillIcons = objectLiteralFrom(source, 'FILL_ICONS');
    const entries = [];

    for (const [name, body] of Object.entries(lineIcons)) {
      entries.push({
        name,
        source: 'lds-legacy',
        sourcePath: 'components/icon/Icon.jsx',
        viewBox: '0 0 24 24',
        body: `${LEGACY_LINE_OPEN}${body}${LEGACY_LINE_CLOSE}`,
      });
    }
    for (const [name, body] of Object.entries(fillIcons)) {
      entries.push({
        name,
        source: 'lds-legacy',
        sourcePath: 'components/icon/Icon.jsx',
        viewBox: '0 0 24 24',
        body,
      });
    }

    return entries;
  } catch {
    return [];
  }
}

function jsString(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function orderEntries(entries) {
  const byName = new Map(entries.map((entry) => [entry.name, entry]));
  const preferred = [
    ...entries.filter((entry) => entry.source !== 'lds-legacy' && !entry.name.startsWith('color-')).map((entry) => entry.name),
    ...entries.filter((entry) => entry.source !== 'lds-legacy' && entry.name.startsWith('color-')).map((entry) => entry.name),
    ...ROBOTICS_LEGACY_ORDER,
    ...entries.filter((entry) => entry.source === 'lds-legacy').map((entry) => entry.name),
  ];

  const seen = new Set();
  const names = [];
  for (const name of preferred) {
    if (!byName.has(name) || seen.has(name)) continue;
    seen.add(name);
    names.push(name);
  }
  return names.map((name) => byName.get(name));
}

function buildComponent(entries) {
  const iconNames = entries.map((entry) => entry.name);
  const iconSvg = Object.fromEntries(entries.map(({ name, viewBox, body }) => [name, { viewBox, body }]));

  return `// AUTO-GENERATED by scripts/generate-icons.mjs from assets/icons/*.svg.
import React from "react";

export const ICON_NAMES = ${JSON.stringify(iconNames)};

const ICON_SVG = ${JSON.stringify(iconSvg)};

/**
 * Icon renders an LDS glyph. Most icons inherit color through currentColor.
 */
export function Icon({ name, size = 24, color, title, style, className, ...rest }) {
  const icon = ICON_SVG[name];
  const ariaLabel = rest["aria-label"] || title || name;
  if (!icon) {
    return React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      style,
      className,
      ...rest,
    });
  }

  return React.createElement("svg", {
    width: size,
    height: size,
    viewBox: icon.viewBox,
    role: rest["aria-hidden"] ? undefined : "img",
    "aria-label": rest["aria-hidden"] ? undefined : ariaLabel,
    className,
    style: { display: "block", color, flexShrink: 0, ...style },
    dangerouslySetInnerHTML: { __html: icon.body },
    ...rest,
  });
}

export default Icon;
`;
}

function buildTypes(entries) {
  const names = entries.map((entry) => jsString(entry.name));
  const union = names.map((name) => `  | ${name}`).join('\n');
  const tuple = `[${names.join(', ')}]`;
  return `import React from "react";

export type IconName =
${union};

export interface IconProps extends React.SVGAttributes<SVGElement> {
  /** Name from ICON_NAMES. Unknown runtime names render an empty 24px SVG. */
  name: IconName;
  /** Rendered square size in px. Defaults to 24. */
  size?: number;
  /** Sets currentColor for monochrome glyphs. */
  color?: string;
  /** Accessible label override. */
  title?: string;
}

export const ICON_NAMES: readonly ${tuple};

export function Icon(props: IconProps): JSX.Element;
export default Icon;
`;
}

function buildManifest(entries, copiedFiles, rasterFiles) {
  return {
    source: {
      name: 'Base icon source / Icon',
      importedFrom: toPosix(sourceRoot),
      importedAt: new Date().toISOString().slice(0, 10),
      note: 'SVG files are normalized for LDS Icon usage. Color logo SVGs keep original fills and embedded image data.',
    },
    counts: {
      svgImported: copiedFiles.length,
      rasterCopied: rasterFiles.length,
      publicIconNames: entries.length,
      sourceIconNames: entries.filter((entry) => entry.source !== 'lds-legacy').length,
      ldsLegacyFallbacks: entries.filter((entry) => entry.source === 'lds-legacy').length,
    },
    icons: entries.map(({ name, source, sourcePath, assetPath, viewBox }) => ({
      name,
      source,
      sourcePath,
      assetPath,
      viewBox,
    })),
    rasterAssets: rasterFiles,
  };
}

await mkdir(assetsRoot, { recursive: true });
await rm(assetsRoot, { recursive: true, force: true });
await mkdir(assetsRoot, { recursive: true });

const svgFiles = await collectFiles(sourceRoot, (file) => file.toLowerCase().endsWith('.svg'));
const rasterSourceFiles = await collectFiles(sourceRoot, (file) => /\.(png|jpg|jpeg|webp)$/i.test(file));
const usedNames = new Set();
const importedEntries = [];
const copiedSvgFiles = [];

for (const file of svgFiles) {
  const rel = path.relative(sourceRoot, file);
  const folder = rel.split(path.sep)[0];
  const name = iconNameFor(file, usedNames);
  const raw = await readFile(file, 'utf8');
  const colorMode = folder === 'Color' ? 'color' : 'monochrome';
  const normalized = normalizeSvg(raw, colorMode);
  const assetRel = `assets/icons/${name}.svg`;
  await writeFile(path.join(repoRoot, assetRel), normalized.svg, 'utf8');
  copiedSvgFiles.push(assetRel);
  importedEntries.push({
    name,
    source: folder === 'Color' ? 'base-color' : folder === 'Navigation' ? 'base-navigation' : 'base-normal',
    sourcePath: toPosix(rel),
    assetPath: assetRel,
    viewBox: normalized.viewBox,
    body: normalized.body,
  });
}

const rasterFiles = [];
for (const file of rasterSourceFiles) {
  const rel = path.relative(sourceRoot, file);
  const destRel = `assets/icons/source/${toPosix(rel)}`;
  await mkdir(path.dirname(path.join(repoRoot, destRel)), { recursive: true });
  await cp(file, path.join(repoRoot, destRel));
  rasterFiles.push(destRel);
}

const legacyEntries = (await readLegacyIcons()).filter((entry) => !usedNames.has(entry.name));
for (const entry of legacyEntries) usedNames.add(entry.name);

const entries = orderEntries([...importedEntries, ...legacyEntries]);
const manifest = buildManifest(entries, copiedSvgFiles, rasterFiles);

await writeFile(path.join(assetsRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
await writeFile(componentFile, buildComponent(entries), 'utf8');
await writeFile(typesFile, buildTypes(entries), 'utf8');

console.log(`Imported ${copiedSvgFiles.length} source SVG icons into assets/icons.`);
console.log(`Copied ${rasterFiles.length} raster source asset(s).`);
console.log(`Generated ${entries.length} public Icon names (${legacyEntries.length} LDS legacy fallback(s)).`);
