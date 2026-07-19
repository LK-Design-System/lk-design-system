import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const tokensRoot = path.join(root, 'tokens');
const assetsRoot = path.join(root, 'assets');

async function recreateDirectory(target) {
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
}

async function copyFiles(packageName, files) {
  const targetRoot = path.join(root, 'packages', packageName, 'tokens');
  await recreateDirectory(targetRoot);
  for (const file of files) {
    await cp(path.join(tokensRoot, file), path.join(targetRoot, file));
  }
}

async function copyAssetDirectories(packageName, directories) {
  const targetRoot = path.join(root, 'packages', packageName, 'assets');
  await recreateDirectory(targetRoot);
  for (const directory of directories) {
    await cp(path.join(assetsRoot, directory), path.join(targetRoot, directory), { recursive: true });
  }
}

const baseCss = await readFile(path.join(tokensRoot, 'base.css'), 'utf8');
const focusCss = await readFile(path.join(tokensRoot, 'focus.css'), 'utf8');
const componentsCss = await readFile(path.join(tokensRoot, 'components.css'), 'utf8');
const viewerDeclarations = componentsCss.match(/^\s*--component-viewer-[^;]+;\r?$/gm) || [];
const coreComponentsCss = componentsCss.replace(/^\s*--component-viewer-[^;]+;\r?$/gm, '');

await copyFiles('core', ['spacing.css', 'grid.css']);
await writeFile(path.join(root, 'packages', 'core', 'tokens', 'components.css'), coreComponentsCss);
await writeFile(path.join(root, 'packages', 'core', 'tokens', 'base.css'), [
  '/* Core reset and layout slice from tokens/base.css. */',
  '*, *::before, *::after { box-sizing: border-box; }',
  'html { -webkit-text-size-adjust: 100%; }',
  'p { margin: 0; text-wrap: pretty; }',
  'img { display: block; max-width: 100%; }',
  '.lk-container { max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter-lg); }',
  '.lk-read { max-width: var(--container-read); margin-inline: auto; padding-inline: var(--gutter); }',
  '.lk-keep { word-break: keep-all; }',
  '.lk-nums { font-variant-numeric: tabular-nums; }',
  '',
].join('\n'));
await writeFile(path.join(root, 'packages', 'core', 'tokens', 'focus.css'), focusCss.split('/* Map geometry owns')[0]);
await writeFile(path.join(root, 'packages', 'core', 'styles.css'), [
  '@import "./tokens/spacing.css";',
  '@import "./tokens/grid.css";',
  '@import "./tokens/components.css";',
  '@import "./tokens/base.css";',
  '@import "./tokens/focus.css";',
  '',
].join('\n'));

await copyFiles('theme', ['fonts.css', 'color-atomic.css', 'color-semantic.css', 'color-components.css', 'typography.css', 'effects.css']);
await writeFile(path.join(root, 'packages', 'theme', 'tokens', 'base.css'), [
  '/* Theme and brand slice from tokens/base.css. */',
  'html { color-scheme: light; }',
  'body {',
  '  margin: 0;',
  '  font-family: var(--font-sans);',
  '  font-size: var(--fs-body);',
  '  line-height: var(--lh-body);',
  '  letter-spacing: var(--ls-body);',
  '  color: var(--color-semantic-label-normal);',
  '  background: var(--color-semantic-background-normal-normal);',
  '  -webkit-font-smoothing: antialiased;',
  '  -moz-osx-font-smoothing: grayscale;',
  '  text-rendering: optimizeLegibility;',
  '}',
  'h1, h2, h3, h4, h5, h6 { margin: 0; font-weight: var(--fw-bold); color: var(--color-semantic-label-strong); word-break: keep-all; text-wrap: balance; }',
  'h1 { font-size: var(--fs-h1); line-height: var(--lh-h1); letter-spacing: var(--ls-h1); }',
  'h2 { font-size: var(--fs-h2); line-height: var(--lh-h2); letter-spacing: var(--ls-h2); }',
  'h3 { font-size: var(--fs-h3); line-height: var(--lh-h3); letter-spacing: var(--ls-h3); }',
  'h4 { font-size: var(--fs-h4); line-height: var(--lh-h4); letter-spacing: var(--ls-h4); }',
  'h5 { font-size: var(--fs-h5); line-height: var(--lh-h5); letter-spacing: var(--ls-h5); }',
  'a { color: var(--color-semantic-primary-normal); text-decoration: none; transition: color var(--dur-fast) var(--ease-out), opacity var(--dur-fast) var(--ease-out); }',
  'a:hover { opacity: 0.8; }',
  '::selection { background: var(--color-semantic-primary-surface-strong); }',
  '.lk-overline { font-size: var(--fs-caption); font-weight: var(--fw-bold); letter-spacing: var(--ls-overline); text-transform: uppercase; color: var(--color-semantic-label-alternative); }',
  '.lk-overline--signal { color: var(--color-semantic-primary-normal); }',
  '.lk-overline--ink { color: var(--color-semantic-label-strong); }',
  '.lk-overline--on-dark { color: rgba(255,255,255,0.60); }',
  '.lk-overline--on-dark.lk-overline--signal { color: var(--color-semantic-primary-normal); }',
  '.lk-overline--on-dark.lk-overline--ink { color: #fff; }',
  '',
].join('\n'));
await writeFile(path.join(root, 'packages', 'theme', 'styles.css'), [
  '@import "./tokens/fonts.css";',
  '@import "./tokens/color-atomic.css";',
  '@import "./tokens/color-semantic.css";',
  '@import "./tokens/color-components.css";',
  '@import "./tokens/typography.css";',
  '@import "./tokens/effects.css";',
  '@import "./tokens/base.css";',
  '',
].join('\n'));

await recreateDirectory(path.join(root, 'packages', 'product', 'tokens'));
await writeFile(path.join(root, 'packages', 'product', 'styles.css'), '/* Product currently has no dedicated CSS projection. */\n');

await recreateDirectory(path.join(root, 'packages', 'robotics-ui', 'tokens'));
await writeFile(path.join(root, 'packages', 'robotics-ui', 'tokens', 'components.css'), `:root {\n${viewerDeclarations.join('\n')}\n}\n`);
await writeFile(path.join(root, 'packages', 'robotics-ui', 'tokens', 'focus.css'), `/* Map geometry focus slice from tokens/focus.css. */\n/* Map geometry owns${focusCss.split('/* Map geometry owns')[1] || ''}`);
await writeFile(path.join(root, 'packages', 'robotics-ui', 'styles.css'), [
  '@import "./tokens/components.css";',
  '@import "./tokens/focus.css";',
  '',
].join('\n'));

await recreateDirectory(path.join(root, 'packages', 'compat', 'tokens'));
await recreateDirectory(path.join(root, 'packages', 'compat', 'assets'));
await cp(tokensRoot, path.join(root, 'packages', 'compat', 'tokens'), { recursive: true });
await cp(assetsRoot, path.join(root, 'packages', 'compat', 'assets'), { recursive: true });
await cp(path.join(root, 'styles.css'), path.join(root, 'packages', 'compat', 'styles.css'));

await copyAssetDirectories('core', ['icons', 'source']);
await copyAssetDirectories('theme', ['brand', 'fonts']);
await copyAssetDirectories('product', ['industry', 'products', 'tech']);
await recreateDirectory(path.join(root, 'packages', 'robotics-ui', 'assets'));

console.log('Projected Wave 1 package CSS and asset ownership while preserving the compatibility CSS and asset surface.');
