import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const css = (await Promise.all([
  'tokens/color-atomic.css',
  'tokens/color-semantic.css',
  'tokens/color-components.css',
  'tokens/components.css',
].map((file) => readFile(file, 'utf8')))).join('\n');

const pairs = [
  ['status info text', '--color-semantic-status-info-text', '--color-semantic-status-info-surface', 4.5],
  ['status positive text', '--color-semantic-status-positive-text', '--color-semantic-status-positive-surface', 4.5],
  ['status cautionary text', '--color-semantic-status-cautionary-text', '--color-semantic-status-cautionary-surface', 4.5],
  ['status negative text', '--color-semantic-status-negative-text', '--color-semantic-status-negative-surface', 4.5],
  ['badge signal', '--component-badge-signal-fg', '--component-badge-signal-bg', 4.5],
  ['badge navy', '--component-badge-navy-fg', '--component-badge-navy-bg', 4.5],
  ['badge steel', '--component-badge-steel-fg', '--component-badge-steel-bg', 4.5],
  ['badge positive', '--component-badge-positive-fg', '--component-badge-positive-bg', 4.5],
  ['badge cautionary', '--component-badge-cautionary-fg', '--component-badge-cautionary-bg', 4.5],
  ['badge negative', '--component-badge-negative-fg', '--component-badge-negative-bg', 4.5],
  ['button ghost text', '--component-button-ghost-fg', '--component-button-ghost-bg', 4.5],
  ['chip selected text', '--component-chip-fg-active', '--component-chip-bg-selected', 4.5],
  ['selected state text', '--color-semantic-label-normal', '--color-semantic-primary-surface-strong', 4.5],
  ['focus indicator on page', '--color-semantic-focus-indicator', '--color-semantic-background-normal-normal', 3],
  ['focus indicator on elevated', '--color-semantic-focus-indicator', '--color-semantic-background-elevated-normal', 3],
  ['status info text on surface', '--color-semantic-status-info-text', '--color-semantic-status-info-surface', 3],
  ['status positive text on surface', '--color-semantic-status-positive-text', '--color-semantic-status-positive-surface', 3],
  ['status cautionary text on surface', '--color-semantic-status-cautionary-text', '--color-semantic-status-cautionary-surface', 3],
  ['status negative text on surface', '--color-semantic-status-negative-text', '--color-semantic-status-negative-surface', 3],
];

function parseColor(value) {
  const rgb = value.match(/^rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i);
  if (rgb) return { r: Number(rgb[1]) / 255, g: Number(rgb[2]) / 255, b: Number(rgb[3]) / 255, a: rgb[4] == null ? 1 : Number(rgb[4]) };
  const srgb = value.match(/^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)$/i);
  if (srgb) return { r: Number(srgb[1]), g: Number(srgb[2]), b: Number(srgb[3]), a: srgb[4] == null ? 1 : Number(srgb[4]) };
  throw new Error(`Unsupported computed color: ${value}`);
}

function composite(foreground, background) {
  const a = foreground.a + background.a * (1 - foreground.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  return {
    r: (foreground.r * foreground.a + background.r * background.a * (1 - foreground.a)) / a,
    g: (foreground.g * foreground.a + background.g * background.a * (1 - foreground.a)) / a,
    b: (foreground.b * foreground.a + background.b * background.a * (1 - foreground.a)) / a,
    a,
  };
}

function luminance(color) {
  const channel = (value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
}

function ratio(a, b) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(`<style>${css}</style><div id="canvas"></div>`);

const failures = [];
const results = [];
for (const theme of ['light', 'dark']) {
  await page.evaluate(({ theme, pairs }) => {
    const canvas = document.getElementById('canvas');
    canvas.className = `theme-${theme}`;
    canvas.style.background = 'var(--color-semantic-background-normal-normal)';
    canvas.innerHTML = '';
    for (const [name, foreground, background] of pairs) {
      const item = document.createElement('div');
      item.dataset.name = name;
      item.style.color = `var(${foreground})`;
      item.style.background = `var(${background})`;
      item.textContent = 'Contrast specimen';
      canvas.appendChild(item);
    }
  }, { theme, pairs });

  const computed = await page.evaluate(() => {
    const canvas = document.getElementById('canvas');
    const canvasBackground = getComputedStyle(canvas).backgroundColor;
    return [...canvas.children].map((item) => ({
      name: item.dataset.name,
      foreground: getComputedStyle(item).color,
      background: getComputedStyle(item).backgroundColor,
      canvasBackground,
    }));
  });

  for (const sample of computed) {
    const definition = pairs.find(([name]) => name === sample.name);
    const threshold = definition[3];
    const canvasColor = parseColor(sample.canvasBackground);
    const background = composite(parseColor(sample.background), canvasColor);
    const foreground = composite(parseColor(sample.foreground), background);
    const contrast = ratio(foreground, background);
    results.push(`${theme} ${sample.name}: ${contrast.toFixed(2)}:1`);
    if (contrast + 0.01 < threshold) failures.push(`${theme} ${sample.name}: ${contrast.toFixed(2)}:1 < ${threshold}:1`);
  }
}

await browser.close();
if (failures.length > 0) throw new Error(`Color contrast failures:\n${failures.join('\n')}`);
console.log(`Validated ${results.length} light/dark color contrast pairs.\n${results.join('\n')}`);
