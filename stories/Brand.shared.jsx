import React from 'react';
import { BRAND_LOGO_NAMES, BrandLogo, Lockup, Overline } from '../src/index.js';

const meta = {
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
        <p style={{ margin: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 13, fontWeight: 'var(--fw-bold)' }}>
          Lockup
        </p>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 32, lineHeight: 1.15 }}>
          LK ROBOTICS 로고
        </h2>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          앱 화면, 내비게이션, 다크 배경에서 사용하는 공식 로고 컴포넌트입니다. 비율과 위치를 임의로
          변형하지 않고 제공된 형태, 색상 톤, 높이 옵션 안에서만 조정합니다.
        </p>
      </header>

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 22 }}>형태</h2>
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
                border: '1px solid var(--color-semantic-line-normal-normal)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-semantic-background-elevated-normal)',
              }}
            >
              <Lockup variant={variant} tone="ink" height={height} />
              <div style={{ display: 'grid', gap: 4 }}>
                <strong style={{ color: 'var(--color-semantic-label-normal)' }}>{label}</strong>
                <code style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 12 }}>
                  variant="{variant}"
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 22 }}>앱 아이콘 · 파비콘</h2>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          심볼을 라운드 네이비 타일에 얹은 앱 아이콘 형태입니다. 브라우저 탭 파비콘과 홈 화면 아이콘에 쓰며, 이 자리에서는
          로크업 대신 고정된 이 형태를 사용합니다. 원본:{' '}
          <code style={{ fontSize: 12, color: 'var(--color-semantic-label-alternative)' }}>assets/brand/lk-favicon.svg</code>
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'flex-end', padding: 'var(--space-5)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
          {[96, 64, 48, 32, 16].map((size) => (
            <div key={size} style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
              <img src="./assets/brand/lk-favicon.svg" alt="LK ROBOTICS 앱 아이콘" width={size} height={size} style={{ display: 'block' }} />
              <code style={{ fontSize: 11, color: 'var(--color-semantic-label-alternative)' }}>{size}px</code>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 22 }}>톤</h2>
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
                  border: isDark ? '1px solid var(--color-semantic-inverse-background)' : '1px solid var(--color-semantic-line-normal-normal)',
                  borderRadius: 'var(--radius-lg)',
                  background: isDark ? 'var(--color-semantic-inverse-background)' : 'var(--color-semantic-background-elevated-normal)',
                }}
              >
                <Lockup variant="inline" tone={tone} height={28} />
                <div style={{ display: 'grid', gap: 4 }}>
                  <strong style={{ color: isDark ? 'var(--color-semantic-inverse-label)' : 'var(--color-semantic-label-normal)' }}>{label}</strong>
                  <code style={{ color: isDark ? 'var(--color-semantic-inverse-label-neutral-soft)' : 'var(--color-semantic-label-alternative)', fontSize: 12 }}>
                    tone="{tone}"
                  </code>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 22 }}>여백 (Clear space)</h2>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          로고 주변에는 최소 여백을 확보합니다. 상·하·좌·우 모두 <strong>로크업 높이의 0.5배(½X)</strong> 이상을 비워
          다른 요소·텍스트·경계와 붙지 않게 합니다. inline 로크업의 <strong>최소 높이는 20px</strong>이며, 그보다 작게
          쓰지 않습니다.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'inline-grid', gap: 6, justifyItems: 'center' }}>
            <div style={{ display: 'inline-flex', padding: 14, border: '1px dashed var(--color-semantic-line-normal-neutral)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)' }}>
              <Lockup variant="inline" height={28} />
            </div>
            <code style={{ fontSize: 11, color: 'var(--color-semantic-label-alternative)' }}>여백 = ½ × 높이 (28px → 14px)</code>
          </div>
          <div style={{ display: 'inline-grid', gap: 6, justifyItems: 'center' }}>
            <div style={{ display: 'inline-flex', padding: 10, border: '1px dashed var(--color-semantic-line-normal-neutral)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)' }}>
              <Lockup variant="inline" height={20} />
            </div>
            <code style={{ fontSize: 11, color: 'var(--color-semantic-label-alternative)' }}>최소 크기 (height=20px)</code>
          </div>
        </div>
      </section>
    </main>
  ),
};

export const LockupOverlineCard = {
  name: 'Lockup · Overline card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div style={{ background: 'var(--color-semantic-background-normal-normal)', padding: '22px 24px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)', marginBottom: 10 }}>
            Lockup — mark · stacked · inline
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', flexWrap: 'wrap', padding: '20px 24px', borderRadius: 'var(--radius-xl)', background: 'var(--color-semantic-static-white)', border: '1px solid var(--color-semantic-line-solid-normal)' }}>
            <Lockup variant="mark" tone="ink" height={46} />
            <Lockup variant="stacked" tone="ink" height={66} />
            <Lockup variant="inline" tone="ink" height={30} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', flexWrap: 'wrap', padding: '20px 24px', borderRadius: 'var(--radius-xl)', background: 'var(--color-semantic-inverse-background)', marginTop: 12 }}>
            <Lockup variant="mark" tone="white" height={46} />
            <Lockup variant="stacked" tone="white" height={66} />
            <Lockup variant="inline" tone="white" height={30} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)', marginBottom: 10 }}>
            Overline (eyebrow kicker)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Overline>Design System</Overline>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: 'var(--color-semantic-label-strong)' }}>
              일관된 화면을 만드는 컴포넌트
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const BrandLogoCard = {
  name: 'BrandLogo card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 680, height: 460, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)', margin: '0 0 12px' }}>
          Full-colour marks · 40px
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          {['apple', 'facebook', 'google'].map((name) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <BrandLogo name={name} size={40} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-semantic-label-alternative)' }}>{name}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)', margin: '0 0 12px' }}>
          플랫폼 · 소셜 · 40px
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          {['github', 'huggingface', 'linkedin', 'x', 'youtube'].map((name) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <BrandLogo name={name} size={40} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-semantic-label-alternative)' }}>{name}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)', margin: '0 0 12px' }}>
          In a sign-in button
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 48, padding: '0 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-semantic-line-solid-normal)', background: 'var(--color-semantic-background-elevated-normal)', fontSize: 15, fontWeight: 700, color: 'var(--color-semantic-label-normal)' }}>
            <BrandLogo name="google" size={20} /> Google로 계속하기
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 48, padding: '0 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-semantic-line-solid-normal)', background: 'var(--color-semantic-background-elevated-normal)', fontSize: 15, fontWeight: 700, color: 'var(--color-semantic-label-normal)' }}>
            <BrandLogo name="apple" size={20} /> Apple로 계속하기
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 48, padding: '0 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-semantic-line-solid-normal)', background: 'var(--color-semantic-background-elevated-normal)', fontSize: 15, fontWeight: 700, color: 'var(--color-semantic-label-normal)' }}>
            <BrandLogo name="github" size={20} /> GitHub로 계속하기
          </span>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)', margin: '0 0 12px' }}>
          다크 서피스 · mono
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 'var(--space-6)', background: 'var(--color-semantic-inverse-background)', padding: '14px 18px', borderRadius: 'var(--radius-md)', color: 'var(--color-semantic-inverse-label)' }}>
          {['github', 'huggingface', 'linkedin', 'x', 'youtube'].map((name) => (
            <BrandLogo key={name} name={name} size={28} mono />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const PlatformBrandMarks = {
  name: '플랫폼 브랜드 마크',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 920 }}>
      <header style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 32, lineHeight: 1.15 }}>
          외부 플랫폼 로고
        </h2>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          BrandLogo 컴포넌트는 LK ROBOTICS 로고가 아니라 Google, GitHub, YouTube처럼 외부 플랫폼을
          표시할 때 사용하는 풀컬러 브랜드 마크입니다.
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
              border: '1px solid var(--color-semantic-line-normal-normal)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-semantic-background-elevated-normal)',
            }}
          >
            <BrandLogo name={name} size={24} />
            <span style={{ color: 'var(--color-semantic-label-normal)', fontWeight: 'var(--fw-bold)' }}>{name}</span>
          </div>
        ))}
      </section>
    </main>
  ),
};
