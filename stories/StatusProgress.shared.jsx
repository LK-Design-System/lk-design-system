import React from 'react';

export function DemoCard({ title, children }) {
  return (
    <section
      style={{
        display: 'grid',
        gap: 'var(--space-3)',
        padding: 16,
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-semantic-background-elevated-normal)',
      }}
    >
      <h2 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-normal)' }}>{title}</h2>
      {children}
    </section>
  );
}
