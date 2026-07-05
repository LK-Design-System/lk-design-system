import React from 'react';

const meta = {
  title: 'Foundations/Tokens',
  parameters: {
    docs: {
      description: {
        component: 'Core token examples loaded from styles.css and tokens/*.css.',
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

const spacings = ['--space-2', '--space-3', '--space-4', '--space-5', '--space-6', '--space-7'];

export const ColorAndSpacing = {
  name: 'Color and spacing',
  render: () => (
    <main style={{ display: 'grid', gap: 32, maxWidth: 1040 }}>
      <section>
        <h1 style={{ margin: '0 0 16px', fontSize: 28, color: 'var(--label-strong)' }}>Color tokens</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
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
        <h2 style={{ margin: '0 0 16px', fontSize: 22, color: 'var(--label-strong)' }}>Spacing scale</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {spacings.map((token) => (
            <div key={token} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: 16 }}>
              <code style={{ color: 'var(--label-alternative)' }}>{token}</code>
              <div style={{ height: 14, width: `var(${token})`, background: 'var(--lk-accent-ink)', borderRadius: 'var(--radius-pill)' }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  ),
};

export const Typography = {
  render: () => (
    <main style={{ display: 'grid', gap: 18, maxWidth: 840 }}>
      <p style={{ margin: 0, color: 'var(--label-alternative)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 1.2 }}>
        Typography
      </p>
      <h1 style={{ margin: 0, fontSize: 48, lineHeight: 1.05, color: 'var(--label-strong)' }}>Operational interfaces need quiet hierarchy.</h1>
      <p style={{ margin: 0, fontSize: 18, lineHeight: 1.7, color: 'var(--label-neutral)' }}>
        The token set is tuned for robotics dashboards, control surfaces, status panels, and product pages.
      </p>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: 'var(--label-alternative)' }}>
        Use large display text sparingly. Dense product and robotics workflows should prioritize scannable labels,
        tabular values, clear state colors, and stable control dimensions.
      </p>
    </main>
  ),
};
