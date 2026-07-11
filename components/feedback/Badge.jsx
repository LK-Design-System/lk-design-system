import React from 'react';

const PALETTES = {
  signal: { bg: 'var(--component-badge-signal-bg)', fg: 'var(--component-badge-signal-fg)', dot: 'var(--color-semantic-primary-normal)' },
  navy: { bg: 'var(--component-badge-navy-bg)', fg: 'var(--component-badge-navy-fg)', dot: 'var(--color-semantic-secondary-normal)' },
  steel: { bg: 'var(--component-badge-steel-bg)', fg: 'var(--component-badge-steel-fg)', dot: 'var(--color-semantic-accent-foreground-blue)' },
  amber: { bg: 'var(--component-badge-cautionary-bg)', fg: 'var(--component-badge-cautionary-fg)', dot: 'var(--color-semantic-status-cautionary-foreground)' },
  red: { bg: 'var(--component-badge-negative-bg)', fg: 'var(--component-badge-negative-fg)', dot: 'var(--color-semantic-status-negative-foreground)' },
  // aliases
  indigo: { bg: 'var(--component-badge-navy-bg)', fg: 'var(--component-badge-navy-fg)', dot: 'var(--color-semantic-secondary-normal)' },
  green: { bg: 'var(--component-badge-positive-bg)', fg: 'var(--component-badge-positive-fg)', dot: 'var(--color-semantic-status-positive-foreground)' },
  ink: { bg: 'var(--component-badge-navy-bg)', fg: 'var(--component-badge-navy-fg)', dot: 'var(--color-semantic-secondary-normal)' },
};

/**
 * LK ROBOTICS — Badge
 * Small status/count token. `dot` renders a bare status dot; otherwise a
 * solid r4 rounded-rect with white text (source `_Badge/Value` spec: r4 / h20 / padX6).
 */
export function Badge({ children, tone = 'signal', dot = false, style, ...rest }) {
  const palette = PALETTES[tone] || PALETTES.signal;
  if (dot) {
    return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: palette.dot, ...style }} {...rest} />;
  }
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 20, height: 20, padding: '0 6px',
        fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--caption1-size)',
        color: palette.fg, background: palette.bg, borderRadius: 4, /* WDS _Badge/Value r4 (no 4px token) */
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
