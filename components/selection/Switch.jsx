import React from 'react';

/**
 * LK ROBOTICS — Switch
 * Instant on/off toggle. The track fills with the LK signal ink when on and
 * the knob slides with the house emphasized ease — calm, no bounce. Track
 * geometry (52×32 / 40×24), LK identity (steel-azure fill, navy-tinted focus).
 * A visually hidden native `<input type="checkbox" role="switch">` wrapped by
 * its own `<label>` owns name, value and keyboard semantics; the track is a
 * decorative `aria-hidden` indicator.
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
  readOnly = false,
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
  const stateChecked = state === 'checked' || state === 'on' ? true : state === 'unchecked' || state === 'off' ? false : undefined;
  const isControlled = checked !== undefined || stateChecked !== undefined;
  const [internal, setInternal] = React.useState(stateChecked ?? !!defaultChecked);
  const [focus, setFocus] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const on = checked !== undefined ? checked : stateChecked !== undefined ? stateChecked : internal;
  const disabledState = disabled || disable || interaction === 'inactive';
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size;
  const activeFocus = focus || forcedFocus || interaction === 'focused';
  const activeHover = !readOnly && (hover || active || interaction === 'hovered');
  const toggle = () => {
    if (disabledState || readOnly) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  const handleChange = (event) => {
    if (disabledState || readOnly) {
      /* readOnly는 포커스를 유지하되 값 변경만 막는다 — 네이티브 checkbox는 readonly를 무시하므로 되돌린다. */
      event.target.checked = on;
      return;
    }
    const next = event.target.checked;
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const d = normalizedSize === 'sm' ? { w: 40, h: 24, k: 18, p: 3, tx: 16 } : { w: 52, h: 32, k: 24, p: 4, tx: 20 };
  const offBg = platform === 'ios' ? 'var(--color-semantic-fill-strong)' : 'var(--color-semantic-interaction-inactive)';
  const trackBg = disabledState ? (on ? 'var(--color-semantic-fill-strong)' : 'var(--color-semantic-fill-normal)') : on ? 'var(--color-semantic-primary-normal)' : activeHover ? 'var(--color-semantic-fill-strong)' : offBg;
  return (
    <label data-disabled={disabledState ? "" : undefined}
      htmlFor={id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--component-input-gap)',
        cursor: disabledState ? 'not-allowed' : readOnly ? 'default' : 'pointer',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--body2-size)', letterSpacing: 0, color: disabledState ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)',
        ...style,
      }}
    >
      <input
        type="checkbox"
        {...rest}
        role="switch"
        id={id}
        name={name}
        value={value}
        checked={on}
        disabled={disabledState}
        aria-checked={on}
        aria-disabled={disabledState ? true : undefined}
        aria-readonly={readOnly || undefined}
        aria-label={ariaLabel}
        tabIndex={disabledState ? -1 : 0}
        onChange={handleChange}
        onFocus={(event) => { setFocus(true); onFocus?.(event); }}
        onBlur={(event) => { setFocus(false); onBlur?.(event); }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          /* Space는 네이티브 checkbox 활성화에 맡기고, Switch 계약상의 Enter만 직접 처리한다. */
          if (event.key === 'Enter') {
            event.preventDefault();
            toggle();
          }
        }}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, margin: 0 }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'relative', flexShrink: 0, width: d.w, height: d.h,
          borderRadius: 'var(--radius-pill)',
          background: trackBg,
          boxShadow: activeFocus ? '0 0 0 4px var(--color-semantic-focus-ring)' : 'none',
          transition: 'background var(--dur-base) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        }}
      >
        <span
          style={{
            position: 'absolute', top: d.p, left: d.p, width: d.k, height: d.k, borderRadius: '50%',
            background: disabledState ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-static-white)', boxShadow: platform === 'ios' ? 'var(--shadow-sm)' : 'var(--shadow-control)',
            transform: on ? `translateX(${d.tx}px)` : 'translateX(0)',
            transition: 'transform var(--dur-base) var(--ease-in-out)',
          }}
        />
      </span>
      {label != null && <span style={labelStyle}>{label}</span>}
    </label>
  );
}
