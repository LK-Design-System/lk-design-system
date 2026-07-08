const meta = {
  title: 'LDS Core/Foundation/Decorate',
  parameters: {
    docs: {
      description: {
        component: 'Decorate coverage for gradient, mask, and interaction overlay primitives.',
      },
    },
  },
};

export default meta;

const panelStyle = {
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-frame-lg)',
  background: 'var(--surface-card)',
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
        <strong style={{ color: 'var(--label-strong)' }}>{label}</strong>
        <code style={{ color: 'var(--label-alternative)', fontSize: 12, wordBreak: 'break-word' }}>{token}</code>
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
          border: '1px solid var(--border-subtle)',
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
          border: '1px solid var(--border-subtle)',
          background: 'var(--surface-subtle)',
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
            background: 'var(--label-normal)',
            WebkitMaskImage: `var(${token})`,
            maskImage: `var(${token})`,
          }}
        />
      </div>
    </TokenCard>
  );
}

export const GradientTokens = {
  name: 'Gradient and mask tokens',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1120 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Decorate / Gradient
        </p>
        <h1 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          Decorative gradients are tokenized by type and direction
        </h1>
        <p style={{ margin: 0, maxWidth: 820, color: 'var(--label-neutral)', lineHeight: 1.7 }}>
          The decorate source separates Solid, Multiple, and Mask gradients. LDS keeps the same categories with top,
          right, bottom, and left direction tokens.
        </p>
      </header>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
          Solid and multiple
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--space-3)' }}>
          {gradientTokens.map(([label, token]) => (
            <GradientSwatch key={token} label={label} token={token} />
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
          Mask
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
  name: 'Interaction tokens',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1040 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Decorate / Interaction
        </p>
        <h1 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          Interaction decoration uses layer and state tokens
        </h1>
        <p style={{ margin: 0, maxWidth: 780, color: 'var(--label-neutral)', lineHeight: 1.7 }}>
          The source names interaction variants and states separately. LDS maps those into layer tokens and opacity
          state tokens so components do not invent one-off hover or pressed visuals.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
        {interactionLayers.map(([label, token]) => (
          <TokenCard key={token} label={label} token={token}>
            <div
              style={{
                height: 96,
                borderRadius: 'var(--radius-frame-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--surface-subtle)',
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
                  border: '1px solid var(--border-subtle)',
                }}
              />
            </div>
          </TokenCard>
        ))}
      </section>

      <section style={panelStyle}>
        <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--label-strong)', fontSize: 18 }}>State opacity</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)' }}>
          {interactionStates.map(([label, token]) => (
            <div key={token} style={{ display: 'grid', gap: 'var(--space-2)' }}>
              <div
                style={{
                  height: 56,
                  borderRadius: 'var(--radius-frame-md)',
                  background: 'var(--color-primary)',
                  opacity: `var(${token})`,
                }}
              />
              <strong style={{ color: 'var(--label-strong)' }}>{label}</strong>
              <code style={{ color: 'var(--label-alternative)', fontSize: 12, wordBreak: 'break-word' }}>{token}</code>
            </div>
          ))}
        </div>
      </section>
    </main>
  ),
};
