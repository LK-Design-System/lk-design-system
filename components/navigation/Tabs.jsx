import React from 'react';

/**
 * LK ROBOTICS — Tabs
 * A horizontal tab bar with a signal-ink underline indicator; the active label
 * takes the ink, inactive labels sit at the alternative tone. Optional trailing
 * `count` per tab. Controlled (`value`) or uncontrolled (`defaultValue`).
 */
export function Tabs({ items = [], value, defaultValue, onChange, full = false, style, ...rest }) {
  const norm = items.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : (norm[0] && norm[0].value));
  const val = isControlled ? value : internal;
  const pick = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };
  return (
    <div role="tablist" style={{ display: 'flex', gap: full ? 0 : 24, borderBottom: '1px solid var(--bw-border)', ...style }} {...rest}>
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
              flex: full ? 1 : undefined, position: 'relative', padding: '0 2px 14px', border: 'none', background: 'transparent', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-semibold)', letterSpacing: '-0.3px',
              color: active ? 'var(--label-normal)' : 'var(--label-alternative)',
              transition: 'color var(--dur-fast) var(--ease-out)',
            }}
          >
            <span>{o.label}</span>
            {o.count != null && <span style={{ fontSize: 13, fontWeight: 'var(--fw-bold)', color: active ? 'var(--lk-accent-ink)' : 'var(--label-assistive)' }}>{o.count}</span>}
            <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2.5, borderRadius: '2px 2px 0 0', background: active ? 'var(--lk-accent-ink)' : 'transparent', transition: 'background var(--dur-fast) var(--ease-out)' }} />
          </button>
        );
      })}
    </div>
  );
}
