import React from 'react';

/**
 * LK ROBOTICS — IconButton
 * Circular control wrapping a single icon glyph (source-model icon buttons are always
 * circular; pass `round={false}` to opt into the rounded-square look). Pass an
 * inline SVG as children. Matches Button's calm hover (minimal tone shift, no
 * lift).
 *
 * variant: soft (cool-gray) · solid (graphite) · signal (cyan-ink) ·
 *          ghost (hairline) · on-dark (translucent white, for navy)
 */
export function IconButton({
  children,
  variant = 'soft',
  size = 'medium',
  alternative = false,
  round = true,
  label,
  style,
  disabled = false,
  disable = false,
  onMouseEnter,
  onMouseLeave,
  type,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const resolvedSize = typeof size === 'number'
    ? size
    : ({
        custom: 28,
        small: 32,
        sm: 32,
        medium: 40,
        md: 40,
      }[size] || 40);
  const palettes = {
    soft:    { bg: 'var(--bw-indigo-tint)', bgHover: 'var(--bw-indigo-tint)', fg: 'var(--bw-ink)', bd: 'none' },
    solid:   { bg: 'var(--bw-indigo)', bgHover: 'var(--bw-indigo)', fg: 'var(--color-semantic-inverse-label)', bd: 'none' },
    signal:  { bg: 'var(--color-semantic-primary-normal)', bgHover: 'var(--color-semantic-primary-normal)', fg: 'var(--color-semantic-static-white)', bd: 'none' },
    ghost:   { bg: 'var(--bw-white)', bgHover: 'var(--bw-white)', fg: 'var(--bw-ink)', bd: '1px solid var(--bw-border)' },
    'on-dark': { bg: 'var(--inverse-fill-normal)', bgHover: 'var(--inverse-fill-hover)', fg: 'var(--color-semantic-inverse-label)', bd: '1px solid var(--inverse-line-strong)' },
  };
  const p = palettes[alternative ? 'on-dark' : variant] || palettes.soft;
  const disabledState = disabled || disable;
  return (
    <button
      type={type ?? 'button'}
      aria-label={label}
      className={`lk-iconbtn lk-iconbtn--${variant}`}
      disabled={disabledState}
      onMouseEnter={(e) => { setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHover(false); onMouseLeave && onMouseLeave(e); }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: resolvedSize,
        height: resolvedSize,
        color: disabledState ? 'var(--color-semantic-label-disable)' : p.fg,
        background: disabledState
          ? 'var(--color-semantic-fill-normal)'
          : hover ? p.bgHover : p.bg,
        border: p.bd,
        borderRadius: round ? 'var(--radius-pill)' : 'var(--radius-md)',
        cursor: disabledState ? 'not-allowed' : 'pointer',
        opacity: 1,
        boxShadow: 'none',
        transition: 'var(--component-button-transition)',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
