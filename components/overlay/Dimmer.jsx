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
        background: 'var(--scrim-dark)', color: 'var(--text-on-inverse)', backdropFilter: blur ? 'blur(3px)' : 'none', borderRadius: 'inherit', ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
