import React from 'react';

/**
 * LK ROBOTICS — FilterChip
 * Rounded filter pill for facet toggles (산업, 제품군). Hairline at rest; the
 * active state fills with the 14% cyan wash + signal-ink text/border. Optional
 * trailing `count`, or a `caret` for a filter that opens a menu.
 */
export function FilterChip({
  children,
  active = false,
  count,
  caret = false,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7, height: 38, padding: '0 15px',
        background: active ? 'var(--lk-accent-tint-2)' : (hover && !disabled ? 'var(--fill-normal)' : 'var(--bw-white)'),
        border: `1px solid ${active ? 'var(--lk-accent-ink)' : 'var(--bw-border)'}`,
        borderRadius: 'var(--radius-pill)', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, fontFamily: 'var(--font-sans)', fontSize: 14,
        fontWeight: 'var(--fw-semibold)', letterSpacing: '-0.1px',
        color: active ? 'var(--lk-accent-ink)' : 'var(--label-neutral)',
        transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
        whiteSpace: 'nowrap', ...style,
      }}
      {...rest}
    >
      <span>{children}</span>
      {count != null && (
        <span style={{ fontWeight: 'var(--fw-bold)', color: active ? 'var(--lk-accent-ink)' : 'var(--label-alternative)' }}>{count}</span>
      )}
      {caret && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      )}
    </button>
  );
}
