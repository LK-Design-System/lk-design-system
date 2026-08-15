#!/usr/bin/env node
/**
 * check:consumer-toolchain — 소비자 도구 체인 검증 (타입 해석 · 제2 번들러)
 *
 * ## 이 검사가 존재하는 이유 (중복이 아닌 이유)
 *
 * 런타임 소비 검증은 이미 `check:workspace-consumer`
 * (check-workspace-consumer-matrix.mjs)가 소유한다. 그쪽은 sha256으로 봉인된
 * tarball 세트를 React 18·19 두 fixture에 설치해 ESM·CJS·SSR·Vite 빌드·
 * 브라우저까지 확인한다. 이 스크립트는 그것을 반복하지 않는다.
 *
 * 그 매트릭스가 보지 않는 두 축만 본다 (2026-08-15 확인: 해당 스크립트에
 * `tsc`/`typescript`/`.d.ts` 언급 0건, `webpack` 언급 0건):
 *
 *   1. **TypeScript 해석.** 우리 dist의 `.d.ts`는 `export {X} from './X.jsx'`
 *      형태로 재수출한다. 이건 TS의 확장자 매핑에 의존하므로 소비자의
 *      `moduleResolution` 설정에 따라 갈린다. 타입이 안 잡히면 소비자는
 *      앰비언트 선언을 손으로 쓰게 된다 — lds-motion이 실제로 그랬다.
 *   2. **제2 번들러 계열.** 매트릭스는 Vite·esbuild(같은 계열)만 쓴다.
 *      webpack은 확장자·조건부 exports 해석 관습이 달라 별도 신호다.
 *
 * 추가로 퍼블리시 패키지에 `file:` 의존이 없는지 정적으로 막는다. `npm pack`은
 * `*.tgz`를 무조건 제외하므로, file: 참조는 tarball에 담기지 않아 소비자
 * 설치에서 반드시 깨진다 (lds-slides-ui가 이 함정을 밟았고, 소비자가
 * overrides로 우회해야 했다).
 *
 * 배경과 계약 전문: docs/SYSTEM_PARTITION_REFORM_PLAN.md R2.
 *
 * 사용:
 *   node scripts/check-consumer-toolchain.mjs
 *   node scripts/check-consumer-toolchain.mjs --keep        실패 조사용 보존
 *   node scripts/check-consumer-toolchain.mjs --no-webpack  타입 축만
 */
import { execFileSync, execSync } from 'node:child_process';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = process.cwd();
const keep = process.argv.includes('--keep');
const withWebpack = !process.argv.includes('--no-webpack');
const isWindows = process.platform === 'win32';

const rootPkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
// 소비자가 쓰는 도구 버전은 저장소 devDependencies와 맞춘다 —
// 이 검사에서만 다른 버전을 쓰는 상황을 만들지 않기 위해서다.
const pin = (name, fallback) => rootPkg.devDependencies?.[name] ?? fallback;

const WORKSPACES = [
  { dir: 'packages/core', name: '@lk-design-system/lds-core' },
  { dir: 'packages/theme', name: '@lk-design-system/lds-theme' },
  { dir: 'packages/product', name: '@lk-design-system/lds-product' },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function run(command, args, options = {}) {
  const stdio = options.inherit ? 'inherit' : 'pipe';
  const base = { encoding: 'utf8', ...options, stdio };
  delete base.inherit;

  // Windows에서 npm/npx는 .cmd 배치라 Node가 shell 없이는 실행을 거부한다
  // (CVE-2024-27980 대응). 이때는 인자를 배열로 넘기지 않고 인용해 한 줄로
  // 조립한다 — shell:true + args 배열 조합은 Node가 DEP0190으로 경고한다.
  if (isWindows && command.endsWith('.cmd')) {
    const quote = (value) => (/[\s"&|<>^]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);
    return execSync([command, ...args.map(quote)].join(' '), base);
  }
  return execFileSync(command, args, base);
}

const npm = isWindows ? 'npm.cmd' : 'npm';
const npx = isWindows ? 'npx.cmd' : 'npx';

function step(label) {
  process.stdout.write(`\n[consumer-toolchain] ${label}\n`);
}

// ------------------------------------------------- 정적 계약 (설치 없이 검사)

step('퍼블리시 계약: file: 의존 금지 · 타입 진입점 선언');
for (const workspace of WORKSPACES) {
  const pkgPath = path.join(root, workspace.dir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

  for (const [depName, range] of Object.entries(pkg.dependencies ?? {})) {
    assert(
      !String(range).startsWith('file:'),
      `${workspace.name}: dependencies의 ${depName}이 file: 참조다. ` +
        'npm pack이 *.tgz를 제외하므로 tarball에 담기지 않아 소비자 설치가 깨진다.',
    );
  }
  assert(
    pkg.types || pkg.exports?.['.']?.types,
    `${workspace.name}: 타입 진입점(types 또는 exports['.'].types)이 선언돼 있지 않다.`,
  );

  const dist = path.join(root, workspace.dir, 'dist');
  assert(
    existsSync(dist) && readdirSync(dist).length > 0,
    `${workspace.name}: dist/가 없다. 먼저 \`npm run build\`를 실행하라.`,
  );
}
process.stdout.write('  통과\n');

// ------------------------------------------------------------------- 준비

const workDir = mkdtempSync(path.join(tmpdir(), 'lds-consumer-toolchain-'));
const tarballDir = path.join(workDir, 'tarballs');
const appDir = path.join(workDir, 'app');
mkdirSync(tarballDir, { recursive: true });
mkdirSync(path.join(appDir, 'src'), { recursive: true });

let failure = null;
try {
  step('tarball 생성');
  const tarballs = {};
  for (const workspace of WORKSPACES) {
    const stdout = run(npm, [
      'pack', '--json', '--ignore-scripts',
      '--pack-destination', tarballDir,
    ], { cwd: path.join(root, workspace.dir) });
    const [result] = JSON.parse(stdout);
    assert(result?.filename, `${workspace.name}: npm pack이 파일명을 반환하지 않았다.`);
    tarballs[workspace.name] = path.join(tarballDir, result.filename);
    process.stdout.write(`  ${workspace.name} → ${result.filename}\n`);
  }

  step('소비자 프로젝트 생성 (저장소 밖 — 워크스페이스 상향 해석 차단)');
  writeFileSync(
    path.join(appDir, 'package.json'),
    `${JSON.stringify(
      {
        name: 'lds-consumer-toolchain',
        version: '0.0.0',
        private: true,
        type: 'module',
        dependencies: {
          ...Object.fromEntries(
            Object.entries(tarballs).map(([name, file]) => [
              name,
              `file:${file.split(path.sep).join('/')}`,
            ]),
          ),
          react: pin('react', '^19.2.3'),
          'react-dom': pin('react-dom', '^19.2.3'),
        },
        devDependencies: {
          typescript: pin('typescript', '^5.9.3'),
          '@types/react': pin('@types/react', '^19.2.7'),
          '@types/react-dom': pin('@types/react-dom', '^19.2.3'),
          ...(withWebpack
            ? {
                webpack: '^5.102.1',
                'webpack-cli': '^6.0.1',
                'esbuild-loader': '^4.4.0',
                'css-loader': '^7.1.2',
                'style-loader': '^4.0.0',
              }
            : {}),
        },
      },
      null,
      2,
    )}\n`,
  );

  // skipLibCheck를 끈 채로 본다 — 켜면 우리 .d.ts의 결함이 그대로 숨는다.
  // moduleResolution은 'bundler': dist의 .d.ts가 './X.jsx'로 재수출하므로
  // 확장자 매핑이 되는 설정이어야 한다. 소비자가 이 설정을 쓸 것이라는
  // 가정 자체가 계약의 일부이고, 그래서 여기서 고정해 검증한다.
  writeFileSync(
    path.join(appDir, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          lib: ['ES2020', 'DOM'],
          module: 'ESNext',
          moduleResolution: 'bundler',
          jsx: 'react-jsx',
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          skipLibCheck: false,
        },
        include: ['src'],
      },
      null,
      2,
    )}\n`,
  );

  // 세 패키지의 값·타입·CSS를 실제로 쓴다. import만 하고 사용하지 않으면
  // 번들러가 떨어내서 검증이 헐거워진다.
  writeFileSync(
    path.join(appDir, 'src', 'entry.tsx'),
    `import { Button } from '@lk-design-system/lds-core';
import '@lk-design-system/lds-core/styles.css';
import '@lk-design-system/lds-theme/styles.css';
import '@lk-design-system/lds-product/styles.css';
import { createElement, type ComponentProps } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// prop 타입이 실제로 잡히는지 — any로 무너지면 이 별칭이 무의미해진다.
type ButtonProps = ComponentProps<typeof Button>;
const props: ButtonProps = { children: '소비자 도구 체인' };

export const markup: string = renderToStaticMarkup(createElement(Button, props));
document.body.innerHTML = markup;
`,
  );

  if (withWebpack) {
    writeFileSync(
      path.join(appDir, 'webpack.config.js'),
      `import path from 'node:path';
export default {
  mode: 'production',
  entry: './src/entry.tsx',
  output: {path: path.resolve(process.cwd(), 'dist-webpack'), filename: 'bundle.js'},
  resolve: {extensions: ['.ts', '.tsx', '.js', '.jsx']},
  module: {
    rules: [
      {test: /\\.[jt]sx?$/, exclude: /node_modules/, loader: 'esbuild-loader', options: {loader: 'tsx', target: 'es2020'}},
      {test: /\\.css$/, use: ['style-loader', 'css-loader']},
    ],
  },
  performance: {hints: false},
  stats: 'errors-warnings',
};
`,
    );
  }

  step('콜드 설치 (tarball + 레지스트리, 캐시 격리)');
  run(npm, [
    'install', '--no-audit', '--no-fund',
    '--cache', path.join(workDir, 'npm-cache'),
  ], { cwd: appDir, inherit: true });

  for (const workspace of WORKSPACES) {
    const installed = path.join(appDir, 'node_modules', ...workspace.name.split('/'));
    assert(existsSync(installed), `${workspace.name}: 소비자 node_modules에 설치되지 않았다.`);
    const installedPkg = JSON.parse(readFileSync(path.join(installed, 'package.json'), 'utf8'));
    const types = installedPkg.exports?.['.']?.types ?? installedPkg.types;
    assert(
      types && existsSync(path.join(installed, types)),
      `${workspace.name}: 타입 진입점 ${types}이 tarball에 담기지 않았다.`,
    );
  }

  step('축 1 — tsc --noEmit (skipLibCheck 끔, strict)');
  run(npx, ['tsc', '--noEmit'], { cwd: appDir, inherit: true });
  process.stdout.write('  타입 해석 OK\n');

  if (withWebpack) {
    step('축 2 — webpack 빌드 (Vite/esbuild와 다른 해석 관습)');
    run(npx, ['webpack', '--config', 'webpack.config.js'], { cwd: appDir, inherit: true });
    const bundle = path.join(appDir, 'dist-webpack', 'bundle.js');
    assert(existsSync(bundle), 'webpack이 번들을 만들지 않았다.');
    const bytes = readFileSync(bundle, 'utf8');
    assert(bytes.length > 1000, `webpack 번들이 비정상적으로 작다 (${bytes.length}바이트).`);
    process.stdout.write(`  webpack 번들 ${Math.round(bytes.length / 1024)}KB OK\n`);
  }

  step('통과 — 소비자가 타입 선언과 제2 번들러로도 우회 없이 소비한다.');
} catch (error) {
  failure = error;
} finally {
  if (keep || failure) {
    process.stdout.write(`\n[consumer-toolchain] 임시 프로젝트 보존: ${appDir}\n`);
  } else {
    rmSync(workDir, { recursive: true, force: true });
  }
}

if (failure) {
  process.stderr.write(`\n[consumer-toolchain] 실패: ${failure.message}\n`);
  if (failure.stdout) process.stderr.write(`${failure.stdout}\n`);
  if (failure.stderr) process.stderr.write(`${failure.stderr}\n`);
  process.exit(1);
}
