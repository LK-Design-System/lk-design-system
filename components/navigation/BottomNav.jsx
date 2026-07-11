import React from 'react';

/**
 * LK ROBOTICS — BottomNav
 * Mobile bottom tab bar: an even row of icon + label tabs on white with a
 * hairline top. The active tab takes the signal ink. Pass `items` as
 * `{ value, label, icon }` (icon is a node, e.g. <Icon name="home" />).
 * Controlled (`value`) or uncontrolled (`defaultValue`).
 */
export function BottomNav({ items = [], value, defaultValue, onChange, style, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : (items[0] && items[0].value));
  const val = isControlled ? value : internal;
  const pick = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };
  return (
    <nav style={{ display: 'flex', alignItems: 'stretch', background: 'var(--color-semantic-background-elevated-normal)', borderTop: '1px solid var(--color-semantic-line-solid-normal)', ...style }} {...rest}>
      {items.map((o) => {
        const active = o.value === val;
        return (
          <button
            key={o.value}
            type="button"
            aria-current={active ? 'page' : undefined}
            onClick={() => pick(o.value)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: '9px 4px', minHeight: 58, border: 'none', background: 'transparent', cursor: 'pointer',
              color: active ? 'var(--color-semantic-primary-heavy)' : 'var(--color-semantic-label-alternative)',
              transition: 'color var(--dur-fast) var(--ease-out)',
            }}
          >
            {o.icon}
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--caption2-size)', fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)', letterSpacing: 0 }}>{o.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
