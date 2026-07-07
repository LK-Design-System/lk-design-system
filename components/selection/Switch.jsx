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
  state,
  platform = 'normal',
  interaction,
  active = false,
  focus: forcedFocus = false,
  disabled = false,
  disable = false,
  labelStyle,
  style,
  id,
  'aria-label': ariaLabel,
  ...rest
}) {
  const stateChecked = state === 'checked' || state === 'on' ? true : state === 'unchecked' || state === 'off' ? false : undefined;
  const isControlled = checked !== undefined || stateChecked !== undefined;
  const [internal, setInternal] = React.useState(stateChecked ?? !!defaultChecked);
  const [focus, setFocus] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const on = checked !== undefined ? checked : stateChecked !== undefined ? stateChecked : internal;
  const disabledState = disabled || disable || interaction === 'inactive';
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size;
  const activeFocus = focus || forcedFocus || interaction === 'focused';
  const activeHover = hover || active || interaction === 'hovered';
  const toggle = () => {
    if (disabledState) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  const d = normalizedSize === 'sm' ? { w: 40, h: 24, k: 18, tx: 16 } : { w: 52, h: 32, k: 26, tx: 20 };
  const offBg = platform === 'ios' ? 'var(--fill-strong)' : 'var(--bw-gray-300)';
  const trackBg = disabledState ? (on ? 'var(--fill-strong)' : 'var(--fill-normal)') : on ? 'var(--lk-accent-ink)' : activeHover ? 'var(--fill-strong)' : offBg;
  return (
    <label
      htmlFor={id}
      onClick={toggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 12,
        cursor: disabledState ? 'not-allowed' : 'pointer', opacity: disabledState ? 0.5 : 1,
        fontFamily: 'var(--font-sans)', fontSize: 15, letterSpacing: 0, color: 'var(--label-normal)',
        ...style,
      }}
    >
      <span
        role="switch"
        aria-checked={on}
        aria-disabled={disabledState ? true : undefined}
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : 'switch')}
        id={id}
        tabIndex={disabledState ? -1 : 0}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } }}
        style={{
          position: 'relative', flexShrink: 0, width: d.w, height: d.h,
          borderRadius: 'var(--radius-pill)',
          background: trackBg,
          boxShadow: activeFocus ? '0 0 0 4px var(--focus-ring)' : 'none',
          transition: 'background var(--dur-base) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        }}
        {...rest}
      >
        <span
          style={{
            position: 'absolute', top: 3, left: 3, width: d.k, height: d.k, borderRadius: '50%',
            background: 'var(--text-on-signal)', boxShadow: platform === 'ios' ? 'var(--shadow-sm)' : 'var(--shadow-control)',
            transform: on ? `translateX(${d.tx}px)` : 'translateX(0)',
            transition: 'transform var(--dur-base) var(--ease-in-out)',
          }}
        />
      </span>
      {label != null && <span style={labelStyle}>{label}</span>}
    </label>
  );
}
