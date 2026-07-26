import React from 'react';

/**
 * LK ROBOTICS — Overline
 * A short UPPERCASE, letter-spaced category or brand kicker that sits above a
 * heading. Use PageHeader's sentence-case eyebrow for page or section context.
 * Muted grey by default (the heading carries the colour); set
 * `tone="signal"` for the brand cyan or `tone="ink"` for max contrast. `onDark`
 * gives the on-a-dark-surface colours. Render as any element via `as`.
 */
export function Overline({ children, as = 'div', tone = 'muted', onDark = false, style, ...rest }) {
  const Comp = as;
  const color = onDark
    ? (tone === 'signal' ? 'var(--color-semantic-inverse-primary)' : tone === 'ink' ? 'var(--color-semantic-static-white)' : 'var(--color-semantic-inverse-label-neutral-soft)')
    : (tone === 'signal' ? 'var(--color-semantic-primary-normal)' : tone === 'ink' ? 'var(--color-semantic-label-strong)' : 'var(--color-semantic-label-alternative)');
  return (
    <Comp
      style={{
        fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', lineHeight: 1.2, color,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
