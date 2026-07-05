import React from 'react';

/**
 * LK ROBOTICS — Card
 * The neutral surface everything is built on: white, hairline border, soft
 * navy-tinted shadow, 16px radius. `interactive` lifts gently on hover;
 * `dark` flips to a navy surface for dark sections.
 */
export function Card({
  children,
  elevation = 'md',
  interactive = false,
  dark = false,
  padding,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) {
  const shadows = { none: 'none', sm: 'var(--shadow-sm)', md: 'var(--shadow-md)', lg: 'var(--shadow-lg)' };
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={(e) => { if (interactive) setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { if (interactive) setHover(false); onMouseLeave && onMouseLeave(e); }}
      style={{
        background: dark ? 'var(--surface-inverse)' : 'var(--surface-card)',
        color: dark ? 'var(--text-on-dark)' : 'var(--text-body)',
        border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--bw-border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: interactive && hover ? 'var(--shadow-lg)' : shadows[elevation],
        transform: interactive && hover ? 'translateY(-4px)' : 'none',
        transition: 'var(--transition-base)',
        padding: padding != null ? padding : 'var(--space-8)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
