import React from 'react';
import { ViewerFrame } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

// This page renders the REAL --viewer-* color tokens LIVE. Each swatch's
// background is `var(--viewer-*)`, so it resolves only because it is mounted
// inside a real viewer frame, and it resolves DIFFERENTLY per appearance because
// the frame redeclares every token for light vs dark. So the catalog is not a
// hand-picked color chart: it IS the tokens as every navigation renderer sees
// them, and the play-test asserts each one resolves to a real color in both
// appearances — which makes the palette its own regression baseline.
const INK = 'var(--color-semantic-label-strong)';
const MUTED = 'var(--color-semantic-label-neutral)';
const LINE = 'var(--color-semantic-line-normal-normal)';

// The nine tokens the viewer frame owns and every renderer themes against. Order
// mirrors the frame's own declaration: chrome surfaces → text → line → tones.
const VIEWER_TOKENS = [
  { name: '--viewer-surface', label: '기본 표면' },
  { name: '--viewer-surface-elevated', label: '상승 표면' },
  { name: '--viewer-foreground', label: '전경' },
  { name: '--viewer-muted', label: '보조 전경' },
  { name: '--viewer-border', label: '경계선' },
  { name: '--viewer-accent', label: '강조' },
  { name: '--viewer-danger', label: '위험' },
  { name: '--viewer-warning', label: '주의' },
  { name: '--viewer-positive', label: '정상' },
];

const APPEARANCES = [
  { value: 'light', label: '밝은 외관 (light)' },
  { value: 'dark', label: '어두운 외관 (dark)' },
];

function Card({ title, hint, children }) {
  return (
    <section
      style={{
        display: 'grid',
        gap: 12,
        padding: 16,
        border: `1px solid ${LINE}`,
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-semantic-background-normal-normal)',
      }}
    >
      <header style={{ display: 'grid', gap: 4 }}>
        <h2 style={{ margin: 0, fontSize: 'var(--label1-size)', color: INK }}>{title}</h2>
        <p style={{ margin: 0, fontSize: 'var(--caption1-size)', color: MUTED, lineHeight: 1.6 }}>{hint}</p>
      </header>
      {children}
    </section>
  );
}

// One token chip. The colored box carries the live `var(--viewer-*)` background
// and the data hook the play-test reads; the caption names the token. The box is
// decorative (the code label is the accessible text), so it is aria-hidden.
function Tile({ token }) {
  return (
    <figure data-viewer-token-tile style={{ margin: 0, minWidth: 0, display: 'grid', gap: 8, padding: 8, borderRadius: 'var(--radius-sm)', border: '1px solid var(--viewer-border)', background: 'color-mix(in srgb, var(--viewer-foreground) 6%, transparent)' }}>
      <div
        data-viewer-token={token.name}
        aria-hidden="true"
        style={{
          height: 36,
          borderRadius: 'var(--radius-sm)',
          background: `var(${token.name})`,
          border: '1px solid var(--viewer-border)',
        }}
      />
      <figcaption style={{ display: 'grid', gap: 2, minWidth: 0 }}>
        <code style={{ fontSize: 11, color: 'var(--viewer-foreground)', overflowWrap: 'anywhere' }}>{token.name}</code>
        <span style={{ fontSize: 10, color: 'var(--viewer-muted)' }}>{token.label}</span>
      </figcaption>
    </figure>
  );
}

// The token grid, mounted inside a real viewer frame for a single appearance so
// every `var(--viewer-*)` resolves against that appearance's declarations. The
// frame's content region is absolutely positioned, so the frame carries an
// explicit height; callers size it for the columns their viewport affords.
function TokenBoard({ appearance, label, frameHeight }) {
  return (
    <ViewerFrame appearance={appearance} label={label} state="ready" style={{ height: frameHeight }}>
      <div
        style={{
          height: '100%',
          boxSizing: 'border-box',
          padding: 16,
          display: 'grid',
          gap: 10,
          gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
          alignContent: 'start',
        }}
      >
        {VIEWER_TOKENS.map((token) => (
          <Tile key={token.name} token={token} />
        ))}
      </div>
    </ViewerFrame>
  );
}

function ViewerTokenCatalog({ frameHeight = 340 }) {
  return (
    <main data-viewer-token-board style={{ width: 'min(880px, 100%)', display: 'grid', gap: 16 }}>
      <Card
        title="뷰어 색 토큰 팔레트"
        hint="같은 9개 토큰을 밝은 외관과 어두운 외관 프레임 안에서 나란히 렌더합니다. 각 스와치 배경은 var(--viewer-*)이며, 프레임 밖에서는 풀리지 않고 외관에 따라 서로 다른 실제 색으로 해석됩니다."
      >
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))' }}>
          {APPEARANCES.map((appearance) => (
            <div key={appearance.value} style={{ display: 'grid', gap: 8, minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: 'var(--caption1-size)', color: INK }}>{appearance.label}</h3>
              <TokenBoard appearance={appearance.value} label={`${appearance.label} 뷰어 토큰 팔레트`} frameHeight={frameHeight} />
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}

const meta = {
  title: 'LDS Robotics/Foundation/Viewer Tokens',
  parameters: {
    storyGuide: {
      storyId: 'lds-robotics-foundation-viewer-tokens--overview',
      eyebrow: 'Foundation / Viewer Tokens',
      title: '내비게이션 렌더러가 색을 맞추는 --viewer-* 토큰을 외관별로 문서화합니다',
      description:
        '지도·3D·영상 위의 웨이포인트·설비·해저드·차선·경로·궤적·구역 렌더러가 한 뷰포트 안에서 하나의 색 시스템으로 읽히도록, 이들이 공유하는 색 토큰 --viewer-surface·--viewer-surface-elevated·--viewer-foreground·--viewer-muted·--viewer-border·--viewer-accent·--viewer-danger·--viewer-warning·--viewer-positive 9종을 뷰어 프레임이 단일 소스로 소유합니다. 이 페이지는 그 9종을 밝은 외관과 어두운 외관 프레임 안에서 실제 색으로 그대로 렌더해, 토큰이 뷰포트 안에서만 그리고 외관에 따라 다르게 풀린다는 계약이 회귀 기준이 되도록 합니다.',
    },
    docs: {
      description: {
        component:
          '내비게이션 렌더러들이 뷰포트 안에서 색을 맞추는 기준이 되는 --viewer-* 색 토큰 9종(--viewer-surface·--viewer-surface-elevated·--viewer-foreground·--viewer-muted·--viewer-border·--viewer-accent·--viewer-danger·--viewer-warning·--viewer-positive)을 한자리에 모아, 밝은 외관과 어두운 외관에서 각각 어떤 실제 색으로 풀리는지 살아 있는 스와치로 보여줍니다. 이 토큰들은 뷰어 프레임 안에서만, 그리고 외관에 따라 다르게 해석됩니다.',
      },
    },
  },
};

export default meta;

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '9개 --viewer-* 토큰을 밝은·어두운 외관 프레임 안에서 나란히 비교합니다. 각 스와치는 var(--viewer-*)로 살아 있게 렌더되고, play-test가 두 외관 모두에서 각 토큰이 빈 값도 투명도 아닌 실제 색으로 풀리는지 단언하므로 이 페이지가 곧 토큰 해석의 회귀 기준입니다.',
  ),
  render: () => <ViewerTokenCatalog />,
  play: async ({ canvasElement }) => {
    const board = canvasElement.querySelector('[data-viewer-token-board]');
    if (!board) throw new Error('The viewer-token board is missing.');

    // Index the two rendered frames by their declared appearance.
    const frames = Array.from(board.querySelectorAll('[data-lds-viewer-frame]'));
    const framesByAppearance = {};
    for (const frame of frames) {
      framesByAppearance[frame.getAttribute('data-viewer-appearance')] = frame;
    }

    const isResolvedColor = (value) => {
      const str = String(value ?? '').trim();
      if (str === '' || str === 'transparent') return false;
      // An unresolved token computes to a fully transparent color (alpha 0);
      // parse the alpha channel rather than hardcoding the transparent literal.
      const match = str.match(/^rgba?\(([^)]+)\)$/i);
      if (match) {
        const alpha = Number(match[1].split(',').map((p) => p.trim())[3] ?? '1');
        if (Number.isFinite(alpha) && alpha === 0) return false;
      }
      return true;
    };

    // Every token must resolve to a real color inside BOTH appearance frames —
    // proving the token exists and that the frame supplies its value. A token is
    // allowed to resolve to any real color; only empty/transparent fails.
    for (const appearance of ['light', 'dark']) {
      const frame = framesByAppearance[appearance];
      if (!frame) throw new Error(`The ${appearance} viewer frame must render.`);
      for (const token of VIEWER_TOKENS) {
        const swatch = frame.querySelector(`[data-viewer-token="${token.name}"]`);
        if (!swatch) {
          throw new Error(`Token ${token.name} must render a swatch in the ${appearance} frame.`);
        }
        const resolved = getComputedStyle(swatch).backgroundColor;
        if (!isResolvedColor(resolved)) {
          throw new Error(
            `Token ${token.name} must resolve to a real color inside the ${appearance} frame (got "${resolved}").`,
          );
        }
      }
    }

    // The frame themes tokens per appearance, so the same token must resolve to
    // different colors in light vs dark — the surface token makes this obvious.
    const surfaceLight = getComputedStyle(
      framesByAppearance.light.querySelector('[data-viewer-token="--viewer-surface"]'),
    ).backgroundColor;
    const surfaceDark = getComputedStyle(
      framesByAppearance.dark.querySelector('[data-viewer-token="--viewer-surface"]'),
    ).backgroundColor;
    if (surfaceLight === surfaceDark) {
      throw new Error('--viewer-surface must resolve differently for light vs dark appearance.');
    }
  },
};

export const NarrowViewport = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 뷰포트 폭에서 토큰 팔레트를 확인합니다. 두 외관 프레임과 스와치 그리드가 좁은 폭에서 접히되 가로 스크롤을 만들지 않아야 합니다.',
  ),
  render: () => (
    <div data-viewer-token-narrow style={{ width: 320, maxWidth: '100%' }}>
      <ViewerTokenCatalog frameHeight={520} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-viewer-token-narrow]');
    if (!fixture) throw new Error('The narrow viewer-token fixture is missing.');
    if (fixture.scrollWidth > fixture.clientWidth + 1) {
      throw new Error('The viewer-token palette must not create horizontal overflow at 320px.');
    }
  },
};

export const ViewerTokensVisualParity = {
  ...Overview,
  name: 'Viewer tokens visual parity',
  tags: ['!dev', 'visual-parity'],
};
