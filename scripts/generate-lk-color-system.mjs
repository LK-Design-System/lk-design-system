/**
 * Generate the complete LK color runtime from tokens/source.json.
 *
 * tokens/source.json is the only editable runtime source. WDS exports remain
 * reference evidence and are never read by this generator.
 *
 * Emits (regenerable, do not hand-edit):
 *   tokens/color-atomic.css
 *   tokens/color-semantic.css
 *   tokens/color-components.css
 *   stories/color-system.data.js
 *
 * Use --check to fail when committed outputs drift from the source contract.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const SOURCE_PATH = 'tokens/source.json';
const source = JSON.parse(readFileSync(SOURCE_PATH, 'utf8'));
const checkOnly = process.argv.includes('--check');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function generatedHeader(title) {
  return `/* ==========================================================================
   LK ROBOTICS — ${title} (GENERATED — do not hand-edit)
   --------------------------------------------------------------------------
   Source of truth: ${SOURCE_PATH}
   Regenerate: node scripts/generate-lk-color-system.mjs
   ========================================================================== */`;
}

function renderBlock(selector, declarations) {
  return `${selector} {\n${declarations.map(([name, value]) => `  ${name}: ${value};`).join('\n')}\n}`;
}

function writeOrCheck(path, contents) {
  const normalized = `${contents.trimEnd()}\n`;
  if (checkOnly) {
    const current = readFileSync(path, 'utf8').replaceAll('\r\n', '\n');
    assert(current === normalized, `${path} has drifted from ${SOURCE_PATH}. Run npm run generate:colors.`);
    return;
  }
  writeFileSync(path, normalized);
}

const colorRamps = source.primitive?.colorRamps;
assert(colorRamps && typeof colorRamps === 'object', 'tokens/source.json is missing primitive.colorRamps.');

const atomicDeclarations = [];
const atomicData = {};
for (const [family, definition] of Object.entries(colorRamps)) {
  assert(definition.label && definition.tokens, `primitive.colorRamps.${family} must include label and tokens.`);
  atomicData[family] = { label: definition.label, steps: [] };
  for (const [step, token] of Object.entries(definition.tokens)) {
    assert(token.css && token.$value, `Atomic color ${family}.${step} must include css and $value.`);
    atomicDeclarations.push([token.css, token.$value]);
    atomicData[family].steps.push(Number(step));
  }
}

const atomicCss = `${generatedHeader(`Atomic color ramps — ${Object.keys(colorRamps).length} families / ${atomicDeclarations.length} tokens`)}
${renderBlock(':root', atomicDeclarations)}`;
writeOrCheck('tokens/color-atomic.css', atomicCss);

const colorRoles = source.semantic?.colorRoles;
assert(colorRoles && typeof colorRoles === 'object', 'tokens/source.json is missing semantic.colorRoles.');

const lightDeclarations = [];
const darkDeclarations = [];
const semanticData = [];
const semanticGroups = {};
for (const [name, token] of Object.entries(colorRoles)) {
  assert(token.css && token.modes?.light && token.modes?.dark, `Semantic color ${name} must include css and light/dark modes.`);
  lightDeclarations.push([token.css, token.modes.light]);
  darkDeclarations.push([token.css, token.modes.dark]);
  semanticData.push(name);
  const group = token.group || name.split('-')[0];
  (semanticGroups[group] ||= []).push(name);
}

const lightSelector = source.modes?.light?.selector || ':root, [data-theme="light"], .theme-light';
const darkSelector = source.modes?.dark?.selector || '[data-theme="dark"], .theme-dark';
const autoSelector = source.modes?.auto?.selector || '[data-theme="auto"], .theme-auto';
const semanticCss = `${generatedHeader(`Semantic color roles — ${semanticData.length} tokens / light and dark`)}
${renderBlock(lightSelector, lightDeclarations)}

${renderBlock(darkSelector, darkDeclarations)}

@media (prefers-color-scheme: dark) {
${renderBlock(`  ${autoSelector}`, darkDeclarations).split('\n').map((line, index) => index === 0 ? line : `  ${line}`).join('\n')}
}`;
writeOrCheck('tokens/color-semantic.css', semanticCss);

const componentLightDeclarations = [];
const componentDarkDeclarations = [];
for (const [componentName, component] of Object.entries(source.component || {})) {
  for (const [tokenName, token] of Object.entries(component?.tokens || {})) {
    if (!token?.generated) continue;
    const lightValue = token.modes?.light || token.$value;
    const darkValue = token.modes?.dark || token.$value;
    assert(token.$type === 'color' && token.css && lightValue && darkValue, `Generated component color ${componentName}.${tokenName} is incomplete.`);
    componentLightDeclarations.push([token.css, lightValue]);
    componentDarkDeclarations.push([token.css, darkValue]);
  }
}
assert(componentLightDeclarations.length > 0, 'No generated component color tokens were found.');
const componentCss = `${generatedHeader(`Component color contracts — ${componentLightDeclarations.length} tokens`)}
${renderBlock(lightSelector, componentLightDeclarations)}

${renderBlock(darkSelector, componentDarkDeclarations)}

@media (prefers-color-scheme: dark) {
${renderBlock(`  ${autoSelector}`, componentDarkDeclarations).split('\n').map((line, index) => index === 0 ? line : `  ${line}`).join('\n')}
}`;
writeOrCheck('tokens/color-components.css', componentCss);

const statusFamilies = {
  info: ['status-info-foreground', 'status-info-surface', 'status-info-border', 'status-info-text'],
  positive: ['status-positive-foreground', 'status-positive-surface', 'status-positive-border', 'status-positive-text'],
  cautionary: ['status-cautionary-foreground', 'status-cautionary-surface', 'status-cautionary-border', 'status-cautionary-text'],
  negative: ['status-negative-foreground', 'status-negative-surface', 'status-negative-border', 'status-negative-text'],
  neutral: ['status-neutral-surface', 'status-neutral-border', 'status-neutral-text'],
};
const dataModule = `// GENERATED by scripts/generate-lk-color-system.mjs — do not hand-edit.
// Source of truth: tokens/source.json
export const ATOMIC = ${JSON.stringify(atomicData, null, 2)};
export const SEMANTIC = ${JSON.stringify(semanticData)};
export const SEMANTIC_GROUPS = ${JSON.stringify(semanticGroups, null, 2)};
export const STATUS_FAMILIES = ${JSON.stringify(statusFamilies, null, 2)};
export const COLOR_SYSTEM_META = ${JSON.stringify({ source: SOURCE_PATH, atomicTokens: atomicDeclarations.length, semanticTokens: semanticData.length, componentTokens: componentLightDeclarations.length }, null, 2)};
`;
writeOrCheck('stories/color-system.data.js', dataModule);

console.log(`${checkOnly ? 'Validated' : 'Generated'} color system from ${SOURCE_PATH}: ${atomicDeclarations.length} atomic, ${semanticData.length} semantic, ${componentLightDeclarations.length} component.`);
