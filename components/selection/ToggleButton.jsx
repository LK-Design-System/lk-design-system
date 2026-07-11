import React from 'react';

/**
 * LK ROBOTICS — ToggleButton
 * A press-and-hold state button — icon and/or label that stays "on". Pressed =
 * cyan wash + signal-ink; rest = hairline. Good for map layers, view options,
 * bookmark-style toggles. Controlled (`pressed`) or uncontrolled.
 */
export function ToggleButton({
  children,
  pressed,
  defaultPressed,
  onChange,
  icon,
  size = 'md',
  disabled = false,
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const isControlled = pressed !== undefined;
  const [internal, setInternal] = React.useState(!!defaultPressed);
  const on = isControlled ? pressed : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  const h = size === 'sm' ? 36 : 44;
  const iconOnly = children == null;
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={ariaLabel ?? (iconOnly ? '토글' : undefined)}
      disabled={disabled}
      onClick={toggle}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        height: h, width: iconOnly ? h : undefined, padding: iconOnly ? 0 : '0 16px',
        background: on ? 'var(--color-semantic-primary-surface-strong)' : 'var(--color-semantic-background-elevated-normal)',
        border: `1px solid ${on ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-solid-normal)'}`,
        borderRadius: 'var(--radius-md)', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, fontFamily: 'var(--font-sans)', fontSize: 15,
        fontWeight: 'var(--fw-semibold)', letterSpacing: 0,
        color: on ? 'var(--color-semantic-primary-heavy)' : 'var(--color-semantic-label-neutral)',
        transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
        whiteSpace: 'nowrap', ...style,
      }}
      {...rest}
    >
      {icon}
      {children != null && <span>{children}</span>}
    </button>
  );
}
