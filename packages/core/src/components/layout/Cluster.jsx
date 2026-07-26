import React from 'react';

/**
 * LK ROBOTICS — Cluster
 * A wrapping row with even `gap` — for chips, tags, button rows, metadata. Wraps
 * gracefully to new lines; align/justify configurable.
 */
export function Cluster({ children, gap = 10, align = 'center', justify = 'flex-start', style, ...rest }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap, alignItems: align, justifyContent: justify, ...style }} {...rest}>
      {children}
    </div>
  );
}
