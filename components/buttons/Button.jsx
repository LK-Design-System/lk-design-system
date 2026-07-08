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
  const lineHeights = {
    sm: 'var(--component-button-line-height-sm)',
    md: 'var(--component-button-line-height-md)',
    lg: 'var(--component-button-line-height-lg)',
  };
  const letterSpacings = {
    sm: 'var(--component-button-letter-spacing-sm)',
    md: 'var(--component-button-letter-spacing-md)',
    lg: 'var(--component-button-letter-spacing-lg)',
  };
  const gaps = {
    sm: 'var(--component-button-gap-sm)',
    md: 'var(--component-button-gap-md)',
    lg: 'var(--component-button-gap-lg)',
  };
  const radii = {
    sm: 'var(--component-button-radius-sm)',
    md: 'var(--component-button-radius-md)',
    lg: 'var(--component-button-radius-lg)',
  };
  const iconSizes = {
    sm: 'var(--component-button-icon-size-sm)',
    md: 'var(--component-button-icon-size-md)',
    lg: 'var(--component-button-icon-size-lg)',
  };
  const iconOnlyIconSizes = {
    sm: 'var(--component-button-icon-only-icon-size-sm)',
    md: 'var(--component-button-icon-only-icon-size-md)',
    lg: 'var(--component-button-icon-only-icon-size-lg)',
  };

  const normalizedSize = {
    small: 'sm',
    medium: 'md',
    large: 'lg',
  }[size] || size;
  const iconSize = iconOnly
    ? (iconOnlyIconSizes[normalizedSize] || iconOnlyIconSizes.md)
    : (iconSizes[normalizedSize] || iconSizes.md);
  const content = React.Children.toArray(children).map((child, index) => (
    typeof child === 'string' || typeof child === 'number'
      ? <span key={`text-${index}`}>{child}</span>
      : (
        <span
          key={`icon-${index}`}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: iconSize, flexShrink: 0 }}
        >
          {child}
        </span>
      )
  ));
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
    'outlined-primary': { bg: 'transparent', bgHover: 'var(--lk-accent-tint)', fg: 'var(--color-semantic-primary-normal)', bd: 'var(--border-thin) solid var(--color-semantic-line-normal-normal)', bdHover: 'var(--border-thin) solid var(--color-semantic-line-normal-normal)', elevated: false },
    'outlined-assistive': { bg: 'transparent', bgHover: 'var(--color-semantic-fill-normal)', fg: 'var(--color-semantic-label-normal)', bd: 'var(--border-thin) solid var(--color-semantic-line-normal-normal)', bdHover: 'var(--border-thin) solid var(--color-semantic-line-solid-normal)', elevated: false },
  };
  const p = palettes[wdsVariant] || palettes.primary;
  const disabledState = disabled || disable || loading;
  const active = !disabledState;
  const outlinedLike = wdsVariant.startsWith('outlined') || wdsVariant === 'ghost';
  const disabledBorder = outlinedLike
    ? 'var(--component-button-disabled-outlined-border)'
    : 'var(--component-button-disabled-border)';
  const disabledFg = outlinedLike
    ? 'var(--component-button-disabled-fg-outlined)'
    : 'var(--component-button-disabled-fg)';
  const disabledBg = outlinedLike ? 'transparent' : 'var(--component-button-disabled-bg)';

  const composed = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: gaps[normalizedSize] || gaps.md,
    height: heights[normalizedSize] || heights.md,
    minWidth: iconOnly ? (heights[normalizedSize] || heights.md) : undefined,
    padding: iconOnly ? 0 : (pads[normalizedSize] || pads.md),
    width: full ? '100%' : undefined,
    fontFamily: 'var(--font-sans)',
    fontSize: fonts[normalizedSize] || fonts.md,
    lineHeight: lineHeights[normalizedSize] || lineHeights.md,
    fontWeight: wdsVariant.endsWith('-assistive')
      ? 'var(--component-button-font-weight-assistive)'
      : 'var(--component-button-font-weight)',
    letterSpacing: letterSpacings[normalizedSize] || letterSpacings.md,
    color: disabledState ? disabledFg : p.fg,
    background: disabledState ? disabledBg : active && hover ? p.bgHover : p.bg,
    border: disabledState ? disabledBorder : (active && hover && p.bdHover) ? p.bdHover : p.bd,
    borderRadius: radii[normalizedSize] || radii.md,
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
