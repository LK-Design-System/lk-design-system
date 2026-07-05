import React from 'react';

/**
 * LK ROBOTICS — SpecRow
 * One row of a product specification table: muted label (left) + value (right),
 * separated by a bottom hairline. Stack several inside a container. Semantic
 * label/border tokens only, so it sits natively on light sheets and — inside a
 * `data-theme="dark"` scope — on the navy product stage. Shares its key/value
 * grammar with DescriptionList (label 14 · value one step up · 34% label col);
 * values render with tabular figures for aligned dimensions and units.
 */
export function SpecRow({ label, value, labelWidth = '34%', style, ...rest }) {
  return (
    <div
      style={{
        display: 'grid', gridTemplateColumns: `${labelWidth} 1fr`, gap: 16,
        padding: '14px 0', borderBottom: '1px solid var(--border-subtle)', alignItems: 'baseline',
        ...style,
      }}
      {...rest}
    >
      <div style={{ fontSize: 14, fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-small)', color: 'var(--label-alternative)', wordBreak: 'keep-all' }}>{label}</div>
      <div style={{ fontSize: 'var(--fs-small)', fontWeight: 'var(--fw-semibold)', lineHeight: 'var(--lh-small)', letterSpacing: 'var(--ls-small)', color: 'var(--label-normal)', fontVariantNumeric: 'tabular-nums', wordBreak: 'keep-all' }}>{value}</div>
    </div>
  );
}
