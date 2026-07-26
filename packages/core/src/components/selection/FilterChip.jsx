import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { pillChipStyle } from './pill-chip-style.js';

/**
 * LK ROBOTICS — FilterChip
 * Rounded filter pill for facet toggles (산업, 제품군). Hairline at rest; the
 * active state fills with the 14% cyan wash + signal-ink text/border. Optional
 * trailing `count`, or a `caret` for a filter that opens a menu.
 *
 * Accessibility — the two roles are kept apart. A plain chip is an on/off
 * toggle and owns `aria-pressed`. A `caret` chip does not toggle a facet, it
 * discloses a menu, so it owns `aria-haspopup` + `aria-expanded` and never
 * `aria-pressed` (mixing the two makes a screen reader read "pressed" for a
 * control that only opened a popup).
 */
export function FilterChip({
  children,
  active = false,
  count,
  caret = false,
  expanded,
  haspopup = 'menu',
  disabled = false,
  size = 'md',
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const isDisclosure = caret;
  return (
    <button
      type="button"
      aria-pressed={isDisclosure ? undefined : active}
      aria-haspopup={isDisclosure ? haspopup : undefined}
      aria-expanded={isDisclosure ? Boolean(expanded ?? active) : undefined}
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
        <span style={{ fontWeight: 'var(--fw-bold)', color: active ? 'currentColor' : 'var(--color-semantic-label-alternative)' }}>{count}</span>
      )}
      {caret && (
        <Icon name="chevron-down-small" size={14} aria-hidden="true" />
      )}
    </button>
  );
}
