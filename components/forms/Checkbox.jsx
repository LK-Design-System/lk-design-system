import React from 'react';
import { Icon } from '../icon/Icon.jsx';

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
  const d = isMark ? (normalizedSize === 'sm' ? 20 : 24) : (normalizedSize === 'sm' ? 16 : 18);
  const iconSize = isMark ? d : (normalizedSize === 'sm' ? 14 : 16);
  const markTone = status === 'negative' ? 'var(--color-semantic-status-negative)' : 'var(--color-semantic-primary-normal)';
  const markIdleColor = activeHover || activeFocus ? 'var(--color-semantic-label-neutral)' : 'var(--color-semantic-interaction-inactive)';
  const boxBackground = disabledState
    ? (on || mixed ? 'var(--color-semantic-fill-strong)' : 'var(--color-semantic-fill-normal)')
    : on || mixed ? 'var(--color-semantic-primary-normal)' : activeHover ? 'var(--color-semantic-fill-normal)' : 'var(--color-semantic-background-elevated-normal)';
  const boxBorder = disabledState
    ? 'var(--color-semantic-line-normal-neutral)'
    : on || mixed ? 'var(--color-semantic-primary-normal)' : activeHover || activeFocus ? 'var(--color-semantic-line-solid-normal)' : 'var(--color-semantic-line-solid-normal)';
  const checkStroke = disabledState ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-static-white)';
  const controlStyle = isMark
    ? {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: d, height: d, flexShrink: 0, boxSizing: 'border-box',
        color: disabledState ? 'var(--color-semantic-label-disable)' : on ? markTone : markIdleColor,
        background: 'transparent',
        border: '0',
        borderRadius: 'var(--radius-pill)',
        boxShadow: activeFocus ? '0 0 0 4px var(--color-semantic-focus-ring)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        outline: 'none',
      }
    : {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: d, height: d, flexShrink: 0, boxSizing: 'border-box',
        background: boxBackground,
        border: `1.5px solid ${boxBorder}`,
        borderRadius: 'var(--radius-5)',
        boxShadow: activeFocus ? '0 0 0 4px var(--color-semantic-focus-ring)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      };

  return (
    <label data-disabled={disabledState ? "" : undefined}
      htmlFor={id}
      onClick={toggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--component-input-gap)',
        cursor: disabledState ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-sans)', fontSize: normalizedSize === 'sm' ? 'var(--label1-size)' : '15px', letterSpacing: 0, color: disabledState ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-brand-ink)',
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
          <Icon name="check" size={iconSize} color={isMark ? 'currentColor' : checkStroke} aria-hidden="true" />
        )}
        {mixed && <span style={{ width: d - 8, height: 2, borderRadius: 'var(--radius-pill)', background: checkStroke }} />}
      </span>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}
