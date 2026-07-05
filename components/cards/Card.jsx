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
  const shadows = {
    none: 'var(--component-card-shadow-none)',
    sm: 'var(--component-card-shadow-sm)',
    md: 'var(--component-card-shadow-md)',
    lg: 'var(--component-card-shadow-lg)',
  };
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={(e) => { if (interactive) setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { if (interactive) setHover(false); onMouseLeave && onMouseLeave(e); }}
      style={{
        background: dark ? 'var(--component-card-bg-dark)' : 'var(--component-card-bg)',
        color: dark ? 'var(--component-card-fg-dark)' : 'var(--component-card-fg)',
        border: dark ? 'var(--component-card-border-dark)' : 'var(--component-card-border)',
        borderRadius: 'var(--component-card-radius)',
        boxShadow: interactive && hover ? 'var(--component-card-shadow-lg)' : shadows[elevation],
        transform: interactive && hover ? 'var(--component-card-hover-transform)' : 'none',
        transition: 'var(--component-card-transition)',
        padding: padding != null ? padding : 'var(--component-card-padding)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
