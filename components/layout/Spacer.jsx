import React from 'react';

/**
 * LK ROBOTICS — Spacer
 * Flexible or fixed space. With no `size`, it flexes to push siblings apart
 * (inside a flex row/column). With `size`, it's a fixed gap on `axis`.
 */
export function Spacer({ size, axis = 'vertical', style, ...rest }) {
  if (size == null) return <span style={{ flex: 1, ...style }} {...rest} />;
  return (
    <span style={{ display: 'block', flexShrink: 0, width: axis === 'horizontal' ? size : undefined, height: axis === 'vertical' ? size : undefined, ...style }} {...rest} />
  );
}
