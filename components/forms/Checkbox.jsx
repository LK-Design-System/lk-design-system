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
  indeterminate = false,
  onChange,
  variant = 'box',
  size = 'md',
  status = 'normal',
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
  const stateChecked = state === 'checked' ? true : state === 'unchecked' ? false : undefined;
  const isControlled = checked !== undefined || stateChecked !== undefined;
  const [internal, setInternal] = React.useState(stateChecked ?? !!defaultChecked);
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const on = checked !== undefined ? checked : stateChecked !== undefined ? stateChecked : internal;
  const isMark = variant === 'mark';
  const mixed = !isMark && (indeterminate || state === 'indeterminate') && !on;
  const activeHover = hover || interaction === 'hovered';
  const activeFocus = focus || interaction === 'focused';
  const disabledState = disabled || disable || interaction === 'inactive';
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size;
  const toggle = () => {
    if (disabledState) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  const d = isMark ? (normalizedSize === 'sm' ? 18 : 22) : (normalizedSize === 'sm' ? 16 : 18);
  const iconSize = isMark ? (normalizedSize === 'sm' ? 14 : 17) : (normalizedSize === 'sm' ? 11 : 13);
  const markTone = status === 'negative' ? 'var(--color-danger)' : 'var(--lk-accent-ink)';
  const markIdleColor = activeHover || activeFocus ? 'var(--label-neutral)' : 'var(--bw-gray-300)';
  const boxBackground = disabledState
    ? (on || mixed ? 'var(--fill-strong)' : 'var(--fill-normal)')
    : on || mixed ? 'var(--lk-accent-ink)' : activeHover ? 'var(--fill-normal)' : 'var(--bw-white)';
  const boxBorder = disabledState
    ? 'var(--line-neutral)'
    : on || mixed ? 'var(--lk-accent-ink)' : activeHover || activeFocus ? 'var(--border-strong)' : 'var(--bw-border)';
  const checkStroke = disabledState ? 'var(--label-disable)' : 'var(--text-on-signal)';
  const controlStyle = isMark
    ? {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: d, height: d, flexShrink: 0, boxSizing: 'border-box',
        color: disabledState ? 'var(--label-disable)' : on ? markTone : markIdleColor,
        background: disabledState ? 'var(--fill-normal)' : on ? 'var(--lk-accent-tint-2)' : activeHover ? 'var(--fill-normal)' : 'transparent',
        border: '0',
        borderRadius: 'var(--radius-pill)',
        boxShadow: activeFocus ? '0 0 0 4px var(--focus-ring)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        outline: 'none',
      }
    : {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: d, height: d, flexShrink: 0, boxSizing: 'border-box',
        background: boxBackground,
        border: `1.5px solid ${boxBorder}`,
        borderRadius: 'var(--radius-5)',
        boxShadow: activeFocus ? '0 0 0 4px var(--focus-ring)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      };

  return (
    <label
      htmlFor={id}
      onClick={toggle}
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
      <span
        role="checkbox"
        aria-checked={mixed ? 'mixed' : on}
        aria-disabled={disabledState ? true : undefined}
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : isMark ? 'check mark' : 'checkbox')}
        id={id}
        tabIndex={disabledState ? -1 : 0}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } }}
        style={controlStyle}
        {...rest}
      >
        {(on || isMark) && (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={isMark ? 'currentColor' : checkStroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
        {mixed && <span style={{ width: d - 8, height: 2, borderRadius: 999, background: checkStroke }} />}
      </span>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}
