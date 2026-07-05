import React from 'react';

const TONES = {
  signal:  { fg: 'var(--lk-accent-ink)', bg: 'var(--lk-accent-tint-2)' },  // brand teal chip (default)
  neutral: { fg: 'var(--label-strong)', bg: 'var(--fill-strong)', solidBg: 'var(--surface-inverse)' }, // ink neutral
  steel:   { fg: 'var(--bw-green-600)', bg: 'rgba(94,110,134,0.14)' },
  amber:   { fg: '#9A7424', bg: 'rgba(194,154,82,0.18)' },
  red:     { fg: 'var(--bw-red)', bg: 'rgba(207,99,96,0.14)' },
  // back-compat aliases (live site uses tone="indigo")
  indigo:  { fg: 'var(--label-strong)', bg: 'var(--fill-strong)', solidBg: 'var(--surface-inverse)' },
  green:   { fg: 'var(--bw-green-600)', bg: 'rgba(94,110,134,0.14)' },
  ink:     { fg: 'var(--label-strong)', bg: 'var(--fill-strong)', solidBg: 'var(--surface-inverse)' },
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
        display: 'inline-flex', alignItems: 'center', height: 26, padding: '0 12px',
        fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-caption)', lineHeight: 1,
        letterSpacing: 'var(--ls-caption)', textTransform: 'uppercase', whiteSpace: 'nowrap',
        color: solid ? '#fff' : t.fg,
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
