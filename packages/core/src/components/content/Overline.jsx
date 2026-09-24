import React from 'react';

// Wide tracking is a Latin-capitals device; on Hangul it splits words into letters.
const HANGUL = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/;

function textOf(node) {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  return node.props ? textOf(node.props.children) : '';
}

/**
 * LK ROBOTICS — Overline
 * A short UPPERCASE, letter-spaced category or brand kicker that sits above a
 * heading. Korean text is not tracked. Use PageHeader's sentence-case eyebrow for page or section context.
 * Muted grey by default (the heading carries the colour); set
 * `tone="signal"` for the brand cyan or `tone="ink"` for max contrast. `onDark`
 * gives the on-a-dark-surface colours. Render as any element via `as`.
 */
export function Overline({ children, as = 'div', tone = 'muted', onDark = false, style, ...rest }) {
  const Comp = as;
  const letterSpacing = HANGUL.test(textOf(children)) ? 0 : 'var(--ls-overline)';
  const color = onDark
    ? (tone === 'signal' ? 'var(--color-semantic-inverse-primary)' : tone === 'ink' ? 'var(--color-semantic-static-white)' : 'var(--color-semantic-inverse-label-neutral-soft)')
    : (tone === 'signal' ? 'var(--color-semantic-primary-normal)' : tone === 'ink' ? 'var(--color-semantic-label-strong)' : 'var(--color-semantic-label-alternative)');
  return (
    <Comp
      style={{
        fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)',
        letterSpacing, textTransform: 'uppercase', lineHeight: 1.2, color,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
