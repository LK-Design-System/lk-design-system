import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = process.cwd();
const staticDir = path.join(root, 'storybook-static');
const tolerance = 1;

function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.webp')) return 'image/webp';
  if (filePath.endsWith('.woff2')) return 'font/woff2';
  return 'application/octet-stream';
}

function startStaticServer() {
  const server = createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
      const safePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '') || 'index.html';
      const filePath = path.resolve(staticDir, safePath);
      if (!filePath.startsWith(staticDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'content-type': contentType(filePath) });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}

function assertClose(label, actual) {
  if (Math.abs(actual) > tolerance) {
    throw new Error(`${label} expected within ${tolerance}px, received ${actual}px`);
  }
}

function assertAtLeast(label, actual, expected) {
  if (actual < expected) {
    throw new Error(`${label} expected at least ${expected}px, received ${actual}px`);
  }
}

// An edge-aligned bubble shorter than its trigger cannot both point exactly at
// the trigger centre and keep the arrow on its flat edge. In that case the arrow
// must still lean toward the trigger — never sit at the bubble centre, and never
// overshoot past the trigger centre.
function assertTowardTarget(label, measurement) {
  const reach = measurement.targetHeight / 2 - measurement.bubbleHeight / 2;
  if (reach <= tolerance) {
    assertClose(`${label} points at target`, measurement.arrowCenterVsTargetCenterY);
    return;
  }
  const fromBubbleCentre = measurement.arrowCenterVsBubbleCenterY;
  const towardTarget = Math.sign(measurement.arrowCenterVsTargetCenterY) !== Math.sign(fromBubbleCentre);
  if (Math.abs(fromBubbleCentre) <= tolerance || !towardTarget) {
    throw new Error(
      `${label} must lean toward the trigger centre, but it sits ${fromBubbleCentre}px from the bubble centre `
      + `while the trigger centre is ${-measurement.arrowCenterVsTargetCenterY}px away`,
    );
  }
}

async function getTooltipStoryId() {
  const indexPath = path.join(staticDir, 'index.json');
  const index = JSON.parse(await readFile(indexPath, 'utf8'));
  const story = Object.values(index.entries).find(
    (entry) =>
      entry.type === 'story' &&
      entry.importPath === './stories/ContentTooltip.stories.jsx' &&
      entry.exportName === 'TooltipPatterns'
  );
  if (!story) throw new Error('Unable to find TooltipPatterns in Storybook index. Run npm run build:storybook first.');
  return story.id;
}

async function main() {
  const id = await getTooltipStoryId();
  const { server, origin } = await startStaticServer();
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({ viewport: { width: 1180, height: 960 }, deviceScaleFactor: 1 });
    await page.goto(`${origin}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'load' });
    await page.waitForSelector('[role="tooltip"][aria-hidden="false"] [data-lds-tooltip-surface]');
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
    });
    await page.waitForTimeout(600);

    const measurements = await page.evaluate(() => {
      function rect(el) {
        const r = el.getBoundingClientRect();
        return {
          top: r.top,
          right: r.right,
          bottom: r.bottom,
          left: r.left,
          width: r.width,
          height: r.height,
          cx: r.left + r.width / 2,
          cy: r.top + r.height / 2,
        };
      }

      const section = Array.from(document.querySelectorAll('section')).find((node) =>
        node.innerText.includes('화살표 세로·가로 정렬')
      );
      if (!section) throw new Error('Tooltip alignment section is missing.');

      return Array.from(section.querySelectorAll('[role="tooltip"]')).map((tip) => {
        const wrapper = tip.parentElement;
        const target = Array.from(wrapper.children).find((child) => child !== tip);
        const surface = tip.querySelector(':scope > svg[data-lds-tooltip-surface]');
        const paths = surface?.querySelectorAll(':scope > path');
        if (!surface || paths.length !== 1) {
          throw new Error('Tooltip body and pointer must render as one SVG path.');
        }
        if (tip.querySelector(':scope > span[aria-hidden="true"]')) {
          throw new Error('Tooltip must not restore a detached arrow element.');
        }
        const bubbleRect = rect(tip);
        const targetRect = rect(target);
        const shapeRect = rect(paths[0]);
        const arrowAxis = Number(surface.dataset.arrowAxis);
        const arrowHeight = Number(surface.dataset.arrowHeight);
        const placement = tip.dataset.placement;
        const arrowPoint = placement === 'top'
          ? { cx: bubbleRect.left + arrowAxis, cy: bubbleRect.bottom + arrowHeight }
          : placement === 'bottom'
            ? { cx: bubbleRect.left + arrowAxis, cy: bubbleRect.top - arrowHeight }
            : placement === 'left'
              ? { cx: bubbleRect.right + arrowHeight, cy: bubbleRect.top + arrowAxis }
              : { cx: bubbleRect.left - arrowHeight, cy: bubbleRect.top + arrowAxis };
        return {
          label: tip.innerText.trim().replace(/\s+/g, ' '),
          // Along-edge overhang must stay at zero. The path may extend only on
          // the placement axis, toward the trigger.
          arrowOverhangY: Math.max(0, bubbleRect.top - shapeRect.top, shapeRect.bottom - bubbleRect.bottom),
          arrowOverhangX: Math.max(0, bubbleRect.left - shapeRect.left, shapeRect.right - bubbleRect.right),
          bubbleHeight: bubbleRect.height,
          targetHeight: targetRect.height,
          bubbleWidth: bubbleRect.width,
          targetWidth: targetRect.width,
          arrowCenterVsBubbleCenterX: arrowPoint.cx - bubbleRect.cx,
          arrowCenterVsBubbleCenterY: arrowPoint.cy - bubbleRect.cy,
          arrowCenterVsTargetCenterX: arrowPoint.cx - targetRect.cx,
          arrowCenterVsTargetCenterY: arrowPoint.cy - targetRect.cy,
          bubbleLeftVsTargetLeft: bubbleRect.left - targetRect.left,
          bubbleCenterVsTargetCenterX: bubbleRect.cx - targetRect.cx,
          bubbleRightVsTargetRight: bubbleRect.right - targetRect.right,
          bubbleTopVsTargetTop: bubbleRect.top - targetRect.top,
          bubbleCenterVsTargetCenterY: bubbleRect.cy - targetRect.cy,
          bubbleBottomVsTargetBottom: bubbleRect.bottom - targetRect.bottom,
        };
      });
    });

    if (measurements.length !== 6) {
      throw new Error(`Expected 6 tooltip alignment examples, received ${measurements.length}.`);
    }

    const [left, center, right, top, middle, bottom] = measurements;
    // Arrow must point AT the target centre in every alignment (edge-aligned
    // bubbles offset the arrow back over the target, not to the bubble centre).
    assertClose('vertical leading arrow points at target', left.arrowCenterVsTargetCenterX);
    assertClose('vertical center arrow points at target', center.arrowCenterVsTargetCenterX);
    assertClose('vertical trailing arrow points at target', right.arrowCenterVsTargetCenterX);
    assertClose('vertical center arrow centered in bubble', center.arrowCenterVsBubbleCenterX);
    assertClose('vertical leading bubble left aligned to target', left.bubbleLeftVsTargetLeft);
    assertClose('vertical center bubble centered to target', center.bubbleCenterVsTargetCenterX);
    assertClose('vertical trailing bubble right aligned to target', right.bubbleRightVsTargetRight);
    assertAtLeast('vertical leading bubble width makes alignment visible', left.bubbleWidth - left.targetWidth, 20);
    assertAtLeast('vertical center bubble width makes alignment visible', center.bubbleWidth - center.targetWidth, 20);
    assertAtLeast('vertical trailing bubble width makes alignment visible', right.bubbleWidth - right.targetWidth, 20);

    // The horizontal row pairs a 58px trigger with a one-line bubble, so the
    // trigger centre of an edge-aligned bubble falls outside the flat span the
    // arrow can occupy. Attachment wins over exact aim there (the same trade
    // Floating UI's arrow padding makes), so the arrow is required to move
    // toward the trigger centre without ever leaving the bubble edge.
    assertTowardTarget('horizontal top arrow', top);
    assertClose('horizontal center arrow points at target', middle.arrowCenterVsTargetCenterY);
    assertTowardTarget('horizontal bottom arrow', bottom);
    assertClose('horizontal center arrow centered in bubble', middle.arrowCenterVsBubbleCenterY);
    assertClose('horizontal top bubble top aligned to target', top.bubbleTopVsTargetTop);
    assertClose('horizontal center bubble centered to target', middle.bubbleCenterVsTargetCenterY);
    assertClose('horizontal bottom bubble bottom aligned to target', bottom.bubbleBottomVsTargetBottom);

    // An arrow that slides past the end of the edge it is attached to reads as a
    // detached wedge in mid-air. Only the along-edge axis counts: the arrow is
    // supposed to protrude on the other one, that is how it points at the
    // trigger. Top-placed bubbles carry the arrow on a horizontal edge, so the
    // first row is measured across X and the left/right row across Y.
    for (const measurement of [left, center, right]) {
      assertClose(`${measurement.label} arrow stays on the bubble edge`, measurement.arrowOverhangX);
    }
    for (const measurement of [top, middle, bottom]) {
      assertClose(`${measurement.label} arrow stays on the bubble edge`, measurement.arrowOverhangY);
    }

    console.log('Validated Tooltip arrow alignment examples.');
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
