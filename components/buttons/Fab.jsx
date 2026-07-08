import React from 'react';

/**
 * LK ROBOTICS — Fab (floating action button)
 * A round, elevated primary action — the one thing to do on a screen (문의,
 * 새 항목). Signal by default; remains visually stable on hover. Always pass
 * `label` for the accessible name.
 */
export function Fab({ children, variant = 'signal', size = 'md', label, style, ...rest }) {
  // FAB diameters are intentionally larger than the Button height scale (32/40/48).
  const d = size === 'sm' ? 48 : size === 'lg' ? 64 : 56;
  const palettes = {
    signal: { bg: 'var(--lk-accent-ink)', fg: 'var(--text-on-signal)', sh: 'var(--shadow-accent)' },
    dark: { bg: 'var(--surface-inverse)', fg: 'var(--text-on-inverse)', sh: 'var(--shadow-md)' },
    primary: { bg: 'var(--color-primary)', fg: 'var(--text-on-signal)', sh: 'var(--shadow-accent)' },
    secondary: { bg: 'var(--bw-indigo)', fg: 'var(--text-on-signal)', sh: 'var(--shadow-indigo)' },
    white: { bg: 'var(--bw-white)', fg: 'var(--label-normal)', sh: 'var(--shadow-md)' },
  };
  const p = palettes[variant] || palettes.signal;
  return (
    <button
      type="button"
      aria-label={label}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: d, height: d, borderRadius: '50%',
        border: variant === 'white' ? '1px solid var(--bw-border)' : 'none', background: p.bg, color: p.fg, cursor: 'pointer',
        boxShadow: p.sh || 'var(--shadow-md)', transform: 'none',
        transition: 'var(--component-button-transition)', ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
