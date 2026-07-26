import React from 'react';
import { Icon } from '../icon/Icon.jsx';

/**
 * LK ROBOTICS — Checkbox
 * 6px rounded square that fills with the LK signal ink + white check when on.
 * A visually hidden native `<input type="checkbox">` wrapped by its own
 * `<label>` (the same structure as Radio) owns state, keyboard and name
 * semantics; the square next to it is a decorative `aria-hidden` indicator.
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
  name,
  value,
  labelStyle,
  style,
  id,
  'aria-label': ariaLabel,
  onFocus,
  onBlur,
  onKeyDown,
  ...rest
}) {
  const inputRef = React.useRef(null);
  const stateChecked = state === 'checked' ? true : state === 'unchecked' ? false : undefined;
  const isControlled = checked !== undefined || stateChecked !== undefined;
  const [internal, setInternal] = React.useState(stateChecked ?? !!defaultChecked);
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const on = checked !== undefined ? checked : stateChecked !== undefined ? stateChecked : internal;
  const isMark = variant === 'mark';
  /* 네이티브 indeterminate는 checked와 독립이므로 on 여부와 무관하게 mixed를 노출한다. */
  const mixed = !isMark && (indeterminate || state === 'indeterminate');
  const activeHover = hover || interaction === 'hovered';
  const activeFocus = focus || interaction === 'focused';
  const disabledState = disabled || disable || interaction === 'inactive';
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size;
  const handleChange = (event) => {
    if (disabledState) {
      event.target.checked = on;
      return;
    }
    const next = event.target.checked;
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const d = isMark ? (normalizedSize === 'sm' ? 20 : 24) : (normalizedSize === 'sm' ? 16 : 18);
  /* 시각 박스는 그대로 두고 네이티브 입력만 24px까지 넓혀 WCAG 2.5.8 타깃 크기를 만족시킨다. */
  const hitPad = Math.max(0, (24 - d) / 2);
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

  /* 사용자 클릭은 DOM indeterminate 플래그를 지우므로 렌더마다 다시 맞춘다. */
  React.useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = mixed;
  });

  return (
    <label data-disabled={disabledState ? "" : undefined}
      htmlFor={id}
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
      <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, lineHeight: 0 }}>
        <input
          ref={inputRef}
          type="checkbox"
          {...rest}
          role="checkbox"
          id={id}
          name={name}
          value={value}
          checked={on}
          disabled={disabledState}
          aria-checked={mixed ? 'mixed' : on}
          aria-disabled={disabledState ? true : undefined}
          aria-label={ariaLabel}
          onChange={handleChange}
          onFocus={(event) => { setFocus(true); onFocus?.(event); }}
          onBlur={(event) => { setFocus(false); onBlur?.(event); }}
          onKeyDown={onKeyDown}
          style={{
            position: 'absolute', top: -hitPad, left: -hitPad,
            width: d + hitPad * 2, height: d + hitPad * 2,
            margin: 0, padding: 0, opacity: 0, cursor: 'inherit',
          }}
        />
        <span aria-hidden="true" style={controlStyle}>
          {(isMark || (on && !mixed)) && (
            <Icon name="check" size={iconSize} color={isMark ? 'currentColor' : checkStroke} aria-hidden="true" />
          )}
          {mixed && <span style={{ width: d - 8, height: 2, borderRadius: 'var(--radius-pill)', background: checkStroke }} />}
        </span>
      </span>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}
