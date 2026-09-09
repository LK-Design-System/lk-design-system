import { build } from 'esbuild';
import { chromium, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const out = 'visual-artifacts/line-chart-tooltip';
await mkdir(out, { recursive: true });
const result = await build({
  stdin: { contents: `import React from 'react'; import {createRoot} from 'react-dom/client';
    import {LineChart} from './components/data/LineChart.jsx';
    createRoot(document.getElementById('root')).render(<LineChart aria-label="측정 이력" width={800}
      showTooltip tooltipXValues={[0,1,2]} xDomain={[0,2]} yDomain={[0,100]}
      series={[{name:'CPU',points:[{x:0,y:0},{x:2,y:40}]}]}
      renderTooltip={x=><span>시각 {x}: {x===1?'미수집':x===0?'0%':'40%'}</span>} />);`,
    resolveDir: process.cwd(), loader: 'jsx' }, bundle: true, write: false, format: 'iife',
});
const css = (await Promise.all(['color-atomic','color-semantic','base','effects','components'].map(name=>readFile(`tokens/${name}.css`,'utf8')))).join('\n');
const server = createServer((req,res) => {
  res.setHeader('Content-Type',req.url==='/app.js'?'text/javascript':'text/html');
  res.end(req.url==='/app.js'?result.outputFiles[0].text:`<!doctype html><style>${css}</style><div id="root"></div><script src="/app.js"></script>`);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser = await chromium.launch({headless:true, channel:process.env.LDS_BROWSER_CHANNEL || undefined});
try {
  const page = await browser.newPage({viewport:{width:960,height:600}});
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const chart = page.getByRole('img',{name:'측정 이력'});
  await chart.focus();
  await expect(page.getByRole('tooltip')).toContainText('40%');
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tooltip')).toContainText('미수집');
  await page.keyboard.press('Home');
  await expect(page.getByRole('tooltip')).toContainText('0%');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await chart.evaluate(node => node.blur());
  await page.mouse.move(950,550);
  await chart.hover({position:{x:410,y:100}});
  await expect(page.getByRole('tooltip')).toContainText('미수집');
  const firstPosition = await page.getByRole('tooltip').boundingBox();
  await chart.hover({position:{x:650,y:150}});
  const secondPosition = await page.getByRole('tooltip').boundingBox();
  expect(secondPosition.x).toBeGreaterThan(firstPosition.x + 100);
  expect(secondPosition.y).toBeGreaterThan(firstPosition.y + 20);
  await page.getByRole('tooltip').hover();
  await page.waitForTimeout(250);
  await expect(page.getByRole('tooltip')).toBeVisible();
  await page.screenshot({path:`${out}/desktop.png`});
  await page.mouse.move(950, 550);
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await page.setViewportSize({width:360,height:600});
  await chart.focus();
  await page.keyboard.press('End');
  await expect(page.getByRole('tooltip')).toContainText('40%');
  await page.screenshot({path:`${out}/narrow.png`});
  await writeFile(`${out}/result.json`,JSON.stringify({keyboard:true,zero:true,gap:true,escape:true,hover:true,followPointer:true,widths:[960,360]}));
  console.log('PASS: tooltip keyboard, zero, missing data, Escape, pointer following, hover persistence, normal/narrow viewports');
} finally {await browser.close();server.close();}
