import { AspectRatio } from '../src/index.js';

const meta = {
  title: 'LDS Core/Foundation/Basic',
  parameters: {
    docs: {
      description: {
        component: 'Foundation coverage for ratio primitives exported from the local source.',
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

const horizontalRatios = [
  ['1:1', '--ratio-1-1'],
  ['5:4', '--ratio-5-4'],
  ['4:3', '--ratio-4-3'],
  ['3:2', '--ratio-3-2'],
  ['16:10', '--ratio-16-10'],
  ['Golden', '--ratio-golden'],
  ['16:9', '--ratio-16-9'],
  ['2:1', '--ratio-2-1'],
  ['21:9', '--ratio-21-9'],
];

const verticalRatios = [
  ['1:2', '--ratio-1-2'],
  ['4:5', '--ratio-4-5'],
  ['3:4', '--ratio-3-4'],
  ['2:3', '--ratio-2-3'],
  ['10:16', '--ratio-10-16'],
  ['Golden vertical', '--ratio-golden-vertical'],
  ['9:16', '--ratio-9-16'],
  ['9:21', '--ratio-9-21'],
];

function RatioTile({ label, token, vertical = false }) {
  return (
    <article
      style={{
        ...panelStyle,
        display: 'grid',
        gap: 'var(--space-3)',
        minWidth: 0,
      }}
    >
      <AspectRatio
        ratio={`var(${token})`}
        style={{
          width: vertical ? 92 : '100%',
          maxWidth: '100%',
          justifySelf: vertical ? 'center' : 'stretch',
          borderRadius: 'var(--radius-frame-md)',
          border: '1px solid var(--border-subtle)',
          background:
            'linear-gradient(135deg, var(--surface-subtle) 0%, var(--fill-normal) 54%, var(--surface-raised) 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 'var(--space-3)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--line-normal)',
          }}
        />
      </AspectRatio>
      <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
        <strong style={{ color: 'var(--label-strong)' }}>{label}</strong>
        <code style={{ color: 'var(--label-alternative)', fontSize: 12, wordBreak: 'break-word' }}>{token}</code>
      </div>
    </article>
  );
}

export const RatioTokens = {
  name: 'Ratio tokens',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1180 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Basic / Ratio
        </p>
        <h1 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          Ratio is a foundation token, not a one-off layout guess
        </h1>
        <p style={{ margin: 0, maxWidth: 820, color: 'var(--label-neutral)', lineHeight: 1.7 }}>
          The foundation source defines horizontal and vertical ratio presets. LDS exposes them as CSS aspect-ratio tokens and
          routes usage through the AspectRatio primitive.
        </p>
      </header>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
          Horizontal ratios
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
          {horizontalRatios.map(([label, token]) => (
            <RatioTile key={token} label={label} token={token} />
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
          Vertical ratios
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
          {verticalRatios.map(([label, token]) => (
            <RatioTile key={token} label={label} token={token} vertical />
          ))}
        </div>
      </section>

      <section style={panelStyle}>
        <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--label-strong)', fontSize: 18 }}>Customize rule</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
          <p style={{ margin: 0, color: 'var(--label-neutral)', lineHeight: 1.65 }}>
            Horizontal examples customize width and let height follow the selected ratio token.
          </p>
          <p style={{ margin: 0, color: 'var(--label-neutral)', lineHeight: 1.65 }}>
            Vertical examples customize height or the containing column and keep width derived from the token.
          </p>
        </div>
      </section>
    </main>
  ),
};
