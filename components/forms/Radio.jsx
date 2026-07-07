import React from 'react';

/**
 * LK ROBOTICS — Radio
 * Hairline ring that fills with an LK signal-ink dot when selected. Use within
 * a group sharing one `name`.
 */
export function Radio({
  label,
  checked,
  defaultChecked = false,
  name,
  value,
  onChange,
  size = 'md',
  state,
  bold = false,
  tight = false,
  interaction,
  disabled = false,
  disable = false,
  labelStyle,
  style,
  id,
  'aria-label': ariaLabel,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const stateChecked = state === 'checked' ? true : state === 'unchecked' ? false : undefined;
  const visualChecked = checked ?? stateChecked ?? defaultChecked;
  const disabledState = disabled || disable || interaction === 'inactive';
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size;
  const activeHover = hover || interaction === 'hovered';
  const activeFocus = focus || interaction === 'focused';
  const d = normalizedSize === 'sm' ? 18 : 22;
  const dot = normalizedSize === 'sm' ? 8 : 10;
  const radioBorder = disabledState
    ? 'var(--line-neutral)'
    : visualChecked || activeFocus ? 'var(--lk-accent-ink)' : activeHover ? 'var(--border-strong)' : 'var(--bw-border)';
  const radioDot = disabledState ? 'var(--label-disable)' : 'var(--lk-accent-ink)';
  return (
    <label
      htmlFor={id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: tight ? 8 : 12,
        cursor: disabledState ? 'not-allowed' : 'pointer', opacity: disabledState ? 0.5 : 1,
        fontFamily: 'var(--font-sans)', fontSize: '15px', letterSpacing: 0, color: 'var(--bw-ink)',
        fontWeight: bold ? 'var(--fw-bold)' : undefined,
        ...style,
      }}
    >
      <input
        type="radio"
        {...rest}
        id={id}
        name={name}
        value={value}
        checked={checked ?? stateChecked}
        defaultChecked={checked === undefined && stateChecked === undefined ? defaultChecked : undefined}
        readOnly={checked === undefined && stateChecked !== undefined && onChange === undefined ? true : rest.readOnly}
        disabled={disabledState}
        onChange={onChange}
        aria-label={ariaLabel}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <span aria-hidden="true" style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: d, height: d, flexShrink: 0, background: activeHover ? 'var(--fill-normal)' : 'var(--bw-white)',
        border: `1px solid ${radioBorder}`,
        borderRadius: 'var(--radius-pill)',
        boxShadow: activeFocus ? '0 0 0 4px var(--focus-ring)' : 'none',
        transition: 'border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      }}>
        {visualChecked && <span style={{ width: dot, height: dot, borderRadius: '50%', background: radioDot }} />}
      </span>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}
