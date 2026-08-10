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
  ['ink', '공식 네이비'],
  ['white', '반전 화이트'],
];

const OFFICIAL_LOGO_NAVY = '#05132b';
const OFFICIAL_LOGO_ACCENT = '#6bbbdd';
const OFFICIAL_LOGO_WHITE = '#ffffff';

const OFFICIAL_LOGOS = [
  {
    label: '기업 표기형',
    description: '주식회사 엘케이로보틱스 표기를 포함한 공식 조합입니다.',
    usage: '회사 소개 · 대외 문서 · 법인 식별',
    variants: [
      { file: 'lk-logo-official-corporate.svg', label: '네이비 바탕' },
      { file: 'lk-logo-official-corporate-light.svg', label: '반전 · 화이트 바탕', light: true },
    ],
  },
  {
    label: '기본형',
    description: '심볼과 ROBOTICS 워드마크로 구성된 공식 조합입니다.',
    usage: '브랜드 타일 · 프로필 · 일반 식별',
    variants: [
      { file: 'lk-logo-official.svg', label: '네이비 바탕' },
      { file: 'lk-logo-official-light.svg', label: '반전 · 화이트 바탕', light: true },
    ],
  },
];

const OFFICIAL_LOGO_VARIANTS = OFFICIAL_LOGOS.flatMap((logo) =>
  logo.variants.map((variant) => ({ ...variant, logoLabel: logo.label })),
);

// These values are read directly from the official SVG. They are brand-asset
// colors, not semantic UI tokens, and must not change with the active theme.
const OFFICIAL_LOGO_COLORS = [
  {
    value: OFFICIAL_LOGO_NAVY,
    label: '공식 네이비',
    usage: '사각 배경 · 투명 파생형의 기본 잉크',
    code: '#05132B',
  },
  {
    value: OFFICIAL_LOGO_ACCENT,
    label: '법인명 포인트',
    usage: '기업 표기형의 한글 법인명에만 사용',
    code: '#6BBBDD',
  },
  {
    value: OFFICIAL_LOGO_WHITE,
    label: '화이트',
    usage: '네이비 배경 위 심볼 · 워드마크',
    code: '#FFFFFF',
    border: true,
  },
];

// Dark brand backgrounds are deliberate single surfaces. They set a reliable
// contrast field for the white lockup without decorative tone drift.
const BRAND_SURFACES = [
  {
    label: '다크 브랜드 서피스',
    where: 'ProductCard·Hero·TopBar 등 어두운 브랜드 면에 공통으로 사용하는 배경입니다.',
    token: '--color-semantic-brand-surface',
  },
];

const BRAND_SOLIDS = [
  {
    token: '--color-semantic-brand-ink',
    label: '브랜드 잉크',
    where: '일반 화면 위에서 브랜드 네이비의 인상을 내는 전경색입니다. 테마에 따라 밝게 바뀌며, 브랜드 배경 위에는 사용하지 않습니다.',
  },
];

const BRAND_ON_SURFACE = [
  {
    token: '--color-semantic-brand-on-surface',
    label: '강조 전경',
    sample: '제목과 핵심 액션',
  },
  {
    token: '--color-semantic-brand-on-surface-muted',
    label: '보조 전경',
    sample: '설명과 보조 액션',
  },
  {
    token: '--color-semantic-brand-on-surface-subtle',
    label: '약한 전경',
    sample: '메타데이터와 부가 정보',
  },
  {
    token: '--color-semantic-brand-on-surface-border',
    label: '브랜드 경계선',
    sample: '네이비 면 내부의 구분선',
    kind: 'border',
  },
];

const BRAND_TOKEN_NAMES = [
  ...BRAND_SURFACES.map((surface) => surface.token),
  ...BRAND_SOLIDS.map((solid) => solid.token),
  ...BRAND_ON_SURFACE.map((foreground) => foreground.token),
];

// Values are read from a node inside this section rather than transcribed, because
// a transcribed hex goes stale silently. Reading from the node — not the document
// root — is what makes the printed value match the theme actually in effect:
// Storybook applies the theme to a wrapper element, so the root keeps the light
// default even while the story renders dark.
function useTokenValues(names, nodeRef) {
  const [values, setValues] = React.useState({});
  React.useEffect(() => {
    const node = nodeRef.current;
    if (!node) return undefined;
    const read = () => {
      const computed = getComputedStyle(node);
      setValues((current) => {
        const next = {};
        let changed = false;
        for (const name of names) {
          next[name] = computed.getPropertyValue(name).trim();
          if (next[name] !== current[name]) changed = true;
        }
        return changed ? next : current;
      });
    };
    read();
    const themed = node.closest('[data-theme]') ?? node.ownerDocument.documentElement;
    const observer = new MutationObserver(read);
    observer.observe(themed, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    return () => observer.disconnect();
  }, [names, nodeRef]);
  return values;
}

function TokenValueRow({ role, token, value }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'baseline', flexWrap: 'wrap' }}>
      {role && (
        <span style={{ flex: '0 0 auto', minWidth: 28, fontSize: 12, fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-normal)' }}>
          {role}
        </span>
      )}
      <code style={{ fontSize: 12, color: 'var(--color-semantic-label-alternative)', overflowWrap: 'anywhere' }}>{token}</code>
      <code style={{ fontSize: 12, color: 'var(--color-semantic-label-neutral)' }}>{value ? value.toUpperCase() : '—'}</code>
    </div>
  );
}

function channelLuminance(channel) {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex) {
  const digits = hex.replace('#', '');
  const full = digits.length === 3 ? [...digits].map((digit) => digit + digit).join('') : digits;
  const [r, g, b] = [0, 2, 4].map((index) => channelLuminance(Number.parseInt(full.slice(index, index + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground, background) {
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(foreground) || !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(background)) return null;
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

function ColorRow({ swatch, name, value, usage, note, border = false }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-3) var(--space-4)',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-semantic-background-elevated-normal)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 44,
          height: 44,
          flex: '0 0 44px',
          borderRadius: 'var(--radius-md)',
          background: swatch,
          border: border ? '1px solid var(--color-semantic-line-solid-neutral)' : '1px solid transparent',
        }}
      />
      <span style={{ display: 'grid', gap: 2, minWidth: 0 }}>
        <strong style={{ color: 'var(--color-semantic-label-normal)' }}>{name}</strong>
        <code style={{ fontSize: 12, color: 'var(--color-semantic-label-alternative)', overflowWrap: 'anywhere' }}>{value}</code>
        {usage && <span style={{ fontSize: 12, color: 'var(--color-semantic-label-neutral)' }}>{usage}</span>}
        {note && <span style={{ fontSize: 12, color: 'var(--color-semantic-label-neutral)' }}>{note}</span>}
      </span>
    </div>
  );
}

function BrandColorReference() {
  const sectionRef = React.useRef(null);
  const tokenValues = useTokenValues(BRAND_TOKEN_NAMES, sectionRef);
  const navyOnWhite = contrastRatio(OFFICIAL_LOGO_NAVY, OFFICIAL_LOGO_WHITE);
  const whiteOnNavy = contrastRatio(OFFICIAL_LOGO_WHITE, OFFICIAL_LOGO_NAVY);

  return (
    <section ref={sectionRef} style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 22 }}>색상</h2>
      <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
        공식 SVG 안에 고정된 색과 제품 UI의 배경 토큰은 서로 다른 체계입니다. 로고 path에는 원본 색을 유지하고,
        제품 표면을 만들 때만 의미 기반 토큰을 사용합니다.
      </p>

      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h3 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 16 }}>1. 공식 SVG 고정 색상</h3>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7, fontSize: 14 }}>
          아래 세 값은 <code>assets/brand/lk-logo-construction.json</code>에 고정된 승인 색상입니다. 테마나 UI 상태에 따라 바꾸지 않습니다.
          투명 배경 파생형만 밝은 면에서는 <code>tone="ink"</code>, 어두운 면에서는 <code>tone="white"</code>를 고릅니다.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
          {OFFICIAL_LOGO_COLORS.map((color) => (
            <ColorRow
              key={color.code}
              swatch={color.value}
              border={color.border}
              name={color.label}
              value={color.code}
              usage={color.usage}
            />
          ))}
        </div>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7, fontSize: 14 }}>
          대비: 네이비 로고를 흰 배경에 얹으면{' '}
          <strong>{navyOnWhite ? `${navyOnWhite.toFixed(1)}:1` : '—'}</strong>, 화이트 로고를 네이비 배경에
          얹으면 <strong>{whiteOnNavy ? `${whiteOnNavy.toFixed(1)}:1` : '—'}</strong>입니다. 중간 밝기 사진 위에서는
          이 값이 보장되지 않으므로 단색 판을 깔고 얹습니다.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h3 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 16 }}>2. 제품 UI 배경 토큰</h3>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7, fontSize: 14 }}>
          제품 화면에서 로고가 놓이는 표면입니다. 브랜드 네이비 역할은 공식 SVG 기준인 <code>#05132B</code>로
          통일하며, 아래 값은 현재 테마에서 실제로 계산해 표시합니다. 흰색 파생형을 얹을 때는 충분한 대비를
          별도로 확인합니다.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-3)' }}>
          {BRAND_SURFACES.map((surface) => (
            <div
              key={surface.token}
              style={{
                display: 'grid',
                gap: 'var(--space-3)',
                padding: 'var(--space-4)',
                border: '1px solid var(--color-semantic-line-normal-normal)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-semantic-background-elevated-normal)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 84,
                  borderRadius: 'var(--radius-md)',
                  background: `var(${surface.token})`,
                }}
              >
                <Lockup variant="inline" tone="white" height={22} />
              </div>
              <div style={{ display: 'grid', gap: 4 }}>
                <strong style={{ color: 'var(--color-semantic-label-normal)' }}>{surface.label}</strong>
                <span style={{ fontSize: 12, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.6 }}>{surface.where}</span>
              </div>
              <div style={{ display: 'grid', gap: 4 }}>
                <TokenValueRow token={surface.token} value={tokenValues[surface.token]} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-3)' }}>
          {BRAND_SOLIDS.map((solid) => (
            <div
              key={solid.token}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-4)',
                padding: 'var(--space-4)',
                border: '1px solid var(--color-semantic-line-normal-normal)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-semantic-background-elevated-normal)',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 44,
                  height: 44,
                  flex: '0 0 44px',
                  borderRadius: 'var(--radius-md)',
                  background: `var(${solid.token})`,
                  border: '1px solid var(--color-semantic-line-solid-neutral)',
                }}
              />
              <span style={{ display: 'grid', gap: 4, minWidth: 0 }}>
                <strong style={{ color: 'var(--color-semantic-label-normal)' }}>{solid.label}</strong>
                <span style={{ fontSize: 12, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.6 }}>{solid.where}</span>
                <TokenValueRow token={solid.token} value={tokenValues[solid.token]} />
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'grid',
            gap: 'var(--space-3)',
            padding: 'var(--space-5)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-semantic-brand-surface)',
            border: '1px solid var(--color-semantic-brand-on-surface-border)',
          }}
        >
          <strong style={{ color: 'var(--color-semantic-brand-on-surface)' }}>브랜드 서피스 전용 전경</strong>
          {BRAND_ON_SURFACE.map((foreground) => (
            <div
              key={foreground.token}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(100px, 0.8fr) minmax(140px, 1fr)',
                gap: 'var(--space-3)',
                alignItems: 'center',
                paddingTop: 'var(--space-2)',
                borderTop: `1px solid var(${foreground.kind === 'border' ? foreground.token : '--color-semantic-brand-on-surface-border'})`,
              }}
            >
              <span style={{ color: `var(${foreground.kind === 'border' ? '--color-semantic-brand-on-surface-subtle' : foreground.token})` }}>{foreground.label}</span>
              <span style={{ color: 'var(--color-semantic-brand-on-surface-subtle)', fontSize: 12 }}>
                {foreground.sample}<br /><code>{foreground.token}</code>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 'var(--space-2)',
          padding: 'var(--space-4) var(--space-5)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          background: 'var(--color-semantic-fill-alternative)',
        }}
      >
        <strong style={{ color: 'var(--color-semantic-label-strong)' }}>자주 헷갈리는 것</strong>
        <ul style={{ margin: 0, paddingInlineStart: '1.1em', color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7, fontSize: 14 }}>
          <li>
            <strong>브랜드 네이비 토큰도 공식 <code>#05132B</code>에 맞춥니다.</strong>{' '}
            <code>--color-semantic-brand-surface</code>와 라이트 모드의 <code>--color-semantic-brand-ink</code>가 같은 값을
            공유하지만 역할은 다릅니다. 네이비 면 위의 글자·아이콘·경계선에는 <code>brand-on-surface*</code>를 사용하고,
            로고 path는 토큰으로 다시 칠하지 않고 공식 자산의 고정 색을 유지합니다.
          </li>
          <li>
            <strong><code>#6BBBDD</code>는 UI 파란색이 아닙니다.</strong> 기업 표기형의 한글 법인명에만 들어가는
            원본 포인트 색이며 버튼·포커스에 재사용하지 않습니다.
          </li>
          <li>
            <strong>공식 사각 로고는 색과 배경을 함께 고정합니다.</strong> <code>tone</code>은 mark·stacked·inline
            파생형에만 적용합니다.
          </li>
        </ul>
      </div>
    </section>
  );
}

export const LKRoboticsLogo = {
  name: 'LK ROBOTICS 로고',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-8)', maxWidth: 1040 }}>
      <header style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <p style={{ margin: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 13, fontWeight: 'var(--fw-bold)' }}>
          Official vector master
        </p>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 32, lineHeight: 1.15 }}>
          LK ROBOTICS 로고
        </h2>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          커스텀 LK 심볼, Montserrat ExtraBold 800 워드마크, Noto Sans KR ExtraBold 800 한글 법인명을 하나의 제작 규정으로 정리했습니다. 공식 사각 조합은
          색·비율·배치를 고정한 네이비·화이트 바탕 자산 중 하나를 사용하고, 제품 UI용 mark·stacked·inline도 같은 생성 원본을 사용합니다.
        </p>
      </header>

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 22 }}>워드마크 · 법인명 제작 규정</h2>
          <p style={{ margin: 0, maxWidth: 760, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
            <strong>ROBOTICS는 Montserrat ExtraBold 800, Version 7.222로 고정합니다.</strong> 대문자, 글꼴 기본 커닝,
            추가 자간 0, 가로·세로 동일 비율을 사용하며 글리프 윤곽을 임의로 수정하지 않습니다. 승인 결과물은 모두 path라
            서비스에서 Montserrat를 로드하지 않습니다.
          </p>
          <p style={{ margin: 0, maxWidth: 760, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
            <strong>주식회사 엘케이로보틱스는 Noto Sans KR ExtraBold 800, Version 2.004-H2로 고정합니다.</strong> NFC 텍스트,
            글꼴 기본 커닝, 글자 사이 0.105em 자간, 가로·세로 동일 비율을 사용합니다. 법인명 보이는 폭은 1.90X,
            상단 로크업과의 간격은 0.21X이며 보이는 중심축을 맞춥니다.
          </p>
        </div>
        <ul style={{ margin: 0, paddingInlineStart: '1.2em', maxWidth: 800, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.8 }}>
          <li><strong>LK:</strong> 기존 커스텀 벡터 심볼을 정본으로 유지</li>
          <li><strong>ROBOTICS:</strong> 고정 TTF의 SHA-256을 검증한 뒤 아웃라인 생성</li>
          <li><strong>한글 법인명:</strong> 고정 가변 TTF의 SHA-256과 <code>wght=800</code> 인스턴스를 검증한 뒤 0.105em 자간으로 아웃라인 생성</li>
          <li><strong>배치:</strong> inline은 심볼과 워드마크의 보이는 높이를 같게 하고, 간격은 심볼 보이는 폭의 20%</li>
          <li><strong>사용:</strong> 승인 SVG 또는 <code>Lockup</code>만 사용하고 텍스트로 재조판하지 않음</li>
          <li><strong>정본:</strong> <code>assets/brand/lk-logo-construction.json</code> · 생성: <code>npm run generate:brand</code></li>
        </ul>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 22 }}>승인 SVG 자산</h2>
          <p style={{ margin: 0, maxWidth: 760, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
            LK 심볼은 커스텀 벡터 윤곽을 유지하고 ROBOTICS와 한글 법인명은 각각 규정된 글꼴에서 다시 생성합니다. 화이트 바탕 반전은 같은 path와
            포인트 색을 유지하고 네이비·화이트 역할만 맞바꿉니다. 승인 조합 전체는 <code>assets/brand/lk-logo-master.svg</code>에서 확인합니다.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
          {OFFICIAL_LOGOS.map((logo) => (
            <article
              key={logo.label}
              style={{
                display: 'grid',
                gap: 'var(--space-5)',
                padding: 'var(--space-5)',
                border: '1px solid var(--color-semantic-line-normal-normal)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-semantic-background-elevated-normal)',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-4)', alignItems: 'end' }}>
                {logo.variants.map((variant) => (
                  <div key={variant.file} style={{ display: 'grid', gap: 'var(--space-2)', justifyItems: 'center' }}>
                    <img
                      src={`./assets/brand/${variant.file}`}
                      alt={`LK ROBOTICS ${logo.label} 로고 (${variant.label})`}
                      width={176}
                      height={176}
                      style={{
                        display: 'block',
                        width: '100%',
                        maxWidth: 176,
                        height: 'auto',
                        border: variant.light ? '1px solid var(--color-semantic-line-solid-neutral)' : 'none',
                      }}
                    />
                    <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 11 }}>{variant.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0 }}>
                <strong style={{ color: 'var(--color-semantic-label-strong)', fontSize: 16 }}>{logo.label}</strong>
                <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 13, lineHeight: 1.6 }}>{logo.description}</span>
                <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 12 }}>{logo.usage}</span>
                {logo.variants.map((variant) => (
                  <code key={variant.file} style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 11, overflowWrap: 'anywhere' }}>
                    assets/brand/{variant.file}
                  </code>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 22 }}>제품 UI 파생형</h2>
          <p style={{ margin: 0, maxWidth: 760, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
            내비게이션처럼 사각 로고를 그대로 놓기 어려운 제품 표면을 위한 조합입니다. 글자 윤곽은 공식 SVG와 같고,
            <strong> inline만 가로 배치를 위해 위치와 크기를 조정</strong>합니다.
          </p>
        </div>
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
                minWidth: 0,
                minHeight: 148,
                padding: 'var(--space-5)',
                border: '1px solid var(--color-semantic-line-normal-normal)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-semantic-background-elevated-normal)',
              }}
            >
              <Lockup variant={variant} tone="ink" height={height} style={{ width: 'auto', maxWidth: '100%' }} />
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
                  border: isDark ? `1px solid ${OFFICIAL_LOGO_NAVY}` : '1px solid var(--color-semantic-line-normal-normal)',
                  borderRadius: 'var(--radius-lg)',
                  background: isDark ? OFFICIAL_LOGO_NAVY : 'var(--color-semantic-background-elevated-normal)',
                }}
              >
                <Lockup variant="inline" tone={tone} height={28} />
                <div style={{ display: 'grid', gap: 4 }}>
                  <strong style={{ color: isDark ? 'var(--color-semantic-brand-on-surface)' : 'var(--color-semantic-label-normal)' }}>{label}</strong>
                  <code style={{ color: isDark ? 'var(--color-semantic-brand-on-surface-subtle)' : 'var(--color-semantic-label-alternative)', fontSize: 12 }}>
                    tone="{tone}"
                  </code>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <BrandColorReference />

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 22 }}>여백 (Clear space)</h2>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          <strong>X는 LK 심볼의 보이는 높이</strong>입니다. 로고 주변 상·하·좌·우 모두 <strong>0.5X</strong> 이상을 비워
          다른 요소·텍스트·경계와 붙지 않게 합니다. 제품 UI용 inline 로크업의 <strong>최소 높이는 20px</strong>이며, 그보다 작게
          쓰지 않습니다.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'inline-grid', gap: 6, justifyItems: 'center' }}>
            <div style={{ display: 'inline-flex', padding: 14, border: '1px dashed var(--color-semantic-line-normal-neutral)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)' }}>
              <Lockup variant="inline" height={28} />
            </div>
            <code style={{ fontSize: 11, color: 'var(--color-semantic-label-alternative)' }}>예시 여백 14px (최소 0.5X 충족)</code>
          </div>
          <div style={{ display: 'inline-grid', gap: 6, justifyItems: 'center' }}>
            <div style={{ display: 'inline-flex', padding: 10, border: '1px dashed var(--color-semantic-line-normal-neutral)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)' }}>
              <Lockup variant="inline" height={20} />
            </div>
            <code style={{ fontSize: 11, color: 'var(--color-semantic-label-alternative)' }}>최소 크기 (height=20px)</code>
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 22 }}>앱 아이콘 · 파비콘</h2>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          공식 심볼 path를 라운드 네이비 타일에 얹은 앱 아이콘 파생형입니다. 브라우저 탭 파비콘과 홈 화면 아이콘에 쓰며,
          이 자리에서는 로크업 대신 고정된 이 형태를 사용합니다. 원본:{' '}
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
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 22 }}>공식 사각 로고 · 크기별 확인</h2>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          소셜 프로필·문서 썸네일처럼 정사각 슬롯이 고정된 자리에서 원본 조합을 그대로 축소합니다. 기업 표기형은 디지털
          160px 이상, 권장 192px 이상, 인쇄 32mm 이상에서만 사용합니다. 그보다 작으면 법인명 없는 기본형을 사용하고,
          표면에 맞춰 네이비 바탕 또는 화이트 바탕 반전을 고릅니다.
        </p>
        <div style={{ display: 'grid', gap: 'var(--space-5)', padding: 'var(--space-5)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
          {OFFICIAL_LOGO_VARIANTS.map((variant) => (
            <div key={variant.file} style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <strong style={{ color: 'var(--color-semantic-label-normal)', fontSize: 13 }}>
                {variant.logoLabel} · {variant.label}
              </strong>
              <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {(variant.file.includes('corporate') ? [320, 192, 160] : [160, 96, 64, 48]).map((size) => (
                <div key={size} style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
                  <img
                    src={`./assets/brand/${variant.file}`}
                    alt={`LK ROBOTICS 공식 사각 로고 (${variant.logoLabel} · ${variant.label})`}
                    width={size}
                    height={size}
                    style={{ display: 'block', border: variant.light ? '1px solid var(--color-semantic-line-solid-neutral)' : 'none' }}
                  />
                  <code style={{ fontSize: 11, color: 'var(--color-semantic-label-alternative)' }}>{size}px</code>
                </div>
              ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 22 }}>가로형 배너</h2>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          공식 심볼과 워드마크 path로 만든 inline 파생형에 사방 여백 규정(0.5X, X=LK 심볼 보이는 높이)을 포함한 배너입니다. 서명·헤더 이미지처럼 가로
          슬롯이 고정된 자리에 쓰며, 공식 네이비 바탕과 화이트 바탕 두 벌을 제공합니다. 원본:{' '}
          <code style={{ fontSize: 12, color: 'var(--color-semantic-label-alternative)' }}>assets/brand/lk-logo-banner-navy.svg · lk-logo-banner-light.svg</code>
        </p>
        <div style={{ display: 'grid', gap: 'var(--space-5)', padding: 'var(--space-5)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
          {[['lk-logo-banner-navy.svg', '네이비 바탕'], ['lk-logo-banner-light.svg', '화이트 바탕']].map(([file, label]) => (
            <div key={file} style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {[96, 64, 44, 28].map((height) => (
                <div key={height} style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
                  <img src={`./assets/brand/${file}`} alt={`LK ROBOTICS 가로형 배너 로고 (${label})`} height={height} style={{ display: 'block', border: file.includes('light') ? '1px solid var(--color-semantic-line-solid-neutral)' : 'none' }} />
                  <code style={{ fontSize: 11, color: 'var(--color-semantic-label-alternative)' }}>{height}px</code>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  ),
};

export const LockupOverlineCard = {
  name: 'Lockup · Overline card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 820, minHeight: 650, boxSizing: 'border-box', background: 'var(--color-semantic-background-normal-normal)', padding: '22px 24px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)', marginBottom: 10 }}>
            Lockup — mark · stacked · inline
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', flexWrap: 'wrap', padding: '20px 24px', borderRadius: 'var(--radius-xl)', background: 'var(--color-semantic-static-white)', border: '1px solid var(--color-semantic-line-solid-normal)' }}>
            <Lockup variant="mark" tone="ink" height={46} />
            <Lockup variant="stacked" tone="ink" height={66} />
            <Lockup variant="inline" tone="ink" height={30} />
            <Lockup variant="inline" tone="ink" height={20} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', flexWrap: 'wrap', padding: '20px 24px', borderRadius: 'var(--radius-xl)', background: 'var(--color-semantic-brand-surface)', marginTop: 12 }}>
            <Lockup variant="mark" tone="white" height={46} />
            <Lockup variant="stacked" tone="white" height={66} />
            <Lockup variant="inline" tone="white" height={30} />
            <Lockup variant="inline" tone="white" height={20} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)', marginBottom: 10 }}>
            Corporate descriptor — 160px minimum
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '18px 24px', borderRadius: 'var(--radius-xl)', background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)' }}>
            <img src="./assets/brand/lk-logo-official-corporate.svg" alt="LK ROBOTICS 기업 표기형 네이비" width={160} height={160} style={{ display: 'block' }} />
            <img src="./assets/brand/lk-logo-official-corporate-light.svg" alt="LK ROBOTICS 기업 표기형 화이트" width={160} height={160} style={{ display: 'block', border: '1px solid var(--color-semantic-line-solid-neutral)' }} />
            <div style={{ display: 'grid', gap: 6, maxWidth: 250, color: 'var(--color-semantic-label-neutral)', fontSize: 12, lineHeight: 1.55 }}>
              <strong style={{ color: 'var(--color-semantic-label-normal)' }}>Noto Sans KR ExtraBold 800</strong>
              <span>자간 0.105em · 폭 1.90X · 간격 0.21X</span>
              <span>160px 미만에서는 기본형 사용</span>
            </div>
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
