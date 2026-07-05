import React from 'react';

/**
 * LK ROBOTICS — Button
 * Solid, rounded-rect CTAs driven entirely by design-system tokens.
 * Calm by default: hover keeps solid fills visually stable, with only minimal
 * tone changes for low-emphasis variants. No animation, positional lift, or
 * press scale. `arrow` is deprecated and kept as a no-op for compatibility.
 *
 * variant: primary (LK azure — brand) · secondary (graphite) · signal (LK cyan-ink) ·
 *          dark (navy) · flat (cool-gray) · ghost (hairline) · on-dark (translucent, for navy sections)
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',          // sm | md | lg
  arrow = false,
  full = false,
  disabled = false,
  as = 'button',
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const content = React.Children.toArray(children).map((child, index) => (
    typeof child === 'string' || typeof child === 'number'
      ? <span key={`text-${index}`}>{child}</span>
      : child
  ));

  const heights = {
    sm: 'var(--component-button-height-sm)',
    md: 'var(--component-button-height-md)',
    lg: 'var(--component-button-height-lg)',
  };
  const pads = {
    sm: 'var(--component-button-padding-sm)',
    md: 'var(--component-button-padding-md)',
    lg: 'var(--component-button-padding-lg)',
  };
  const fonts = {
    sm: 'var(--component-button-font-size-sm)',
    md: 'var(--component-button-font-size-md)',
    lg: 'var(--component-button-font-size-lg)',
  };

  const palettes = {
    primary: { bg: 'var(--component-button-primary-bg)', bgHover: 'var(--component-button-primary-bg-hover)', fg: 'var(--component-button-primary-fg)', bd: 'none', elevated: true },
    secondary: { bg: 'var(--component-button-secondary-bg)', bgHover: 'var(--component-button-secondary-bg-hover)', fg: 'var(--component-button-secondary-fg)', bd: 'none', elevated: true },
    signal: { bg: 'var(--component-button-signal-bg)', bgHover: 'var(--component-button-signal-bg-hover)', fg: 'var(--component-button-signal-fg)', bd: 'none', elevated: true },
    dark: { bg: 'var(--component-button-dark-bg)', bgHover: 'var(--component-button-dark-bg-hover)', fg: 'var(--component-button-dark-fg)', bd: 'none', elevated: true },
    flat: { bg: 'var(--component-button-flat-bg)', bgHover: 'var(--component-button-flat-bg-hover)', fg: 'var(--component-button-flat-fg)', bd: 'none', elevated: false },
    ghost: { bg: 'var(--component-button-ghost-bg)', bgHover: 'var(--component-button-ghost-bg-hover)', fg: 'var(--component-button-ghost-fg)', bd: 'var(--component-button-ghost-border)', bdHover: 'var(--component-button-ghost-border-hover)', elevated: false },
    'on-dark': { bg: 'var(--component-button-on-dark-bg)', bgHover: 'var(--component-button-on-dark-bg-hover)', fg: 'var(--component-button-on-dark-fg)', bd: 'var(--component-button-on-dark-border)', elevated: false },
  };
  const p = palettes[variant] || palettes.primary;
  const active = !disabled;

  const composed = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--component-button-gap)',
    height: heights[size] || heights.md,
    padding: pads[size] || pads.md,
    width: full ? '100%' : undefined,
    fontFamily: 'var(--font-sans)',
    fontSize: fonts[size] || fonts.md,
    fontWeight: 'var(--component-button-font-weight)',
    letterSpacing: 'var(--component-button-letter-spacing)',
    color: p.fg,
    background: active && hover ? p.bgHover : p.bg,
    border: (active && hover && p.bdHover) ? p.bdHover : p.bd,
    borderRadius: 'var(--component-button-radius)',
    boxShadow: p.elevated ? 'var(--component-button-shadow-rest)' : 'none',
    transform: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--component-button-disabled-opacity)' : 1,
    transition: 'var(--component-button-transition)',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    WebkitTapHighlightColor: 'transparent',
    ...style,
  };

  const Comp = as;
  return (
    <Comp
      className={`lk-btn lk-btn--${variant}`}
      style={composed}
      disabled={as === 'button' ? disabled : undefined}
      onMouseEnter={(e) => { setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHover(false); onMouseLeave && onMouseLeave(e); }}
      onMouseDown={(e) => { onMouseDown && onMouseDown(e); }}
      onMouseUp={(e) => { onMouseUp && onMouseUp(e); }}
      {...rest}
    >
      {content}
    </Comp>
  );
}
