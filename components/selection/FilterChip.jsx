import React from 'react';
import { pillChipStyle } from './pill-chip-style.js';

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
        ...pillChipStyle(active, disabled), gap: 7,
        ...(!active && hover && !disabled ? { background: 'var(--fill-normal)' } : null),
        ...style,
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
