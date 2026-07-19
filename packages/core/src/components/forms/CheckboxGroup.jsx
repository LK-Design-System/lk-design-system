import React from 'react';
import { Checkbox } from './Checkbox.jsx';

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
          <Checkbox
            key={o.value}
            checked={on}
            disabled={o.disabled}
            onChange={() => toggle(o.value)}
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
