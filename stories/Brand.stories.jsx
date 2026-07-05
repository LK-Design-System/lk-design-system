import React from 'react';
import { BRAND_LOGO_NAMES, BrandLogo, Lockup } from '../src/index.js';

const meta = {
  title: '파운데이션/브랜드',
  component: Lockup,
  parameters: {
    docs: {
      description: {
        component:
          'LK ROBOTICS 로고 Lockup과 외부 플랫폼 브랜드 마크를 구분해 확인하는 브랜드 파운데이션입니다.',
      },
    },
  },
};

export default meta;

const toneLabels = [
  ['ink', '기본 잉크'],
  ['brand', '브랜드 블루'],
  ['white', '반전 화이트'],
];

export const LKRoboticsLogo = {
  name: 'LK ROBOTICS 로고',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-8)', maxWidth: 1040 }}>
      <header style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <p style={{ margin: 0, color: 'var(--label-alternative)', fontSize: 13, fontWeight: 'var(--fw-bold)' }}>
          Lockup
        </p>
        <h1 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 32, lineHeight: 1.15 }}>
          LK ROBOTICS 로고
        </h1>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--label-neutral)', lineHeight: 1.7 }}>
          제품 화면, 내비게이션, 다크 배경에서 사용하는 공식 로고 컴포넌트입니다. 비율과 위치를 임의로
          변형하지 않고 `variant`, `tone`, `height`만 조정합니다.
        </p>
      </header>

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <h2 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 22 }}>형태</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          {[
            ['inline', '가로형', 30],
            ['stacked', '스택형', 72],
            ['mark', '심볼', 44],
          ].map(([variant, label, height]) => (
            <div
              key={variant}
              style={{
                display: 'grid',
                alignContent: 'center',
                gap: 'var(--space-4)',
                minHeight: 148,
                padding: 'var(--space-5)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--surface-card)',
              }}
            >
              <Lockup variant={variant} tone="ink" height={height} />
              <div style={{ display: 'grid', gap: 4 }}>
                <strong style={{ color: 'var(--label-normal)' }}>{label}</strong>
                <code style={{ color: 'var(--label-alternative)', fontSize: 12 }}>
                  variant="{variant}"
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <h2 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 22 }}>톤</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          {toneLabels.map(([tone, label]) => {
            const isDark = tone === 'white';
            return (
              <div
                key={tone}
                style={{
                  display: 'grid',
                  alignContent: 'center',
                  gap: 'var(--space-4)',
                  minHeight: 132,
                  padding: 'var(--space-5)',
                  border: isDark ? '1px solid var(--surface-inverse)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  background: isDark ? 'var(--surface-inverse)' : 'var(--surface-card)',
                }}
              >
                <Lockup variant="inline" tone={tone} height={28} />
                <div style={{ display: 'grid', gap: 4 }}>
                  <strong style={{ color: isDark ? 'var(--text-on-inverse)' : 'var(--label-normal)' }}>{label}</strong>
                  <code style={{ color: isDark ? 'rgba(255,255,255,0.72)' : 'var(--label-alternative)', fontSize: 12 }}>
                    tone="{tone}"
                  </code>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  ),
};

export const PlatformBrandMarks = {
  name: '플랫폼 브랜드 마크',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 920 }}>
      <header style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h1 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 32, lineHeight: 1.15 }}>
          외부 플랫폼 로고
        </h1>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--label-neutral)', lineHeight: 1.7 }}>
          `BrandLogo`는 LK ROBOTICS 로고가 아니라 Google, GitHub, YouTube처럼 외부 플랫폼을 표시할 때
          사용하는 풀컬러 브랜드 마크입니다.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)' }}>
        {BRAND_LOGO_NAMES.map((name) => (
          <div
            key={name}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              minHeight: 60,
              padding: '0 var(--space-4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--surface-card)',
            }}
          >
            <BrandLogo name={name} size={24} />
            <span style={{ color: 'var(--label-normal)', fontWeight: 'var(--fw-bold)' }}>{name}</span>
          </div>
        ))}
      </section>
    </main>
  ),
};
