import React from 'react';

/**
 * LK ROBOTICS — SegmentedControl
 * Compact single-select: options sit in a cool-gray track; the active segment
 * lifts to a white pill with a soft shadow. Good for view toggles (KR/EN,
 * List/Grid, 기간 필터). Controlled (`value`) or uncontrolled (`defaultValue`).
 */
export function SegmentedControl({
  options = [],
  value,
  defaultValue,
  onChange,
  variant = 'solid',
  size = 'md',
  interaction,
  full = false,
  resize,
  disabled = false,
  disable = false,
  style,
  ...rest
}) {
  const norm = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : (norm[0] && norm[0].value));
  const val = isControlled ? value : internal;
  const disabledState = disabled || disable || interaction === 'inactive';
  const pick = (v) => { if (disabledState) return; if (!isControlled) setInternal(v); onChange && onChange(v); };
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size === 'large' ? 'lg' : size;
  const h = normalizedSize === 'sm' ? 32 : normalizedSize === 'lg' ? 48 : 40;
  const fs = normalizedSize === 'sm' ? 13 : normalizedSize === 'lg' ? 16 : 14.5;
  const outlined = variant === 'outlined';
  const fill = full || resize === 'fill';
  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex', width: fill ? '100%' : undefined, justifySelf: fill ? undefined : 'start', padding: outlined ? 0 : 4, gap: outlined ? 0 : 2,
        background: outlined ? 'var(--bw-white)' : 'var(--fill-normal)',
        border: outlined ? '1px solid var(--bw-border)' : 'none',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      {norm.map((o, index) => {
        const optionInteraction = o.interaction || interaction;
        const selected = o.value === val;
        const active = selected || optionInteraction === 'active' || optionInteraction === 'active-focused';
        const activeHover = optionInteraction === 'hovered';
        const activeFocus = optionInteraction === 'focused' || optionInteraction === 'active-focused';
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => pick(o.value)}
            disabled={disabledState || o.disabled}
            style={{
              flex: fill ? 1 : undefined, height: h, padding: '0 18px', border: 'none',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              cursor: disabledState || o.disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', fontSize: fs,
              fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)', letterSpacing: 0,
              color: active ? 'var(--lk-accent-ink)' : activeFocus ? 'var(--label-normal)' : 'var(--label-alternative)',
              background: active ? (outlined ? 'var(--lk-accent-tint-2)' : 'var(--bw-white)') : activeHover || activeFocus ? 'var(--fill-normal)' : 'transparent',
              borderRadius: outlined ? 0 : 'var(--radius-sm)',
              borderLeft: outlined && index > 0 ? '1px solid var(--bw-border)' : 'none',
              boxShadow: [
                active && !outlined ? 'var(--shadow-xs)' : null,
                activeFocus ? '0 0 0 3px var(--focus-ring)' : null,
              ].filter(Boolean).join(', ') || 'none',
              opacity: disabledState || o.disabled ? 0.45 : 1,
              transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
              whiteSpace: 'nowrap',
            }}
          >
            {o.icon && <span style={{ display: 'inline-flex', flex: '0 0 auto' }}>{o.icon}</span>}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
