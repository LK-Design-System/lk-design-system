// Consumer-free contract tests for the promoted behavior engines:
// - @lk-design-system/lds-core/headless useMenuKeyboard (roving focus, typeahead, Escape stack)
// - components/overlay/anchored-overlay.js (useLightDismiss latch, useFloatingPosition, helpers)
// - components/overlay/dialog-focus.js (focus trap, restore, overlay stack, scroll lock)
// - components/forms/field-shared.js (field metadata, message priority, state tokens)
//
// Follows the repository harness precedent (scripts/check-consumer-smoke.mjs):
// bundle a fixture with esbuild, serve it locally, and drive real keyboard and
// pointer input through Playwright Chromium.
import { createReadStream } from 'node:fs';
import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import esbuild from 'esbuild';
import { chromium } from '@playwright/test';

const root = process.cwd();
const fixtureEntry = path.join(root, 'scripts', 'fixtures', 'engine-contracts', 'harness.jsx');
const outDir = path.join(root, 'visual-artifacts', 'engine-contracts');

let passed = 0;

function assert(condition, message) {
  if (!condition) throw new Error(`Engine contract violated: ${message}`);
  passed += 1;
}

function startStaticServer(dir) {
  const server = createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
      const safePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '') || 'index.html';
      const filePath = path.resolve(dir, safePath);
      if (!filePath.startsWith(dir)) {
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
      res.writeHead(200, {
        'content-type': filePath.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/javascript; charset=utf-8',
      });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, origin: `http://127.0.0.1:${server.address().port}` });
    });
  });
}

async function activeTestId(page) {
  return page.evaluate(() => document.activeElement?.getAttribute('data-testid') ?? document.activeElement?.tagName ?? 'none');
}

async function settleFrames(page, frames = 3) {
  await page.evaluate(async (count) => {
    for (let i = 0; i < count; i += 1) {
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    }
  }, frames);
}

async function testMenuKeyboard(page) {
  const trigger = page.getByTestId('menu-a-trigger');

  // Entry focus skips the data-menu-back item and lands on the first command.
  await trigger.click();
  await settleFrames(page);
  assert((await activeTestId(page)) === 'menu-a-item-Pause', 'entry focus must land on the first non-back menuitem');

  // Arrow navigation wraps across the full roving collection (including Back).
  await page.keyboard.press('ArrowUp');
  assert((await activeTestId(page)) === 'menu-a-back', 'ArrowUp from the first command reaches the back item');
  await page.keyboard.press('ArrowUp');
  assert((await activeTestId(page)) === 'menu-a-item-Stop', 'ArrowUp wraps from the top to the last item');
  await page.keyboard.press('ArrowDown');
  assert((await activeTestId(page)) === 'menu-a-back', 'ArrowDown wraps back to the top');
  await page.keyboard.press('End');
  assert((await activeTestId(page)) === 'menu-a-item-Stop', 'End focuses the last item');
  await page.keyboard.press('Home');
  assert((await activeTestId(page)) === 'menu-a-back', 'Home focuses the first roving item');

  // Typeahead: a single character advances past the current item.
  await page.keyboard.press('p');
  assert((await activeTestId(page)) === 'menu-a-item-Pause', 'single-character typeahead finds the next matching item');
  await page.waitForTimeout(600); // exceed the 500ms accumulation window
  await page.keyboard.press('p');
  assert((await activeTestId(page)) === 'menu-a-item-Patrol', 'after the 500ms window a fresh single character cycles to the next same-initial item');
  await page.waitForTimeout(600);

  // Typeahead: rapid characters accumulate into one refining query.
  await page.keyboard.press('p');
  await page.keyboard.press('a');
  await page.keyboard.press('r');
  assert((await activeTestId(page)) === 'menu-a-item-Park', 'accumulated "par" query refines to the exact match');
  await page.waitForTimeout(600);
  await page.keyboard.press('s');
  assert((await activeTestId(page)) === 'menu-a-item-Stop', 'the stale buffer is dropped after the idle timeout');

  // Escape closes and restores focus to the trigger.
  await page.keyboard.press('Escape');
  await settleFrames(page);
  assert(!(await page.getByTestId('menu-a-menu').isVisible().catch(() => false)), 'Escape closes the menu');
  assert((await activeTestId(page)) === 'menu-a-trigger', 'Escape restores focus to the trigger');

  // requestItemFocus('last') reserves the entry position.
  await page.getByTestId('menu-a-open-last').click();
  await settleFrames(page);
  assert((await activeTestId(page)) === 'menu-a-item-Stop', "requestItemFocus('last') moves the entry focus to the last item");
  await page.keyboard.press('Escape');
  await settleFrames(page);

  // Entry focus cancellation: keyboard navigation that lands before the queued
  // entry frame must win instead of being dragged back to the edge item.
  await page.getByTestId('menu-a-open-then-arrow').click();
  await settleFrames(page);
  assert((await activeTestId(page)) === 'menu-a-item-Pause', 'keyboard navigation cancels the queued entry focus frame');
  await page.keyboard.press('Escape');
  await settleFrames(page);

  // Tab closes without restoring focus to the trigger.
  await trigger.click();
  await settleFrames(page);
  await page.keyboard.press('Tab');
  await settleFrames(page);
  assert(!(await page.getByTestId('menu-a-menu').isVisible().catch(() => false)), 'Tab closes the menu');
  assert((await activeTestId(page)) !== 'menu-a-trigger', 'Tab does not drag focus back to the trigger');

  // Document-level Escape only closes the most recently opened menu (stack).
  await page.getByTestId('menu-a-trigger').click();
  await settleFrames(page);
  await page.getByTestId('menu-b-trigger').click();
  await settleFrames(page);
  assert(await page.getByTestId('menu-a-menu').isVisible(), 'both menus are open before the stack test');
  assert(await page.getByTestId('menu-b-menu').isVisible(), 'both menus are open before the stack test');
  await page.keyboard.press('Escape');
  await settleFrames(page);
  assert(!(await page.getByTestId('menu-b-menu').isVisible().catch(() => false)), 'Escape closes only the top of the menu stack');
  assert(await page.getByTestId('menu-a-menu').isVisible(), 'the lower menu stays open after the first Escape');
  await page.keyboard.press('Escape');
  await settleFrames(page);
  assert(!(await page.getByTestId('menu-a-menu').isVisible().catch(() => false)), 'the second Escape closes the remaining menu');
}

async function testLightDismiss(page) {
  const trigger = page.getByTestId('dismiss-a-trigger');
  const panel = page.getByTestId('dismiss-a-panel');

  // Escape with focus inside the anchor: dismiss, restore the trigger, and
  // latch it so open-on-focus does not immediately re-open the surface.
  await trigger.focus();
  assert(await panel.isVisible(), 'focusing the trigger opens the surface');
  await page.keyboard.press('Escape');
  await settleFrames(page, 4);
  assert(!(await panel.isVisible().catch(() => false)), 'Escape dismisses the surface');
  assert((await activeTestId(page)) === 'dismiss-a-trigger', 'Escape returns focus to the trigger it owns');
  assert((await page.getByTestId('dismiss-a-reason').innerText()) === 'escape', 'onDismiss receives the escape reason');
  await settleFrames(page, 4);
  assert(!(await panel.isVisible().catch(() => false)), 'the latch keeps the surface closed while focus stays on the trigger');

  // Leaving the anchor releases the latch; a deliberate Tab return re-opens.
  await page.keyboard.press('Tab');
  await settleFrames(page);
  await page.keyboard.press('Shift+Tab');
  await settleFrames(page);
  assert(await panel.isVisible(), 'after focus leaves and returns, open-on-focus works again');
  await page.keyboard.press('Escape');
  await settleFrames(page, 4);

  // Pointer-only session: Escape must not steal the caret.
  await page.getByTestId('outside-button').click();
  await settleFrames(page);
  await trigger.hover();
  assert(await panel.isVisible(), 'hover opens the surface');
  await page.keyboard.press('Escape');
  await settleFrames(page, 4);
  assert(!(await panel.isVisible().catch(() => false)), 'Escape dismisses a pointer-only session');
  assert((await activeTestId(page)) === 'outside-button', 'a pointer-only Escape leaves the caret where the user put it');

  // Outside press dismisses and lets the pressed target own the next focus.
  await page.mouse.move(0, 0); // leave the trigger so the next hover re-fires mouseenter
  await trigger.hover();
  assert(await panel.isVisible(), 'hover re-opens the surface');
  await page.getByTestId('outside-button').click();
  await settleFrames(page);
  assert(!(await panel.isVisible().catch(() => false)), 'outside pointerdown dismisses the surface');
  assert((await page.getByTestId('dismiss-a-reason').innerText()) === 'outside-press', 'onDismiss receives the outside-press reason');
  assert((await activeTestId(page)) === 'outside-button', 'outside dismissal does not restore focus to the trigger');

  // outsidePress: false disables pointer dismissal but keeps Escape.
  const lockedPanel = page.getByTestId('dismiss-locked-panel');
  await page.getByTestId('dismiss-locked-trigger').hover();
  assert(await lockedPanel.isVisible(), 'the outsidePress:false surface opens on hover');
  await page.getByTestId('outside-button').click();
  await settleFrames(page);
  assert(await lockedPanel.isVisible(), 'outsidePress:false ignores outside pointerdown');
  await page.keyboard.press('Escape');
  await settleFrames(page, 4);
  assert(!(await lockedPanel.isVisible().catch(() => false)), 'Escape still dismisses an outsidePress:false surface');
}

async function testFloatingPosition(page) {
  await page.getByTestId('float-bottom-anchor').click();
  await settleFrames(page, 4);
  const bottomPanel = page.getByTestId('float-bottom-panel');
  assert((await bottomPanel.getAttribute('data-placement')) === 'bottom', 'a roomy anchor keeps the requested bottom placement');
  const maxHeight = await bottomPanel.getAttribute('data-maxheight');
  assert(maxHeight !== 'null' && Number(maxHeight) > 0, 'an open panel reports the available max height');
  await page.getByTestId('float-bottom-anchor').click();

  await page.getByTestId('float-flip-anchor').click();
  await settleFrames(page, 6);
  assert(
    (await page.getByTestId('float-flip-panel').getAttribute('data-placement')) === 'top',
    'an anchor without room below flips the panel to the top',
  );
  await page.getByTestId('float-flip-anchor').click();

  await page.getByTestId('float-fixed-anchor').click();
  await settleFrames(page, 4);
  const fixedAnchor = page.getByTestId('float-fixed-anchor');
  const fixedPanel = page.getByTestId('float-fixed-panel');
  const fixedX = await fixedPanel.getAttribute('data-x');
  const fixedY = await fixedPanel.getAttribute('data-y');
  assert(fixedX !== 'null' && fixedY !== 'null', 'the fixed strategy reports viewport coordinates');
  const [anchorBox, panelBox] = await Promise.all([fixedAnchor.boundingBox(), fixedPanel.boundingBox()]);
  assert(anchorBox && panelBox && Math.abs(panelBox.x + panelBox.width - (anchorBox.x + anchorBox.width)) < 1,
    'fixed right alignment pins the panel end edge to the anchor end edge');
  assert(anchorBox && panelBox && panelBox.y >= anchorBox.y + anchorBox.height,
    'a roomy fixed panel opens below its anchor');
  await page.getByTestId('float-fixed-anchor').click();

  await page.getByTestId('float-scrollbar-anchor').click();
  await settleFrames(page, 8);
  const scrollbarBoundary = page.getByTestId('float-scrollbar-boundary');
  const scrollbarPanel = page.getByTestId('float-scrollbar-panel');
  const [boundaryBox, scrollbarPanelBox, scrollbarMetrics] = await Promise.all([
    scrollbarBoundary.boundingBox(),
    scrollbarPanel.boundingBox(),
    scrollbarPanel.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    })),
  ]);
  assert(scrollbarMetrics.scrollHeight > scrollbarMetrics.clientHeight,
    'the boundary fixture has a vertical scrollbar');
  assert(scrollbarPanelBox && scrollbarMetrics.scrollWidth < scrollbarPanelBox.width,
    'the scrollbar fixture exposes scrollWidth as smaller than its rendered border-box');
  assert(boundaryBox && scrollbarPanelBox
    && scrollbarPanelBox.x + scrollbarPanelBox.width <= boundaryBox.x + boundaryBox.width - 8 + 0.5,
    'a fixed scrollbar panel keeps its rendered border-box inside the padded collision boundary');
  await page.getByTestId('float-scrollbar-anchor').click();
}

async function testDialogFocus(page) {
  const opener = page.getByTestId('dialog-opener');

  await opener.click();
  await settleFrames(page);
  assert((await activeTestId(page)) === 'a-first', 'an opened dialog focuses its first focusable element');
  assert((await page.evaluate(() => document.body.style.overflow)) === 'hidden', 'an open dialog locks body scroll');

  // Tab cycle: forward wraps last -> first, backward wraps first -> last.
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  assert((await activeTestId(page)) === 'a-last', 'Tab reaches the last focusable');
  await page.keyboard.press('Tab');
  assert((await activeTestId(page)) === 'a-first', 'Tab wraps from the last focusable to the first');
  await page.keyboard.press('Shift+Tab');
  assert((await activeTestId(page)) === 'a-last', 'Shift+Tab wraps from the first focusable to the last');

  // Focus escaping the dialog is pulled back in.
  await page.evaluate(() => document.querySelector('[data-testid="dialog-outside"]').focus());
  await settleFrames(page);
  const yanked = await activeTestId(page);
  assert(yanked !== 'dialog-outside', 'focus that escapes the dialog is contained');

  // Nested dialog: initialFocusRef, stacked z-index, topmost-only Escape.
  await page.getByTestId('a-open-b').click();
  await settleFrames(page);
  assert((await activeTestId(page)) === 'b-preferred', 'initialFocusRef receives the entry focus');
  const zA = Number(await page.getByTestId('dialog-a').getAttribute('data-zindex'));
  const zB = Number(await page.getByTestId('dialog-b').getAttribute('data-zindex'));
  assert(zB > zA, 'the engine assigns a higher z-index to the upper overlay');
  await page.keyboard.press('Escape');
  await settleFrames(page);
  assert(!(await page.getByTestId('dialog-b').isVisible().catch(() => false)), 'Escape closes only the top dialog');
  assert(await page.getByTestId('dialog-a').isVisible(), 'the lower dialog stays open');
  assert((await activeTestId(page)) === 'a-open-b', 'closing the top dialog returns focus to its invoker in the lower dialog');
  assert((await page.evaluate(() => document.body.style.overflow)) === 'hidden', 'the scroll lock is held while any dialog is open');

  await page.keyboard.press('Escape');
  await settleFrames(page);
  assert(!(await page.getByTestId('dialog-a').isVisible().catch(() => false)), 'the second Escape closes the remaining dialog');
  assert((await activeTestId(page)) === 'dialog-opener', 'closing the last dialog restores focus to the original opener');
  assert((await page.evaluate(() => document.body.style.overflow)) === '', 'closing the last dialog releases the body scroll lock');

  // lockScroll: false leaves the page scrollable.
  await page.getByTestId('dialog-plain-opener').click();
  await settleFrames(page);
  assert((await page.evaluate(() => document.body.style.overflow)) === '', 'lockScroll:false leaves body scroll untouched');
  await page.keyboard.press('Escape');
  await settleFrames(page);
}

async function testFieldShared(page) {
  const wiring = await page.evaluate(() => {
    const input = document.querySelector('[data-testid="field-helper-input"]');
    const label = Array.from(document.querySelectorAll('label')).find((node) => node.htmlFor === input.id);
    const describedBy = input.getAttribute('aria-describedby') || '';
    const messageId = describedBy.split(/\s+/).find((id) => id.endsWith('-message'));
    const message = messageId ? document.getElementById(messageId) : null;
    return {
      hasLabel: !!label,
      describedBy,
      hasMetadata: input.getAttribute('data-has-metadata'),
      messageText: message?.textContent ?? null,
      messageRole: message?.getAttribute('role') ?? null,
    };
  });
  assert(wiring.hasLabel, 'the label is wired to the control through fieldId/htmlFor');
  assert(wiring.describedBy.split(/\s+/).includes('external-note'), 'external describedBy ids survive the merge');
  assert(wiring.messageText === '8자 이상 입력', 'the helper renders through messageId');
  assert(wiring.messageRole === null, 'a helper-only message is not a live region');
  assert(wiring.hasMetadata === 'true', 'label/message presence is reported through hasMetadata');

  const errorWiring = await page.evaluate(() => {
    const input = document.querySelector('[data-testid="field-error-input"]');
    const describedBy = input.getAttribute('aria-describedby') || '';
    const messageId = describedBy.split(/\s+/).find((id) => id.endsWith('-message'));
    const message = messageId ? document.getElementById(messageId) : null;
    return {
      ariaInvalid: input.getAttribute('aria-invalid'),
      messageText: message?.textContent ?? null,
      messageRole: message?.getAttribute('role') ?? null,
    };
  });
  assert(errorWiring.messageText === '필수 항목입니다', 'error takes precedence over helper');
  assert(errorWiring.messageRole === 'alert', 'an error message becomes an assertive live region');
  assert(errorWiring.ariaInvalid === 'true', 'the fixture control reflects the invalid state');

  const pure = await page.evaluate(() => {
    const { mergeIds, appendAriaReference, inlineFloatingStyle, fieldBorderColor, fieldBackground } = window.__engine;
    return {
      merged: mergeIds('a b', 'b', undefined, 'c'),
      empty: mergeIds(undefined, '', null) ?? 'undefined',
      appended: appendAriaReference('x y', 'x'),
      disabledWins: fieldBorderColor({ disabled: true, invalid: true, focused: true }),
      invalidWins: fieldBorderColor({ invalid: true, focused: true }),
      positive: fieldBorderColor({ status: 'positive' }),
      focused: fieldBorderColor({ focused: true }),
      resting: fieldBorderColor({}),
      disabledBackground: fieldBackground({ disabled: true }),
      readOnlyBackground: fieldBackground({ readOnly: true }),
      restingBackground: fieldBackground({}),
      inlineTopLeft: inlineFloatingStyle({ placement: 'top', align: 'left', offset: 6 }),
      inlineBottomRight: inlineFloatingStyle({ placement: 'bottom', align: 'right', offset: 10 }),
      inlineLeftCenter: inlineFloatingStyle({ placement: 'left', align: 'center', offset: 4 }),
      inlineRightBottom: inlineFloatingStyle({ placement: 'right', align: 'trailing', offset: 'var(--space-2)', shiftX: 3, shiftY: -2 }),
    };
  });
  assert(pure.merged === 'a b c', 'mergeIds deduplicates and joins ids');
  assert(pure.empty === 'undefined', 'mergeIds returns undefined when no id survives');
  assert(pure.appended === 'x y', 'appendAriaReference does not duplicate existing references');
  assert(pure.disabledWins === 'var(--color-semantic-line-normal-neutral)', 'disabled outranks invalid in fieldBorderColor');
  assert(pure.invalidWins === 'var(--component-input-border-color-invalid)', 'invalid outranks focused in fieldBorderColor');
  assert(pure.positive === 'var(--color-semantic-status-positive)', 'positive status maps to the positive token');
  assert(pure.focused === 'var(--component-input-border-color-focus)', 'focused maps to the focus token');
  assert(pure.resting === 'var(--component-input-border-color)', 'the resting state maps to the base token');
  assert(pure.disabledBackground === 'var(--color-semantic-fill-normal)', 'disabled background token');
  assert(pure.readOnlyBackground === 'var(--color-semantic-fill-alternative)', 'read-only background token');
  assert(pure.restingBackground === 'var(--color-semantic-background-elevated-normal)', 'resting background token');
  assert(pure.inlineTopLeft.bottom === 'calc(100% + 6px)' && pure.inlineTopLeft.left === 0, 'inline top/left placement anchors above the trigger');
  assert(pure.inlineBottomRight.top === 'calc(100% + 10px)' && pure.inlineBottomRight.right === 0, 'inline bottom/right placement anchors below the trigger');
  assert(pure.inlineLeftCenter.right === 'calc(100% + 4px)' && pure.inlineLeftCenter.top === '50%', 'inline left/center placement anchors beside the trigger');
  assert(pure.inlineLeftCenter.transform === 'translateY(-50%)', 'inline vertical center alignment applies its cross-axis transform');
  assert(pure.inlineRightBottom.left === 'calc(100% + var(--space-2))' && pure.inlineRightBottom.bottom === 0, 'inline right/trailing placement supports token offsets');
  assert(pure.inlineRightBottom.translate === '3px -2px', 'inline placement preserves measured viewport shifts');
}

async function main() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await esbuild.build({
    entryPoints: [fixtureEntry],
    outfile: path.join(outDir, 'harness.js'),
    bundle: true,
    format: 'iife',
    jsx: 'automatic',
    logLevel: 'silent',
  });
  await writeFile(path.join(outDir, 'index.html'), `<!doctype html>
<html lang="ko">
  <head><meta charset="UTF-8" /><title>Engine contracts</title></head>
  <body><div id="root"></div><script src="/harness.js"></script></body>
</html>
`, 'utf8');

  const { server, origin } = await startStaticServer(outDir);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  try {
    await page.goto(`${origin}/index.html`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="menu-a-trigger"]', { timeout: 15000 });
    await testMenuKeyboard(page);
    await testLightDismiss(page);
    await testFloatingPosition(page);
    await testDialogFocus(page);
    await testFieldShared(page);
  } finally {
    await browser.close();
    server.close();
  }

  const uniqueConsoleErrors = [...new Set(consoleErrors)].filter((message) => !/ResizeObserver loop/.test(message));
  if (uniqueConsoleErrors.length > 0) {
    throw new Error(`Engine contract harness emitted console/page errors:\n${uniqueConsoleErrors.join('\n')}`);
  }
  console.log(`Validated engine contracts: ${passed} assertions through the supported Core headless, platform, and component-authoring source facades.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
