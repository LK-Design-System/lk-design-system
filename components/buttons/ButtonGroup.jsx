import React from 'react';

/**
 * LK ROBOTICS — ButtonGroup
 * A connected, bordered toggle group (view/mode switches). Single-select by
 * default; `multiple` allows several. Active segments take the cyan wash +
 * signal ink. Distinct from SegmentedControl's filled-track look.
 */
export function ButtonGroup({ options = [], value, defaultValue, onChange, size = 'md', multiple = false, style, ...rest }) {
  const norm = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : (multiple ? [] : (norm[0] && norm[0].value)));
  const val = isControlled ? value : internal;
  const isActive = (v) => (multiple ? Array.isArray(val) && val.includes(v) : val === v);
  const pick = (v) => {
    let next;
    if (multiple) { const arr = Array.isArray(val) ? val : []; next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]; }
    else next = v;
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const h = size === 'sm' ? 36 : 44;
  const fs = size === 'sm' ? 14 : 15;
  return (
    <div role="group" style={{ display: 'inline-flex', ...style }} {...rest}>
      {norm.map((o, i) => {
        const active = isActive(o.value);
        const first = i === 0;
        const last = i === norm.length - 1;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => pick(o.value)}
            style={{
              height: h, padding: '0 16px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: fs,
              fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-semibold)', letterSpacing: 0,
              color: active ? 'var(--lk-accent-ink)' : 'var(--label-neutral)',
              background: active ? 'var(--lk-accent-tint-2)' : 'var(--bw-white)',
              border: `1px solid ${active ? 'var(--lk-accent-ink)' : 'var(--bw-border)'}`,
              marginLeft: first ? 0 : -1, zIndex: active ? 1 : 0,
              borderTopLeftRadius: first ? 'var(--radius-md)' : 0, borderBottomLeftRadius: first ? 'var(--radius-md)' : 0,
              borderTopRightRadius: last ? 'var(--radius-md)' : 0, borderBottomRightRadius: last ? 'var(--radius-md)' : 0,
              transition: 'var(--component-button-transition)',
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
