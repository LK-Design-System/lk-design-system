import React from 'react';

/**
 * LK ROBOTICS — Link
 * A styled inline anchor. Signal ink by default; `underline` none/hover/always.
 * `external` appends a small out-arrow and sets safe rel.
 */
export function Link({ children, href, tone = 'signal', underline = 'hover', external = false, style, onMouseEnter, onMouseLeave, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const color = tone === 'neutral' ? 'var(--label-neutral)' : tone === 'inherit' ? 'inherit' : 'var(--lk-accent-ink)';
  const showUnderline = underline === 'always' || (underline === 'hover' && hover);
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseEnter={(e) => { setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHover(false); onMouseLeave && onMouseLeave(e); }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 3, color, fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--fw-semibold)', letterSpacing: 0, textDecoration: showUnderline ? 'underline' : 'none',
        textUnderlineOffset: '2px', cursor: 'pointer', ...style,
      }}
      {...rest}
    >
      {children}
      {external && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>}
    </a>
  );
}
