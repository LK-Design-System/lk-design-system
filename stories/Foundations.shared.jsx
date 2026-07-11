import React from 'react';
import {
  ATOMIC,
  COLOR_SYSTEM_META,
  SEMANTIC_GROUPS,
  STATUS_FAMILIES,
} from './color-system.data.js';

const meta = {
  parameters: {
    docs: {
      description: {
        component: 'styles.css와 tokens/*.css에서 불러오는 핵심 토큰 예시입니다.',
      },
    },
  },
};

export default meta;

const colors = [
  ['Primary', 'var(--color-semantic-primary-normal)'],
  ['Primary hover', 'var(--color-semantic-primary-strong)'],
  ['Accent ink', 'var(--color-semantic-primary-normal)'],
  ['Accent tint', 'var(--color-semantic-primary-surface-normal)'],
  ['Ink', 'var(--color-semantic-brand-ink)'],
  ['Slate', 'var(--color-semantic-brand-surface-raised)'],
  ['Border', 'var(--color-semantic-line-solid-normal)'],
  ['Green', 'var(--color-semantic-status-positive)'],
  ['Amber', 'var(--color-semantic-status-cautionary)'],
  ['Red', 'var(--color-semantic-status-negative)'],
];

const spacings = [
  ['--space-1', '4px', '미세 간격'],
  ['--space-2', '8px', '밀착 요소 쌍'],
  ['--space-3', '12px', '컨트롤 간격'],
  ['--space-4', '16px', '카드 내부 간격'],
  ['--space-5', '20px', '컴팩트 패딩'],
  ['--space-6', '24px', '섹션 그룹 간격'],
  ['--space-8', '32px', '페이지 리듬'],
  ['--space-10', '40px', '큰 그룹 간격'],
  ['--space-12', '48px', '밴드 리듬'],
  ['--space-16', '64px', '넓은 섹션 간격'],
  ['--space-20', '80px', '큰 섹션 패딩'],
  ['--space-28', '112px', '라이트 섹션 패딩'],
  ['--space-32', '128px', '히어로 · 다크 밴드 패딩'],
];

export const Color = {
  name: '색상 토큰',
  render: () => (
    <main style={{ display: 'grid', gap: 32, width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <section>
        <h1 style={{ margin: '0 0 16px', fontSize: 28, color: 'var(--color-semantic-label-strong)' }}>색상 토큰</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: 14, minWidth: 0 }}>
          {colors.map(([label, value]) => (
            <div key={label} style={{ border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)', overflow: 'hidden' }}>
              <div style={{ height: 72, background: value }} />
              <div style={{ padding: 12 }}>
                <strong style={{ display: 'block', fontSize: 14, color: 'var(--color-semantic-label-normal)' }}>{label}</strong>
                <code style={{ fontSize: 12, color: 'var(--color-semantic-label-alternative)' }}>{value}</code>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  ),
};

export const SpacingScale = {
  name: '간격 스케일',
  render: () => (
    <main style={{ display: 'grid', gap: 32, width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <section>
        <h1 style={{ margin: '0 0 16px', fontSize: 28, color: 'var(--color-semantic-label-strong)' }}>간격 스케일</h1>
        <div style={{ display: 'grid', gap: 12 }}>
          {spacings.map(([token, value, usage]) => (
            <div key={token} style={{ display: 'grid', gridTemplateColumns: 'minmax(88px, 112px) minmax(0, 1fr) auto', alignItems: 'center', gap: '8px 12px', minWidth: 0 }}>
              <code style={{ color: 'var(--color-semantic-label-alternative)' }}>{token}</code>
              <div style={{ height: 14, width: `min(var(${token}), 100%)`, background: 'var(--color-semantic-primary-normal)', borderRadius: 'var(--radius-pill)' }} />
              <code style={{ color: 'var(--color-semantic-label-alternative)', fontVariantNumeric: 'tabular-nums' }}>{value}</code>
              <span style={{ gridColumn: '1 / -1', color: 'var(--color-semantic-label-alternative)', fontSize: 13 }}>{usage}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  ),
};

// Full type-scale specimen — mirrors the source Foundation / Typography page:
// Pretendard weight ladder, the complete 7-tier scale (Display→Caption, 16 styles),
// and applied usage examples. Every metric is read live from the rendered element
// via getComputedStyle, so the spec labels can never drift from tokens/typography.css.
const TYPE_WEIGHTS = [
  ['Regular', 'var(--fw-regular)', '본문 기본'],
  ['Medium', 'var(--fw-medium)', '본문 강조 · 라벨'],
  ['SemiBold', 'var(--fw-semibold)', 'Heading · Headline'],
  ['Bold', 'var(--fw-bold)', 'Title · Display'],
  ['ExtraBold', 'var(--fw-extra)', '수치 · 강한 강조'],
];

const TYPE_SCALE = [
  { group: 'Display', note: '히어로 · 랜딩 표제. 밀도 높은 앱 화면에서는 제한적으로.', sample: '차분한 위계 Calm', rows: [['Display 1', 'type-display1'], ['Display 2', 'type-display2'], ['Display 3', 'type-display3']] },
  { group: 'Title', note: '페이지 · 섹션 제목.', sample: '미션 경로 편집 Aa', rows: [['Title 1', 'type-title1'], ['Title 2', 'type-title2'], ['Title 3', 'type-title3']] },
  { group: 'Heading', note: '카드 · 그룹 제목.', sample: '오늘의 작업 요약', rows: [['Heading 1', 'type-heading1'], ['Heading 2', 'type-heading2']] },
  { group: 'Headline', note: '강조 본문 · 소제목.', sample: '읽기 쉬운 인터페이스 텍스트', rows: [['Headline 1', 'type-headline1'], ['Headline 2', 'type-headline2']] },
  { group: 'Body', note: '본문. Normal 외에 행간이 넉넉한 Reading 변형(--*-reading-line)이 있습니다.', sample: '밀도 높은 앱 화면에서는 읽기 쉬운 본문과 안정적인 위계가 필요합니다. Aa 123', rows: [['Body 1', 'type-body1'], ['Body 2', 'type-body2']] },
  { group: 'Label', note: '버튼 · 태그 · 폼 라벨.', sample: '상태 라벨 Label 123', rows: [['Label 1', 'type-label1'], ['Label 2', 'type-label2']] },
  { group: 'Caption', note: '보조 설명 · 메타 텍스트.', sample: '보조 설명 캡션 Caption 123', rows: [['Caption 1', 'type-caption1'], ['Caption 2', 'type-caption2']] },
];

function TypeSpecRow({ name, cls, sample }) {
  const ref = React.useRef(null);
  const [metrics, setMetrics] = React.useState(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    const px = (value) => Math.round(parseFloat(value) * 100) / 100;
    setMetrics({
      size: px(cs.fontSize),
      line: px(cs.lineHeight),
      weight: cs.fontWeight,
      tracking: cs.letterSpacing === 'normal' ? 0 : px(cs.letterSpacing),
    });
  }, []);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 190px) minmax(0, 1fr)', gap: 24, alignItems: 'baseline', padding: '14px 0', borderTop: '1px solid var(--color-semantic-line-normal-normal)', minWidth: 0 }}>
      <div style={{ display: 'grid', gap: 3, alignSelf: 'center' }}>
        <strong style={{ fontSize: 14, fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-strong)' }}>{name}</strong>
        <code style={{ fontSize: 11, color: 'var(--color-semantic-label-alternative)' }}>.{cls}</code>
        {metrics && (
          <span style={{ fontSize: 11, color: 'var(--color-semantic-label-alternative)', fontVariantNumeric: 'tabular-nums' }}>
            {metrics.size}px · line {metrics.line}px · {metrics.weight}{metrics.tracking ? ` · ${metrics.tracking}px` : ''}
          </span>
        )}
      </div>
      <div ref={ref} className={cls} style={{ color: 'var(--color-semantic-label-strong)', minWidth: 0, wordBreak: 'keep-all' }}>{sample}</div>
    </div>
  );
}

function TypographySpecimen() {
  return (
    <main style={{ display: 'grid', gap: 40, width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <header style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0, color: 'var(--color-semantic-label-alternative)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 1.2 }}>타이포그래피</p>
        <div className="type-display3" style={{ color: 'var(--color-semantic-label-strong)' }}>Pretendard <span style={{ color: 'var(--color-semantic-label-neutral)' }}>프리텐다드 プリテンダード</span></div>
        <p style={{ margin: 0, maxWidth: 640 }} className="type-body1">
          하나의 본문 서체(Pretendard JP)가 한글·라틴·가나를 모두 담당합니다. 제목은 음수 자간으로 또렷하게,
          본문은 넉넉한 행간으로 차분하게 읽히도록 설계했습니다. 아래 모든 수치는 타이포그래피 토큰에서 실시간으로 읽어 표시합니다.
        </p>
      </header>

      <section style={{ display: 'grid', gap: 14 }}>
        <h2 style={{ margin: 0 }} className="type-heading1">서체 · 굵기</h2>
        <div style={{ display: 'grid', gap: 0, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--color-semantic-background-elevated-normal)' }}>
          {TYPE_WEIGHTS.map(([label, weightVar, usage], i) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 150px) minmax(0, 1fr) auto', gap: 16, alignItems: 'baseline', padding: '14px 18px', borderTop: i === 0 ? 'none' : '1px solid var(--color-semantic-line-normal-normal)' }}>
              <span style={{ fontSize: 13, color: 'var(--color-semantic-label-alternative)' }}>{label}</span>
              <span style={{ fontSize: 26, fontWeight: weightVar, color: 'var(--color-semantic-label-strong)', letterSpacing: '-0.01em' }}>가나다라 AaBb 0123</span>
              <span style={{ fontSize: 12, color: 'var(--color-semantic-label-alternative)' }}>{usage}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 14 }}>
        <h2 style={{ margin: 0 }} className="type-heading1">타입 스케일 · 16종</h2>
        <div style={{ display: 'grid', gap: 24 }}>
          {TYPE_SCALE.map(({ group, note, sample, rows }) => (
            <div key={group} style={{ display: 'grid', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <strong style={{ fontSize: 15, color: 'var(--color-semantic-label-strong)', fontWeight: 'var(--fw-bold)' }}>{group}</strong>
                <span style={{ fontSize: 12, color: 'var(--color-semantic-label-alternative)' }}>{note}</span>
              </div>
              {rows.map(([name, cls]) => (
                <TypeSpecRow key={cls} name={name} cls={cls} sample={sample} />
              ))}
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 14 }}>
        <h2 style={{ margin: 0 }} className="type-heading1">적용 예시</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 16, minWidth: 0 }}>
          <article style={{ display: 'grid', gap: 12, padding: 24, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)', minWidth: 0 }}>
            <h3 className="type-title3" style={{ margin: 0, color: 'var(--color-semantic-label-strong)' }}>미션을 완료하고 포인트를 쌓아 보세요</h3>
            <p className="type-body2" style={{ margin: 0, color: 'var(--color-semantic-label-neutral)' }}>
              경로를 검증하고 구역을 지정하면 오늘의 작업이 자동으로 요약됩니다. 상태 패널에서 진행률을 확인하세요.
            </p>
            <span className="type-caption1" style={{ color: 'var(--color-semantic-label-alternative)' }}>최근 업데이트 · 방금 전</span>
          </article>

          <article style={{ display: 'grid', gap: 10, padding: 24, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)', minWidth: 0 }}>
            <div className="type-display3" style={{ color: 'var(--color-semantic-label-strong)', fontVariantNumeric: 'tabular-nums' }}>84m</div>
            <div className="type-headline2" style={{ color: 'var(--color-semantic-label-strong)' }}>예상 이동 거리</div>
            <div style={{ display: 'grid', gap: 6, marginTop: 4 }}>
              {[['웨이포인트', '12개'], ['경유 구역', 'Zone 3'], ['검증 상태', '검증 중']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span className="type-label1" style={{ color: 'var(--color-semantic-label-alternative)' }}>{k}</span>
                  <span className="type-label1" style={{ color: 'var(--color-semantic-label-strong)', fontWeight: 'var(--fw-bold)' }}>{v}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export const Typography = {
  name: '타이포그래피',
  render: () => <TypographySpecimen />,
};

// The showcase is generated from the same source contract as runtime CSS.
// It is an approval surface for real foundation roles, not an audit dashboard.
const SEMANTIC_GROUP_ORDER = [
  'brand', 'primary', 'secondary', 'label', 'background', 'interaction', 'line',
  'status', 'data-viz', 'accent', 'inverse', 'fill', 'material', 'static',
];

function Swatch({ varName, caption, sub }) {
  return (
    <div style={{ display: 'grid', gap: 4, minWidth: 0 }}>
      <div style={{ height: 40, borderRadius: 'var(--radius-sm)', background: `var(${varName})`, border: '1px solid var(--color-semantic-line-normal-normal)' }} />
      <div style={{ display: 'grid', gap: 1, minWidth: 0 }}>
        <span style={{ fontSize: 11, color: 'var(--color-semantic-label-neutral)', fontVariantNumeric: 'tabular-nums' }}>{caption}</span>
        {sub && <code style={{ fontSize: 9, color: 'var(--color-semantic-label-neutral)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</code>}
      </div>
    </div>
  );
}

function StatusFamily({ name, roles }) {
  const [foregroundRole, surfaceRole, borderRole, textRole] = roles.length === 4
    ? roles
    : [roles[2], roles[0], roles[1], roles[2]];
  return (
    <article
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0, 1fr)',
        gap: 10,
        alignItems: 'start',
        minWidth: 0,
        padding: 14,
        borderRadius: 'var(--radius-lg)',
        background: `var(--color-semantic-${surfaceRole})`,
        border: `1px solid var(--color-semantic-${borderRole})`,
        color: `var(--color-semantic-${textRole})`,
      }}
    >
      <span
        aria-hidden="true"
        style={{ width: 10, height: 10, marginTop: 4, borderRadius: '50%', background: `var(--color-semantic-${foregroundRole})` }}
      />
      <div style={{ display: 'grid', gap: 4, minWidth: 0 }}>
        <strong style={{ fontSize: 13, textTransform: 'capitalize' }}>{name}</strong>
        <span style={{ fontSize: 12, lineHeight: 1.5 }}>foreground · surface · border · text를 하나의 의미 계약으로 사용합니다.</span>
        <code style={{ fontSize: 10, overflowWrap: 'anywhere' }}>{roles.join(' · ')}</code>
      </div>
    </article>
  );
}

function ColorSystemSpecimen() {
  return (
    <main style={{ display: 'grid', gap: 40, width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <header style={{ display: 'grid', gap: 10 }}>
        <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 1.2 }}>Color system</p>
        <h1 style={{ margin: 0 }} className="type-title2">원자 팔레트에서 역할과 컴포넌트 계약까지</h1>
        <p style={{ margin: 0, maxWidth: 680 }} className="type-body1">
          {COLOR_SYSTEM_META.atomicTokens}개 원자 토큰과 {COLOR_SYSTEM_META.semanticTokens}개 의미 토큰이
          하나의 원본에서 생성됩니다. 제품과 컴포넌트는 원자색이 아니라 아래 의미 역할을 사용합니다.
        </p>
        <code style={{ fontSize: 11, color: 'var(--color-semantic-label-neutral)' }}>{COLOR_SYSTEM_META.source}</code>
      </header>

      <section style={{ display: 'grid', gap: 14 }}>
        <div style={{ display: 'grid', gap: 4 }}>
          <h2 style={{ margin: 0 }} className="type-heading1">상태 역할 조합</h2>
          <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)' }} className="type-body2">
            상태색은 단일 색상값이 아니라 아이콘, 배경, 테두리, 텍스트 역할을 함께 승인합니다.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
          {Object.entries(STATUS_FAMILIES).map(([name, roles]) => <StatusFamily key={name} name={name} roles={roles} />)}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 14 }}>
        <h2 style={{ margin: 0 }} className="type-heading1">의미 색상</h2>
        <div style={{ display: 'grid', gap: 18 }}>
          {SEMANTIC_GROUP_ORDER.map((group) => {
            const names = SEMANTIC_GROUPS[group] || [];
            if (!names.length) return null;
            return (
              <div key={group} style={{ display: 'grid', gap: 8 }}>
                <strong style={{ fontSize: 13, color: 'var(--color-semantic-label-strong)', textTransform: 'capitalize' }}>{group}</strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 10 }}>
                  {names.map((name) => <Swatch key={name} varName={`--color-semantic-${name}`} caption={name.startsWith(`${group}-`) ? name.slice(group.length + 1) : name} sub={`semantic-${name}`} />)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 14 }}>
        <h2 style={{ margin: 0 }} className="type-heading1">원자 팔레트</h2>
        <div style={{ display: 'grid', gap: 16 }}>
          {Object.entries(ATOMIC).map(([slug, { label, steps }]) => (
            <div key={slug} style={{ display: 'grid', gap: 6, minWidth: 0 }}>
              <strong style={{ fontSize: 12, color: 'var(--color-semantic-label-neutral)' }}>{label}</strong>
              <div style={{ display: 'flex', gap: 2, minWidth: 0, overflowX: 'auto' }}>
                {steps.map((step) => (
                  <div key={step} style={{ flex: '1 0 34px', minWidth: 34 }}>
                    <div style={{ height: 44, background: `var(--color-atomic-${slug}-${step})`, borderRadius: 3, border: '1px solid var(--color-semantic-line-normal-normal)' }} />
                    <div style={{ fontSize: 9, color: 'var(--color-semantic-label-neutral)', textAlign: 'center', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{step}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export const ColorSystem = {
  name: '색상 시스템',
  render: () => <ColorSystemSpecimen />,
};
