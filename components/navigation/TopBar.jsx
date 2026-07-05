import React from 'react';

/**
 * LK ROBOTICS — TopBar
 * The top app bar: a brand slot (left), an optional nav region (children), and
 * an actions slot (right). Hairline base rule on a card surface; `sticky` pins
 * it with a frosted blur; `dark` renders the navy masthead variant. Compose nav
 * with Link / TextButton / Tabs and actions with Button / IconButton.
 */
export function TopBar({ brand, children, actions, navAlign = 'start', sticky = false, bordered = true, dark = false, height = 64, style, ...rest }) {
  return (
    <header
      style={{
        position: sticky ? 'sticky' : 'static', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 20,
        height, paddingInline: 'clamp(16px, 4vw, 32px)', boxSizing: 'border-box',
        background: dark ? 'var(--surface-inverse)' : (sticky ? 'color-mix(in srgb, var(--surface-card) 88%, transparent)' : 'var(--surface-card)'),
        color: dark ? 'var(--text-on-inverse)' : 'var(--text-body)',
        borderBottom: bordered ? `1px solid ${dark ? 'rgba(255,255,255,0.10)' : 'var(--border-subtle)'}` : 'none',
        backdropFilter: sticky ? 'saturate(150%) blur(8px)' : 'none',
        WebkitBackdropFilter: sticky ? 'saturate(150%) blur(8px)' : 'none',
        fontFamily: 'var(--font-sans)', ...style,
      }}
      {...rest}
    >
      {brand != null && <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{brand}</div>}
      {children != null
        ? <nav style={{ display: 'flex', alignItems: 'center', alignSelf: 'stretch', gap: 4, flex: 1, minWidth: 0, justifyContent: navAlign === 'center' ? 'center' : 'flex-start' }}>{children}</nav>
        : <div style={{ flex: 1 }} />}
      {actions != null && <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>{actions}</div>}
    </header>
  );
}
