import React from 'react';

const TopBarToneContext = React.createContext('light');

/**
 * LK ROBOTICS — TopBar
 * The top app bar: a brand slot (left), an optional nav region (children), and
 * an actions slot (right). Hairline base rule on a card surface; `sticky` pins
 * it with a frosted blur; `dark` renders the navy masthead variant. Compose nav
 * with TopBarNavItem / Link / Tabs and actions with Button / IconButton.
 */
export function TopBar({ brand, children, actions, navAlign = 'start', sticky = false, bordered = true, dark = false, height = 64, style, ...rest }) {
  const tone = dark ? 'dark' : 'light';

  return (
    <header
      style={{
        position: sticky ? 'sticky' : 'static', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 20px)',
        width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'hidden',
        height, paddingInline: 'clamp(16px, 4vw, 32px)', boxSizing: 'border-box',
        background: dark ? 'linear-gradient(135deg, var(--lk-navy-from), var(--lk-navy-to))' : (sticky ? 'color-mix(in srgb, var(--surface-card) 88%, transparent)' : 'var(--surface-card)'),
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
        ? (
          <TopBarToneContext.Provider value={tone}>
            <nav style={{ display: 'flex', alignItems: 'center', alignSelf: 'stretch', gap: 4, flex: '1 1 auto', minWidth: 0, overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', justifyContent: navAlign === 'center' ? 'safe center' : 'flex-start' }}>{children}</nav>
          </TopBarToneContext.Provider>
        )
        : <div style={{ flex: 1 }} />}
      {actions != null && <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>{actions}</div>}
    </header>
  );
}

/**
 * LK ROBOTICS — TopBarNavItem
 * TopBar navigation item with active underline and optional hover/focus menu.
 * It reads the parent TopBar tone so the same item works in light and navy
 * masthead variants.
 */
export function TopBarNavItem({ children, active = false, href, menuItems, menuTheme = 'light', style, onClick, ...rest }) {
  const tone = React.useContext(TopBarToneContext);
  const onDark = tone === 'dark';
  const [hover, setHover] = React.useState(false);
  const [focusWithin, setFocusWithin] = React.useState(false);
  const [clickOpen, setClickOpen] = React.useState(false);
  const hasMenu = !!menuItems?.length;
  const open = hasMenu && (hover || focusWithin || clickOpen);
  const activeOrHover = active || hover || focusWithin || clickOpen;
  const Comp = href ? 'a' : 'button';

  const fg = active
    ? (onDark ? '#fff' : 'var(--lk-accent-ink)')
    : activeOrHover
      ? (onDark ? '#fff' : 'var(--label-strong)')
      : (onDark ? 'rgba(255,255,255,0.66)' : 'var(--label-alternative)');

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignSelf: 'stretch', ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusWithin(false);
          setClickOpen(false);
        }
      }}
      {...rest}
    >
      <Comp
        href={href}
        type={href ? undefined : 'button'}
        aria-current={active ? 'page' : undefined}
        aria-haspopup={hasMenu ? 'menu' : undefined}
        aria-expanded={hasMenu ? open : undefined}
        onClick={(event) => {
          if (hasMenu) {
            event.preventDefault();
            setClickOpen((value) => !value);
          }
          onClick && onClick(event);
        }}
        onFocus={() => setFocusWithin(true)}
        onBlur={(event) => {
          if (!event.currentTarget.parentElement?.contains(event.relatedTarget)) {
            setFocusWithin(false);
            setClickOpen(false);
          }
        }}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          alignSelf: 'stretch',
          padding: '0 14px',
          border: 'none',
          background: 'transparent',
          color: fg,
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          fontSize: 14.5,
          fontWeight: 700,
          letterSpacing: 0,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          transition: 'color var(--dur-fast) var(--ease-out)',
        }}
      >
        {children}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 14,
            right: 14,
            bottom: 0,
            height: 2.5,
            borderRadius: '2px 2px 0 0',
            background: onDark ? 'var(--lk-accent)' : 'var(--lk-accent-ink)',
            transform: activeOrHover ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'center',
            transition: 'transform var(--dur-fast) var(--ease-out)',
          }}
        />
      </Comp>

      {menuItems?.length ? (
        <div
          role="menu"
          data-theme={menuTheme}
          className={`theme-${menuTheme}`}
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            zIndex: 60,
            minWidth: 176,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: 8,
            background: 'var(--surface-card)',
            border: '1px solid var(--line-normal)',
            borderRadius: 14,
            boxShadow: 'var(--shadow-md)',
            opacity: open ? 1 : 0,
            visibility: open ? 'visible' : 'hidden',
            transform: open ? 'translate(-50%, 0)' : 'translate(-50%, 4px)',
            transition: 'opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), visibility 0s linear',
          }}
        >
          {menuItems.map((item) => {
            const ItemComp = item.href ? 'a' : 'button';
            return (
              <ItemComp
                key={item.label}
                href={item.href}
                type={item.href ? undefined : 'button'}
                role="menuitem"
                onClick={item.onClick}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 12px',
                  border: 'none',
                  borderRadius: 10,
                  background: 'transparent',
                  color: 'var(--label-normal)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: 'left',
                  textDecoration: 'none',
                }}
                onMouseEnter={(event) => { event.currentTarget.style.background = 'var(--bw-mist)'; }}
                onMouseLeave={(event) => { event.currentTarget.style.background = 'transparent'; }}
              >
                {item.label}
              </ItemComp>
            );
          })}
        </div>
      ) : null}
    </span>
  );
}
