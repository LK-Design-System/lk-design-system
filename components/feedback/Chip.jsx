import React from 'react';

/**
 * LK ROBOTICS — Chip
 * Mixed-case keyword chip — white box, hairline border, 8px radius. The
 * recurring "applied product / capability" token (적용 제품, 핵심 기술). Pass
 * `as="a"` + `href` for a link chip; hover lifts the border + text to the
 * signal ink.
 */
export function Chip({
  children,
  as = 'span',
  selected = false,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const active = selected || hover;
  const Comp = as;
  return (
    <Comp
      onMouseEnter={(e) => { setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHover(false); onMouseLeave && onMouseLeave(e); }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 2, height: 32, paddingInline: 8,
        background: selected ? 'var(--lk-accent-tint-2)' : 'var(--bw-white)',
        border: `1px solid ${active ? 'var(--lk-accent-ink)' : 'var(--bw-border)'}`,
        borderRadius: 'var(--radius-8)',
        fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 'var(--fw-medium)', letterSpacing: '0.015em',
        color: active ? 'var(--lk-accent-ink)' : 'var(--bw-ink)',
        whiteSpace: 'nowrap', textDecoration: 'none',
        cursor: as === 'a' || rest.onClick ? 'pointer' : 'default',
        transition: 'color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
