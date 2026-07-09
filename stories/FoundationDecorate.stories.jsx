const meta = {
  title: 'LDS Core/Foundation/Decorate',
  parameters: {
    docs: {
      description: {
        component: '그라디언트, 마스크, 인터랙션 오버레이 프리미티브를 다루는 Decorate 커버리지입니다.',
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

const gradientTokens = [
  ['Solid top', '--decorate-gradient-solid-top'],
  ['Solid right', '--decorate-gradient-solid-right'],
  ['Solid bottom', '--decorate-gradient-solid-bottom'],
  ['Solid left', '--decorate-gradient-solid-left'],
  ['Multiple top', '--decorate-gradient-multiple-top'],
  ['Multiple right', '--decorate-gradient-multiple-right'],
  ['Multiple bottom', '--decorate-gradient-multiple-bottom'],
  ['Multiple left', '--decorate-gradient-multiple-left'],
];

const maskTokens = [
  ['Mask top', '--decorate-mask-fade-top'],
  ['Mask right', '--decorate-mask-fade-right'],
  ['Mask bottom', '--decorate-mask-fade-bottom'],
  ['Mask left', '--decorate-mask-fade-left'],
];

const interactionLayers = [
  ['Normal', '--interaction-layer-normal'],
  ['Default', '--interaction-layer-default'],
  ['Light', '--interaction-layer-light'],
  ['Strong', '--interaction-layer-strong'],
];

const interactionStates = [
  ['Normal', '--interaction-opacity-normal'],
  ['Hovered', '--interaction-opacity-hovered'],
  ['Focused', '--interaction-opacity-focused'],
  ['Pressed', '--interaction-opacity-pressed'],
];

function TokenCard({ label, token, children }) {
  return (
    <article style={{ ...panelStyle, display: 'grid', gap: 'var(--space-3)' }}>
      {children}
      <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
        <strong style={{ color: 'var(--color-semantic-label-strong)' }}>{label}</strong>
        <code style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 12, wordBreak: 'break-word' }}>{token}</code>
      </div>
    </article>
  );
}

function GradientSwatch({ label, token }) {
  return (
    <TokenCard label={label} token={token}>
      <div
        style={{
          height: 104,
          borderRadius: 'var(--radius-frame-md)',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          background: `var(${token})`,
        }}
      />
    </TokenCard>
  );
}

function MaskSwatch({ label, token }) {
  return (
    <TokenCard label={label} token={token}>
      <div
        style={{
          height: 104,
          borderRadius: 'var(--radius-frame-md)',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          background: 'var(--color-semantic-background-normal-alternative)',
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div
          style={{
            width: '78%',
            height: 56,
            borderRadius: 'var(--radius-frame-md)',
            background: 'var(--color-semantic-label-normal)',
            WebkitMaskImage: `var(${token})`,
            maskImage: `var(${token})`,
          }}
        />
      </div>
    </TokenCard>
  );
}

export const GradientTokens = {
  name: '그라디언트와 마스크 토큰',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1120 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Decorate / Gradient
        </p>
        <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          장식용 그라디언트는 유형과 방향으로 토큰화되어 있습니다
        </h1>
        <p style={{ margin: 0, maxWidth: 820, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          Decorate 소스는 Solid, Multiple, Mask 그라디언트를 구분합니다. LDS는 같은 분류를 유지하면서 top,
          right, bottom, left 방향 토큰을 제공합니다.
        </p>
      </header>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
          Solid와 Multiple
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--space-3)' }}>
          {gradientTokens.map(([label, token]) => (
            <GradientSwatch key={token} label={label} token={token} />
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
          마스크
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--space-3)' }}>
          {maskTokens.map(([label, token]) => (
            <MaskSwatch key={token} label={label} token={token} />
          ))}
        </div>
      </section>
    </main>
  ),
};

export const InteractionTokens = {
  name: '인터랙션 토큰',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1040 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Decorate / Interaction
        </p>
        <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          인터랙션 장식은 레이어와 상태 토큰을 사용합니다
        </h1>
        <p style={{ margin: 0, maxWidth: 780, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          소스는 인터랙션 변형과 상태를 따로 명명합니다. LDS는 이를 레이어 토큰과 불투명도 상태 토큰으로 매핑해
          컴포넌트가 임의의 hover, pressed 표현을 만들지 않게 합니다.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
        {interactionLayers.map(([label, token]) => (
          <TokenCard key={token} label={label} token={token}>
            <div
              style={{
                height: 96,
                borderRadius: 'var(--radius-frame-md)',
                border: '1px solid var(--color-semantic-line-normal-normal)',
                background: 'var(--color-semantic-background-normal-alternative)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <div
                style={{
                  width: '76%',
                  height: 48,
                  borderRadius: 'var(--radius-frame-md)',
                  background: `var(${token})`,
                  border: '1px solid var(--color-semantic-line-normal-normal)',
                }}
              />
            </div>
          </TokenCard>
        ))}
      </section>

      <section style={panelStyle}>
        <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--color-semantic-label-strong)', fontSize: 18 }}>상태 불투명도</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)' }}>
          {interactionStates.map(([label, token]) => (
            <div key={token} style={{ display: 'grid', gap: 'var(--space-2)' }}>
              <div
                style={{
                  height: 56,
                  borderRadius: 'var(--radius-frame-md)',
                  background: 'var(--color-semantic-primary-normal)',
                  opacity: `var(${token})`,
                }}
              />
              <strong style={{ color: 'var(--color-semantic-label-strong)' }}>{label}</strong>
              <code style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 12, wordBreak: 'break-word' }}>{token}</code>
            </div>
          ))}
        </div>
      </section>
    </main>
  ),
};
