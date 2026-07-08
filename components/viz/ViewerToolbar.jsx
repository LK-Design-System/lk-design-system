import React from 'react';

/**
 * LK ROBOTICS — ViewerToolbar
 * A floating toolbar for map / 3D viewers (zoom, fit, layers, measure). Fill it
 * with `ViewerToolbarButton` children. Sits over a viewport corner.
 */
export function ViewerToolbar({ children, orientation = 'vertical', style, ...rest }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: orientation === 'vertical' ? 'column' : 'row', gap: 2, padding: 4,
      background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', ...style }} {...rest}>
      {children}
    </div>
  );
}

/** A single icon button inside a ViewerToolbar. */
export function ViewerToolbarButton({ children, active = false, label, style, ...rest }) {
  return (
    <button type="button" aria-label={label} title={label}
      style={{ width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: 0, borderRadius: 'var(--radius-sm)',
        cursor: 'pointer', background: active ? 'var(--lk-accent-tint)' : 'transparent', color: active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-neutral)',
        transition: 'background var(--dur-fast) var(--ease-out)', ...style }} {...rest}>
      {children}
    </button>
  );
}
