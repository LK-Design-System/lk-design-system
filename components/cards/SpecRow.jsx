import React from 'react';

/**
 * LK ROBOTICS — SpecRow
 * One row of a product specification table: muted label (left) + value (right),
 * separated by a bottom hairline. Stack several inside a container; set
 * `divider={false}` on the last row so the list closes on the container edge
 * instead of trailing a stray hairline. Semantic
 * label/border tokens only, so it sits natively on light sheets and — inside a
 * `data-theme="dark"` scope — on the navy product stage. Shares its key/value
 * grammar with DescriptionList (label 14 · value one step up · 34% label col);
 * values render with tabular figures for aligned dimensions and units.
 */
export function SpecRow({ label, value, labelWidth = '34%', divider = true, style, ...rest }) {
  return (
    <div
      style={{
        display: 'grid', gridTemplateColumns: `${labelWidth} 1fr`, gap: 16,
        padding: '14px 0', borderBottom: divider ? '1px solid var(--color-semantic-line-normal-normal)' : 'none', alignItems: 'baseline',
        ...style,
      }}
      {...rest}
    >
      <div style={{ fontSize: 'var(--label1-size)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-small)', color: 'var(--color-semantic-label-alternative)', wordBreak: 'keep-all' }}>{label}</div>
      <div style={{ fontSize: 'var(--fs-small)', fontWeight: 'var(--fw-semibold)', lineHeight: 'var(--lh-small)', letterSpacing: 'var(--ls-small)', color: 'var(--color-semantic-label-normal)', fontVariantNumeric: 'tabular-nums', wordBreak: 'keep-all' }}>{value}</div>
    </div>
  );
}
