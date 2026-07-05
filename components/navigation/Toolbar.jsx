import React from 'react';

/**
 * LK ROBOTICS — Toolbar
 * A horizontal container for grouped controls (icon buttons, toggles) with a
 * hairline and soft elevation. Separate groups with a `Divider vertical`.
 */
export function Toolbar({ children, style, ...rest }) {
  return (
    <div role="toolbar" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: 6, background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-xs)', ...style }} {...rest}>
      {children}
    </div>
  );
}
