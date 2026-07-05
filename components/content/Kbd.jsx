import React from 'react';

/**
 * LK ROBOTICS — Kbd
 * A keyboard key glyph for shortcuts (⌘ K). Cool-gray key face with a hairline
 * and a subtle bottom shadow. Inline, tabular.
 */
export function Kbd({ children, style, ...rest }) {
  return (
    <kbd
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 22, height: 22, padding: '0 6px',
        fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 'var(--fw-bold)', color: 'var(--label-neutral)',
        background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderBottomWidth: 2, borderRadius: 'var(--radius-sm)',
        lineHeight: 1, ...style,
      }}
      {...rest}
    >
      {children}
    </kbd>
  );
}
