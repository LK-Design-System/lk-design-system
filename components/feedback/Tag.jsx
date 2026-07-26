import React from 'react';

const TONES = {
  signal:  { fg: 'var(--color-semantic-label-normal)', bg: 'var(--color-semantic-primary-surface-strong)' },  // brand surface carries the signal role
  neutral: { fg: 'var(--color-semantic-label-strong)', bg: 'var(--color-semantic-fill-strong)', solidBg: 'var(--color-semantic-inverse-background)' }, // ink neutral
  steel:   { fg: 'var(--color-semantic-accent-foreground-blue)', bg: 'var(--color-semantic-secondary-surface)' },
  amber:   { fg: 'var(--color-semantic-status-cautionary-text)', bg: 'color-mix(in srgb, var(--color-semantic-data-viz-series-5) 14%, transparent)', solidBg: 'var(--color-semantic-data-viz-series-5)', solidFg: 'var(--color-semantic-static-black)' },
  red:     { fg: 'var(--color-semantic-accent-foreground-red)', bg: 'color-mix(in srgb, var(--color-semantic-accent-foreground-red) 14%, transparent)' },
  // back-compat aliases (live site uses tone="indigo")
  indigo:  { fg: 'var(--color-semantic-label-strong)', bg: 'var(--color-semantic-fill-strong)', solidBg: 'var(--color-semantic-inverse-background)' },
  green:   { fg: 'var(--color-semantic-data-viz-series-4)', bg: 'color-mix(in srgb, var(--color-semantic-data-viz-series-4) 14%, transparent)' },
  ink:     { fg: 'var(--color-semantic-label-strong)', bg: 'var(--color-semantic-fill-strong)', solidBg: 'var(--color-semantic-inverse-background)' },
};

const SIZES = {
  md: {
    height: 'var(--component-tag-height)',
    padding: '0 12px',
    fontSize: 'var(--fs-caption)',
    fontWeight: 'var(--fw-bold)',
    letterSpacing: 'var(--ls-caption)',
  },
  sm: {
    height: 20,
    padding: '0 var(--space-2)',
    fontSize: 'var(--caption1-size)',
    fontWeight: 'var(--fw-semibold)',
    letterSpacing: 'calc(var(--ls-caption) / 2)',
  },
};

/**
 * LK ROBOTICS — Tag
 * Uppercase, letter-spaced overline pill — eyebrows, plan tiers, promo chips.
 * `solid` fills with the tone colour; otherwise a soft tint.
 */
export function Tag({ children, tone = 'signal', size = 'sm', solid = false, style, ...rest }) {
  const t = TONES[tone] || TONES.signal;
  const resolvedSize = SIZES[size] ? size : 'sm';
  const dimensions = SIZES[resolvedSize];
  return (
    <span
      className={`lk-tag lk-tag--${tone} lk-tag--${resolvedSize}`}
      style={{
        display: 'inline-flex', alignItems: 'center', height: dimensions.height, padding: dimensions.padding,
        fontFamily: 'var(--font-sans)', fontWeight: dimensions.fontWeight, fontSize: dimensions.fontSize, lineHeight: 1,
        letterSpacing: dimensions.letterSpacing, textTransform: 'uppercase', whiteSpace: 'nowrap',
        color: solid ? (t.solidFg || 'var(--color-semantic-static-white)') : t.fg,
        background: solid ? (t.solidBg || t.fg) : t.bg,
        borderRadius: 'var(--radius-pill)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
