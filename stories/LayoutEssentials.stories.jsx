import { Divider, MobileSystemBars } from '../src/index.js';

const meta = {
  title: 'LDS Core/3 Component/1 Layout/Essential and Divider',
  parameters: {
    docs: {
      description: {
        component: 'Layout coverage for Essential mobile system bars and Divider variants.',
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

function PhoneMock({ platform }) {
  return (
    <div
      style={{
        width: 220,
        height: 420,
        border: '1px dashed var(--color-accent)',
        borderRadius: 'var(--radius-frame-xl)',
        background: 'var(--surface-subtle)',
        overflow: 'hidden',
      }}
    >
      <MobileSystemBars platform={platform} style={{ minHeight: '100%' }} />
    </div>
  );
}

export const EssentialAndDivider = {
  name: 'Essential and Divider',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1100 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Layout / Essential + Divider
        </p>
        <h1 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          Layout essentials stay separate from product layout components
        </h1>
        <p style={{ margin: 0, maxWidth: 820, color: 'var(--label-neutral)', lineHeight: 1.7 }}>
          The layout source defines Essential mobile system bars and Divider variants. LDS maps those to small primitives
          instead of folding them into PageHeader, Grid, or product-only shells.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--label-strong)', fontSize: 18 }}>Essential / iOS</h2>
          <PhoneMock platform="ios" />
        </article>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--label-strong)', fontSize: 18 }}>Essential / Android</h2>
          <PhoneMock platform="android" />
        </article>
      </section>

      <section style={panelStyle}>
        <h2 style={{ margin: '0 0 var(--space-4)', color: 'var(--label-strong)', fontSize: 18 }}>Divider variants</h2>
        <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <strong style={{ color: 'var(--label-normal)' }}>variant = normal</strong>
            <Divider />
          </div>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <strong style={{ color: 'var(--label-normal)' }}>variant = thick</strong>
            <Divider variant="thick" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minHeight: 56 }}>
            <strong style={{ color: 'var(--label-normal)' }}>vertical = true</strong>
            <Divider vertical />
            <span style={{ color: 'var(--label-neutral)' }}>Inline group separator</span>
          </div>
        </div>
      </section>
    </main>
  ),
};
