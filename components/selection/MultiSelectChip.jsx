import React from 'react';

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
  style,
  ...rest
}) {
  const isControlled = selected !== undefined;
  const [internal, setInternal] = React.useState(!!defaultSelected);
  const on = isControlled ? selected : internal;
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
        display: 'inline-flex', alignItems: 'center', gap: 6, height: 38,
        padding: on ? '0 15px 0 11px' : '0 15px',
        background: on ? 'var(--lk-accent-tint-2)' : 'var(--bw-white)',
        border: `1px solid ${on ? 'var(--lk-accent-ink)' : 'var(--bw-border)'}`,
        borderRadius: 'var(--radius-pill)', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, fontFamily: 'var(--font-sans)', fontSize: 14,
        fontWeight: 'var(--fw-semibold)', letterSpacing: 0,
        color: on ? 'var(--lk-accent-ink)' : 'var(--label-neutral)',
        transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), padding var(--dur-fast) var(--ease-out)',
        whiteSpace: 'nowrap', ...style,
      }}
      {...rest}
    >
      {on && (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
      )}
      <span>{children}</span>
    </button>
  );
}
