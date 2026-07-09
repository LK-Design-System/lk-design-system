import React from 'react';

/**
 * LK ROBOTICS — Legend
 * Colour key for maps, charts, and diagrams. Each item is {label, color, and
 * optional shape 'dot' | 'line' | 'square', muted}. Lays out horizontally
 * (default) or vertically. Token-driven; pairs with LineChart, BarChart, and
 * the 2D map viewers.
 */
function Swatch({ shape = 'square', color }) {
  if (shape === 'line') return <span aria-hidden="true" style={{ width: 14, height: 0, borderTop: `3px solid ${color}`, borderRadius: 2 }} />;
  const round = shape === 'dot';
  return <span aria-hidden="true" style={{ width: round ? 10 : 12, height: round ? 10 : 12, borderRadius: round ? '50%' : 3, background: color, flexShrink: 0 }} />;
}

export function Legend({ items = [], direction = 'horizontal', style, ...rest }) {
  const vertical = direction === 'vertical';
  return (
    <ul
      style={{
        listStyle: 'none', margin: 0, padding: 0, display: 'flex',
        flexDirection: vertical ? 'column' : 'row', flexWrap: vertical ? 'nowrap' : 'wrap',
        gap: vertical ? 'var(--space-2)' : 'var(--space-4)', fontFamily: 'var(--font-sans)', ...style,
      }}
      {...rest}
    >
      {items.map((it, i) => (
        <li key={it.label ?? i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: it.muted ? 'var(--color-semantic-label-assistive)' : 'var(--color-semantic-label-neutral)' }}>
          <Swatch shape={it.shape} color={it.color} />
          <span>{it.label}</span>
          {it.value != null && <span style={{ color: 'var(--color-semantic-label-alternative)', fontVariantNumeric: 'tabular-nums' }}>{it.value}</span>}
        </li>
      ))}
    </ul>
  );
}
