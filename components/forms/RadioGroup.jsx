import React from 'react';

/**
 * LK ROBOTICS — RadioGroup
 * A set of single-select radios (signal-ink dot when on). `options` are strings
 * or `{ value, label, description }`. Controlled (`value`) or uncontrolled.
 */
export function RadioGroup({ options = [], value, defaultValue, onChange, name, direction = 'column', style, ...rest }) {
  const norm = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const val = isControlled ? value : internal;
  const pick = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };
  const autoId = React.useId();
  const gname = name || autoId;
  return (
    <div role="radiogroup" style={{ display: 'flex', flexDirection: direction === 'row' ? 'row' : 'column', gap: direction === 'row' ? 20 : 14, flexWrap: 'wrap', ...style }} {...rest}>
      {norm.map((o) => {
        const on = o.value === val;
        return (
          <label key={o.value} style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 10, cursor: o.disabled ? 'not-allowed' : 'pointer', opacity: o.disabled ? 0.5 : 1, fontFamily: 'var(--font-sans)' }}>
            <input type="radio" name={gname} checked={on} disabled={o.disabled} onChange={() => pick(o.value)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
            <span style={{ marginTop: 1, flexShrink: 0, width: 20, height: 20, borderRadius: '50%', border: `2px solid ${on ? 'var(--color-semantic-primary-normal)' : 'var(--bw-gray-300)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color var(--dur-fast) var(--ease-out)' }}>
              {on && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-semantic-primary-normal)' }} />}
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
