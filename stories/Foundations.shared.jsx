import React from 'react';
import { ATOMIC, SEMANTIC } from './color-system.data.js';

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
  ['Accent tint', 'var(--lk-accent-tint)'],
  ['Ink', 'var(--bw-ink)'],
  ['Slate', 'var(--bw-slate)'],
  ['Border', 'var(--bw-border)'],
  ['Green', 'var(--bw-green)'],
  ['Amber', 'var(--bw-amber)'],
  ['Red', 'var(--bw-red)'],
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

// Two-tier color system showcase — mirrors the source Color page: the atomic
// hue ramps and the semantic role tokens. Structure is adopted from the source
// design system; every value is re-toned to the LK palette (see
// scripts/generate-lk-color-system.mjs). Reads live var(--color-*) tokens.
const SEMANTIC_GROUPS = ['primary', 'label', 'background', 'interaction', 'line', 'status', 'accent', 'inverse', 'fill', 'material', 'static'];

function Swatch({ varName, caption, sub }) {
  return (
    <div style={{ display: 'grid', gap: 4, minWidth: 0 }}>
      <div style={{ height: 40, borderRadius: 'var(--radius-sm)', background: `var(${varName})`, border: '1px solid var(--color-semantic-line-normal-normal)' }} />
      <div style={{ display: 'grid', gap: 1, minWidth: 0 }}>
        <span style={{ fontSize: 11, color: 'var(--color-semantic-label-neutral)', fontVariantNumeric: 'tabular-nums' }}>{caption}</span>
        {sub && <code style={{ fontSize: 9, color: 'var(--color-semantic-label-alternative)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</code>}
      </div>
    </div>
  );
}

function ColorSystemSpecimen() {
  return (
    <main style={{ display: 'grid', gap: 40, width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <header style={{ display: 'grid', gap: 10 }}>
        <p style={{ margin: 0, color: 'var(--color-semantic-label-alternative)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 1.2 }}>색상 시스템</p>
        <h1 style={{ margin: 0 }} className="type-title2">원자 팔레트 → 시맨틱 역할, 2단 토큰 구조</h1>
        <p style={{ margin: 0, maxWidth: 680 }} className="type-body1">
          {ATOMIC && Object.keys(ATOMIC).length}개 색상 램프({SEMANTIC.length}개 시맨틱 역할)로 이루어진 2단 구조입니다.
          구조는 원본 디자인 시스템을 따르되, 모든 값은 LK 팔레트로 재보정했습니다(명도 보존, 색상·채도 재조정). 라이트/다크에 반응합니다.
        </p>
      </header>

      <section style={{ display: 'grid', gap: 14 }}>
        <h2 style={{ margin: 0 }} className="type-heading1">시맨틱 역할</h2>
        <div style={{ display: 'grid', gap: 18 }}>
          {SEMANTIC_GROUPS.map((group) => {
            const names = SEMANTIC.filter((n) => n.split('-')[0] === group);
            if (!names.length) return null;
            return (
              <div key={group} style={{ display: 'grid', gap: 8 }}>
                <strong style={{ fontSize: 13, color: 'var(--color-semantic-label-strong)', textTransform: 'capitalize' }}>{group}</strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 10 }}>
                  {names.map((n) => <Swatch key={n} varName={`--color-semantic-${n}`} caption={n.slice(group.length + 1) || 'normal'} sub={`semantic-${n}`} />)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 14 }}>
        <h2 style={{ margin: 0 }} className="type-heading1">원자 램프</h2>
        <div style={{ display: 'grid', gap: 16 }}>
          {Object.entries(ATOMIC).map(([slug, { label, steps }]) => (
            <div key={slug} style={{ display: 'grid', gap: 6, minWidth: 0 }}>
              <strong style={{ fontSize: 12, color: 'var(--color-semantic-label-neutral)' }}>{label}</strong>
              <div style={{ display: 'flex', gap: 2, minWidth: 0, overflowX: 'auto' }}>
                {steps.map((step) => (
                  <div key={step} style={{ flex: '1 0 34px', minWidth: 34 }}>
                    <div style={{ height: 44, background: `var(--color-atomic-${slug}-${step})`, borderRadius: 3, border: '1px solid var(--color-semantic-line-normal-normal)' }} />
                    <div style={{ fontSize: 9, color: 'var(--color-semantic-label-alternative)', textAlign: 'center', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{step}</div>
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
