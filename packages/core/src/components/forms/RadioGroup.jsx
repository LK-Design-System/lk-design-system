import React from 'react';
import { Radio } from './Radio.jsx';

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
          <Radio
            key={o.value}
            name={gname}
            value={o.value}
            checked={on}
            disabled={o.disabled}
            onChange={() => pick(o.value)}
            style={{ alignItems: 'flex-start' }}
            label={(
              <span>
              <span style={{ fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-semibold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)' }}>{o.label}</span>
              {o.description != null && <span style={{ display: 'block', marginTop: 2, fontSize: 'var(--label2-size)', color: 'var(--color-semantic-label-alternative)' }}>{o.description}</span>}
              </span>
            )}
          />
        );
      })}
    </div>
  );
}
