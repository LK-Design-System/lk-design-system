import React from 'react';

/**
 * LK ROBOTICS — DescriptionList
 * Key/value pairs (사양, 제원). Muted term on the left, bold description on the
 * right, hairline rows. `columns` lays pairs out in a responsive grid.
 */
export function DescriptionList({ items = [], columns = 1, style, ...rest }) {
  return (
    <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, columnGap: 32, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--bw-border)' }}>
          <dt style={{ flex: '0 0 34%', fontSize: 14, fontWeight: 'var(--fw-semibold)', color: 'var(--label-alternative)' }}>{it.term}</dt>
          <dd style={{ margin: 0, flex: 1, fontSize: 14.5, fontWeight: 'var(--fw-semibold)', color: 'var(--label-normal)', wordBreak: 'keep-all' }}>{it.description}</dd>
        </div>
      ))}
    </dl>
  );
}
