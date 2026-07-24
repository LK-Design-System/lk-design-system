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
 *
 * Accessibility — the label/value pair is a real `dt`/`dd` pair so assistive
 * technology reports the name with its value (WCAG 1.3.1). A standalone row is
 * its own single-pair `dl`; rows that form one specification table opt into
 * `grouped` and share the caller's `dl` wrapper.
 */
export function SpecRow({ label, value, labelWidth = '34%', divider = true, grouped = false, style, ...rest }) {
  const Row = grouped ? 'div' : 'dl';
  return (
    <Row
      style={{
        display: 'grid', gridTemplateColumns: `${labelWidth} 1fr`, gap: 16, margin: 0,
        padding: '14px 0', borderBottom: divider ? '1px solid var(--color-semantic-line-normal-normal)' : 'none', alignItems: 'baseline',
        ...style,
      }}
      {...rest}
    >
      <dt style={{ fontSize: 'var(--label1-size)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-small)', color: 'var(--color-semantic-label-alternative)', wordBreak: 'keep-all' }}>{label}</dt>
      <dd style={{ margin: 0, fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-semibold)', lineHeight: 'var(--body2-line)', letterSpacing: 'var(--body2-spacing)', color: 'var(--color-semantic-label-normal)', fontVariantNumeric: 'tabular-nums', wordBreak: 'keep-all' }}>{value}</dd>
    </Row>
  );
}
