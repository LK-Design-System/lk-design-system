import {
  Col,
  Columns,
  Grid,
} from '../src/index.js';
import {
  ColumnsColCard as ColumnsColCardStory,
  GridCard as GridCardStory,
} from './Layout.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Layout/Grid and Columns',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-layout-grid-and-columns--grid-and-columns',
      eyebrow: 'Core / Grid and Columns',
      title: '콘텐츠 관계를 유지하며 화면 너비에 맞춰 열을 재배치합니다',
      description:
        '주요·보조 영역의 비율이나 반복 카드의 최소 너비가 여러 화면 구간에서 유지되어야 할 때 적합합니다. 단순한 한 방향 간격에는 Grid를 사용하지 말고 Stack 또는 Cluster를 사용하세요.',
    },
    docs: {
      description: {
        component: '반응형 열 배치와 반복 카드 배치에 쓰는 Columns, Col, Grid 패턴입니다.',
      },
    },
  },
};

export default meta;

const sampleTile = (label, tone = 'normal') => (
  <div
    style={{
      minHeight: 84,
      display: 'grid',
      placeItems: 'center',
      border: '1px solid var(--color-semantic-line-normal-normal)',
      borderRadius: 'var(--radius-lg)',
      background: tone === 'accent' ? 'var(--color-semantic-primary-surface-normal)' : 'var(--color-semantic-background-elevated-normal)',
      color: tone === 'accent' ? 'var(--color-semantic-primary-heavy)' : 'var(--color-semantic-label-neutral)',
      fontWeight: 'var(--fw-bold)',
    }}
  >
    {label}
  </div>
);

export const GridAndColumns = {
  name: '개요',
  parameters: storyDescription(
    '주요 영역과 보조 영역을 12단 컬럼으로 나누고 반복 카드를 최소 너비 기반으로 배치하는 상황입니다. 브레이크포인트에서 열 비율이 의도대로 바뀌고 반복 항목이 넘침 없이 균등하게 재배치되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 960 }}>
      <Columns gap="var(--space-4)">
        <Col span={12} md={8}>{sampleTile('메인 영역 md=8', 'accent')}</Col>
        <Col span={12} md={4}>{sampleTile('보조 영역 md=4')}</Col>
      </Columns>

      <Grid minItemWidth={180} gap="var(--space-4)">
        {['문서 카드', '상태 카드', '설정 카드', '알림 카드'].map((label) => sampleTile(label))}
      </Grid>
    </main>
  ),
};

export const ColumnsColCard = { ...ColumnsColCardStory, name: 'Columns · Col card parity', tags: ['!dev', 'visual-parity'] };
export const GridCard = { ...GridCardStory, name: 'Grid card parity', tags: ['!dev', 'visual-parity'] };

// --- Grid guideline specimen -------------------------------------------------
// Mirrors the source Foundation / Grid page: breakpoints, the 2/3/12 column grids,
// container tiers, the 4px spacing rule, and the side-margin note. Every value
// is the canonical grid token.
const GRID_TINT = 'var(--grid-overlay-fill)';
const GRID_EDGE = 'var(--grid-overlay-line)';

const BREAKPOINTS = [
  ['xs', '모바일', '< 768px', 2],
  ['sm', '태블릿', '768 – 991px', 3],
  ['md', '태블릿', '992 – 1199px', 3],
  ['lg', '데스크톱', '1200 – 1599px', 12],
  ['xl', '데스크톱', '1600px +', 12],
];

function ColumnGridPreview({ cols, caption }) {
  return (
    <figure style={{ margin: 0, display: 'grid', gap: 8, minWidth: 0 }}>
      <div style={{ border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)', padding: 20, minWidth: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 20, height: 96 }}>
          {Array.from({ length: cols }, (_, i) => (
            <div key={i} style={{ background: GRID_TINT, borderInline: `1px solid ${GRID_EDGE}`, borderRadius: 2 }} />
          ))}
        </div>
      </div>
      <figcaption style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12, color: 'var(--color-semantic-label-alternative)' }}>
        <span>{caption}</span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{cols}단 · 마진 20 · 거터 20</span>
      </figcaption>
    </figure>
  );
}

export const GridGuidelines = {
  name: '사용법 · 화면 구간별 열 구성',
  parameters: storyDescription(
    '모바일·태블릿·데스크톱의 컬럼 수, 컨테이너 너비, 마진, 거터, 간격 기준을 설계 전에 확인하는 상황입니다. 구현 값이 그리드 토큰과 일치하고 4px 간격 기준 및 20px 마진·거터가 각 화면 구간에 일관되게 적용되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 40, width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <header style={{ display: 'grid', gap: 10 }}>
        <p style={{ margin: 0, color: 'var(--color-semantic-label-alternative)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 1.2 }}>그리드</p>
        <h2 style={{ margin: 0 }} className="type-title2">화면 너비에 유연히 대응하는 컬럼 그리드</h2>
        <p style={{ margin: 0, maxWidth: 640 }} className="type-body1">
          거터는 20px로 두고, 화면 너비에 맞춰 컬럼을 늘리는 STRETCH 그리드를 씁니다. 모바일 2단, 태블릿 3단,
          데스크톱 12단이며 컬럼을 묶어 사용합니다. 아래 모든 값은 그리드 토큰과 동일합니다.
        </p>
      </header>

      <section style={{ display: 'grid', gap: 14 }}>
        <h2 style={{ margin: 0 }} className="type-heading1">브레이크포인트</h2>
        <div style={{ display: 'grid', gap: 0, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--color-semantic-background-elevated-normal)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px minmax(0, 1fr) minmax(0, 1.2fr) auto', gap: 12, padding: '10px 18px', background: 'var(--color-semantic-background-normal-alternative)', fontSize: 12, fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-alternative)' }}>
            <span>명칭</span><span>구분</span><span>너비 범위</span><span>컬럼</span>
          </div>
          {BREAKPOINTS.map(([key, kind, range, cols]) => (
            <div key={key} style={{ display: 'grid', gridTemplateColumns: '80px minmax(0, 1fr) minmax(0, 1.2fr) auto', gap: 12, alignItems: 'center', padding: '12px 18px', borderTop: '1px solid var(--color-semantic-line-normal-normal)', fontSize: 13 }}>
              <code style={{ color: 'var(--color-semantic-label-strong)', fontWeight: 'var(--fw-bold)' }}>{key}</code>
              <span style={{ color: 'var(--color-semantic-label-neutral)' }}>{kind}</span>
              <span style={{ color: 'var(--color-semantic-label-neutral)', fontVariantNumeric: 'tabular-nums' }}>{range}</span>
              <span style={{ color: 'var(--color-semantic-label-strong)', fontWeight: 'var(--fw-bold)', fontVariantNumeric: 'tabular-nums' }}>{cols}단</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 14 }}>
        <h2 style={{ margin: 0 }} className="type-heading1">컬럼 그리드</h2>
        <div style={{ display: 'grid', gap: 20 }}>
          <ColumnGridPreview cols={2} caption="모바일 · < 768px" />
          <ColumnGridPreview cols={3} caption="태블릿 · 768 – 1199px" />
          <ColumnGridPreview cols={12} caption="데스크톱 · 1200px +" />
        </div>
      </section>

      <section style={{ display: 'grid', gap: 14 }}>
        <h2 style={{ margin: 0 }} className="type-heading1">컨테이너 · 여백</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 16, minWidth: 0 }}>
          {[['--container-lg', '1100px', '여백 포함 그리드 최대 너비 (기본 데스크톱)'], ['--container-xl', '1440px', '여백 포함 그리드 최대 너비 (와이드 데스크톱, xl)']].map(([token, value, desc]) => (
            <div key={token} style={{ display: 'grid', gap: 6, padding: 18, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
              <div className="type-title3" style={{ color: 'var(--color-semantic-label-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
              <code style={{ fontSize: 12, color: 'var(--color-semantic-label-alternative)' }}>{token}</code>
              <span style={{ fontSize: 13, color: 'var(--color-semantic-label-neutral)' }}>{desc}</span>
            </div>
          ))}
          <div style={{ display: 'grid', gap: 6, padding: 18, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
            <div className="type-title3" style={{ color: 'var(--color-semantic-label-strong)', fontVariantNumeric: 'tabular-nums' }}>20px</div>
            <code style={{ fontSize: 12, color: 'var(--color-semantic-label-alternative)' }}>--grid-margin · --grid-gutter</code>
            <span style={{ fontSize: 13, color: 'var(--color-semantic-label-neutral)' }}>사이드 여백과 컬럼 사이 간격은 모든 구간에서 20px 고정</span>
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gap: 14 }}>
        <h2 style={{ margin: 0 }} className="type-heading1">간격 기준</h2>
        <div style={{ display: 'grid', gap: 12, padding: 20, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
          <p style={{ margin: 0 }} className="type-body2">
            예측 가능한 규칙과 개발자와의 소통을 위해 <strong style={{ color: 'var(--color-semantic-label-strong)' }}>4px 배수</strong>를 기준으로 간격을 잡습니다.
            시각 보정이 필요하면 2px씩, 불가피하면 1px씩 조정합니다.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[4, 8, 12, 16, 20, 24, 32, 40, 48, 64].map((n) => (
              <span key={n} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-pill)', fontSize: 12, color: 'var(--color-semantic-label-neutral)', fontVariantNumeric: 'tabular-nums' }}>
                <span style={{ width: n, height: 8, background: 'var(--color-semantic-primary-normal)', borderRadius: 2 }} />
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  ),
};
