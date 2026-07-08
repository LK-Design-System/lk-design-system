import React from 'react';

const meta = {
  title: '파운데이션/토큰/shared',
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
  ['Primary', 'var(--color-primary)'],
  ['Primary hover', 'var(--color-primary-hover)'],
  ['Accent ink', 'var(--lk-accent-ink)'],
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

export const ColorAndSpacing = {
  name: '색상과 간격',
  render: () => (
    <main style={{ display: 'grid', gap: 32, width: '100%', maxWidth: 1040, minWidth: 0 }}>
      <section>
        <h1 style={{ margin: '0 0 16px', fontSize: 28, color: 'var(--label-strong)' }}>색상 토큰</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: 14, minWidth: 0 }}>
          {colors.map(([label, value]) => (
            <div key={label} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', overflow: 'hidden' }}>
              <div style={{ height: 72, background: value }} />
              <div style={{ padding: 12 }}>
                <strong style={{ display: 'block', fontSize: 14, color: 'var(--label-normal)' }}>{label}</strong>
                <code style={{ fontSize: 12, color: 'var(--label-alternative)' }}>{value}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ margin: '0 0 16px', fontSize: 22, color: 'var(--label-strong)' }}>간격 스케일</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {spacings.map(([token, value, usage]) => (
            <div key={token} style={{ display: 'grid', gridTemplateColumns: 'minmax(88px, 112px) minmax(0, 1fr) auto', alignItems: 'center', gap: '8px 12px', minWidth: 0 }}>
              <code style={{ color: 'var(--label-alternative)' }}>{token}</code>
              <div style={{ height: 14, width: `min(var(${token}), 100%)`, background: 'var(--lk-accent-ink)', borderRadius: 'var(--radius-pill)' }} />
              <code style={{ color: 'var(--label-alternative)', fontVariantNumeric: 'tabular-nums' }}>{value}</code>
              <span style={{ gridColumn: '1 / -1', color: 'var(--label-alternative)', fontSize: 13 }}>{usage}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  ),
};

export const Typography = {
  name: '타이포그래피',
  render: () => (
    <main style={{ display: 'grid', gap: 18, maxWidth: 840 }}>
      <p style={{ margin: 0, color: 'var(--label-alternative)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 1.2 }}>
        타이포그래피
      </p>
      <h1 style={{ margin: 0, fontSize: 48, lineHeight: 1.05, color: 'var(--label-strong)' }}>앱 인터페이스에는 차분한 위계가 필요합니다.</h1>
      <p style={{ margin: 0, fontSize: 18, lineHeight: 1.7, color: 'var(--label-neutral)' }}>
        이 토큰 세트는 대시보드, 관리 화면, 상태 패널, 문서 페이지에 맞춰져 있습니다.
      </p>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: 'var(--label-alternative)' }}>
        큰 display text는 제한적으로 사용합니다. 밀도 높은 앱 화면에서는 읽기 쉬운 label,
        tabular value, 명확한 상태 색상, 안정적인 control dimension을 우선합니다.
      </p>
    </main>
  ),
};
