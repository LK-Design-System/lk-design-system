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
  const [hovered, setHovered] = React.useState(null);
  const cur = isControlled ? active : internal;
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {items.map((it) => {
        const on = it.href === cur;
        const hov = hovered === it.href;
        return (
          <a
            key={it.href} href={it.href}
            aria-current={on ? 'location' : undefined}
            onClick={() => { if (!isControlled) setInternal(it.href); onChange && onChange(it.href); }}
            onMouseEnter={() => setHovered(it.href)}
            onMouseLeave={() => setHovered(null)}
            /* 하위 레벨은 들여쓰기 + 한 단계 작은 타입으로 위계를 함께 전달한다. */
            style={{ display: 'block', padding: '7px 12px', paddingLeft: 12 + (it.level || 0) * 16, borderLeft: `2px solid ${on ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-solid-normal)'}`, color: on ? 'var(--color-semantic-label-normal)' : hov ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)', fontSize: (it.level || 0) > 0 ? 'var(--label2-size)' : 'var(--label1-size)', fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)', textDecoration: 'none', transition: 'color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)' }}
          >
            {it.label}
          </a>
        );
      })}
    </nav>
  );
}
