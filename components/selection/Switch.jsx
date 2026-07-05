import React from 'react';

/**
 * LK ROBOTICS — Switch
 * Instant on/off toggle. The track fills with the LK signal ink when on and
 * the knob slides with the house emphasized ease — calm, no bounce. Track
 * geometry (52×32 / 40×24), LK identity (steel-azure fill, navy-tinted focus).
 * Controlled (`checked`) or uncontrolled (`defaultChecked`).
 */
export function Switch({
  checked,
  defaultChecked,
  onChange,
  label,
  size = 'md',
  disabled = false,
  id,
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const [focus, setFocus] = React.useState(false);
  const on = isControlled ? checked : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  const d = size === 'sm' ? { w: 40, h: 24, k: 18, tx: 16 } : { w: 52, h: 32, k: 26, tx: 20 };
  return (
    <label
      htmlFor={id}
      onClick={toggle}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 12,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        fontFamily: 'var(--font-sans)', fontSize: 15, letterSpacing: 0, color: 'var(--label-normal)',
      }}
    >
      <span
        role="switch"
        aria-checked={on}
        id={id}
        tabIndex={disabled ? -1 : 0}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } }}
        style={{
          position: 'relative', flexShrink: 0, width: d.w, height: d.h,
          borderRadius: 'var(--radius-pill)',
          background: on ? 'var(--lk-accent-ink)' : 'var(--bw-gray-300)',
          boxShadow: focus ? '0 0 0 4px var(--focus-ring)' : 'none',
          transition: 'background var(--dur-base) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        }}
        {...rest}
      >
        <span
          style={{
            position: 'absolute', top: 3, left: 3, width: d.k, height: d.k, borderRadius: '50%',
            background: '#fff', boxShadow: '0 1px 3px rgba(8,14,33,0.28)',
            transform: on ? `translateX(${d.tx}px)` : 'translateX(0)',
            transition: 'transform var(--dur-base) var(--ease-in-out)',
          }}
        />
      </span>
      {label != null && <span>{label}</span>}
    </label>
  );
}
