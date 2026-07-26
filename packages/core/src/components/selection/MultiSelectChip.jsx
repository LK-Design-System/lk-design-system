import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { pillChipStyle } from './pill-chip-style.js';

/**
 * LK ROBOTICS — MultiSelectChip
 * Toggle chip for multi-select facets (핵심 기술 선택). When selected, a leading
 * check appears and the chip fills with the cyan wash. Controlled (`selected`)
 * or uncontrolled (`defaultSelected`).
 */
export function MultiSelectChip({
  children,
  selected,
  defaultSelected,
  onChange,
  disabled = false,
  size = 'md',
  style,
  ...rest
}) {
  const isControlled = selected !== undefined;
  const [internal, setInternal] = React.useState(!!defaultSelected);
  const on = isControlled ? selected : internal;
  const sm = size === 'sm';
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled}
      onClick={toggle}
      style={{
        ...pillChipStyle(on, disabled, size), gap: 'var(--space-1-5)',
        padding: on ? (sm ? '0 12px 0 9px' : '0 12px 0 8px') : (sm ? '0 12px' : '0 12px'),
        transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), padding var(--dur-fast) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      {on && (
        <Icon name="check" size={15} aria-hidden="true" />
      )}
      <span>{children}</span>
    </button>
  );
}
