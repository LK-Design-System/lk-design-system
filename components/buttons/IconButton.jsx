import React from 'react';

/**
 * LK ROBOTICS — IconButton
 * Square (or circular) control wrapping a single icon glyph. Pass an inline
 * SVG as children. Matches Button's calm hover (tint shift, no lift).
 *
 * variant: soft (cool-gray) · solid (graphite) · signal (cyan-ink) ·
 *          ghost (hairline) · on-dark (translucent white, for navy)
 */
export function IconButton({
  children,
  variant = 'soft',
  size = 44,
  round = false,
  label,
  style,
  disabled = false,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const palettes = {
    soft:    { bg: 'var(--bw-indigo-tint)', bgHover: 'var(--fill-strong)', fg: 'var(--bw-ink)', bd: 'none' },
    solid:   { bg: 'var(--bw-indigo)', bgHover: 'var(--bw-indigo-600)', fg: '#fff', bd: 'none' },
    signal:  { bg: 'var(--lk-accent-ink)', bgHover: '#005793', fg: 'var(--text-on-signal)', bd: 'none' },
    ghost:   { bg: 'var(--bw-white)', bgHover: 'var(--bw-mist)', fg: 'var(--bw-ink)', bd: '1px solid var(--bw-border)' },
    'on-dark': { bg: 'rgba(255,255,255,0.12)', bgHover: 'rgba(255,255,255,0.2)', fg: '#fff', bd: '1px solid rgba(255,255,255,0.22)' },
  };
  const p = palettes[variant] || palettes.soft;
  return (
    <button
      aria-label={label}
      className={`lk-iconbtn lk-iconbtn--${variant}`}
      disabled={disabled}
      onMouseEnter={(e) => { setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHover(false); onMouseLeave && onMouseLeave(e); }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        color: p.fg,
        background: hover && !disabled ? p.bgHover : p.bg,
        border: p.bd,
        borderRadius: round ? 'var(--radius-pill)' : 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        boxShadow: hover && !disabled && (variant === 'solid' || variant === 'signal') ? 'var(--shadow-sm)' : 'none',
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
