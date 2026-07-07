import React from 'react';

const TONES = {
  signal: 'var(--lk-accent-ink)',
  navy: 'var(--surface-inverse)',
  neutral: 'var(--bw-gray)',
  positive: 'var(--bw-green)',
  cautionary: 'var(--bw-amber)',
  negative: 'var(--bw-red)',
};

/**
 * LK ROBOTICS — ContentBadge
 * A small label pinned to content (NEW, 즉시지원, 신규). Three weights — solid /
 * soft (tinted) / outline — across the muted status tones. Squared 6px radius,
 * bold, faintly tracked.
 */
export function ContentBadge({ children, tone = 'signal', variant = 'soft', size = 'md', style, ...rest }) {
  const c = TONES[tone] || TONES.signal;
  const h = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;
  const fs = size === 'sm' ? 11 : size === 'lg' ? 13 : 12;
  const looks = {
    solid: { background: c, color: 'var(--text-on-signal)', border: '1px solid transparent' },
    soft: { background: `color-mix(in srgb, ${c} 14%, var(--surface-card))`, color: c, border: '1px solid transparent' },
    outline: { background: 'transparent', color: c, border: `1px solid color-mix(in srgb, ${c} 40%, var(--surface-card))` },
  }[variant] || {};
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, height: h, padding: '0 6px',
        fontFamily: 'var(--font-sans)', fontSize: fs, fontWeight: 'var(--fw-bold)', letterSpacing: '0.2px',
        borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap', ...looks, ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
