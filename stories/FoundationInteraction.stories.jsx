import { foundationGuideStory } from './FoundationGuide.shared.jsx';

const meta = {
  id: 'lds-core-foundation-interaction',
  title: 'LDS Core/Foundation/State',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-interaction--interaction-tokens',
      eyebrow: 'Foundation / Interaction',
      title: '인터랙션 표현은 상태 축은 공통, 시각 표현은 컴포넌트 계열이 담당합니다',
      description:
        'LDS는 hover·pressed·focus를 하나의 불투명도 램프로 묶지 않습니다. 상태 축(normal·hovered·focused·pressed)은 컴포넌트 API가 공통으로 노출하고, 실제 표현은 계열별 semantic token으로 고정됩니다. 포커스만은 예외 없이 전역 focus ring 계약을 따릅니다.',
    },
    docs: {
      description: {
        component:
          '이 페이지는 LDS가 실제로 구현하고 있는 인터랙션 계약을 기술합니다. 공통 상태 축, 전역 포커스 링, 계열별 hover·pressed 표현 세 가지로 구성됩니다. 과거 문서가 소개하던 `--interaction-layer-*` / `--interaction-opacity-*` 토큰은 어떤 컴포넌트도 소비하지 않으며 deprecated 상태입니다(하단 참고).',
      },
    },
  },
};

export default meta;

const panelStyle = {
  border: '1px solid var(--color-semantic-line-normal-normal)',
  borderRadius: 'var(--radius-frame-lg)',
  background: 'var(--color-semantic-background-elevated-normal)',
  padding: 'var(--space-5)',
  boxShadow: 'var(--shadow-xs)',
};

const headingStyle = {
  margin: 0,
  color: 'var(--color-semantic-label-strong)',
  fontSize: 18,
  fontWeight: 'var(--fw-semibold)',
};

const noteStyle = {
  margin: 0,
  color: 'var(--color-semantic-label-neutral)',
  lineHeight: 1.7,
};

const codeStyle = {
  color: 'var(--color-semantic-label-alternative)',
  fontSize: 12,
  wordBreak: 'break-word',
};

/* 상태 축은 컴포넌트 API에서 공통으로 쓰는 이름입니다. 값은 불투명도가 아니라
   "어떤 상태를 미리보기로 렌더링할지"를 고르는 열거형입니다.
   근거: components/content/ListCell.jsx, components/feedback/Avatar.jsx,
   components/selection/ChoiceCard.jsx, components/forms/{Input,Checkbox,Radio,
   Select,Textarea}.jsx, components/selection/{Switch,SegmentedControl}.jsx */
const stateAxis = [
  ['normal', '기본 상태. 별도 인터랙션 표현 없음.'],
  ['hovered', '포인터가 올라간 상태. 계열별 hover 표현을 적용.'],
  ['focused', '키보드 포커스 상태. 아래 포커스 계약을 그대로 사용.'],
  ['pressed', '눌린 상태. hover보다 한 단계 강한 표현을 적용.'],
];

/* 계열별 hover·pressed 표현. 각 행은 실제 구현 파일에서 확인한 값입니다. */
const expressionFamilies = [
  {
    family: '표면 채움 (Fill)',
    example: 'ListCell, MenuItem 계열 행·셀',
    hover: '--color-semantic-fill-alternative',
    pressed: '--color-semantic-fill-strong',
    evidence: 'components/content/ListCell.jsx',
    preview: 'fill',
  },
  {
    family: '엘리베이션 (Elevation)',
    example: 'Card interactive',
    hover: '--component-card-shadow-lg + --component-card-hover-transform',
    pressed: '별도 표현 없음 (hover 상태를 유지)',
    evidence: 'components/cards/Card.jsx · tokens/components.css',
    preview: 'elevation',
  },
  {
    family: '링·스케일 (Ring)',
    example: 'Avatar interaction',
    hover: '1px --color-semantic-line-solid-normal 링',
    pressed: '같은 링 + scale(0.96)',
    evidence: 'components/feedback/Avatar.jsx',
    preview: 'ring',
  },
];

/* 폐기 예정 토큰과 대체 경로. tokens/effects.css의 Decorate/Interaction 블록. */
const deprecatedTokens = [
  ['--interaction-layer-normal', 'transparent', '표현 없음 — 상태별 배경을 지정하지 않는다'],
  ['--interaction-layer-light', 'rgba(112, 115, 124, 0.05)', '--color-semantic-fill-alternative (동일 값)'],
  ['--interaction-layer-default', 'rgba(112, 115, 124, 0.08)', '--color-semantic-fill-normal (동일 값)'],
  ['--interaction-layer-strong', 'rgba(112, 115, 124, 0.14)', '--color-semantic-fill-strong (0.16, 근사값)'],
  ['--interaction-opacity-normal', '1', '대체 없음 — 상태를 불투명도로 표현하지 않는다'],
  ['--interaction-opacity-hovered', '0.92', '계열별 hover 표현 (위 표 참고)'],
  ['--interaction-opacity-focused', '0.84', '전역 focus ring 계약 (tokens/focus.css)'],
  ['--interaction-opacity-pressed', '0.76', '계열별 pressed 표현 (위 표 참고)'],
];

function SwatchBox({ children, background = 'var(--color-semantic-background-elevated-normal)', style }) {
  return (
    <div
      style={{
        height: 72,
        borderRadius: 'var(--radius-frame-md)',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        background,
        display: 'grid',
        placeItems: 'center',
        color: 'var(--color-semantic-label-alternative)',
        fontSize: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function FamilyPreview({ kind }) {
  if (kind === 'fill') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
        <SwatchBox background="var(--color-semantic-fill-alternative)">hovered</SwatchBox>
        <SwatchBox background="var(--color-semantic-fill-strong)">pressed</SwatchBox>
      </div>
    );
  }
  if (kind === 'elevation') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', alignItems: 'center' }}>
        <SwatchBox style={{ boxShadow: 'var(--shadow-sm)' }}>normal</SwatchBox>
        <SwatchBox style={{ boxShadow: 'var(--component-card-shadow-lg)', transform: 'var(--component-card-hover-transform)' }}>
          hovered
        </SwatchBox>
      </div>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', placeItems: 'center' }}>
      <span
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'var(--color-semantic-background-normal-alternative)',
          boxShadow: '0 0 0 1px var(--color-semantic-line-solid-normal)',
        }}
      />
      <span
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'var(--color-semantic-background-normal-alternative)',
          boxShadow: '0 0 0 1px var(--color-semantic-line-solid-normal)',
          transform: 'scale(0.96)',
        }}
      />
    </div>
  );
}

export const InteractionTokens = {
  name: '개요',
  parameters: {
    docs: {
      description: {
        story:
          '공통 상태 축, 전역 포커스 계약, 계열별 hover·pressed 표현을 한 화면에서 확인합니다. 새 컴포넌트를 만들 때는 상태 이름을 그대로 재사용하고, 표현은 세 계열 중 하나를 골라 쓰세요. 새 계열을 만들려면 이 페이지에 근거와 함께 추가해야 합니다.',
      },
    },
  },
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1040 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Foundation / Interaction
        </p>
        <h1
          style={{
            margin: 0,
            color: 'var(--color-semantic-label-strong)',
            fontSize: 'var(--title2-size)',
            lineHeight: 'var(--title2-line)',
          }}
        >
          상태 이름은 하나, 표현은 계열별로 고정합니다
        </h1>
        <p style={{ ...noteStyle, maxWidth: 780 }}>
          LDS는 인터랙션을 두 층으로 나눕니다. 위층은 모든 컴포넌트가 공유하는 <strong>상태 축</strong>
          (normal · hovered · focused · pressed)이고, 아래층은 그 상태를 화면에 그리는 <strong>표현 계열</strong>입니다.
          상태 이름은 컴포넌트를 넘나들며 같지만, 표현은 계열마다 다른 semantic token을 씁니다. 컴포넌트가 자유롭게
          만들어도 되는 것은 없으며, 아래 세 계열 밖의 표현을 추가하려면 이 페이지를 함께 갱신해야 합니다.
        </p>
      </header>

      <section style={{ ...panelStyle, display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={headingStyle}>1. 공통 상태 축</h2>
        <p style={noteStyle}>
          상태 축은 CSS 토큰이 아니라 컴포넌트 API입니다. 상태를 노출하는 컴포넌트는{' '}
          <code style={codeStyle}>interaction</code> prop으로 같은 열거형을 받고, 실제 포인터·키보드 이벤트가
          만드는 내부 상태와 동일한 스타일을 렌더링합니다. 문서·시각 회귀 스냅샷에서 상태를 고정할 때 사용합니다.
        </p>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          {stateAxis.map(([token, description]) => (
            <div
              key={token}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(96px, 120px) minmax(0, 1fr)',
                gap: 'var(--space-3)',
                alignItems: 'baseline',
                paddingTop: 'var(--space-2)',
                borderTop: '1px solid var(--color-semantic-line-normal-alternative)',
              }}
            >
              <code style={{ ...codeStyle, color: 'var(--color-semantic-label-strong)' }}>{token}</code>
              <span style={{ color: 'var(--color-semantic-label-neutral)', lineHeight: 1.6 }}>{description}</span>
            </div>
          ))}
        </div>
        <p style={{ ...noteStyle, fontSize: 13 }}>
          근거: <code style={codeStyle}>components/content/ListCell.jsx</code>,{' '}
          <code style={codeStyle}>components/feedback/Avatar.jsx</code>,{' '}
          <code style={codeStyle}>components/selection/ChoiceCard.jsx</code>,{' '}
          <code style={codeStyle}>components/forms/Input.jsx</code> 외 폼·선택 컴포넌트.
        </p>
      </section>

      <section style={{ ...panelStyle, display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={headingStyle}>2. 포커스는 링으로만 표현합니다</h2>
        <p style={noteStyle}>
          포커스는 계열별로 달라지지 않습니다. <code style={codeStyle}>tokens/focus.css</code>가 모든 인터랙티브
          요소에 <code style={codeStyle}>:focus-visible</code> 링을 <code style={codeStyle}>!important</code>로
          부여하므로, 컴포넌트가 <code style={codeStyle}>outline: none</code>을 써도 링은 사라지지 않습니다.
          <strong> 불투명도를 낮추는 방식으로 포커스를 표현하지 마세요.</strong> 불투명도만으로는 WCAG 2.4.7(Focus
          Visible) · 2.4.11(Focus Appearance)의 비포커스 대비 요구를 만족할 수 없습니다.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <strong style={{ color: 'var(--color-semantic-label-strong)' }}>전역 키보드 포커스 링</strong>
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                height: 96,
                borderRadius: 'var(--radius-frame-md)',
                background: 'var(--color-semantic-background-normal-alternative)',
              }}
            >
              <button
                type="button"
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-frame-md)',
                  border: '1px solid var(--color-semantic-line-solid-normal)',
                  background: 'var(--color-semantic-background-elevated-normal)',
                  color: 'var(--color-semantic-label-normal)',
                  font: 'inherit',
                  cursor: 'pointer',
                }}
              >
                Tab으로 포커스해 보세요
              </button>
            </div>
            <code style={codeStyle}>outline: 2px solid var(--color-semantic-focus-indicator); outline-offset: 2px</code>
          </div>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <strong style={{ color: 'var(--color-semantic-label-strong)' }}>폼 컨트롤 포커스 섀도</strong>
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                height: 96,
                borderRadius: 'var(--radius-frame-md)',
                background: 'var(--color-semantic-background-normal-alternative)',
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-semantic-background-elevated-normal)',
                  border: '1px solid var(--color-semantic-line-solid-_strong)',
                  boxShadow: '0 0 0 4px var(--color-semantic-focus-ring)',
                }}
              />
            </div>
            <code style={codeStyle}>box-shadow: 0 0 0 4px var(--color-semantic-focus-ring)</code>
          </div>
        </div>
        <p style={{ ...noteStyle, fontSize: 13 }}>
          두 역할은 서로 대체재가 아닙니다. <code style={codeStyle}>--color-semantic-focus-indicator</code>는 전역
          아웃라인 링, <code style={codeStyle}>--color-semantic-focus-ring</code>은 폼 컨트롤 box-shadow 전용입니다.
          맵·SVG 지오메트리(<code style={codeStyle}>[data-waypoint-marker]</code> 등)는 전역 링을 끄고 SVG 안에서
          도형을 따라가는 포커스 표시를 직접 그립니다 — 이는 <code style={codeStyle}>tokens/focus.css</code>에 명시된
          유일한 예외입니다.
        </p>
      </section>

      <section style={{ ...panelStyle, display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <h2 style={headingStyle}>3. hover · pressed 표현 계열</h2>
          <p style={noteStyle}>
            같은 계열 안에서는 항상 같은 토큰을 씁니다. 컴포넌트를 새로 만들 때는 표면의 성격을 보고 계열을 고르세요.
            행·셀처럼 표면이 넓으면 Fill, 떠 있는 카드면 Elevation, 원형 미디어면 Ring입니다.
          </p>
        </div>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          {expressionFamilies.map((row) => (
            <article
              key={row.family}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 'var(--space-3)',
                paddingTop: 'var(--space-3)',
                borderTop: '1px solid var(--color-semantic-line-normal-alternative)',
              }}
            >
              <div style={{ display: 'grid', gap: 'var(--space-1)', alignContent: 'start' }}>
                <strong style={{ color: 'var(--color-semantic-label-strong)' }}>{row.family}</strong>
                <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 13 }}>{row.example}</span>
                <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 13 }}>
                  hovered · <code style={codeStyle}>{row.hover}</code>
                </span>
                <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 13 }}>
                  pressed · <code style={codeStyle}>{row.pressed}</code>
                </span>
                <code style={{ ...codeStyle, fontSize: 11 }}>{row.evidence}</code>
              </div>
              <FamilyPreview kind={row.preview} />
            </article>
          ))}
        </div>
      </section>

      <section
        style={{
          ...panelStyle,
          display: 'grid',
          gap: 'var(--space-3)',
          background: 'var(--color-semantic-status-cautionary-surface)',
          border: '1px solid var(--color-semantic-status-cautionary-border)',
        }}
      >
        <h2 style={headingStyle}>4. Deprecated · `--interaction-*` 토큰</h2>
        <p style={noteStyle}>
          <code style={codeStyle}>tokens/effects.css</code>의 Decorate / Interaction 블록은 초기 WDS 매핑 시도에서
          남은 토큰입니다. <strong>어떤 컴포넌트도 이 토큰을 소비하지 않습니다.</strong> 특히{' '}
          <code style={codeStyle}>--interaction-opacity-focused: 0.84</code>가 전제하는 &ldquo;불투명도로 포커스를
          표현한다&rdquo;는 모델은 위 2번의 포커스 링 계약과 정면으로 충돌하며 접근성 요구도 만족하지 못합니다.
          새 코드에서 사용하지 말고 아래 대체 경로를 따르세요. 폐기 이력은{' '}
          <code style={codeStyle}>docs/TOKEN_GOVERNANCE.md</code>에 기록되어 있습니다.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560, fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--color-semantic-label-alternative)' }}>
                <th style={{ padding: '6px 8px', fontWeight: 'var(--fw-medium)' }}>폐기 토큰</th>
                <th style={{ padding: '6px 8px', fontWeight: 'var(--fw-medium)' }}>현재 값</th>
                <th style={{ padding: '6px 8px', fontWeight: 'var(--fw-medium)' }}>대체</th>
              </tr>
            </thead>
            <tbody>
              {deprecatedTokens.map(([token, value, replacement]) => (
                <tr key={token} style={{ borderTop: '1px solid var(--color-semantic-line-normal-alternative)' }}>
                  <td style={{ padding: '6px 8px' }}>
                    <code style={{ ...codeStyle, textDecoration: 'line-through' }}>{token}</code>
                  </td>
                  <td style={{ padding: '6px 8px', color: 'var(--color-semantic-label-neutral)' }}>{value}</td>
                  <td style={{ padding: '6px 8px', color: 'var(--color-semantic-label-neutral)' }}>{replacement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    /* 폐기 표는 토큰의 원시 값을 문서 내용으로 싣는다. tokens/effects.css가 바뀌면
       이 표가 거짓말을 하므로, 해석된 값과 대조해 드리프트를 막는다. */
    const styles = getComputedStyle(canvasElement.ownerDocument.documentElement);
    const normalize = (value) => value.trim().replace(/\s+/g, ' ');
    for (const [token, documented] of deprecatedTokens) {
      const resolved = normalize(styles.getPropertyValue(token));
      if (!resolved) {
        throw new Error(`${token}이 아직 폐기 표에 있지만 tokens/effects.css에서 사라졌습니다. 표에서 제거하세요.`);
      }
      if (resolved !== normalize(documented)) {
        throw new Error(`${token}의 문서값 ${documented}이 실제 토큰 값 ${resolved}과 다릅니다.`);
      }
    }
  },
};

export const Guidance = { ...foundationGuideStory('state', '참조 · 전체 지침'), name: '참조 · 전체 지침' };
