import React from 'react';

/**
 * LK ROBOTICS — Fab (floating action button)
 * A round, elevated primary action — the one thing to do on a screen (문의,
 * 새 항목). Signal by default; hover and pressed feedback use calm tone shifts
 * without moving the control. Always pass `label` for the accessible name.
 */
export function Fab({
  children,
  variant = 'signal',
  size = 'md',
  label,
  style,
  disabled = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onKeyDown,
  onKeyUp,
  onBlur,
  className,
  'aria-disabled': ariaDisabled,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  // FAB diameters are intentionally larger than the Button height scale (32/40/48).
  const d = size === 'sm' ? 48 : size === 'lg' ? 64 : 56;
  const palettes = {
    signal: { bg: 'var(--color-semantic-primary-normal)', fg: 'var(--color-semantic-static-white)', sh: 'var(--shadow-accent)' },
    dark: { bg: 'var(--color-semantic-inverse-background)', fg: 'var(--color-semantic-inverse-label)', sh: 'var(--shadow-md)' },
    primary: { bg: 'var(--color-semantic-primary-normal)', fg: 'var(--color-semantic-static-white)', sh: 'var(--shadow-accent)' },
    secondary: { bg: 'var(--color-semantic-secondary-normal)', fg: 'var(--color-semantic-static-white)', sh: 'var(--shadow-indigo)' },
    white: { bg: 'var(--color-semantic-background-elevated-normal)', fg: 'var(--color-semantic-label-normal)', sh: 'var(--shadow-md)' },
  };
  const p = palettes[variant] || palettes.signal;
  const ariaBlocked = ariaDisabled === true || ariaDisabled === 'true';
  const blocked = disabled || ariaBlocked;
  const interactiveBackground = pressed
    ? `color-mix(in srgb, ${p.bg} 88%, var(--color-semantic-label-normal))`
    : hover
      ? `color-mix(in srgb, ${p.bg} 96%, var(--color-semantic-label-normal))`
      : p.bg;
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={ariaBlocked || undefined}
      disabled={disabled}
      className={['lk-fab', `lk-fab--${variant}`, className].filter(Boolean).join(' ')}
      onClick={(event) => {
        if (blocked) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      onMouseEnter={(event) => { setHover(true); onMouseEnter?.(event); }}
      onMouseLeave={(event) => { setHover(false); setPressed(false); onMouseLeave?.(event); }}
      onMouseDown={(event) => { if (!blocked) setPressed(true); onMouseDown?.(event); }}
      onMouseUp={(event) => { setPressed(false); onMouseUp?.(event); }}
      onKeyDown={(event) => {
        if (!blocked && (event.key === 'Enter' || event.key === ' ')) setPressed(true);
        onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        if (event.key === 'Enter' || event.key === ' ') setPressed(false);
        onKeyUp?.(event);
      }}
      onBlur={(event) => { setPressed(false); onBlur?.(event); }}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: d, height: d, borderRadius: '50%',
        border: blocked
          ? 'var(--component-button-disabled-outlined-border)'
          : variant === 'white' ? '1px solid var(--color-semantic-line-solid-normal)' : 'none',
        background: blocked ? 'var(--component-button-disabled-bg)' : interactiveBackground,
        color: blocked ? 'var(--component-button-disabled-fg-outlined)' : p.fg,
        cursor: blocked ? 'not-allowed' : 'pointer',
        boxShadow: blocked ? 'none' : p.sh || 'var(--shadow-md)', transform: 'none',
        transition: 'var(--component-button-transition)', ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
