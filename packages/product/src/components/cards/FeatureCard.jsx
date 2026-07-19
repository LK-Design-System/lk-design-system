import React from 'react';

const ICON_TONES = {
  signal: { fg: 'var(--color-semantic-primary-normal)', bg: 'var(--color-semantic-primary-surface-normal)' },     // teal tile (default)
  steel:  { fg: 'var(--color-semantic-accent-foreground-blue)', bg: 'var(--color-semantic-primary-surface-normal)' },
  amber:  { fg: 'var(--color-semantic-accent-foreground-orange)', bg: 'color-mix(in srgb, var(--color-semantic-accent-foreground-orange) 14%, transparent)' },
  navy:   { fg: 'var(--color-semantic-brand-ink)', bg: 'var(--color-semantic-fill-strong)' },
};

/**
 * LK ROBOTICS — FeatureCard
 * Tinted icon tile + title + supporting copy. The recurring capability cell
 * (핵심 기능 / 주요 기능). `boxed` wraps it in a white Card surface.
 */
export function FeatureCard({
  icon,
  title,
  children,
  tone = 'signal',
  boxed = false,
  style,
  ...rest
}) {
  const t = ICON_TONES[tone] || ICON_TONES.signal;
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', gap: '16px',
        background: boxed ? 'var(--component-card-bg)' : 'transparent',
        border: boxed ? 'var(--component-card-border)' : 'none',
        borderRadius: boxed ? 'var(--component-card-radius)' : 0,
        /* Card's default rest elevation (elevation="md") — same value as the
           previous var(--shadow-md), now tracked via the card token. */
        boxShadow: boxed ? 'var(--component-card-shadow-md)' : 'none',
        padding: boxed ? 'var(--component-card-padding)' : 0,
        ...style,
      }}
      {...rest}
    >
      {icon && (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 'var(--radius-14)', color: t.fg, background: t.bg }}>
          {icon}
        </span>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4 style={{ fontSize: 'var(--headline1-size)', fontWeight: 'var(--fw-extra)', letterSpacing: 0, color: 'var(--color-semantic-label-strong)', margin: 0, wordBreak: 'keep-all' }}>{title}</h4>
        <p style={{ fontSize: 'var(--body2-size)', lineHeight: 1.7, color: 'var(--color-semantic-label-alternative)', margin: 0, wordBreak: 'keep-all' }}>{children}</p>
      </div>
    </div>
  );
}
