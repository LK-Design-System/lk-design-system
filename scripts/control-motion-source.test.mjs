import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';

// Narrow authoring-source browser checks. CSS and bundle stay in memory; no
// generated package, screenshot baseline, or installed dependency is changed.
let server;
let browser;
let origin;
const fixture = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './components/buttons/Button.jsx';
import { ToggleIcon } from './components/buttons/ToggleIcon.jsx';
import { TextButton } from './components/buttons/TextButton.jsx';
import { IconButton } from './components/buttons/IconButton.jsx';
import { Fab } from './components/buttons/Fab.jsx';
import { Combobox } from './components/forms/Combobox.jsx';
import { Select } from './components/forms/Select.jsx';
import { ButtonGroup } from './components/buttons/ButtonGroup.jsx';
import { SocialButton } from './components/buttons/SocialButton.jsx';
import { SplitButton } from './components/buttons/SplitButton.jsx';
import { ToggleButton } from './components/selection/ToggleButton.jsx';
import { SavedViewControl } from './components/data/SavedViewControl.jsx';
import { ThemeToggle } from './components/selection/ThemeToggle.jsx';
import { SegmentedControl } from './components/selection/SegmentedControl.jsx';
import { Switch } from './components/selection/Switch.jsx';
import { Accordion } from './components/content/Accordion.jsx';
import { Collapsible } from './components/content/Collapsible.jsx';
function Fixture() {
  const [loading, setLoading] = React.useState(false);
  const [activated, setActivated] = React.useState(0);
  const [value, setValue] = React.useState('status');
  const [history, setHistory] = React.useState([]);
  const [width, setWidth] = React.useState(320);
  const [direction, setDirection] = React.useState('ltr');
  const [paintValue, setPaintValue] = React.useState('status');
  const [paintDisabled, setPaintDisabled] = React.useState(false);
  const [paintHistory, setPaintHistory] = React.useState([]);
  window.controlFixture = { setLoading, setWidth, setDirection };
  window.paintFixture = { setValue: setPaintValue, setDisabled: setPaintDisabled };
  const paint = { background: 'transparent', boxShadow: 'none', borderRadius: 0 };
  const paintOptions = [{value:'status',label:'상태',disabled:paintDisabled},{value:'log',label:'로그'}];
  const onPaintChange = (next) => { setPaintValue(next); setPaintHistory((previous) => [...previous,next]); };
  return <main>
    <section data-testid="controls" style={{display:'grid',gap:12,justifyItems:'start',width:340}}>
      <Button data-testid="button" loading={loading} onClick={() => {setActivated((n) => n+1);setLoading(true);}}>변경 사항 저장</Button>
      <output data-testid="activated">{activated}</output>
      <Button data-testid="disabled-button" disabled onClick={() => setActivated((n) => n+1)}>비활성</Button>
      <ToggleIcon data-testid="toggle-icon" label="즐겨찾기">★</ToggleIcon>
      <TextButton data-testid="text-button">자세히</TextButton>
      <IconButton data-testid="icon-button" label="닫기">×</IconButton>
      <Fab data-testid="fab" label="추가">+</Fab>
      <div data-testid="combobox"><Combobox aria-label="다중 선택" options={['하나','둘']} /></div>
      <div data-testid="select"><Select aria-label="단일 선택" options={['하나','둘']} /></div>
      <div data-testid="button-group"><ButtonGroup options={['목록','지도']} multiple /></div>
      <SocialButton data-testid="social-button">Google로 계속하기</SocialButton>
      <div data-testid="split-button"><SplitButton items={[{label:'다른 작업'}]}>저장</SplitButton></div>
      <ToggleButton data-testid="toggle-button">고정</ToggleButton>
      <div data-testid="saved-view"><SavedViewControl views={[{id:'a',label:'기본'}]} value="a" onChange={() => {}} /></div>
      <div data-testid="theme-toggle"><ThemeToggle target={null} persist={false} /></div>
    </section>
    <section data-testid="segmented-width" dir={direction} style={{width,maxWidth:'100%',marginTop:24}}>
      <SegmentedControl data-testid="segmented" aria-label="선택 전환 보기" value={value} onChange={(next) => {setValue(next);setHistory((previous) => [...previous,next]);}} options={[
        {value:'status',label:'상태',count:12}, {value:'history',label:'최근 장치 연결 및 동작 이력',count:8},
        {value:'disabled',label:'미지원',disabled:true}, {value:'log',label:'로그',count:3}
      ]} full />
      <output data-testid="selected-value">{value}</output><output data-testid="selection-history">{JSON.stringify(history)}</output>
      <SegmentedControl data-testid="disabled-segmented" aria-label="비활성 선택" options={['선택됨','선택 안 됨']} disabled />
    </section>
    <section style={{display:'grid',gap:12,width:320}}>
      <SegmentedControl data-testid="paint-part" options={paintOptions} value={paintValue} onChange={onPaintChange} styles={{segment:paint}} full />
      <SegmentedControl data-testid="paint-option" options={paintOptions.map((option,index) => index === 0 ? {...option,style:paint} : option)} value={paintValue} onChange={onPaintChange} styles={{segment:{background:'rgb(10, 20, 30)',boxShadow:'0 0 0 2px rgb(20, 30, 40)',borderRadius:3}}} full />
      <SegmentedControl data-testid="paint-class" options={paintOptions} value={paintValue} onChange={onPaintChange} classNames={{segment:'segmented-paint-class'}} full />
      <SegmentedControl data-testid="paint-option-class" options={paintOptions.map((option,index) => index === 0 ? {...option,className:'segmented-paint-class'} : option)} value={paintValue} onChange={onPaintChange} full />
      <SegmentedControl data-testid="paint-normal" options={paintOptions} value={paintValue} onChange={onPaintChange} className="consumer-layout" classNames={{root:'consumer-root'}} styles={{segment:{paddingInline:12,fontWeight:500},label:{letterSpacing:'0.5px'},count:{fontWeight:500}}} vars={{'--lds-segmented-control-height':'44px'}} full />
      <output data-testid="paint-history">{JSON.stringify(paintHistory)}</output>
    </section>
    <section style={{marginTop:24,width:320,maxWidth:'100%'}}>
      <Switch data-testid="switch" label="알림" />
      <Accordion data-testid="accordion" items={[{title:'연결 상태',content:<button>연결 점검</button>}]} />
      <Collapsible data-testid="collapsible" title="추가 설정"><button>설정 변경</button></Collapsible>
    </section>
  </main>;
}
createRoot(document.getElementById('root')).render(<Fixture />);
`;

before(async () => {
  const [bundle, sources] = await Promise.all([
    build({ stdin: { contents: fixture, resolveDir: process.cwd(), loader: 'jsx' }, bundle: true, write: false, format: 'iife', platform: 'browser', jsx: 'automatic', logLevel: 'silent' }),
    Promise.all(['color-atomic','color-semantic','color-components','typography','spacing','grid','effects','components','base','focus','profiles'].map((name) => readFile(`tokens/${name}.css`, 'utf8'))),
  ]);
  const html = `<!doctype html><meta charset="utf-8"><style>${sources.join('\n')} body{margin:0;padding:24px;} main{display:grid;gap:16px;} .segmented-paint-class[data-state="checked"]{background:transparent!important;box-shadow:none!important;border-radius:0!important}</style><div id="root"></div><script src="/fixture.js"></script>`;
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

async function pageFor({ profile = 'default', reducedMotion = 'no-preference' } = {}) {
  const page = await browser.newPage({ viewport: { width: 900, height: 900 }, reducedMotion });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(origin);
  await page.getByTestId('button').waitFor();
  await page.evaluate((next) => document.documentElement.setAttribute('data-lds-profile', next), profile);
  return { page, errors };
}

const probes = {
  Button: '[data-testid="button"]', ToggleIcon: '[data-testid="toggle-icon"]', TextButton: '[data-testid="text-button"]',
  IconButton: '[data-testid="icon-button"]', Fab: '[data-testid="fab"]', ComboboxChevron: '[data-testid="combobox"] svg',
  Select: '[data-testid="select"] [role="combobox"]', ButtonGroup: '[data-testid="button-group"] button',
  SocialButton: '[data-testid="social-button"]', SplitButton: '[data-testid="split-button"] button',
  ToggleButton: '[data-testid="toggle-button"]', SavedViewControl: '[data-testid="saved-view"] select', ThemeToggle: '[data-testid="theme-toggle"] button',
};

for (const profile of ['default', 'ops']) for (const reducedMotion of ['no-preference', 'reduce']) {
  test(`shared transition: ${profile}/${reducedMotion} computes all 13 authored consumers`, async () => {
    const { page, errors } = await pageFor({ profile, reducedMotion });
    try {
      const expected = reducedMotion === 'reduce' ? 0 : profile === 'ops' ? 0.08 : 0.12;
      for (const [name, selector] of Object.entries(probes)) {
        const durations = await page.locator(selector).first().evaluate((element) => getComputedStyle(element).transitionDuration.split(',').map(Number.parseFloat));
        assert.ok(durations.length > 0 && durations.every((duration) => duration === expected), `${name}: expected ${expected}s, got ${durations}`);
      }
      const fieldExpected = reducedMotion === 'reduce' ? 0 : profile === 'ops' ? 0.16 : 0.2;
      assert.deepEqual(await page.getByRole('combobox', { name: '다중 선택' }).evaluate((element) => getComputedStyle(element).transitionDuration.split(',').map(Number.parseFloat)), [fieldExpected, fieldExpected]);
      assert.deepEqual(errors, []);
    } finally { await page.close(); }
  });
}

test('shared transition resolves the fast duration inside a nested ops scope', async () => {
  const { page } = await pageFor();
  try {
    await page.getByTestId('controls').evaluate((element) => element.setAttribute('data-lds-profile', 'ops'));
    const durations = await page.getByTestId('button').evaluate((element) => ({
      fast: getComputedStyle(element).getPropertyValue('--dur-fast').trim(),
      transitions: getComputedStyle(element).transitionDuration.split(',').map(Number.parseFloat),
    }));
    assert.equal(durations.fast, '80ms');
    assert.ok(durations.transitions.every((duration) => duration === 0.08), `Nested ops fast=80ms must resolve locally, got ${durations.transitions}`);
  } finally { await page.close(); }
});

test('Button keeps width and keyboard focus while loading, and blocks repeat activation', async () => {
  const { page, errors } = await pageFor();
  try {
    const button = page.getByTestId('button');
    const before = await button.boundingBox();
    await button.focus();
    await page.keyboard.press('Enter');
    assert.equal(await button.getAttribute('aria-busy'), 'true');
    assert.equal(await button.getAttribute('aria-disabled'), 'true');
    assert.equal(await button.evaluate((element) => element === document.activeElement && !element.disabled), true);
    assert.equal(await page.getByTestId('activated').textContent(), '1');
    assert.ok(Math.abs((await button.boundingBox()).width - before.width) < 0.5);
    assert.ok(Math.abs((await button.boundingBox()).height - before.height) < 0.5);
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    await button.click({ force: true });
    assert.equal(await page.getByTestId('activated').textContent(), '1');
    await page.evaluate(() => window.controlFixture.setLoading(false));
    await button.focus();
    await page.keyboard.press('Space');
    assert.equal(await page.getByTestId('activated').textContent(), '2');
    assert.equal(await page.getByTestId('disabled-button').isDisabled(), true);
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});

async function assertSelectionEndpoint(page) {
  await page.waitForFunction(() => {
    const group = document.querySelector('[data-testid="segmented"]');
    const selected = group.querySelector('[aria-checked="true"]').getBoundingClientRect();
    const surface = group.querySelector('[data-lds-segmented-surface]').getBoundingClientRect();
    return ['x','y','width','height'].every((axis) => Math.abs(selected[axis] - surface[axis]) < 1);
  });
}

for (const reducedMotion of ['no-preference', 'reduce']) test(`SegmentedControl: rapid selection, resize, RTL, keyboard and disabled endpoint (${reducedMotion})`, async () => {
  const { page, errors } = await pageFor({ reducedMotion });
  try {
    const group = page.getByTestId('segmented');
    const radios = group.getByRole('radio');
    for (const index of [1,3,0,1]) await radios.nth(index).click();
    assert.equal(await page.getByTestId('selected-value').textContent(), 'history');
    assert.deepEqual(JSON.parse(await page.getByTestId('selection-history').textContent()), ['history','log','status','history']);
    await assertSelectionEndpoint(page);
    await page.evaluate(() => window.controlFixture.setWidth(240));
    await page.waitForFunction(() => document.querySelector('[data-testid="segmented-width"]').getBoundingClientRect().width === 240);
    await assertSelectionEndpoint(page);
    assert.equal(await group.evaluate((element) => element.scrollWidth <= element.clientWidth + 1), true);
    assert.ok((await radios.nth(1).textContent()).includes('최근 장치 연결 및 동작 이력8'));
    assert.equal(await radios.nth(2).isDisabled(), true);
    await radios.nth(1).focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await radios.nth(3).getAttribute('aria-checked'), 'true');
    assert.equal(await radios.nth(3).evaluate((element) => element === document.activeElement), true);
    await page.keyboard.press('Home');
    assert.equal(await radios.nth(0).getAttribute('aria-checked'), 'true');
    await page.keyboard.press('End');
    assert.equal(await radios.nth(3).getAttribute('aria-checked'), 'true');
    await page.evaluate(() => window.controlFixture.setDirection('rtl'));
    await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-testid="segmented"]')).direction === 'rtl');
    await radios.nth(0).focus();
    await page.keyboard.press('ArrowLeft');
    assert.equal(await radios.nth(1).getAttribute('aria-checked'), 'true');
    await assertSelectionEndpoint(page);
    const disabled = page.getByTestId('disabled-segmented');
    assert.equal(await disabled.getByRole('radio', { checked: true }).isDisabled(), true);
    assert.notEqual(await disabled.locator('[data-lds-segmented-surface]').evaluate((element) => getComputedStyle(element).backgroundColor), 'rgba(0, 0, 0, 0)');
    if (reducedMotion === 'reduce') assert.equal(await group.locator('[data-lds-segmented-motion]').evaluateAll((elements) => elements.every((element) => getComputedStyle(element).transitionDuration.split(',').every((value) => Number.parseFloat(value) === 0))), true);
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});

test('SegmentedControl: parent DOM direction mutations realign the surface without changing selection', async () => {
  const { page, errors } = await pageFor();
  try {
    const group = page.getByTestId('segmented');
    const radios = group.getByRole('radio');
    await assertSelectionEndpoint(page);
    const expectEndpoint = async () => {
      try {
        await page.waitForFunction(() => {
          const group = document.querySelector('[data-testid="segmented"]');
          const selected = group.querySelector('[aria-checked="true"]').getBoundingClientRect();
          const surface = group.querySelector('[data-lds-segmented-surface]').getBoundingClientRect();
          return ['x','y','width','height'].every((axis) => Math.abs(selected[axis] - surface[axis]) < 1);
        }, undefined, { timeout: 1000 });
      } catch (error) {
        const geometry = await group.evaluate((element) => {
          const selected = element.querySelector('[aria-checked="true"]').getBoundingClientRect();
          const surface = element.querySelector('[data-lds-segmented-surface]').getBoundingClientRect();
          return { direction: getComputedStyle(element).direction, selectedX: selected.x, surfaceX: surface.x, selectedWidth: selected.width, surfaceWidth: surface.width };
        });
        assert.fail(`Parent-only dir mutation must update selection geometry: ${JSON.stringify(geometry)} (${error.message.split('\n')[0]})`);
      }
    };
    // Mutate the existing parent DOM only: React props/children and width stay
    // identical, so neither React layout nor ResizeObserver can mask the bug.
    await page.getByTestId('segmented-width').evaluate((element) => { element.dir = 'rtl'; });
    await expectEndpoint();
    assert.equal(await radios.nth(0).getAttribute('aria-checked'), 'true');
    assert.equal(await page.getByTestId('selected-value').textContent(), 'status');
    assert.equal(await page.getByTestId('selection-history').textContent(), '[]');
    for (const direction of ['ltr', 'rtl', 'ltr', 'rtl', 'ltr']) {
      await page.getByTestId('segmented-width').evaluate((element, next) => { element.dir = next; }, direction);
    }
    await expectEndpoint();
    assert.equal(await group.evaluate((element) => getComputedStyle(element).direction), 'ltr');
    assert.equal(await radios.nth(0).getAttribute('aria-checked'), 'true');
    assert.equal(await page.getByTestId('selected-value').textContent(), 'status');
    assert.equal(await page.getByTestId('selection-history').textContent(), '[]');
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});

for (const kind of ['part', 'option', 'class', 'option-class']) test(`SegmentedControl: custom paint (${kind}) owns the selected fill, shadow and radius`, async () => {
  const { page, errors } = await pageFor();
  try {
    const group = page.getByTestId(`paint-${kind}`);
    const selected = group.getByRole('radio', { checked: true });
    const paint = await selected.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, shadow: style.boxShadow, radius: style.borderRadius };
    });
    assert.deepEqual(paint, { background: 'rgba(0, 0, 0, 0)', shadow: 'none', radius: '0px' });
    assert.equal(await group.locator('[data-lds-segmented-surface]').count(), 0,
      'A separate default fill/shadow must not remain behind customized segment paint.');
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});

for (const reducedMotion of ['no-preference', 'reduce']) test(`SegmentedControl: custom paint preserves live controlled/disabled state and normal hooks keep motion (${reducedMotion})`, async () => {
  const { page, errors } = await pageFor({ reducedMotion });
  try {
    const custom = page.getByTestId('paint-part');
    const radios = custom.getByRole('radio');
    const normal = page.getByTestId('paint-normal');
    const surface = normal.locator('[data-lds-segmented-surface]');
    assert.equal(await surface.count(), 1, 'Root classes and text/geometry styles must retain the shared selection surface.');
    assert.equal(await normal.evaluate((element) => element.offsetHeight), 44);
    const durations = await surface.evaluate((element) => getComputedStyle(element).transitionDuration.split(',').map(Number.parseFloat));
    assert.ok(reducedMotion === 'reduce' ? durations.every((duration) => duration === 0) : durations.includes(0.2),
      'Normal root/text/layout hooks must preserve base movement timing and the reduced-motion endpoint.');
    await radios.nth(0).focus();
    await page.evaluate(() => window.paintFixture.setValue('log'));
    assert.equal(await radios.nth(1).getAttribute('aria-checked'), 'true');
    assert.equal(await radios.nth(0).evaluate((element) => element === document.activeElement), true);
    await page.waitForFunction(() => {
      const group = document.querySelector('[data-testid="paint-normal"]');
      const selected = group.querySelector('[aria-checked="true"]').getBoundingClientRect();
      const indicator = group.querySelector('[data-lds-segmented-surface]').getBoundingClientRect();
      return ['x','y','width','height'].every((axis) => Math.abs(selected[axis] - indicator[axis]) < 1);
    });
    assert.equal(await page.getByTestId('paint-option-class').locator('[data-lds-segmented-surface]').count(), 1,
      'Returning to an uncustomized option must restore its normal shared surface.');
    await page.evaluate(() => { window.paintFixture.setValue('status'); window.paintFixture.setDisabled(true); });
    assert.equal(await radios.nth(0).isDisabled(), true);
    assert.equal(await radios.nth(0).getAttribute('aria-checked'), 'true');
    await radios.nth(0).click({ force: true });
    assert.equal(await page.getByTestId('paint-history').textContent(), '[]');
    assert.equal(await custom.locator('[data-lds-segmented-surface]').count(), 0);
    await page.evaluate(() => { window.paintFixture.setDisabled(false); window.paintFixture.setValue('log'); });
    await page.waitForFunction(() => {
      const radios = document.querySelector('[data-testid="paint-part"]').querySelectorAll('[role="radio"]');
      return !radios[0].disabled && radios[1].getAttribute('aria-checked') === 'true';
    });
    await radios.nth(1).focus();
    await page.keyboard.press('Home');
    assert.equal(await radios.nth(0).getAttribute('aria-checked'), 'true');
    assert.equal(await radios.nth(0).evaluate((element) => element === document.activeElement), true);
    assert.equal(await page.getByTestId('paint-history').textContent(), '["status"]');
    if (reducedMotion === 'reduce') assert.equal(await custom.locator('[data-lds-segmented-motion]').evaluateAll((elements) => elements.every((element) => getComputedStyle(element).transitionDuration.split(',').every((duration) => Number.parseFloat(duration) === 0))), true);
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});

for (const reducedMotion of ['no-preference', 'reduce']) test(`Switch and disclosure preserve latest endpoint and keyboard semantics (${reducedMotion})`, async () => {
  const { page, errors } = await pageFor({ reducedMotion });
  try {
    const control = page.getByRole('switch', { name: '알림' });
    await control.focus();
    for (const key of ['Space','Enter','Space']) await page.keyboard.press(key);
    assert.equal(await control.getAttribute('aria-checked'), 'true');
    assert.equal(await control.evaluate((element) => element === document.activeElement), true);
    await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-testid="switch"]').nextElementSibling.firstElementChild).transform === 'matrix(1, 0, 0, 1, 20, 0)');
    for (const id of ['accordion','collapsible']) {
      const disclosure = page.getByTestId(id);
      const trigger = disclosure.getByRole('button').first();
      for (let count = 0; count < 3; count += 1) await trigger.click();
      assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
      const panel = disclosure.getByRole('region');
      assert.equal(await panel.getAttribute('inert'), null);
      await page.waitForFunction((testId) => {
        const panel = document.querySelector('[data-testid="'+testId+'"] [role="region"]');
        return panel.getBoundingClientRect().height >= panel.scrollHeight - 1;
      }, id);
      await trigger.click();
      assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
      assert.equal(await panel.getAttribute('inert'), '');
      if (reducedMotion === 'reduce') assert.equal(await disclosure.locator('[data-lds-'+id+'-motion]').evaluateAll((elements) => elements.every((element) => getComputedStyle(element).transitionDuration.split(',').every((value) => Number.parseFloat(value) === 0))), true);
    }
    if (reducedMotion === 'reduce') assert.equal(await page.locator('[data-lds-switch-motion]').evaluateAll((elements) => elements.every((element) => getComputedStyle(element).transitionDuration.split(',').every((value) => Number.parseFloat(value) === 0))), true);
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});
