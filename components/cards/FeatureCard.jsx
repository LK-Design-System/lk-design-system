import React from 'react';

const ICON_TONES = {
  signal: { fg: 'var(--lk-accent-ink)', bg: 'var(--lk-accent-tint)' },     // teal tile (default)
  steel:  { fg: 'var(--color-positive-strong)', bg: 'var(--status-positive-tint)' },
  amber:  { fg: 'var(--color-cautionary-strong)', bg: 'var(--status-cautionary-tint)' },
  navy:   { fg: 'var(--bw-ink)', bg: 'var(--fill-strong)' },
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
        background: boxed ? 'var(--surface-card)' : 'transparent',
        border: boxed ? '1px solid var(--bw-border)' : 'none',
        borderRadius: boxed ? 'var(--radius-xl)' : 0,
        boxShadow: boxed ? 'var(--shadow-md)' : 'none',
        padding: boxed ? 'var(--space-8)' : 0,
        ...style,
      }}
      {...rest}
    >
      {icon && (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 14, color: t.fg, background: t.bg }}>
          {icon}
        </span>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4 style={{ fontSize: '19px', fontWeight: 'var(--fw-extra)', letterSpacing: 0, color: 'var(--bw-ink)', margin: 0, wordBreak: 'keep-all' }}>{title}</h4>
        <p style={{ fontSize: '15.5px', lineHeight: 1.7, color: 'var(--bw-gray)', margin: 0, wordBreak: 'keep-all' }}>{children}</p>
      </div>
    </div>
  );
}
