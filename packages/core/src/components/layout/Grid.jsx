import React from 'react';

/**
 * LK ROBOTICS — Grid
 * A CSS-grid primitive. Give it `columns` (fixed count) or `minItemWidth`
 * (responsive auto-fill). Token-friendly `gap`.
 */
export function Grid({ children, columns, minItemWidth, gap = 20, style, ...rest }) {
  const template = minItemWidth
    ? `repeat(auto-fill, minmax(${typeof minItemWidth === 'number' ? minItemWidth + 'px' : minItemWidth}, 1fr))`
    : (columns ? `repeat(${columns}, minmax(0, 1fr))` : undefined);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: template, gap, ...style }} {...rest}>
      {children}
    </div>
  );
}
