import React from 'react';

/**
 * LK ROBOTICS — Tooltip
 * A small navy bubble on hover/focus. Wrap any trigger; set `placement`.
 * Calm fade, no motion theatrics. Keep `content` short (one line).
 */
export function Tooltip({ content, placement = 'top', children, style, ...rest }) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-8px)' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(8px)' },
  }[placement] || {};
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      {...rest}
    >
      {children}
      <span
        role="tooltip"
        style={{
          position: 'absolute', ...pos, zIndex: 40, pointerEvents: 'none',
          padding: '7px 11px', background: 'var(--surface-inverse)', color: 'var(--text-on-inverse)',
          fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 'var(--fw-semibold)', letterSpacing: 0,
          lineHeight: 1.4, borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap', boxShadow: 'var(--shadow-md)',
          opacity: show ? 1 : 0, transition: 'opacity var(--dur-fast) var(--ease-out)',
        }}
      >
        {content}
      </span>
    </span>
  );
}
