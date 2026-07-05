import React from 'react';

/**
 * LK ROBOTICS — Anchor
 * An in-page table-of-contents nav. Items are `{ href, label, level? }`; the
 * active item takes the signal ink + rule. Controlled (`active`) or
 * uncontrolled.
 */
export function Anchor({ items = [], active, onChange, style, ...rest }) {
  const isControlled = active !== undefined;
  const [internal, setInternal] = React.useState(items[0] && items[0].href);
  const cur = isControlled ? active : internal;
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {items.map((it) => {
        const on = it.href === cur;
        return (
          <a
            key={it.href} href={it.href}
            onClick={() => { if (!isControlled) setInternal(it.href); onChange && onChange(it.href); }}
            style={{ display: 'block', padding: '7px 12px', paddingLeft: 12 + (it.level || 0) * 14, borderLeft: `2px solid ${on ? 'var(--lk-accent-ink)' : 'var(--bw-border)'}`, color: on ? 'var(--lk-accent-ink)' : 'var(--label-alternative)', fontSize: 14, fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)', textDecoration: 'none', transition: 'color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)' }}
          >
            {it.label}
          </a>
        );
      })}
    </nav>
  );
}
