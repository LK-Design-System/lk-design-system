import React from 'react';
import { Icon } from '../icon/Icon.jsx';
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
  size = 'md',
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
        ...pillChipStyle(active, disabled, size), gap: size === 'sm' ? 6 : 7,
        ...(!active && hover && !disabled ? { background: 'var(--color-semantic-fill-normal)' } : null),
        ...style,
      }}
      {...rest}
    >
      <span>{children}</span>
      {count != null && (
        <span style={{ fontWeight: 'var(--fw-bold)', color: active ? 'var(--color-semantic-primary-heavy)' : 'var(--color-semantic-label-alternative)' }}>{count}</span>
      )}
      {caret && (
        <Icon name="chevron-down-small" size={14} aria-hidden="true" />
      )}
    </button>
  );
}
