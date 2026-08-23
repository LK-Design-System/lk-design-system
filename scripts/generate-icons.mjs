import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.resolve(process.argv[2] || process.env.WDS_ICON_SOURCE || 'C:/Users/MSI/Downloads/Icon');
const customIconSourceRoot = path.join(repoRoot, 'assets', 'icon-source-overrides');
const assetsRoot = path.join(repoRoot, 'assets', 'icons');
const componentFile = path.join(repoRoot, 'components', 'icon', 'Icon.jsx');
const typesFile = path.join(repoRoot, 'components', 'icon', 'Icon.d.ts');
const CUSTOM_ICON_SOURCES = new Map([
  // `model`은 Material Symbols `deployed_code`의 FILL=0 판이다. rc.62는 FILL=1(채움)을
  // 들여와 획 두께가 7.0이었고, rc.64는 "외곽선 변형이 없다"고 잘못 판단해 직접 그렸다.
  // 같은 이름의 두 변형을 반드시 구분해 받는다 — 원본 URL은 `.../deployed_code/default/`
  // (FILL=0)이고 `.../deployed_code/fill1/`이 채움이다.
  ['model', 'material-symbols'],
  ['unlink', 'material-symbols'],
  // 로봇·지도 의미는 base 원본에 없어 예전에는 stroke로 그린 fallback으로 들고
  // 있었다. Material Symbols outlined 원본으로 갈아 base와 같은 채운 path로 맞춘다.
  // 위쪽 이름이 LDS 이름, 주석이 원본 glyph다.
  ['robot', 'material-symbols'], // smart_toy
  ['joystick', 'material-symbols'], // sports_esports
  ['waypoint', 'material-symbols'], // pin_drop
  ['route', 'material-symbols'], // route
  ['zone', 'material-symbols'], // fence
  ['layers', 'material-symbols'], // layers
  ['lidar', 'material-symbols'], // sensors
  ['battery', 'material-symbols'], // battery_0_bar
  ['battery-charging', 'material-symbols'], // battery_charging_full
  ['gauge', 'material-symbols'], // speed
  ['signal', 'material-symbols'], // signal_cellular_alt
  ['crosshair', 'material-symbols'], // gps_fixed
  ['map', 'material-symbols'], // map
  ['cpu', 'material-symbols'], // memory
  ['volume-x', 'material-symbols'], // volume_off
  ['maximize', 'material-symbols'], // fullscreen
  ['volume-2', 'material-symbols'], // volume_up
]);

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

function customIconNameFor(filePath, usedNames) {
  const name = toKebab(path.basename(filePath));
  if (!name) throw new Error(`Custom icon has no usable name: ${filePath}`);
  if (usedNames.has(name)) throw new Error(`Custom icon name conflicts with the registry: ${name}`);
  usedNames.add(name);
  return name;
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

async function readManifestLegacyIcons() {
  try {
    const manifest = JSON.parse(await readFile(path.join(assetsRoot, 'manifest.json'), 'utf8'));
    const source = await readFile(componentFile, 'utf8');
    const iconSvg = objectLiteralFrom(source, 'ICON_SVG');
    const entries = [];

    for (const icon of manifest.icons ?? []) {
      if (icon?.source !== 'lds-legacy' || typeof icon.name !== 'string') continue;
      const definition = iconSvg[icon.name];
      if (!definition || typeof definition.body !== 'string') continue;
      entries.push({
        name: icon.name,
        source: 'lds-legacy',
        sourcePath: icon.sourcePath || 'assets/icons/manifest.json',
        viewBox: definition.viewBox || icon.viewBox || '0 0 24 24',
        body: definition.body,
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

/* The registry key of the glyph drawn when a caller asks for a name the
   registry does not have. \`blank\` is the existing dashed placeholder square,
   so an authoring mistake reads as "an icon slot with nothing in it" instead of
   silently collapsing to an empty <svg> that ships unnoticed. */
const MISSING_ICON_FALLBACK = "blank";

/* Development-only guard: bundlers replace \`process.env.NODE_ENV\` at build
   time — the same contract React itself relies on — so this branch disappears
   from production builds. The try/catch keeps it inert in environments that
   never define \`process\` at all. */
function isDevelopmentBuild() {
  try {
    return process.env.NODE_ENV !== "production";
  } catch {
    return false;
  }
}

/* Levenshtein distance, iterative single-row form. Only ever runs in a
   development build, once per unknown name. */
function iconNameDistance(source, target) {
  if (source === target) return 0;
  let previous = Array.from({ length: target.length + 1 }, (_unused, index) => index);
  for (let row = 1; row <= source.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= target.length; column += 1) {
      const substitution = previous[column - 1] + (source[row - 1] === target[column - 1] ? 0 : 1);
      current[column] = Math.min(current[column - 1] + 1, previous[column] + 1, substitution);
    }
    previous = current;
  }
  return previous[target.length];
}

/* Near misses first (typos), then registry names that contain the requested
   text (wrong vocabulary, e.g. "battery" for "battery-charging"). */
function suggestIconNames(name) {
  const requested = String(name).toLowerCase();
  const budget = Math.max(2, Math.round(requested.length / 3));
  const scored = [];
  for (const candidate of ICON_NAMES) {
    const distance = iconNameDistance(requested, candidate);
    const contains = candidate.includes(requested) || requested.includes(candidate);
    if (distance <= budget || contains) scored.push({ candidate, distance, contains });
  }
  return scored
    .sort((left, right) =>
      left.distance - right.distance ||
      Number(right.contains) - Number(left.contains) ||
      left.candidate.localeCompare(right.candidate))
    .slice(0, 5)
    .map((entry) => entry.candidate);
}

const warnedIconNames = new Set();

function warnUnknownIconName(name) {
  if (!isDevelopmentBuild() || warnedIconNames.has(name)) return;
  warnedIconNames.add(name);
  const suggestions = suggestIconNames(name);
  const hint = suggestions.length > 0
    ? \` Did you mean \${suggestions.map((candidate) => \`"\${candidate}"\`).join(", ")}?\`
    : " Check the exported ICON_NAMES for the available glyphs.";
  console.warn(
    \`[LDS] Icon: "\${name}" is not in the icon registry, so the "\${MISSING_ICON_FALLBACK}" placeholder glyph is rendered instead.\` + hint,
  );
}

/**
 * Icon renders an LDS glyph. Most icons inherit color through currentColor.
 *
 * Accessibility: icons are DECORATIVE by default (\`aria-hidden="true"\`, no
 * role), because a glyph almost always repeats meaning that visible text or the
 * wrapping control already carries. Never let the registry key leak into the
 * accessibility tree — "chevron-right" is a file name, not a name for a user.
 * Pass an explicit \`aria-label\` (or \`title\`) to promote the glyph to an
 * informative image; it then renders as \`role="img"\` with that accessible name.
 * Icon-only controls should get their name from the control (IconButton /
 * Button / Fab \`label\`), not from the glyph.
 */
export function Icon({
  name,
  size = 24,
  color,
  title,
  style,
  className,
  ...rest
}) {
  const icon = ICON_SVG[name];
  const {
    "aria-label": ariaLabelProp,
    "aria-hidden": ariaHiddenProp,
    role: roleProp,
    ...domProps
  } = rest;
  const explicitName = ariaLabelProp != null ? ariaLabelProp : title;
  const hiddenRequested =
    ariaHiddenProp === true || ariaHiddenProp === "true";
  const informative = explicitName != null && !hiddenRequested;
  const a11y = informative
    ? {
        role: roleProp != null ? roleProp : "img",
        "aria-label": explicitName,
        "aria-hidden": undefined,
      }
    : {
        role: roleProp,
        "aria-label": undefined,
        "aria-hidden": ariaHiddenProp !== undefined ? ariaHiddenProp : "true",
      };
  if (!icon) {
    /* An absent/empty \`name\` is a caller rendering "no icon" on purpose (an
       optional slot), so it stays an empty box with no console noise. A
       non-empty name that the registry does not know is an authoring mistake:
       warn in development and draw the placeholder so the gap is visible in a
       production build too. */
    const requested = typeof name === "string" ? name.trim() : "";
    if (requested === "") {
      return React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        style,
        className,
        ...domProps,
        ...a11y,
      });
    }
    warnUnknownIconName(requested);
    const fallback = ICON_SVG[MISSING_ICON_FALLBACK];
    return React.createElement("svg", {
      width: size,
      height: size,
      viewBox: fallback ? fallback.viewBox : "0 0 24 24",
      className,
      style: { display: "block", color, flexShrink: 0, ...style },
      "data-icon-missing": requested,
      ...(fallback ? { dangerouslySetInnerHTML: { __html: fallback.body } } : null),
      ...domProps,
      ...a11y,
    });
  }

  return React.createElement("svg", {
    width: size,
    height: size,
    viewBox: icon.viewBox,
    className,
    style: { display: "block", color, flexShrink: 0, ...style },
    dangerouslySetInnerHTML: { __html: icon.body },
    ...domProps,
    ...a11y,
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
  /**
   * Accessible name for an informative icon. Supplying it (or \`aria-label\`)
   * promotes the glyph from decorative to \`role="img"\` with this name.
   * Leave undefined for decorative icons — the registry \`name\` is never used
   * as an accessible name.
   */
  title?: string;
}

export const ICON_NAMES: readonly ${tuple};

// 전역 \`JSX\` 네임스페이스는 React 19 소비자 tsconfig에서 해석되지 않는다.
// 소비자 타입 검사가 보는 이름으로 낸다.
export function Icon(props: IconProps): React.JSX.Element;
export default Icon;
`;
}

function buildManifest(entries, rasterFiles) {
  const customSvgEntries = entries.filter((entry) => entry.isCustom === true);
  const wdsSvgEntries = entries.filter((entry) => entry.source !== 'lds-legacy' && entry.isCustom !== true);
  return {
    source: {
      name: 'Base icon source / Icon',
      importedFrom: toPosix(sourceRoot),
      importedAt: new Date().toISOString().slice(0, 10),
      note: 'SVG files are normalized for LDS Icon usage. Color logo SVGs keep original fills and embedded image data. Repository-local additions live in assets/icon-source-overrides/.',
    },
    counts: {
      // Keep the WDS import count separate from repository-local extensions so
      // alignment checks continue to prove every upstream glyph is present.
      svgImported: wdsSvgEntries.length,
      customSvgImported: customSvgEntries.length,
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

const svgFiles = await collectFiles(sourceRoot, (file) => file.toLowerCase().endsWith('.svg'));
const customSvgFiles = await collectFiles(customIconSourceRoot, (file) => file.toLowerCase().endsWith('.svg'));
const rasterSourceFiles = await collectFiles(sourceRoot, (file) => /\.(png|jpg|jpeg|webp)$/i.test(file));
const manifestLegacyEntries = await readManifestLegacyIcons();

// Resolve and read the source inventory before replacing generated output. A
// missing or unreadable source must leave the existing icon package intact.
await rm(assetsRoot, { recursive: true, force: true });
await mkdir(assetsRoot, { recursive: true });
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

for (const file of customSvgFiles) {
  const name = customIconNameFor(file, usedNames);
  const raw = await readFile(file, 'utf8');
  const normalized = normalizeSvg(raw, 'monochrome');
  const assetRel = `assets/icons/${name}.svg`;
  await writeFile(path.join(repoRoot, assetRel), normalized.svg, 'utf8');
  copiedSvgFiles.push(assetRel);
  importedEntries.push({
    name,
    source: CUSTOM_ICON_SOURCES.get(name) || 'lds-custom',
    isCustom: true,
    sourcePath: toPosix(path.relative(repoRoot, file)),
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

const legacyByName = new Map([
  ...manifestLegacyEntries,
  ...(await readLegacyIcons()).map((entry) => ({
    ...entry,
    assetPath: `assets/icons/${entry.name}.svg`,
    svg: `<svg viewBox="${entry.viewBox}" xmlns="http://www.w3.org/2000/svg">${entry.body}</svg>\n`,
  })),
].map((entry) => [entry.name, entry]));
const legacyEntries = [...legacyByName.values()].filter((entry) => !usedNames.has(entry.name));
for (const entry of legacyEntries) usedNames.add(entry.name);
for (const entry of legacyEntries) {
  if (entry.assetPath && entry.svg) {
    await writeFile(path.join(repoRoot, entry.assetPath), entry.svg, 'utf8');
  }
}

const entries = orderEntries([...importedEntries, ...legacyEntries]);
const manifest = buildManifest(entries, rasterFiles);

await writeFile(path.join(assetsRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
await writeFile(componentFile, buildComponent(entries), 'utf8');
await writeFile(typesFile, buildTypes(entries), 'utf8');

console.log(`Imported ${copiedSvgFiles.length} source SVG icons into assets/icons.`);
console.log(`Copied ${rasterFiles.length} raster source asset(s).`);
console.log(`Generated ${entries.length} public Icon names (${legacyEntries.length} LDS legacy fallback(s)).`);
