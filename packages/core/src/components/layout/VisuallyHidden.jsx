import React from 'react';

/**
 * LK ROBOTICS — VisuallyHidden
 * Accessibility utility: hides content visually while keeping it available to
 * screen readers (e.g. an icon-only button's label). Renders as `as` (default
 * span).
 */
export function VisuallyHidden({ children, as = 'span', ...rest }) {
  const Comp = as;
  return (
    <Comp style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }} {...rest}>
      {children}
    </Comp>
  );
}
