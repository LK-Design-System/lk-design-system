import React from 'react';

const listStyle = { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-0-5)' };

/* 평면 items(level 기반)를 중첩 트리로 변환한다 — 더 깊은 항목은 직전 얕은 항목의 하위로. */
function buildTree(items) {
  const roots = [];
  const stack = [];
  items.forEach((item) => {
    const node = { item, children: [] };
    const level = item.level || 0;
    while (stack.length > 0 && stack[stack.length - 1].level >= level) stack.pop();
    if (stack.length === 0) roots.push(node);
    else stack[stack.length - 1].node.children.push(node);
    stack.push({ level, node });
  });
  return roots;
}

/**
 * LK ROBOTICS — Anchor
 * An in-page table-of-contents nav. Items are `{ href, label, level? }`; the
 * active item takes the signal ink + rule. Controlled (`active`) or
 * uncontrolled. Renders nested lists (`ul > li > ul`) from item levels so the
 * hierarchy is exposed to assistive tech; the nav defaults to aria-label
 * '목차' (consumer-provided aria-label wins).
 */
export function Anchor({ items = [], active, onChange, style, ...rest }) {
  const isControlled = active !== undefined;
  const [internal, setInternal] = React.useState(items[0] && items[0].href);
  const [hovered, setHovered] = React.useState(null);
  const cur = isControlled ? active : internal;

  const renderNodes = (nodes) => (
    <ul style={listStyle}>
      {nodes.map(({ item: it, children }) => {
        const on = it.href === cur;
        const hov = hovered === it.href;
        return (
          <li key={it.href} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-0-5)' }}>
            <a
              href={it.href}
              aria-current={on ? 'location' : undefined}
              onClick={() => { if (!isControlled) setInternal(it.href); onChange && onChange(it.href); }}
              onMouseEnter={() => setHovered(it.href)}
              onMouseLeave={() => setHovered(null)}
              /* 하위 레벨은 들여쓰기 + 한 단계 작은 타입으로 위계를 함께 전달한다. */
              style={{ display: 'block', padding: '7px 12px', paddingLeft: 12 + (it.level || 0) * 16, borderLeft: `2px solid ${on ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-solid-normal)'}`, color: on ? 'var(--color-semantic-label-normal)' : hov ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)', fontSize: (it.level || 0) > 0 ? 'var(--label2-size)' : 'var(--label1-size)', fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)', textDecoration: 'none', transition: 'color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)' }}
            >
              {it.label}
            </a>
            {children.length > 0 && renderNodes(children)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <nav aria-label="목차" style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {renderNodes(buildTree(items))}
    </nav>
  );
}
