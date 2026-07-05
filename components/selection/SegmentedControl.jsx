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
  size = 'md',
  full = false,
  style,
  ...rest
}) {
  const norm = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : (norm[0] && norm[0].value));
  const val = isControlled ? value : internal;
  const pick = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };
  const h = size === 'sm' ? 36 : 44;
  const fs = size === 'sm' ? 14 : 15;
  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex', width: full ? '100%' : undefined, padding: 4, gap: 2,
        background: 'var(--fill-normal)', borderRadius: 'var(--radius-md)', ...style,
      }}
      {...rest}
    >
      {norm.map((o) => {
        const active = o.value === val;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => pick(o.value)}
            style={{
              flex: full ? 1 : undefined, height: h, padding: '0 18px', border: 'none',
              cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: fs,
              fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)', letterSpacing: '-0.1px',
              color: active ? 'var(--label-normal)' : 'var(--label-alternative)',
              background: active ? 'var(--bw-white)' : 'transparent',
              borderRadius: 'var(--radius-sm)', boxShadow: active ? 'var(--shadow-xs)' : 'none',
              transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
              whiteSpace: 'nowrap',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
