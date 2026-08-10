import React from 'react';
import { Checkbox } from './Checkbox.jsx';
import { useResolvedControlSize } from '../internal/component-density.js';

/**
 * LK ROBOTICS — CheckboxGroup
 * A multi-select checkbox set (signal-ink fill + white check when on). Value is
 * an array of selected option values. Controlled (`value`) or uncontrolled.
 */
export function CheckboxGroup({ options = [], value, defaultValue = [], onChange, direction = 'column', size, style, ...rest }) {
  const resolvedSize = useResolvedControlSize(size);
  const compact = resolvedSize === 'sm' || resolvedSize === 'small';
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
    <div role="group" data-size={compact ? 'sm' : 'md'} style={{ display: 'flex', flexDirection: direction === 'row' ? 'row' : 'column', gap: direction === 'row' ? (compact ? 16 : 20) : (compact ? 12 : 14), flexWrap: 'wrap', ...style }} {...rest}>
      {norm.map((o) => {
        const on = Array.isArray(val) && val.includes(o.value);
        return (
          <Checkbox
            key={o.value}
            value={o.value}
            checked={on}
            disabled={o.disabled}
            size={resolvedSize}
            onChange={() => toggle(o.value)}
            style={{ alignItems: 'flex-start' }}
            label={(
              <span>
              <span style={{ fontSize: compact ? 'var(--label1-size)' : 'var(--body2-size)', lineHeight: compact ? 'var(--label1-line)' : 'var(--body2-line)', fontWeight: 'var(--fw-semibold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)' }}>{o.label}</span>
              {o.description != null && <span style={{ display: 'block', marginTop: 'var(--space-0-5)', fontSize: 'var(--label2-size)', color: 'var(--color-semantic-label-alternative)' }}>{o.description}</span>}
              </span>
            )}
          />
        );
      })}
    </div>
  );
}
