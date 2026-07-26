import React from 'react';

/**
 * LK ROBOTICS — DescriptionList
 * Key/value pairs (사양, 제원). Muted term on the left, bold description on the
 * right, hairline rows. `columns` lays pairs out in a responsive grid.
 * `variant="stacked"` stacks the term above a regular-weight value with spacing
 * instead of hairlines — for narrow detail panels and cards where a fixed term
 * column wastes width and uniform bold flattens emphasis.
 */
export function DescriptionList({ items = [], columns = 1, variant = 'default', style, ...rest }) {
  if (variant === 'stacked') {
    return (
      <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: 'var(--space-4) 32px', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0 }}>
            <dt style={{ fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', color: 'var(--color-semantic-label-alternative)' }}>{it.term}</dt>
            <dd style={{ margin: 0, fontSize: 'var(--body2-size)', lineHeight: 'var(--body2-line)', color: 'var(--color-semantic-label-normal)', wordBreak: 'keep-all' }}>{it.description}</dd>
          </div>
        ))}
      </dl>
    );
  }
  // Rows on the last grid row omit the hairline so the list closes on its
  // container edge rather than trailing a stray line under the final row.
  const lastRowStart = items.length - (((items.length - 1) % columns) + 1);
  return (
    <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, columnGap: 32, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: i >= lastRowStart ? 'none' : '1px solid var(--color-semantic-line-solid-normal)' }}>
          <dt style={{ flex: '0 0 34%', fontSize: 'var(--label1-size)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-alternative)' }}>{it.term}</dt>
          <dd style={{ margin: 0, flex: 1, fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-normal)', wordBreak: 'keep-all' }}>{it.description}</dd>
        </div>
      ))}
    </dl>
  );
}
