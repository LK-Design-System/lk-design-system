import React from 'react';

const COLORS = {
  signal: 'var(--color-semantic-primary-normal)',
  navy:   'var(--color-semantic-inverse-background)',
  steel:  'var(--bw-blue)',
  amber:  'var(--bw-amber)',
  red:    'var(--bw-red)',
  // aliases
  indigo: 'var(--color-semantic-inverse-background)',
  green:  'var(--bw-green)',
  ink:    'var(--color-semantic-inverse-background)',
};

/**
 * LK ROBOTICS — Badge
 * Small status/count token. `dot` renders a bare status dot; otherwise a
 * solid rounded pill with white text.
 */
export function Badge({ children, tone = 'signal', dot = false, style, ...rest }) {
  const c = COLORS[tone] || COLORS.signal;
  if (dot) {
    return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: c, ...style }} {...rest} />;
  }
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 20, height: 20, padding: '0 7px',
        fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-bold)', fontSize: 12,
        color: 'var(--color-semantic-static-white)', background: c, borderRadius: 'var(--radius-pill)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
