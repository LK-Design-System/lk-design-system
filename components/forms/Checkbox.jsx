import React from 'react';

/**
 * LK ROBOTICS — Checkbox
 * 6px rounded square that fills with the LK signal ink + white check when on.
 * Controlled (`checked`) or uncontrolled (`defaultChecked`).
 */
export function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  'aria-label': ariaLabel,
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return (
    <label
      htmlFor={id}
      onClick={toggle}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '12px',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        fontFamily: 'var(--font-sans)', fontSize: '15px', letterSpacing: 0, color: 'var(--bw-ink)',
      }}
    >
      <span
        role="checkbox"
        aria-checked={on}
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : '체크박스')}
        id={id}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } }}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 18, height: 18, flexShrink: 0, boxSizing: 'border-box',
          background: on ? 'var(--lk-accent-ink)' : 'var(--bw-white)',
          border: `1.5px solid ${on ? 'var(--lk-accent-ink)' : 'var(--bw-border)'}`,
          borderRadius: 'var(--radius-5)',
          transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
        }}
        {...rest}
      >
        {on && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-on-signal)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
