import React from 'react';

/**
 * LK ROBOTICS — ToastStack
 * A fixed viewport that stacks Toast children in a corner. Pair with your own
 * queue state; render the visible Toasts as children.
 */
export function ToastStack({ children, position = 'bottom-right', gap = 10, style, ...rest }) {
  const pos = {
    'bottom-right': { bottom: 20, right: 20, alignItems: 'flex-end' },
    'bottom-left': { bottom: 20, left: 20, alignItems: 'flex-start' },
    'top-right': { top: 20, right: 20, alignItems: 'flex-end' },
    'top-left': { top: 20, left: 20, alignItems: 'flex-start' },
    'bottom-center': { bottom: 20, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
  }[position] || {};
  return (
    <div style={{ position: 'fixed', zIndex: 120, display: 'flex', flexDirection: 'column', gap, ...pos, ...style }} {...rest}>
      {children}
    </div>
  );
}
