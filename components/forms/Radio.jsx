import React from 'react';

/**
 * LK ROBOTICS — Radio
 * 20px circle (16px sm) with a 1.5px hairline ring; when selected the circle
 * fills with LK signal ink and shows a white center dot. Use within a group
 * sharing one `name`.
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
  const d = normalizedSize === 'sm' ? 16 : 20;
  const dot = normalizedSize === 'sm' ? 6 : 8;
  const radioBorder = disabledState
    ? 'var(--line-neutral)'
    : visualChecked || activeFocus ? 'var(--lk-accent-ink)' : activeHover ? 'var(--border-strong)' : 'var(--bw-border)';
  const radioBg = disabledState
    ? 'var(--fill-normal)'
    : visualChecked ? 'var(--lk-accent-ink)' : activeHover ? 'var(--fill-normal)' : 'var(--bw-white)';
  const radioDot = disabledState ? 'var(--label-disable)' : 'var(--text-on-signal)';
  return (
    <label
      htmlFor={id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: tight ? 8 : 12,
        cursor: disabledState ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-sans)', fontSize: '15px', letterSpacing: 0, color: disabledState ? 'var(--label-disable)' : 'var(--bw-ink)',
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
        width: d, height: d, flexShrink: 0, boxSizing: 'border-box', background: radioBg,
        border: `1.5px solid ${radioBorder}`,
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
