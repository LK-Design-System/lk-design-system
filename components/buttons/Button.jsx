import React from 'react';

/**
 * LK ROBOTICS — Button
 * Solid, rounded-rect CTAs driven entirely by design-system tokens.
 * Calm by default: a subtle lift + shadow on hover, a small press-in — no
 * bounce. `arrow` is deprecated and kept as a no-op for compatibility.
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
  const [press, setPress] = React.useState(false);

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
    primary: { bg: 'var(--component-button-primary-bg)', bgHover: 'var(--component-button-primary-bg-hover)', fg: 'var(--component-button-primary-fg)', bd: 'none', lift: true, shadow: 'var(--component-button-primary-shadow-hover)' },
    secondary: { bg: 'var(--component-button-secondary-bg)', bgHover: 'var(--component-button-secondary-bg-hover)', fg: 'var(--component-button-secondary-fg)', bd: 'none', lift: true, shadow: 'var(--component-button-secondary-shadow-hover)' },
    signal: { bg: 'var(--component-button-signal-bg)', bgHover: 'var(--component-button-signal-bg-hover)', fg: 'var(--component-button-signal-fg)', bd: 'none', lift: true, shadow: 'var(--component-button-signal-shadow-hover)' },
    dark: { bg: 'var(--component-button-dark-bg)', bgHover: 'var(--component-button-dark-bg-hover)', fg: 'var(--component-button-dark-fg)', bd: 'none', lift: true, shadow: 'var(--component-button-dark-shadow-hover)' },
    flat: { bg: 'var(--component-button-flat-bg)', bgHover: 'var(--component-button-flat-bg-hover)', fg: 'var(--component-button-flat-fg)', bd: 'none', lift: false, shadow: 'none' },
    ghost: { bg: 'var(--component-button-ghost-bg)', bgHover: 'var(--component-button-ghost-bg-hover)', fg: 'var(--component-button-ghost-fg)', bd: 'var(--component-button-ghost-border)', bdHover: 'var(--component-button-ghost-border-hover)', lift: false, shadow: 'none' },
    'on-dark': { bg: 'var(--component-button-on-dark-bg)', bgHover: 'var(--component-button-on-dark-bg-hover)', fg: 'var(--component-button-on-dark-fg)', bd: 'var(--component-button-on-dark-border)', lift: false, shadow: 'none' },
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
    boxShadow: active && hover && p.shadow !== 'none' ? p.shadow : (p.lift ? 'var(--component-button-shadow-rest)' : 'none'),
    transform: press && active ? 'var(--component-button-transform-pressed)' : (active && hover && p.lift ? 'var(--component-button-transform-hover)' : 'none'),
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--component-button-disabled-opacity)' : 1,
    transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
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
      onMouseLeave={(e) => { setHover(false); setPress(false); onMouseLeave && onMouseLeave(e); }}
      onMouseDown={(e) => { setPress(true); onMouseDown && onMouseDown(e); }}
      onMouseUp={(e) => { setPress(false); onMouseUp && onMouseUp(e); }}
      {...rest}
    >
      <span>{children}</span>
    </Comp>
  );
}
