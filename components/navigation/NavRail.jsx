import React from 'react';

/**
 * LK ROBOTICS — NavRail
 * A vertical icon+label navigation rail (desktop side nav). The active item
 * takes the cyan wash + signal ink. Pass `items` as `{ value, label, icon }`.
 * Controlled (`value`) or uncontrolled (`defaultValue`).
 */
export function NavRail({ items = [], value, defaultValue, onChange, style, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : (items[0] && items[0].value));
  const val = isControlled ? value : internal;
  const pick = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };
  return (
    <nav style={{ display: 'inline-flex', flexDirection: 'column', gap: 6, padding: 10, background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-xl)', ...style }} {...rest}>
      {items.map((o) => {
        const active = o.value === val;
        return (
          <button
            key={o.value} type="button" aria-current={active ? 'page' : undefined} onClick={() => pick(o.value)} title={typeof o.label === 'string' ? o.label : undefined}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, width: 68, height: 60, border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', background: active ? 'var(--color-semantic-primary-surface-strong)' : 'transparent', color: active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-alternative)', transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)' }}
          >
            {o.icon}
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)' }}>{o.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
