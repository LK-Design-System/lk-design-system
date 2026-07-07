import React from 'react';
import { Spinner } from '../status/Spinner.jsx';

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
  color,
  size = 'md',          // sm | md | lg
  arrow = false,
  full = false,
  disabled = false,
  disable = false,
  iconOnly = false,
  loading = false,
  loadingLabel = 'Loading',
  as = 'button',
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onClick,
  type,
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

  const normalizedSize = {
    small: 'sm',
    medium: 'md',
    large: 'lg',
  }[size] || size;
  const normalizedVariant = String(variant || 'primary').toLowerCase();
  const normalizedColor = String(color || 'primary').toLowerCase();
  const wdsVariant =
    normalizedVariant === 'solid' || normalizedVariant === 'outlined'
      ? `${normalizedVariant}-${normalizedColor === 'assistive' ? 'assistive' : 'primary'}`
      : normalizedVariant;

  const palettes = {
    primary: { bg: 'var(--component-button-primary-bg)', bgHover: 'var(--component-button-primary-bg-hover)', fg: 'var(--component-button-primary-fg)', bd: 'none', elevated: true },
    secondary: { bg: 'var(--component-button-secondary-bg)', bgHover: 'var(--component-button-secondary-bg-hover)', fg: 'var(--component-button-secondary-fg)', bd: 'none', elevated: true },
    signal: { bg: 'var(--component-button-signal-bg)', bgHover: 'var(--component-button-signal-bg-hover)', fg: 'var(--component-button-signal-fg)', bd: 'none', elevated: true },
    dark: { bg: 'var(--component-button-dark-bg)', bgHover: 'var(--component-button-dark-bg-hover)', fg: 'var(--component-button-dark-fg)', bd: 'none', elevated: true },
    flat: { bg: 'var(--component-button-flat-bg)', bgHover: 'var(--component-button-flat-bg-hover)', fg: 'var(--component-button-flat-fg)', bd: 'none', elevated: false },
    ghost: { bg: 'var(--component-button-ghost-bg)', bgHover: 'var(--component-button-ghost-bg-hover)', fg: 'var(--component-button-ghost-fg)', bd: 'var(--component-button-ghost-border)', bdHover: 'var(--component-button-ghost-border-hover)', elevated: false },
    'on-dark': { bg: 'var(--component-button-on-dark-bg)', bgHover: 'var(--component-button-on-dark-bg-hover)', fg: 'var(--component-button-on-dark-fg)', bd: 'var(--component-button-on-dark-border)', elevated: false },
    'solid-primary': { bg: 'var(--component-button-primary-bg)', bgHover: 'var(--component-button-primary-bg-hover)', fg: 'var(--component-button-primary-fg)', bd: 'none', elevated: true },
    'solid-assistive': { bg: 'var(--component-button-flat-bg)', bgHover: 'var(--component-button-flat-bg-hover)', fg: 'var(--component-button-flat-fg)', bd: 'none', elevated: false },
    'outlined-primary': { bg: 'transparent', bgHover: 'var(--lk-accent-tint)', fg: 'var(--color-primary)', bd: 'var(--border-thin) solid var(--color-primary)', bdHover: 'var(--border-thin) solid var(--color-primary)', elevated: false },
    'outlined-assistive': { bg: 'transparent', bgHover: 'var(--fill-normal)', fg: 'var(--label-normal)', bd: 'var(--border-thin) solid var(--border-subtle)', bdHover: 'var(--border-thin) solid var(--border-strong)', elevated: false },
  };
  const p = palettes[wdsVariant] || palettes.primary;
  const disabledState = disabled || disable || loading;
  const active = !disabledState;
  const disabledBorder = wdsVariant.startsWith('outlined')
    ? 'var(--component-button-disabled-outlined-border)'
    : 'var(--component-button-disabled-border)';

  const composed = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--component-button-gap)',
    height: heights[normalizedSize] || heights.md,
    minWidth: iconOnly ? (heights[normalizedSize] || heights.md) : undefined,
    padding: iconOnly ? 0 : (pads[normalizedSize] || pads.md),
    width: full ? '100%' : undefined,
    fontFamily: 'var(--font-sans)',
    fontSize: fonts[normalizedSize] || fonts.md,
    fontWeight: 'var(--component-button-font-weight)',
    letterSpacing: 'var(--component-button-letter-spacing)',
    color: disabledState ? 'var(--component-button-disabled-fg)' : p.fg,
    background: disabledState ? 'var(--component-button-disabled-bg)' : active && hover ? p.bgHover : p.bg,
    border: disabledState ? disabledBorder : (active && hover && p.bdHover) ? p.bdHover : p.bd,
    borderRadius: 'var(--component-button-radius)',
    boxShadow: active && p.elevated ? 'var(--component-button-shadow-rest)' : 'none',
    transform: 'none',
    cursor: disabledState ? 'not-allowed' : 'pointer',
    opacity: 1,
    transition: 'var(--component-button-transition)',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    WebkitTapHighlightColor: 'transparent',
    ...style,
  };

  const Comp = as;
  return (
    <Comp
      className={`lk-btn lk-btn--${wdsVariant}`}
      style={composed}
      disabled={as === 'button' ? disabledState : undefined}
      type={as === 'button' ? (type ?? 'button') : undefined}
      aria-busy={loading || undefined}
      aria-disabled={as !== 'button' && disabledState ? true : undefined}
      onMouseEnter={(e) => { setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHover(false); onMouseLeave && onMouseLeave(e); }}
      onMouseDown={(e) => { onMouseDown && onMouseDown(e); }}
      onMouseUp={(e) => { onMouseUp && onMouseUp(e); }}
      onClick={(e) => {
        if (disabledState) {
          e.preventDefault();
          return;
        }
        onClick && onClick(e);
      }}
      {...rest}
    >
      {loading && (
        <>
          <Spinner size={16} color="currentColor" aria-hidden="true" />
          <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
            {loadingLabel}
          </span>
        </>
      )}
      {content}
    </Comp>
  );
}
