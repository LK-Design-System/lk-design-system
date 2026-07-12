import React from 'react';

/**
 * LK ROBOTICS — Dimmer
 * A scrim overlay that fills its nearest positioned ancestor (set the parent
 * `position: relative`). Use to dim a card/panel behind a spinner or message.
 * Controlled via `open`.
 */
export function Dimmer({ open = false, children, onClick, blur = false, style, ...rest }) {
  if (!open) return null;
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--component-dialog-scrim)', color: 'var(--color-semantic-inverse-label)', backdropFilter: blur ? 'blur(var(--component-dialog-scrim-blur))' : 'none', borderRadius: 'inherit', ...style,
      }}
      {...rest}
    >
      <span
        data-dimmer-content=""
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-semantic-inverse-background)',
          color: 'var(--color-semantic-inverse-label)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {children}
      </span>
    </div>
  );
}
