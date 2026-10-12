import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';

// Authoring-source regression only: no generated package or visual baseline is
// written. The short-lived HTTP fixture and browser are released in after().
let server;
let browser;
let origin;
const fixture = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Modal } from './components/overlay/Modal.jsx';
import { Sheet } from './components/overlay/Sheet.jsx';
import { Popover } from './components/overlay/Popover.jsx';
import { LdsProvider } from './components/selection/LdsProvider.jsx';
function NestedChild({ kind, controlledOpen, setControlledOpen, localState, changes }) {
  const [localOpen, setLocalOpen] = React.useState(false);
  const open = localState ? localOpen : controlledOpen;
  const change = (value) => {
    changes.current.push(value);
    (localState ? setLocalOpen : setControlledOpen)(value);
  };
  return <>
    <button onClick={() => change(true)}>하위 열기</button>
    {kind === 'Popover'
      ? <Popover open={open} onOpenChange={change} ariaLabel="하위 팝오버" trigger={<button>하위 팝오버 열기</button>}><button>하위 작업</button></Popover>
      : <Modal open={open} title="하위 모달" onClose={() => change(false)}><button onClick={() => change(false)}>하위 닫기</button></Modal>}
  </>;
}
function Fixture() {
  const query = new URLSearchParams(location.search);
  const [open, setOpen] = React.useState(query.has('initialOpen'));
  const [nestedOpen, setNestedOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(true);
  const nestedChanges = React.useRef([]);
  const field = React.useRef(null);
  const alternate = React.useRef(null);
  const kind = query.get('kind') || 'Modal';
  const Surface = kind === 'Sheet' ? Sheet : Modal;
  window.overlayFixture = { setOpen, setMounted, nestedOpen, nestedChanges: nestedChanges.current };
  const close = () => setOpen(false);
  const nested = query.get('nestedInside') === 'Popover'
    ? <Popover open={nestedOpen} onOpenChange={setNestedOpen} ariaLabel="하위 팝오버" trigger={<button>하위 팝오버 열기</button>}><button>하위 작업</button></Popover>
    : <Modal open={nestedOpen} title="하위 모달" onClose={() => setNestedOpen(false)}><button onClick={() => setNestedOpen(false)}>하위 닫기</button></Modal>;
  const body = <><input ref={field} aria-label="상세 입력" /><button onClick={close}>본문 닫기</button>{query.has('nestedInside')
    ? <NestedChild kind={query.get('nestedInside')} controlledOpen={nestedOpen} setControlledOpen={setNestedOpen} localState={query.has('localChildState')} changes={nestedChanges} />
    : <button onClick={() => setNestedOpen(true)}>하위 열기</button>}</>;
  const content = <main inert={query.has('shellInert') && open ? true : undefined}>
    <button data-testid="trigger" onClick={() => setOpen(true)}>열기</button>
    <button ref={alternate} data-testid="alternate" onClick={() => setOpen(true)}>다음 작업</button>
    {mounted && (kind === 'Popover'
      ? <Popover open={open} onOpenChange={setOpen} ariaLabel="Popover" styles={query.has('pointerOverride') ? {panel:{pointerEvents:'all'}} : undefined} trigger={<button data-testid="popover-trigger">팝오버 열기</button>}>{body}</Popover>
      : <Surface open={open} title={kind} onClose={close} initialFocusRef={field} styles={query.has('pointerOverride') ? {backdrop:{pointerEvents:'all'}} : undefined} returnFocusRef={query.has('explicitReturn') ? alternate : undefined}>{body}</Surface>)}
    {!query.has('nestedInside') && nested}
  </main>;
  return query.has('provider')
    ? <LdsProvider colorScheme="dark" profile="ops" target={null} persist={false}><div data-theme="dark" data-lds-profile="ops">{content}</div></LdsProvider>
    : content;
}
createRoot(document.getElementById('root')).render(<Fixture />);
`;

before(async () => {
  const bundle = await build({
    stdin: { contents: fixture, resolveDir: process.cwd(), loader: 'jsx' },
    bundle: true, write: false, format: 'iife', platform: 'browser', jsx: 'automatic', logLevel: 'silent',
  });
  const scopeCss = (await Promise.all(['color-atomic', 'color-semantic', 'profiles'].map((name) => readFile(`tokens/${name}.css`, 'utf8')))).join('\n');
  const html = `<!doctype html><meta charset="utf-8"><style>
    :root { --dur-fast:120ms; --dur-base:200ms; --dur-slow:320ms; --ease-out:cubic-bezier(.16,1,.3,1); --space-1:4px; --space-2:8px; --space-6:24px; --component-dialog-scrim:rgba(0,0,0,.32); --color-semantic-background-elevated-normal:white; }
    * { box-sizing:border-box; } body { margin:0; min-height:1200px; } main { padding:32px; } button,input { min-height:32px; } input { display:block; }
    ${scopeCss}
  </style><div id="root"></div><script src="/fixture.js"></script>`;
  server = createServer((request, response) => {
    const script = request.url === '/fixture.js';
    response.setHeader('Content-Type', script ? 'text/javascript' : 'text/html');
    response.end(script ? bundle.outputFiles[0].text : html);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true });
});

after(async () => {
  await browser?.close();
  await new Promise((resolve) => server ? server.close(resolve) : resolve());
});

async function pageFor(kind, options = {}) {
  const page = await browser.newPage({ viewport: { width: 900, height: 700 }, reducedMotion: options.reducedMotion ?? 'no-preference' });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${origin}/?kind=${kind}${options.query ?? ''}`);
  if (options.bodyStyle) await page.evaluate((styles) => Object.assign(document.body.style, styles), options.bodyStyle);
  await page.getByTestId(kind === 'Popover' ? 'popover-trigger' : 'trigger').click();
  await page.getByRole('dialog', { name: kind, exact: true }).waitFor();
  if (kind !== 'Popover') await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === '상세 입력');
  await page.waitForTimeout(350);
  return { page, errors };
}

for (const kind of ['Modal', 'Sheet', 'Popover']) {
  test(`${kind}: exit releases interaction immediately and rapid reopen cancels removal`, async () => {
    const { page, errors } = await pageFor(kind);
    try {
      const surface = page.locator('[role="dialog"]').filter({ has: page.getByLabel('상세 입력') });
      const before = await surface.boundingBox();
      await surface.getByRole('button', { name: '본문 닫기' }).click();
      // The retained pixels must never retain modality, hit-testing or Tab stops.
      const exiting = await surface.evaluate((element) => ({
        hidden: element.getAttribute('aria-hidden'), inert: element.hasAttribute('inert'),
        modal: element.getAttribute('aria-modal'), pointer: getComputedStyle(element).pointerEvents,
        overflow: getComputedStyle(document.body).overflow,
        rect: { x: element.getBoundingClientRect().x, y: element.getBoundingClientRect().y },
        backgroundInert: document.getElementById('root').hasAttribute('inert'),
      }));
      assert.equal(exiting.hidden, 'true');
      assert.equal(exiting.inert, true);
      assert.equal(exiting.modal, null);
      assert.equal(exiting.pointer, 'none');
      assert.notEqual(exiting.overflow, 'hidden');
      assert.equal(exiting.backgroundInert, false);
      if (kind === 'Popover') assert.ok(exiting.rect.x > -100 && Math.abs(exiting.rect.y - before.y) < 10, 'Popover retains its anchor coordinates during exit');
      const trigger = page.getByTestId(kind === 'Popover' ? 'popover-trigger' : 'trigger');
      await trigger.click();
      await page.waitForTimeout(450);
      assert.equal(await page.getByRole('dialog', { name: kind, exact: true }).count(), 1);
      assert.equal(await surface.getAttribute('aria-hidden'), null);
      await surface.getByRole('button', { name: '본문 닫기' }).click();
      await surface.waitFor({ state: 'detached' });
      assert.deepEqual(errors, []);
    } finally { await page.close(); }
  });

  test(`${kind}: reduce finishes at endpoints, including a preference change during exit`, async () => {
    const { page, errors } = await pageFor(kind, { reducedMotion: 'reduce' });
    try {
      const dialog = page.getByRole('dialog', { name: kind, exact: true });
      assert.equal(await dialog.evaluate((element) => getComputedStyle(element).transitionDuration.split(',').every((duration) => Number.parseFloat(duration) === 0)), true);
      assert.equal(await dialog.evaluate((element) => getComputedStyle(element).transform), 'none');
      await dialog.getByRole('button', { name: '본문 닫기' }).click();
      assert.equal(await page.locator('[role="dialog"]').count(), 0);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.getByTestId(kind === 'Popover' ? 'popover-trigger' : 'trigger').click();
      await page.waitForTimeout(350);
      await dialog.getByRole('button', { name: '본문 닫기' }).click();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));
      await page.evaluate(() => window.overlayFixture.setOpen(true));
      await dialog.waitFor();
      await page.evaluate(() => window.overlayFixture.setMounted(false));
      await dialog.waitFor({ state: 'detached' });
      await page.waitForTimeout(400);
      assert.deepEqual(errors, []);
      assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).overflow), 'hidden');
    } finally { await page.close(); }
  });
}

for (const kind of ['Modal', 'Sheet']) {
  for (const child of ['Modal', 'Popover']) test(`${kind}: parent controlled close immediately deactivates a nested portaled ${child}`, async () => {
    const { page, errors } = await pageFor(kind, { query: `&nestedInside=${child}` });
    try {
      const parent = page.locator('[role="dialog"]').filter({ has: page.getByLabel('상세 입력') });
      await parent.getByRole('button', { name: '하위 열기', exact: true }).click();
      const nestedName = child === 'Modal' ? '하위 모달' : '하위 팝오버';
      await page.getByRole('dialog', { name: nestedName, exact: true }).waitFor();
      await page.waitForTimeout(350);
      await page.evaluate(() => window.overlayFixture.setOpen(false));
      await page.waitForFunction((name) => [...document.querySelectorAll('[role="dialog"]')].some((element) => document.getElementById(element.getAttribute('aria-labelledby'))?.textContent === name && element.getAttribute('aria-hidden') === 'true'), kind);
      const closing = await page.evaluate((name) => {
        const nested = [...document.querySelectorAll('[role="dialog"]')].find((element) => (element.getAttribute('aria-label') || document.getElementById(element.getAttribute('aria-labelledby'))?.textContent) === name);
        return {
          nestedPresent: Boolean(nested),
          nestedHidden: nested?.getAttribute('aria-hidden'), nestedInert: nested?.hasAttribute('inert'),
          nestedPointer: nested ? getComputedStyle(nested).pointerEvents : null,
          backgroundInert: document.getElementById('root').hasAttribute('inert'),
          overflow: getComputedStyle(document.body).overflow,
          active: document.activeElement?.getAttribute('data-testid'),
          childControlledOpen: window.overlayFixture.nestedOpen,
        };
      }, nestedName);
      assert.equal(await parent.count(), 1, 'parent pixels remain for their visual exit');
      // Removing a descendant Portal is also valid deactivation. Retained
      // descendant pixels must satisfy the complete non-interactive contract.
      if (closing.nestedPresent) {
        assert.equal(closing.nestedHidden, 'true');
        assert.equal(closing.nestedInert, true);
        assert.equal(closing.nestedPointer, 'none');
      }
      assert.equal(closing.backgroundInert, false);
      assert.notEqual(closing.overflow, 'hidden');
      assert.equal(closing.active, 'trigger');
      assert.equal(closing.childControlledOpen, true, 'ancestor close must not rewrite consumer-controlled child state');
      await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));
      assert.equal(await page.evaluate(() => document.getElementById('root').hasAttribute('inert')), false);
      assert.deepEqual(errors, []);
    } finally { await page.close(); }
  });

  for (const child of ['Modal', 'Popover']) {
    for (const localState of [false, true]) test(`${kind}: nested ${child} rapid reopen preserves ${localState ? 'subtree reset' : 'consumer state and Escape order'}`, async () => {
      const { page, errors } = await pageFor(kind, {
        query: `&nestedInside=${child}${localState ? '&localChildState=1' : ''}`,
        bodyStyle: { overflow: 'auto', paddingRight: '7px' },
      });
      try {
        const parent = page.locator('[role="dialog"]').filter({ has: page.getByLabel('상세 입력') });
        const nestedName = child === 'Modal' ? '하위 모달' : '하위 팝오버';
        const nested = page.getByRole('dialog', { name: nestedName, exact: true });
        await parent.getByRole('button', { name: '하위 열기', exact: true }).click();
        await nested.waitFor();
        await page.waitForTimeout(350);
        assert.deepEqual(await page.evaluate(() => window.overlayFixture.nestedChanges), [true]);

        await page.evaluate(() => window.overlayFixture.setOpen(false));
        await page.waitForFunction((name) => [...document.querySelectorAll('[role="dialog"]')].some((element) => document.getElementById(element.getAttribute('aria-labelledby'))?.textContent === name && element.getAttribute('aria-hidden') === 'true'), kind);
        assert.equal(await parent.count(), 1, 'reopen occurs while parent exit pixels remain');
        await page.evaluate(() => window.overlayFixture.setOpen(true));
        await page.waitForFunction((name) => [...document.querySelectorAll('[role="dialog"]')].some((element) => document.getElementById(element.getAttribute('aria-labelledby'))?.textContent === name && element.getAttribute('aria-hidden') !== 'true'), kind);

        if (localState) {
          assert.equal(await nested.count(), 0, 'subtree-owned child state resets as it did after immediate parent unmount');
        } else {
          await nested.waitFor();
          assert.equal(await page.evaluate(() => window.overlayFixture.nestedOpen), true);
          await page.keyboard.press('Escape');
          await page.waitForFunction((name) => window.overlayFixture.nestedOpen === false || [...document.querySelectorAll('[role="dialog"]')].some((element) => document.getElementById(element.getAttribute('aria-labelledby'))?.textContent === name && element.getAttribute('aria-hidden') === 'true'), kind, { timeout: 1000 });
          assert.equal(await page.evaluate(() => window.overlayFixture.nestedOpen), false, 'Escape closes the controlled child before the reopened parent');
          assert.equal(await parent.getAttribute('aria-hidden'), null, 'the child, rather than the reopened parent, owns Escape');
        }
        assert.deepEqual(await page.evaluate(() => window.overlayFixture.nestedChanges), localState ? [true] : [true, false], 'ancestor lifecycle does not synthesize child callbacks');

        await page.evaluate(() => window.overlayFixture.setOpen(false));
        await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));
        assert.deepEqual(await page.evaluate(() => ({ overflow: document.body.style.overflow, paddingRight: document.body.style.paddingRight, inert: document.getElementById('root').hasAttribute('inert') })), { overflow: 'auto', paddingRight: '7px', inert: false });
        assert.deepEqual(errors, []);
      } finally { await page.close(); }
    });
  }

  test(`${kind}: nested Escape and explicit return target retain the focus contract`, async () => {
    const { page } = await pageFor(kind, { query: '&explicitReturn=1' });
    try {
      const parent = page.getByRole('dialog', { name: kind, exact: true });
      await parent.getByRole('button', { name: '하위 열기' }).click();
      await page.getByRole('dialog', { name: '하위 모달', exact: true }).waitFor();
      await page.keyboard.press('Escape');
      assert.equal(await parent.getByRole('button', { name: '하위 열기' }).evaluate((element) => element === document.activeElement), true);
      assert.equal(await page.evaluate(() => getComputedStyle(document.body).overflow), 'hidden');
      await page.keyboard.press('Escape');
      assert.equal(await page.getByTestId('alternate').evaluate((element) => element === document.activeElement), true);
      assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).overflow), 'hidden');
      await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));
    } finally { await page.close(); }
  });

  test(`${kind}: shell-controlled inert is removed before focus handoff`, async () => {
    const { page } = await pageFor(kind, { query: '&shellInert=1' });
    try {
      await page.getByRole('dialog', { name: kind, exact: true }).getByRole('button', { name: '본문 닫기' }).click();
      assert.equal(await page.getByTestId('trigger').evaluate((element) => element === document.activeElement), true);
    } finally { await page.close(); }
  });

  test(`${kind}: a different invoker reopening during exit becomes the new return target`, async () => {
    const { page } = await pageFor(kind, { query: '&shellInert=1' });
    try {
      const dialog = page.getByRole('dialog', { name: kind, exact: true });
      await dialog.getByRole('button', { name: '본문 닫기' }).click();
      await page.getByTestId('alternate').click();
      await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === '상세 입력');
      await dialog.getByRole('button', { name: '본문 닫기' }).click();
      assert.equal(await page.getByTestId('alternate').evaluate((element) => element === document.activeElement), true);
    } finally { await page.close(); }
  });
}

test('initially open modal surfaces inherit target-null provider theme/profile and keep focus contracts', async () => {
  for (const [kind, expectedDuration] of [['Sheet', '0.24s'], ['Modal', '0.16s']]) {
    const page = await browser.newPage({ viewport: { width: 900, height: 700 }, reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    try {
      await page.addInitScript(() => localStorage.setItem('lk-theme', 'unchanged-marker'));
      await page.goto(`${origin}/?kind=${kind}&provider=1&initialOpen=1&explicitReturn=1`);
      const dialog = page.getByRole('dialog', { name: kind, exact: true });
      await dialog.waitFor();
      await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === '상세 입력');
      const state = await dialog.evaluate((element) => {
        const portal = element.closest('[data-lds-overlay-portal]');
        return {
          theme: portal.dataset.theme, profile: portal.dataset.ldsProfile,
          duration: getComputedStyle(element).transitionDuration,
          background: getComputedStyle(element).backgroundColor,
          htmlTheme: document.documentElement.getAttribute('data-theme'),
          htmlProfile: document.documentElement.getAttribute('data-lds-profile'),
          storage: localStorage.getItem('lk-theme'),
          modal: element.getAttribute('aria-modal'),
          backgroundInert: document.getElementById('root').hasAttribute('inert'),
        };
      });
      assert.equal(state.theme, 'dark');
      assert.equal(state.profile, 'ops');
      assert.equal(state.duration, expectedDuration);
      assert.equal(state.background, 'rgb(33, 34, 37)');
      assert.equal(state.htmlTheme, null);
      assert.equal(state.htmlProfile, null);
      assert.equal(state.storage, 'unchanged-marker');
      assert.equal(state.modal, 'true');
      assert.equal(state.backgroundInert, true);
      await dialog.locator('button').last().focus();
      await page.keyboard.press('Tab');
      assert.equal(await dialog.evaluate((element) => document.activeElement === element.querySelector('button, input')), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.getByTestId('alternate').evaluate((element) => element === document.activeElement), true);
      assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).overflow), 'hidden');
      await dialog.waitFor({ state: 'detached' });
      assert.deepEqual(errors, []);
    } finally { await page.close(); }
  }
});

for (const kind of ['Modal', 'Popover']) test(`${kind}: open pointer override survives and exit disables hit testing`, async () => {
  const { page } = await pageFor(kind, { query: '&pointerOverride=1' });
  try {
    const selector = kind === 'Modal' ? '[data-slot="backdrop"]' : '[data-slot="panel"]';
    assert.equal(await page.locator(selector).evaluate((element) => getComputedStyle(element).pointerEvents), 'all');
    await page.evaluate(() => window.overlayFixture.setOpen(false));
    assert.equal(await page.locator(selector).evaluate((element) => getComputedStyle(element).pointerEvents), 'none');
  } finally { await page.close(); }
});
