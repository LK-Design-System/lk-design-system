import { createReadStream } from 'node:fs';
import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { build } from 'vite';
import { chromium } from '@playwright/test';

const root = process.cwd();
const appDir = path.join(root, 'visual-artifacts', 'consumer-smoke');
const srcDir = path.join(appDir, 'src');
const outDir = path.join(appDir, 'dist');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.webp')) return 'image/webp';
  if (filePath.endsWith('.woff2')) return 'font/woff2';
  return 'application/octet-stream';
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

const indexHtml = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LK DS Consumer Smoke</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/App.jsx"></script>
  </body>
</html>
`;

const appSource = `import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button as RootButton } from '@lk-design-system/design-system-core';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Toast,
} from '@lk-design-system/design-system-core/core';
import {
  Lockup,
  ThemeToggle,
} from '@lk-design-system/design-system-core/theme';
import {
  Table,
  TopBar,
  TopBarNavItem,
} from '@lk-design-system/design-system-core/product';
import { RobotStatusCard } from '@lk-design-system/design-system-core/robotics';
import '@lk-design-system/design-system-core/styles.css';

const rows = [
  { id: 'RB-01', status: '정상', battery: '82%' },
  { id: 'RB-02', status: '점검', battery: '47%' },
];
const columns = [
  { key: 'id', label: '로봇' },
  { key: 'status', label: '상태', render: (row) => <Badge tone={row.status === '정상' ? 'success' : 'warning'}>{row.status}</Badge> },
  { key: 'battery', label: '배터리', align: 'right' },
];

function App() {
  return (
    <main data-testid="consumer-smoke" style={{ minHeight: '100vh', background: 'var(--surface-page)', color: 'var(--label-normal)' }}>
      <TopBar
        brand={<Lockup />}
        actions={<ThemeToggle target={null} persist={false} defaultValue="light" />}
      >
        <TopBarNavItem active>관제</TopBarNavItem>
        <TopBarNavItem>로봇</TopBarNavItem>
      </TopBar>
      <section style={{ display: 'grid', gap: 24, maxWidth: 960, margin: '0 auto', padding: 32 }}>
        <Card>
          <h1 style={{ marginTop: 0 }}>LK 디자인 시스템 소비 앱 스모크</h1>
          <p>패키지명 import, styles.css export, React 컴포넌트 조합이 소비 앱 번들에서 동작해야 합니다.</p>
          <Button>운영 화면 열기</Button>
          <RootButton variant="secondary">Root compatibility</RootButton>
        </Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
          <RobotStatusCard name="RB-01" status="online" battery={82} mode="순찰" selected />
          <EmptyState title="알림 없음" description="현재 조치가 필요한 운영 이벤트가 없습니다." action={<Button variant="secondary">새로고침</Button>} />
        </div>
        <Table columns={columns} rows={rows} />
        <Toast tone="success">소비 앱 스모크 빌드가 완료되었습니다.</Toast>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
`;

async function main() {
  await rm(appDir, { recursive: true, force: true });
  await mkdir(srcDir, { recursive: true });
  await writeFile(path.join(appDir, 'index.html'), indexHtml, 'utf8');
  await writeFile(path.join(srcDir, 'App.jsx'), appSource, 'utf8');

  await build({
    root: appDir,
    base: './',
    logLevel: 'warn',
    build: {
      outDir,
      emptyOutDir: true,
    },
  });

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
    await page.waitForSelector('[data-testid="consumer-smoke"]', { timeout: 15000 });
    await page.getByText('LK 디자인 시스템 소비 앱 스모크').waitFor({ timeout: 5000 });
    await page.getByRole('button', { name: '운영 화면 열기', exact: true }).waitFor({ timeout: 5000 });
    await page.locator('text=RB-01').first().waitFor({ timeout: 5000 });
    const bodyText = await page.locator('body').innerText();
    assert(bodyText.includes('소비 앱 스모크 빌드가 완료되었습니다.'), 'Consumer smoke page did not render Toast content.');
  } finally {
    await browser.close();
    server.close();
  }

  const uniqueConsoleErrors = [...new Set(consoleErrors)].filter((message) => !/ResizeObserver loop/.test(message));
  assert(uniqueConsoleErrors.length === 0, `Consumer smoke emitted console/page errors:\n${uniqueConsoleErrors.join('\n')}`);
  console.log('Validated consumer smoke: aggregate compatibility plus Core/Theme/Product/Robotics imports, styles.css, Vite production build, and rendered operational page passed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
