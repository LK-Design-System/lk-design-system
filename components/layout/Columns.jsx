import React from 'react';

const toLen = (v) => (typeof v === 'number' ? v + 'px' : v);

/**
 * LK ROBOTICS — Columns
 * A responsive column grid for DIVIDING a layout (12-column grid). Put
 * `Col` children with `span`/`sm`/`md`/`lg` to build asymmetric layouts, or
 * set `columns` for an even split. The gutter follows `--grid-gutter`; pass
 * `gap` (or `columnGap`/`rowGap`) to override.
 *
 * <Columns><Col md={8}>main</Col><Col md={4}>aside</Col></Columns>
 */
export function Columns({ children, columns = 12, gap, columnGap, rowGap, style, ...rest }) {
  const vars = { '--cols': columns };
  if (gap != null) { vars['--col-gap'] = toLen(gap); vars['--row-gap'] = toLen(gap); }
  if (columnGap != null) vars['--col-gap'] = toLen(columnGap);
  if (rowGap != null) vars['--row-gap'] = toLen(rowGap);
  return (
    <div className="lk-grid" style={{ ...vars, ...style }} {...rest}>
      {children}
    </div>
  );
}
