import React from 'react';

/**
 * LK ROBOTICS — Stack
 * Flexbox layout primitive. `direction` row/column, token-friendly `gap`, plus
 * `align` / `justify` / `wrap`. The building block for vertical & horizontal
 * rhythm — prefer this over ad-hoc flex.
 */
export function Stack({ children, direction = 'column', gap = 16, align, justify, wrap = false, as = 'div', style, ...rest }) {
  const Comp = as;
  return (
    <Comp style={{ display: 'flex', flexDirection: direction, gap, alignItems: align, justifyContent: justify, flexWrap: wrap ? 'wrap' : 'nowrap', ...style }} {...rest}>
      {children}
    </Comp>
  );
}
