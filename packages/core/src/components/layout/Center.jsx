import React from 'react';

/**
 * LK ROBOTICS — Center
 * Centers its child both axes. Optional `minHeight` (px or CSS) to reserve
 * vertical space (empty states, loaders).
 */
export function Center({ children, minHeight, style, ...rest }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight, ...style }} {...rest}>
      {children}
    </div>
  );
}
