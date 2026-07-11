import React from 'react';

/**
 * LK ROBOTICS — CheckboxGroup
 * A multi-select checkbox set (signal-ink fill + white check when on). Value is
 * an array of selected option values. Controlled (`value`) or uncontrolled.
 */
export function CheckboxGroup({ options = [], value, defaultValue = [], onChange, direction = 'column', style, ...rest }) {
  const norm = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const val = isControlled ? value : internal;
  const toggle = (v) => {
    const arr = Array.isArray(val) ? val : [];
    const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  return (
    <div role="group" style={{ display: 'flex', flexDirection: direction === 'row' ? 'row' : 'column', gap: direction === 'row' ? 20 : 14, flexWrap: 'wrap', ...style }} {...rest}>
      {norm.map((o) => {
        const on = Array.isArray(val) && val.includes(o.value);
        return (
          <label key={o.value} style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 10, cursor: o.disabled ? 'not-allowed' : 'pointer', opacity: o.disabled ? 0.5 : 1, fontFamily: 'var(--font-sans)' }}>
            <input type="checkbox" checked={on} disabled={o.disabled} onChange={() => toggle(o.value)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
            <span style={{ marginTop: 1, flexShrink: 0, width: 20, height: 20, borderRadius: 'var(--radius-sm)', border: `1px solid ${on ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-solid-normal)'}`, background: on ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-background-elevated-normal)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)' }}>
              {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-semantic-static-white)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
            </span>
            <span>
              <span style={{ fontSize: 15, fontWeight: 'var(--fw-semibold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)' }}>{o.label}</span>
              {o.description != null && <span style={{ display: 'block', marginTop: 2, fontSize: 13, color: 'var(--color-semantic-label-alternative)' }}>{o.description}</span>}
            </span>
          </label>
        );
      })}
    </div>
  );
}
