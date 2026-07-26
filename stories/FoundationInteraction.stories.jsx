
const meta = {
  id: 'lds-core-foundation-interaction',
  title: 'LDS Core/Foundation/State',
  tags: ['autodocs'],
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
          '공통 상태 축, 전역 포커스 링, 계열별 hover·pressed 표현으로 구성된 인터랙션 계약입니다.',
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
   "어떤 상태를 미리보기로 렌더링할지"를 고르는 열거형입니다. */
const stateAxis = [
  ['normal', '기본 상태. 별도 인터랙션 표현 없음.'],
  ['hovered', '포인터가 올라간 상태. 계열별 hover 표현을 적용.'],
  ['focused', '키보드 포커스 상태. 아래 포커스 계약을 그대로 사용.'],
  ['pressed', '눌린 상태. hover보다 한 단계 강한 표현을 적용.'],
];

/* 계열별 hover·pressed 표현. */
const expressionFamilies = [
  {
    family: '표면 채움 (Fill)',
    example: 'ListCell, MenuItem 계열 행·셀',
    hover: '--color-semantic-fill-alternative',
    pressed: '--color-semantic-fill-strong',
    preview: 'fill',
  },
  {
    family: '엘리베이션 (Elevation)',
    example: 'Card interactive',
    hover: '--component-card-shadow-lg + --component-card-hover-transform',
    pressed: '별도 표현 없음 (hover 상태를 유지)',
    preview: 'elevation',
  },
  {
    family: '링·스케일 (Ring)',
    example: 'Avatar interaction',
    hover: '1px --color-semantic-line-solid-normal 링',
    pressed: '같은 링 + scale(0.96)',
    preview: 'ring',
  },
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
          '공통 상태 축, 전역 포커스 계약, 계열별 hover·pressed 표현을 한 화면에서 확인합니다. 상태 이름은 일관되게 재사용하고 표면의 성격에 맞는 표현 계열을 선택하세요.',
      },
    },
  },
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1040 }}>
      {/*
        No eyebrow and no title here. `parameters.storyGuide` already puts a masthead above this
        story with the same eyebrow and a title of its own, so a second one made the page
        introduce itself twice. What stays is the part the masthead does not say: the two-layer
        model the specimen below is organised by.
      */}
      <p style={{ ...noteStyle, maxWidth: 780 }}>
          LDS는 인터랙션을 두 층으로 나눕니다. 위층은 모든 컴포넌트가 공유하는 <strong>상태 축</strong>
          (normal · hovered · focused · pressed)이고, 아래층은 그 상태를 화면에 그리는 <strong>표현 계열</strong>입니다.
          상태 이름은 컴포넌트를 넘나들며 같지만, 표현은 계열마다 다른 semantic token을 씁니다. 새로운 표현을
          임의로 추가하지 않고 표면의 성격에 가장 가까운 기존 계열을 사용합니다.
      </p>

      <section style={{ ...panelStyle, display: 'grid', gap: 'var(--space-3)' }}>
        <h3 style={headingStyle}>1. 공통 상태 축</h3>
        <p style={noteStyle}>
          상태 축은 CSS 토큰이 아니라 컴포넌트 API입니다. 상태를 노출하는 컴포넌트는{' '}
          <code style={codeStyle}>interaction</code> prop으로 같은 열거형을 받고, 실제 포인터·키보드 이벤트가
          만드는 상태와 동일한 스타일을 렌더링합니다. 여러 상태의 시각 표현을 나란히 비교할 때 사용합니다.
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
      </section>

      <section style={{ ...panelStyle, display: 'grid', gap: 'var(--space-3)' }}>
        <h3 style={headingStyle}>2. 포커스는 링으로만 표현합니다</h3>
        <p style={noteStyle}>
          포커스는 계열별로 달라지지 않습니다. 모든 인터랙티브 요소는{' '}
          <code style={codeStyle}>:focus-visible</code>일 때 명확한 포커스 링을 표시합니다.
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
          맵·SVG 지오메트리는 사각 외곽선 대신 도형을 따라가는 포커스 표시를 사용할 수 있지만, 같은 대비와
          비포커스 상태 구분 기준을 충족해야 합니다.
        </p>
      </section>

      <section style={{ ...panelStyle, display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <h3 style={headingStyle}>3. hover · pressed 표현 계열</h3>
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
              </div>
              <FamilyPreview kind={row.preview} />
            </article>
          ))}
        </div>
      </section>

    </main>
  ),
};
