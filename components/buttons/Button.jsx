import React from 'react';

/**
 * LK ROBOTICS — Button
 * Solid, rounded-rect CTAs driven entirely by design-system tokens.
 * Calm by default: a subtle lift + shadow on hover, a small press-in — no
 * bounce. Pair `arrow` with imperative copy ("도입 문의 →").
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

  const heights = { sm: 'var(--control-h-sm)', md: '52px', lg: 'var(--control-h-lg)' };
  const pads = { sm: '0 20px', md: '0 26px', lg: '0 32px' };
  const fonts = { sm: '14px', md: '16px', lg: '17px' };

  const palettes = {
    primary:   { bg: 'var(--color-primary)', bgHover: 'var(--color-primary-hover)', fg: '#fff', bd: 'none', lift: true, shadow: 'var(--shadow-accent)' },
    secondary: { bg: 'var(--bw-indigo)', bgHover: 'var(--bw-indigo-600)', fg: '#fff', bd: 'none', lift: true, shadow: 'var(--shadow-indigo)' },
    signal:   { bg: 'var(--lk-accent-ink)', bgHover: '#005793', fg: 'var(--text-on-signal)', bd: 'none', lift: true, shadow: 'var(--shadow-accent)' },
    dark:     { bg: 'var(--surface-inverse)', bgHover: 'var(--bw-slate)', fg: 'var(--text-on-inverse)', bd: 'none', lift: true, shadow: 'var(--shadow-md)' },
    flat:     { bg: 'var(--bw-indigo-tint)', bgHover: 'var(--fill-strong)', fg: 'var(--bw-ink)', bd: 'none', lift: false, shadow: 'none' },
    ghost:    { bg: 'transparent', bgHover: 'var(--bw-mist)', fg: 'var(--bw-ink)', bd: '1px solid var(--bw-border)', bdHover: '1px solid var(--bw-gray-300)', lift: false, shadow: 'none' },
    'on-dark': { bg: 'rgba(255,255,255,0.14)', bgHover: 'rgba(255,255,255,0.22)', fg: '#fff', bd: '1px solid rgba(255,255,255,0.28)', lift: false, shadow: 'none' },
  };
  const p = palettes[variant] || palettes.primary;
  const active = !disabled;

  const composed = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '9px',
    height: heights[size] || heights.md,
    padding: pads[size] || pads.md,
    width: full ? '100%' : undefined,
    fontFamily: 'var(--font-sans)',
    fontSize: fonts[size] || fonts.md,
    fontWeight: 'var(--fw-bold)',
    letterSpacing: '-0.3px',
    color: p.fg,
    background: active && hover ? p.bgHover : p.bg,
    border: (active && hover && p.bdHover) ? p.bdHover : p.bd,
    borderRadius: 'var(--radius-md)',
    boxShadow: active && hover && p.shadow !== 'none' ? p.shadow : (p.lift ? 'var(--shadow-xs)' : 'none'),
    transform: press && active ? 'translateY(0) scale(0.97)' : (active && hover && p.lift ? 'translateY(-2px)' : 'none'),
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
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
      {arrow && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          style={{ transform: hover && active ? 'translateX(3px)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)' }}>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      )}
    </Comp>
  );
}
