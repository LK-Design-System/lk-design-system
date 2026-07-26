import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

// Kept inline (not the VisuallyHidden component) so Link stays a single-import
// leaf; same clipping recipe as the rest of the system's SR-only text.
const SR_ONLY_STYLE = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
};

/**
 * LK ROBOTICS — Link
 * A styled inline anchor. Signal ink by default; `underline` none/hover/always.
 * `external` opens a new tab with safe rel, and announces that: the out-arrow
 * glyph is `aria-hidden`, so on its own it left the "opens in a new tab" warning
 * visual-only (WCAG G201). A visually hidden `externalLabel` joins the
 * accessible name instead. Without `href` the anchor is a plain styled span
 * (no link role, no pointer cursor) rather than a fake clickable target.
 */
export function Link({ children, href, tone = 'signal', underline = 'hover', external = false, externalLabel = '새 창에서 열림', style, onMouseEnter, onMouseLeave, ...rest }) {
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
        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', color, fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--fw-semibold)', letterSpacing: 0, textDecoration: showUnderline ? 'underline' : 'none',
        textUnderlineOffset: '2px', cursor: href == null ? 'default' : 'pointer', ...style,
      }}
      {...rest}
    >
      {children}
      {/* The separating space lives inside the clipped span: a bare {' '} would
          become an extra flex item and widen the link by a gap. */}
      {external && <span style={SR_ONLY_STYLE}>{` ${externalLabel}`}</span>}
      {external && <Icon name="external-link" size={13} aria-hidden="true" />}
    </a>
  );
}
