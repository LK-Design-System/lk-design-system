import React from 'react';

const uncontrolledRadioGroups = new Map();

function notifyUncontrolledGroup(name, selectedInput) {
  if (!name) return;
  uncontrolledRadioGroups.get(name)?.forEach((listener) => listener(selectedInput));
}

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
  onFocus,
  onBlur,
  ...rest
}) {
  const inputRef = React.useRef(null);
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const stateChecked = state === 'checked' ? true : state === 'unchecked' ? false : undefined;
  const isControlled = checked !== undefined || stateChecked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(!!defaultChecked);
  const visualChecked = checked ?? stateChecked ?? internalChecked;
  const disabledState = disabled || disable || interaction === 'inactive';
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size;
  const activeHover = hover || interaction === 'hovered';
  const activeFocus = focus || interaction === 'focused';
  const d = normalizedSize === 'sm' ? 16 : 20;
  const dot = normalizedSize === 'sm' ? 8 : 12;

  React.useEffect(() => {
    if (isControlled || !name) return undefined;
    const syncGroup = (selectedInput) => setInternalChecked(selectedInput === inputRef.current);
    const listeners = uncontrolledRadioGroups.get(name) ?? new Set();
    listeners.add(syncGroup);
    uncontrolledRadioGroups.set(name, listeners);
    return () => {
      listeners.delete(syncGroup);
      if (!listeners.size) uncontrolledRadioGroups.delete(name);
    };
  }, [isControlled, name]);
  const radioBorder = disabledState
    ? 'var(--color-semantic-line-normal-neutral)'
    : visualChecked || activeFocus ? 'var(--color-semantic-primary-normal)' : activeHover ? 'var(--color-semantic-line-solid-normal)' : 'var(--color-semantic-line-solid-normal)';
  const radioBg = disabledState
    ? 'var(--color-semantic-fill-normal)'
    : visualChecked ? 'var(--color-semantic-primary-normal)' : activeHover ? 'var(--color-semantic-fill-normal)' : 'var(--color-semantic-background-elevated-normal)';
  const radioDot = disabledState ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-static-white)';
  return (
    <label
      data-disabled={disabledState ? "" : undefined}
      data-selected={visualChecked ? "" : undefined}
      htmlFor={id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--component-input-gap)',
        cursor: disabledState ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--body2-size)', letterSpacing: 0, color: disabledState ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-brand-ink)',
        fontWeight: bold ? 'var(--fw-bold)' : undefined,
        ...style,
      }}
    >
      <input
        ref={inputRef}
        type="radio"
        {...rest}
        id={id}
        name={name}
        value={value}
        checked={visualChecked}
        readOnly={checked === undefined && stateChecked !== undefined && onChange === undefined ? true : rest.readOnly}
        disabled={disabledState}
        onChange={(event) => {
          if (!isControlled) {
            if (name) notifyUncontrolledGroup(name, inputRef.current);
            else setInternalChecked(event.target.checked);
          }
          onChange?.(event);
        }}
        aria-label={ariaLabel}
        onFocus={(event) => { setFocus(true); onFocus?.(event); }}
        onBlur={(event) => { setFocus(false); onBlur?.(event); }}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <span aria-hidden="true" style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: d, height: d, flexShrink: 0, boxSizing: 'border-box', background: radioBg,
        border: `1.5px solid ${radioBorder}`,
        borderRadius: 'var(--radius-pill)',
        boxShadow: activeFocus ? '0 0 0 4px var(--color-semantic-focus-ring)' : 'none',
        transition: 'border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      }}>
        {visualChecked && <span style={{ width: dot, height: dot, borderRadius: '50%', background: radioDot }} />}
      </span>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}
