import React from 'react';

/**
 * LK ROBOTICS — Col
 * A child of `Columns`. `span` sets how many columns it occupies at the base
 * (mobile) width; `sm`/`md`/`lg` override at those breakpoints. Values are
 * column counts (1–12); each breakpoint falls back to the smaller one, so set
 * only what changes.
 *
 * <Col span={12} md={6} lg={4} />   // full → half → third
 */
export function Col({ children, span, sm, md, lg, style, ...rest }) {
  const vars = {};
  if (span != null) vars['--col-span'] = span;
  if (sm != null) vars['--col-span-sm'] = sm;
  if (md != null) vars['--col-span-md'] = md;
  if (lg != null) vars['--col-span-lg'] = lg;
  return (
    <div className="lk-col" style={{ ...vars, ...style }} {...rest}>
      {children}
    </div>
  );
}
