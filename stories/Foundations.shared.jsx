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
  ['Green (vivid)', 'var(--color-semantic-status-positive)'],
  ['Amber (vivid)', 'var(--color-semantic-status-cautionary)'],
  ['Red (vivid)', 'var(--color-semantic-status-negative)'],
];

/* 상태색은 "선명한 신호색"과 "AA를 만족하는 텍스트색"이 분리되어 있습니다.
   흰 배경 기준 대비는 tokens/color-semantic.css의 실제 값으로 계산한 값입니다. */
const VIVID_STATUS_RULES = [
  {
    role: 'positive',
    vivid: ['--color-semantic-status-positive', '#13BE4C', '2.47:1'],
    text: ['--color-semantic-status-positive-text', '#087A32', '5.47:1'],
  },
  {
    role: 'cautionary',
    vivid: ['--color-semantic-status-cautionary', '#EB9C33', '2.25:1'],
    text: ['--color-semantic-status-cautionary-text', '#7A4A00', '7.48:1'],
  },
  {
    role: 'negative',
    vivid: ['--color-semantic-status-negative', '#EE5656', '3.44:1'],
    text: ['--color-semantic-status-negative-text', '#A82727', '7.04:1'],
  },
];

function VividStatusWarning() {
  return (
    <section
      style={{
        display: 'grid',
        gap: 12,
        padding: 20,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-semantic-status-cautionary-surface)',
        border: '1px solid var(--color-semantic-status-cautionary-border)',
      }}
    >
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-strong)' }}>
        선명한 상태색은 텍스트·텍스트 배경으로 쓰지 않습니다
      </h2>
      <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
        <code style={{ fontSize: 12 }}>--color-semantic-status-*</code>의 기본값(위 Green · Amber · Red)은 <strong>신호용
        선명색</strong>입니다. 점·아이콘·테두리·진행 표시처럼 <em>텍스트가 아닌</em> 요소에만 쓰세요. 흰 배경 기준 대비가
        모두 4.5:1 아래이므로, 이 색으로 본문을 찍거나 이 색을 배경 삼아 흰 글자를 올리면 WCAG AA(1.4.3)를 만족하지 못합니다.
        같은 의미의 텍스트에는 <code style={{ fontSize: 12 }}>--color-semantic-status-*-text</code>를 사용하세요.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 520, fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--color-semantic-label-alternative)' }}>
              <th style={{ padding: '6px 8px', fontWeight: 'var(--fw-medium)' }}>역할</th>
              <th style={{ padding: '6px 8px', fontWeight: 'var(--fw-medium)' }}>신호색 · 텍스트 금지</th>
              <th style={{ padding: '6px 8px', fontWeight: 'var(--fw-medium)' }}>텍스트색 · AA 통과</th>
            </tr>
          </thead>
          <tbody>
            {VIVID_STATUS_RULES.map(({ role, vivid, text }) => (
              <tr key={role} style={{ borderTop: '1px solid var(--color-semantic-line-normal-alternative)' }}>
                <td style={{ padding: '6px 8px', color: 'var(--color-semantic-label-strong)' }}>{role}</td>
                <td style={{ padding: '6px 8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span aria-hidden="true" style={{ width: 14, height: 14, borderRadius: 3, background: `var(${vivid[0]})`, flexShrink: 0 }} />
                    <span style={{ color: 'var(--color-semantic-label-neutral)' }}>{vivid[1]} · 흰 배경 {vivid[2]}</span>
                  </span>
                </td>
                <td style={{ padding: '6px 8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span aria-hidden="true" style={{ width: 14, height: 14, borderRadius: 3, background: `var(${text[0]})`, flexShrink: 0 }} />
                    <span style={{ color: 'var(--color-semantic-label-neutral)' }}>{text[1]} · 흰 배경 {text[2]}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7, fontSize: 13 }}>
        solid/강조 배지처럼 상태색을 배경으로 채우는 변형은 특히 주의하세요. 선명색 배경 + 흰 글자 조합은 위 표의 대비값이
        그대로 적용되어 AA에 미달합니다. 이때는 <code style={{ fontSize: 12 }}>--color-semantic-status-*-surface</code> 배경과{' '}
        <code style={{ fontSize: 12 }}>--color-semantic-status-*-text</code> 글자를 쌍으로 쓰거나, 배경을 더 어둡게
        재정의해야 합니다. 선명색은 같은 배지의 테두리·점 표시로 남깁니다.
      </p>
    </section>
  );
}

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
      <VividStatusWarning />
    </main>
  ),
  play: async ({ canvasElement }) => {
    /* 이 표는 토큰의 원시 값을 문서 내용으로 싣는다. 값이 토큰과 어긋나면 문서가
       거짓말을 하므로, 실제로 해석된 토큰과 대조해 드리프트를 막는다. */
    const root = canvasElement.ownerDocument.documentElement;
    const styles = getComputedStyle(root);
    const channels = (value) => {
      const parsed = value.trim().startsWith('#')
        ? [1, 3, 5].map((index) => parseInt(value.trim().slice(index, index + 2), 16))
        : value.match(/\d+(\.\d+)?/g)?.slice(0, 3).map(Number);
      if (!parsed || parsed.length !== 3) throw new Error(`색상 값을 해석하지 못했습니다: ${value}`);
      return parsed;
    };
    const luminance = (value) => {
      const [r, g, b] = channels(value).map((channel) => {
        const ratio = channel / 255;
        return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const contrast = (a, b) => {
      const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (high + 0.05) / (low + 0.05);
    };
    const background = styles.getPropertyValue('--color-semantic-background-normal-normal');
    const lightTheme = luminance(background) > 0.5;

    for (const { role, vivid, text } of VIVID_STATUS_RULES) {
      const vividValue = styles.getPropertyValue(vivid[0]).trim();
      const textValue = styles.getPropertyValue(text[0]).trim();
      if (!vividValue || !textValue) {
        throw new Error(`${role} 상태 토큰이 해석되지 않았습니다.`);
      }
      /* 표가 가르치는 주장은 테마와 무관하게 성립해야 한다. */
      if (contrast(vividValue, background) >= 4.5) {
        throw new Error(`${role} 신호색이 본문 배경에서 AA를 통과합니다. 표의 "텍스트 금지" 설명이 더 이상 맞지 않습니다.`);
      }
      if (contrast(textValue, background) < 4.5) {
        throw new Error(`${role} 텍스트색이 본문 배경에서 AA에 미달합니다.`);
      }
      /* 표에 적힌 hex와 대비값은 밝은 테마 기준으로 계산한 것이다. */
      if (!lightTheme) continue;
      for (const [token, documented, documentedRatio] of [vivid, text]) {
        const resolved = styles.getPropertyValue(token).trim();
        const hex = `#${channels(resolved).map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
        if (hex.toUpperCase() !== documented.toUpperCase()) {
          throw new Error(`${token}의 문서값 ${documented}이 실제 토큰 값 ${hex.toUpperCase()}과 다릅니다.`);
        }
        const measured = `${contrast(resolved, '#FFFFFF').toFixed(2)}:1`;
        if (measured !== documentedRatio) {
          throw new Error(`${token}의 문서 대비값 ${documentedRatio}이 실제 측정값 ${measured}과 다릅니다.`);
        }
      }
    }
  },
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
/* 용도 설명은 tokens/typography.css의 실제 선언을 그대로 옮긴 것입니다.
   .type-body1/.type-body2는 500(Medium)이며 400(Regular)이 아닙니다. */
const TYPE_WEIGHTS = [
  ['Regular', 'var(--fw-regular)', '타입 스케일 미사용 · 목록 비선택 항목 등에서 직접 지정'],
  ['Medium', 'var(--fw-medium)', 'Body · Label · Caption (타입 스케일 기본)'],
  ['SemiBold', 'var(--fw-semibold)', 'Heading · Headline'],
  ['Bold', 'var(--fw-bold)', 'Title · Display'],
  ['ExtraBold', 'var(--fw-extra)', '타입 스케일 미사용 · 수치와 카드 표제에 직접 지정'],
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
        <p style={{ margin: 0, maxWidth: 640, color: 'var(--color-semantic-label-neutral)' }} className="type-body2">
          타입 스케일 유틸리티 클래스가 실제로 쓰는 굵기는 Medium(500) · SemiBold(600) · Bold(700) 세 가지입니다.
          본문 기본값은 Regular가 아니라 <strong>Medium(500)</strong>입니다 — 한글 본문 가독성을 위해
          <code style={{ fontSize: 12 }}> .type-body1</code>·<code style={{ fontSize: 12 }}>.type-body2</code>가
          500으로 선언되어 있습니다. Regular(400)와 ExtraBold(800)는 스케일 밖에서 필요할 때만 직접 지정합니다.
        </p>
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

      <VividStatusWarning />

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
