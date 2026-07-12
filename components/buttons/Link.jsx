import React from 'react';
import { Icon } from '../icon/Icon.jsx';

/**
 * LK ROBOTICS — Link
 * A styled inline anchor. Signal ink by default; `underline` none/hover/always.
 * `external` appends a small out-arrow and sets safe rel.
 */
export function Link({ children, href, tone = 'signal', underline = 'hover', external = false, style, onMouseEnter, onMouseLeave, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const color = tone === 'neutral' ? 'var(--color-semantic-label-neutral)' : tone === 'inherit' ? 'inherit' : 'var(--color-semantic-primary-normal)';
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
      {external && <Icon name="external-link" size={13} aria-hidden="true" />}
    </a>
  );
}
