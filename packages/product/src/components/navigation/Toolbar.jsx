import React from 'react';

/**
 * LK ROBOTICS — Toolbar
 * A horizontal container for grouped controls (icon buttons, toggles) with a
 * hairline and soft elevation. Separate groups with a `Divider vertical`.
 */
export function Toolbar({ children, style, ...rest }) {
  return (
    <div role="toolbar" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1-5)', padding: 'var(--space-1-5)', background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-xs)', ...style }} {...rest}>
      {children}
    </div>
  );
}
