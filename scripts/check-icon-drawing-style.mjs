import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

/**
 * 아이콘이 같은 손으로 그려졌는지 본다.
 *
 * 이름·정렬 검사는 있었지만 드로잉 스타일을 보는 검사는 없었다. 그래서 획 두께가
 * base의 3.5배인 글리프(`model`, 7.0)가 아무 경고 없이 들어왔고, 사이드바에서 그
 * 한 줄만 두껍고 어둡게 보였다. 사람 눈으로 잡던 것을 수치로 잡는다.
 *
 * 두 가지를 잰다.
 *
 * - 획 두께: 잉크 화소마다 가로·세로 연속 길이의 작은 쪽을 구하고 그 중위값을
 *   24 그리드로 환산한다. 선으로 그린 글리프의 굵기다.
 * - 잉크 비율: 잉크 화소가 상자에서 차지하는 비율. 외곽선과 solid를 가른다.
 *
 * 재는 방법은 캔버스 rasterize라 Storybook 시각 회귀와 같은 chromium을 쓴다.
 * `-fill` 계열은 solid가 의도이므로 잉크 비율에서 제외하고, 브랜드 마크는 원래
 * 색과 비율을 보존하는 예외라 둘 다 제외한다.
 */

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iconsRoot = path.join(repoRoot, 'assets', 'icons');

const THICKNESS = { min: 1.5, max: 3 };
// 상한만 둔다. 잉크 비율이 낮은 것은 결함이 아니다 — 화살표·더보기 점처럼 성긴
// 글리프가 정상적으로 3~8%에 있다. 이 축이 잡으려는 것은 solid로 채운 글리프다.
const COVERAGE_MAX = 36;

const reportMode = process.argv.includes('--report');
const dirArgument = process.argv.find((value) => value.startsWith('--dir='));
const targetRoot = dirArgument ? path.resolve(dirArgument.slice('--dir='.length)) : iconsRoot;

/** 브랜드 자산은 원본 색과 비율을 보존한다. 드로잉 규칙의 예외다. */
function isBrandAsset(name) {
  return name.startsWith('color-logo') || name.startsWith('logo-') || name === 'apple';
}

/**
 * solid로 그리는 것이 의도인 글리프.
 *
 * `-fill` 접미사가 대부분을 가르고, 접미사가 없는 것들은 여기 적는다 — 재생·정지
 * 삼각형처럼 채운 모양이 그 기호의 본래 형태이거나(`play`), 점·사각형처럼 글리프
 * 자체가 면인 경우다(`dot`). `-thick`은 같은 손이 굵게 그린 변형이고,
 * `nav-*`는 base-navigation 픽토그램이라 선 두께 축이 다르다.
 *
 * 목록에 없는 이름이 solid로 들어오면 검사가 막는다. 그 자리에서 할 일은 목록에
 * 이름을 더하는 것이 아니라, 왜 목적지 아이콘이 solid여야 하는지 답하는 것이다.
 */
const SOLID_BY_DESIGN = new Set([
  'dot', 'normal', 'play', 'pause', 'caret-up', 'caret-down', 'quote', 'android', 'agent',
]);

function isSolidVariant(name) {
  return name.endsWith('-fill') || name.includes('-thick') || name.startsWith('nav-') || SOLID_BY_DESIGN.has(name);
}

const files = (await readdir(targetRoot)).filter((file) => file.toLowerCase().endsWith('.svg'));
const icons = [];
for (const file of files) {
  const name = file.replace(/\.svg$/i, '');
  const svg = await readFile(path.join(targetRoot, file), 'utf8');
  icons.push({ name, svg });
}
if (icons.length === 0) {
  console.error(`No SVG files under ${path.relative(repoRoot, targetRoot) || targetRoot}.`);
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage();
const measured = await page.evaluate((input) => {
  const SIZE = 96;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const parser = new DOMParser();

  function measure(svgText) {
    const svg = parser.parseFromString(svgText, 'image/svg+xml').documentElement;
    const viewBox = (svg.getAttribute('viewBox') || '0 0 24 24').trim().split(/[\s,]+/).map(Number);
    const [minX, minY, width, height] = viewBox;
    const shapes = [...svg.querySelectorAll('path')];
    if (shapes.length === 0) return null;

    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.scale(SIZE / width, SIZE / height);
    ctx.translate(-minX, -minY);
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#000';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    let usesStroke = false;
    for (const node of shapes) {
      const geometry = node.getAttribute('d');
      if (!geometry) continue;
      const shape = new Path2D(geometry);
      const inherited = node.closest('g');
      const stroke = node.getAttribute('stroke') || inherited?.getAttribute('stroke');
      const fill = node.getAttribute('fill') ?? inherited?.getAttribute('fill');
      const strokeWidth = Number(node.getAttribute('stroke-width') || inherited?.getAttribute('stroke-width') || 0);
      if (stroke && stroke !== 'none') {
        usesStroke = true;
        ctx.lineWidth = strokeWidth || 2;
        ctx.stroke(shape);
      }
      if (!stroke || stroke === 'none' || (fill && fill !== 'none')) {
        ctx.fill(shape, node.getAttribute('fill-rule') === 'evenodd' ? 'evenodd' : 'nonzero');
      }
    }
    ctx.restore();

    const pixels = ctx.getImageData(0, 0, SIZE, SIZE).data;
    const ink = new Uint8Array(SIZE * SIZE);
    let inkCount = 0;
    for (let index = 0; index < SIZE * SIZE; index += 1) {
      if (pixels[index * 4 + 3] > 128) {
        ink[index] = 1;
        inkCount += 1;
      }
    }
    if (inkCount === 0) return null;

    const runs = [];
    for (let y = 0; y < SIZE; y += 1) {
      for (let x = 0; x < SIZE; x += 1) {
        if (!ink[y * SIZE + x]) continue;
        let left = x;
        while (left > 0 && ink[y * SIZE + left - 1]) left -= 1;
        let right = x;
        while (right < SIZE - 1 && ink[y * SIZE + right + 1]) right += 1;
        let top = y;
        while (top > 0 && ink[(top - 1) * SIZE + x]) top -= 1;
        let bottom = y;
        while (bottom < SIZE - 1 && ink[(bottom + 1) * SIZE + x]) bottom += 1;
        runs.push(Math.min(right - left + 1, bottom - top + 1));
      }
    }
    runs.sort((left, right) => left - right);
    const median = runs[Math.floor(runs.length / 2)];
    return {
      thickness: Math.round(median * (24 / SIZE) * 100) / 100,
      coverage: Math.round((inkCount / (SIZE * SIZE)) * 1000) / 10,
      usesStroke,
    };
  }

  return input.map((icon) => ({ name: icon.name, ...(measure(icon.svg) || { empty: true }) }));
}, icons);
await browser.close();

const failures = [];
for (const icon of measured) {
  if (icon.empty) continue;
  if (isBrandAsset(icon.name)) continue;
  if (icon.usesStroke) {
    failures.push(`${icon.name}: stroke로 그렸습니다. base set은 채운 path로 그립니다.`);
  }
  if (isSolidVariant(icon.name)) continue;
  if (icon.thickness < THICKNESS.min || icon.thickness > THICKNESS.max) {
    failures.push(`${icon.name}: 획 두께 ${icon.thickness} (허용 ${THICKNESS.min}–${THICKNESS.max}). base 외곽선보다 굵으면 같은 줄에서 그 글리프만 어둡게 보입니다.`);
  }
  if (icon.coverage > COVERAGE_MAX) {
    failures.push(`${icon.name}: 잉크 비율 ${icon.coverage}% (허용 ${COVERAGE_MAX}% 이하). solid로 그릴 의도라면 \`-fill\` 이름을 쓰거나 SOLID_BY_DESIGN에 근거와 함께 등록합니다.`);
  }
}

if (reportMode) {
  const rows = measured
    .filter((icon) => !icon.empty)
    .sort((left, right) => right.thickness - left.thickness);
  for (const icon of rows) {
    console.log(`${icon.name.padEnd(28)} thickness ${String(icon.thickness).padStart(5)}  ink ${String(icon.coverage).padStart(5)}%${icon.usesStroke ? '  stroke' : ''}`);
  }
}

const scope = path.relative(repoRoot, targetRoot) || 'assets/icons';
if (failures.length > 0 && !reportMode) {
  console.error(`Icon drawing style violations in ${scope}:`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

const checked = measured.filter((icon) => !icon.empty).length;
const thicknesses = measured.filter((icon) => !icon.empty && !isBrandAsset(icon.name)).map((icon) => icon.thickness).sort((a, b) => a - b);
const median = thicknesses[Math.floor(thicknesses.length / 2)];
console.log(`Validated icon drawing style: ${checked} glyphs in ${scope}, median stroke thickness ${median} on the 24 grid${failures.length > 0 ? `, ${failures.length} finding(s) reported` : ''}.`);
