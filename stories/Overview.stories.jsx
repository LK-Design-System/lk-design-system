import React from 'react';
import { Button, Icon, MetricCard } from '../src/index.js';

const meta = {
  title: 'Documentation/Overview',
  parameters: {
    docs: {
      description: {
        component:
          'LK Design System Core is the package entry for LK Robotics tokens, React components, assets, templates, and static previews.',
      },
    },
  },
};

export default meta;

const sectionStyle = {
  display: 'grid',
  gap: 20,
  maxWidth: 1040,
};

const panelStyle = {
  background: 'var(--surface-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: 24,
  boxShadow: 'var(--shadow-xs)',
};

export const RepositoryBaseline = {
  name: 'Repository baseline',
  render: () => (
    <main style={sectionStyle}>
      <header style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--lk-accent-ink)', fontWeight: 800 }}>
          <Icon name="robot" size={22} />
          LK Robotics
        </div>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.08, color: 'var(--label-strong)' }}>Design System Core</h1>
        <p style={{ margin: 0, maxWidth: 760, color: 'var(--label-neutral)', lineHeight: 1.65 }}>
          This Storybook documents the core package surface: CSS tokens, reusable React components,
          robotics-specific UI patterns, iconography, and package usage rules.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <MetricCard label="Components" value="145" caption="React component sources" />
        <MetricCard label="Groups" value="16" caption="Component directories" />
        <MetricCard label="Package" value="0.1.0" caption="@lk-robotics/design-system-core" />
      </section>

      <section style={panelStyle}>
        <h2 style={{ margin: '0 0 12px', fontSize: 20 }}>Consumer import</h2>
        <pre style={{ margin: 0, overflowX: 'auto', background: 'var(--fill-normal)', padding: 16, borderRadius: 'var(--radius-md)' }}>
          <code>{`import { Button, ProductCard, TopBar } from '@lk-robotics/design-system-core';
import '@lk-robotics/design-system-core/styles.css';`}</code>
        </pre>
      </section>

      <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button>Primary action</Button>
        <Button variant="ghost">Secondary action</Button>
        <Button variant="dark" arrow>
          Robot console
        </Button>
      </section>
    </main>
  ),
};
