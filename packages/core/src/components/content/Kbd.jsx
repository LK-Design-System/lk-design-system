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
        fontFamily: 'var(--font-sans)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-neutral)',
        background: 'var(--color-semantic-background-elevated-normal)',
        borderColor: 'var(--color-semantic-line-normal-normal)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderBottomWidth: 2,
        borderRadius: 'var(--radius-sm)',
        lineHeight: 1, ...style,
      }}
      {...rest}
    >
      {children}
    </kbd>
  );
}
