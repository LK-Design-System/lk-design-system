import React from 'react';

const TONES = {
  signal:  { fg: 'var(--color-semantic-primary-normal)', bg: 'var(--lk-accent-tint-2)' },  // brand teal chip (default)
  neutral: { fg: 'var(--color-semantic-label-strong)', bg: 'var(--color-semantic-fill-strong)', solidBg: 'var(--color-semantic-inverse-background)' }, // ink neutral
  steel:   { fg: 'var(--bw-steel)', bg: 'var(--bw-indigo-tint)' },
  amber:   { fg: 'var(--color-semantic-status-cautionary)', bg: 'var(--status-cautionary-tint)' },
  red:     { fg: 'var(--color-semantic-status-negative)', bg: 'var(--status-danger-tint)' },
  // back-compat aliases (live site uses tone="indigo")
  indigo:  { fg: 'var(--color-semantic-label-strong)', bg: 'var(--color-semantic-fill-strong)', solidBg: 'var(--color-semantic-inverse-background)' },
  green:   { fg: 'var(--color-semantic-status-positive)', bg: 'var(--status-positive-tint)' },
  ink:     { fg: 'var(--color-semantic-label-strong)', bg: 'var(--color-semantic-fill-strong)', solidBg: 'var(--color-semantic-inverse-background)' },
};

/**
 * LK ROBOTICS — Tag
 * Uppercase, letter-spaced overline pill — eyebrows, plan tiers, promo chips.
 * `solid` fills with the tone colour; otherwise a soft tint.
 */
export function Tag({ children, tone = 'signal', solid = false, style, ...rest }) {
  const t = TONES[tone] || TONES.signal;
  return (
    <span
      className={`lk-tag lk-tag--${tone}`}
      style={{
        display: 'inline-flex', alignItems: 'center', height: 'var(--component-tag-height)', padding: '0 12px',
        fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-caption)', lineHeight: 1,
        letterSpacing: 'var(--ls-caption)', textTransform: 'uppercase', whiteSpace: 'nowrap',
        color: solid ? 'var(--color-semantic-static-white)' : t.fg,
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
