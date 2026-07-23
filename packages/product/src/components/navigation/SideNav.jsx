import React from 'react';
import { Tooltip } from '@lk-robotics/lds-core/components/content/Tooltip';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

const Chevron = ({ open }) => (
  <Icon name="chevron-down-small" size={14} aria-hidden="true" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }} />
);

const LIST_ITEM_STYLE = { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 };

/**
 * Collapsed-rail label surface. The wrapper stays mounted in both rail states so
 * the item control keeps its DOM identity (and focus) across collapse
 * transitions; the tooltip itself only ever opens while the rail is collapsed.
 */
function RailItemTooltip({ label, collapsed, children }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => { if (!collapsed) setOpen(false); }, [collapsed]);
  if (label == null) return children;
  return (
    <Tooltip content={label} placement="right" size="small" open={collapsed ? open : false} onOpenChange={setOpen} style={{ width: '100%' }}>
      {children}
    </Tooltip>
  );
}

/**
 * LK ROBOTICS — SideNav
 * A wide labeled dashboard sidebar: brand `header` (+ `headerCollapsed` for the
 * rail state), grouped nav `items` (icon + label + badge, `{ heading }` section
 * rows, `children` sub-menus with disclosure), optional pinned `footer`, and a
 * built-in collapse toggle (`collapsible`). Active item takes the cyan wash +
 * signal ink. Collapsed = icon rail (labels become tooltips, badges become
 * dots, headings become hairlines). Controlled or uncontrolled for both
 * `value` and `collapsed`. Compact fixed rail → `NavRail`; mobile → `BottomNav`.
 */
export function SideNav({
  items = [], value, defaultValue, onChange,
  header, headerCollapsed, footer, width = 240,
  surface = 'floating',
  collapsed, defaultCollapsed = false, onCollapsedChange, collapsedWidth = 64, overlay = false,
  renderLink, className, style, onBlur, onFocus,
  'aria-label': ariaLabel = '사이드 탐색',
  ...rest
}) {
  const isControlled = value !== undefined;
  const flat = [];
  items.forEach((i) => { if (i && !i.heading && i.value != null) { flat.push(i); (i.children || []).forEach((c) => flat.push(c)); } });
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : (flat[0] && flat[0].value));
  const val = isControlled ? value : internal;
  const pick = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };

  const colControlled = collapsed !== undefined;
  const [colInternal, setColInternal] = React.useState(defaultCollapsed || overlay);
  const col = colControlled ? collapsed : colInternal;
  const setCol = (c) => { if (!colControlled) setColInternal(c); onCollapsedChange && onCollapsedChange(c); };
  const generatedPanelId = React.useId().replace(/:/g, '');
  const panelId = `lk-sidenav-panel-${generatedPanelId}`;

  const navRef = React.useRef(null);
  const hasPopover = () => !!(navRef.current && navRef.current.querySelector('[role="menu"]'));
  const peekT = React.useRef(null);
  const pointerInside = React.useRef(false);
  const restoringFocus = React.useRef(false);
  const collapseAndRestoreFocus = () => {
    clearTimeout(peekT.current);
    const activeElement = document.activeElement;
    const activeControl = navRef.current?.contains(activeElement) ? activeElement?.closest?.('[data-sidenav-value]') : null;
    const restoreValue = activeControl?.dataset.sidenavParent || activeControl?.dataset.sidenavValue;
    restoringFocus.current = !!activeControl;
    setCol(true);
    if (!activeControl) return;
    requestAnimationFrame(() => {
      const candidates = Array.from(navRef.current?.querySelectorAll('[data-sidenav-value]') || []);
      const matchingButton = restoreValue
        ? candidates.find((button) => button.dataset.sidenavValue === restoreValue)
        : null;
      const target = matchingButton
        || (activeControl.isConnected ? activeControl : null)
        || navRef.current?.querySelector('.lk-sidenav__scroll [data-sidenav-value]:not(:disabled):not([aria-disabled="true"])');
      target?.focus();
      requestAnimationFrame(() => { restoringFocus.current = false; });
    });
  };
  const peek = (expand) => {
    clearTimeout(peekT.current);
    peekT.current = setTimeout(() => {
      if (!expand && (hasPopover() || navRef.current?.contains(document.activeElement))) return;
      setCol(!expand);
    }, expand ? 160 : 480);
  };
  React.useEffect(() => () => clearTimeout(peekT.current), []);
  React.useEffect(() => {
    if (!overlay || col) return undefined;
    const down = (e) => { if (hasPopover()) return; if (navRef.current && !navRef.current.contains(e.target)) setCol(true); };
    const key = (e) => {
      if (e.key !== 'Escape' || hasPopover()) return;
      e.preventDefault();
      collapseAndRestoreFocus();
    };
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key); };
    // The handlers only read refs plus the latest collapse state, so the
    // subscription only needs to follow the overlay/collapsed lifecycle.
  }, [overlay, col]);

  const [open, setOpen] = React.useState(() => {
    const o = {};
    items.forEach((i) => { if (i && i.children && i.children.some((c) => c.value === val)) o[i.value] = true; });
    return o;
  });

  React.useEffect(() => {
    const activeParent = items.find((item) => (
      item
      && !item.heading
      && item.children?.some((child) => child.value === val)
    ));
    if (!activeParent) return;
    setOpen((current) => (
      current[activeParent.value]
        ? current
        : { ...current, [activeParent.value]: true }
    ));
  }, [items, val]);

  const [hovKey, setHovKey] = React.useState(null);
  const hoverProps = (k) => ({ onMouseEnter: () => setHovKey(k), onMouseLeave: () => setHovKey(null) });
  const row = (active, disabled, extra, hovered) => ({
    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: col ? 'center' : 'flex-start', gap: 11,
    width: '100%', minHeight: col ? undefined : 44, padding: col ? '11px 0' : '10px 12px', boxSizing: 'border-box', border: 'none', borderRadius: 'var(--radius-lg)',
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, textAlign: 'left', textDecoration: 'none', fontFamily: 'var(--font-sans)',
    fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)',
    background: active ? 'var(--color-semantic-primary-surface-strong)' : hovered && !disabled ? 'var(--color-semantic-primary-surface-normal)' : 'transparent', color: active ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)',
    transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)', ...extra,
  });
  const labelSpan = (active, children) => (
    <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--label1-size)', fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)', letterSpacing: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</span>
  );
  const pill = (active, badge) => (
    <span style={{ flexShrink: 0, minWidth: 18, height: 18, padding: '0 6px', boxSizing: 'border-box', borderRadius: 'var(--radius-pill)', fontSize: 'var(--caption2-size)', fontWeight: 'var(--fw-bold)', lineHeight: '18px', textAlign: 'center', background: active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-primary-surface-strong)', color: active ? 'var(--color-semantic-background-elevated-normal)' : 'var(--color-semantic-label-normal)' }}>{badge}</span>
  );
  const dot = <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: 'var(--color-semantic-primary-normal)' }} />;

  const renderLeafControl = (item, { active, parentValue, ariaLabel, title, content, itemStyle }) => {
    const disabled = !!item.disabled;
    const activate = (event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      pick(item.value);
      item.onClick?.(event);
    };
    const commonProps = {
      'data-sidenav-value': item.value,
      'data-sidenav-parent': parentValue,
      'aria-label': ariaLabel,
      'aria-current': active ? 'page' : undefined,
      title,
      onClick: activate,
      ...hoverProps(item.value),
      style: itemStyle,
      children: content,
    };

    if (item.href != null) {
      const linkProps = {
        ...commonProps,
        href: disabled ? undefined : item.href,
        target: item.target,
        rel: item.rel,
        'aria-disabled': disabled || undefined,
        tabIndex: disabled ? -1 : undefined,
      };
      return renderLink ? renderLink(item, linkProps) : <a {...linkProps} />;
    }

    return <button type="button" disabled={disabled} {...commonProps} />;
  };

  const brand = col ? (headerCollapsed != null ? headerCollapsed : header) : header;

  const resolvedSurface = surface === 'docked' ? 'docked' : 'floating';
  const docked = resolvedSurface === 'docked';
  const shell = { position: 'relative', display: 'flex', flexDirection: 'column', width: col ? collapsedWidth : width, boxSizing: 'border-box', background: 'var(--color-semantic-background-elevated-normal)', border: docked ? 'none' : '1px solid var(--color-semantic-line-solid-normal)', borderInlineEnd: docked ? '1px solid var(--color-semantic-line-solid-normal)' : undefined, borderRadius: docked ? 0 : 'var(--radius-xl)', boxShadow: docked ? 'none' : undefined, padding: 10, transition: 'width var(--dur-base, 200ms) var(--ease-out), box-shadow var(--dur-base, 200ms) var(--ease-out)' };
  const sideNavStyles = `.lk-sidenav__scroll{scrollbar-width:none;-ms-overflow-style:none}.lk-sidenav__scroll::-webkit-scrollbar{display:none;width:0;height:0}@media(prefers-reduced-motion:reduce){.lk-sidenav__surface{transition-duration:0s!important;animation-duration:0s!important}}`;
  const brandRegionStyle = { position: 'relative', display: 'flex', flexDirection: col ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 24, padding: col ? '14px 10px 10px' : '14px 10px 18px' };
  const panelContent = (
    <div id={panelId} className="lk-sidenav__panel-content" data-collapsed={col ? 'true' : 'false'} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0 }}>
      <style>{sideNavStyles}</style>
      {brand != null && (
        <div className="lk-sidenav__brand" style={brandRegionStyle}>
          {brand}
        </div>
      )}
      <ul className="lk-sidenav__scroll" style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: '1 1 auto', minHeight: 0, margin: 0, padding: 0, listStyle: 'none', overflowX: col ? 'visible' : 'hidden', overflowY: col ? 'visible' : 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {items.map((o, i) => {
          if (o.heading) return col
            ? <li key={'h' + i} style={LIST_ITEM_STYLE}><div aria-hidden="true" style={{ height: 1, flexShrink: 0, background: 'var(--color-semantic-line-solid-normal)', margin: i === 0 ? '2px 12px 6px' : '10px 12px 6px' }} /></li>
            : <li key={'h' + i} style={LIST_ITEM_STYLE}><div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--caption2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)', padding: i === 0 ? '4px 12px 6px' : '14px 12px 6px' }}>{o.heading}</div></li>;

          const kids = o.children || [];
          const title = typeof o.label === 'string' ? o.label : undefined;
          const accessibleLabel = o.ariaLabel || title;

          if (kids.length > 0) {
            const isOpen = !!open[o.value];
            const childActive = kids.some((c) => c.value === val);
            const onParent = () => { if (col) { setCol(false); setOpen((s) => ({ ...s, [o.value]: true })); } else { setOpen((s) => ({ ...s, [o.value]: !s[o.value] })); } };
            return (
              <li key={o.value} style={LIST_ITEM_STYLE}>
                <RailItemTooltip label={accessibleLabel} collapsed={col}>
                  <button type="button" data-sidenav-value={o.value} aria-label={col || o.ariaLabel ? accessibleLabel : undefined} aria-expanded={col ? undefined : isOpen} disabled={o.disabled} onClick={onParent} title={col ? undefined : accessibleLabel} {...hoverProps(o.value)}
                    style={row(false, o.disabled, { color: childActive ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)' }, hovKey === o.value)}>
                    {o.icon != null && <span aria-hidden="true" style={{ flexShrink: 0, display: 'inline-flex' }}>{o.icon}</span>}
                    {!col && labelSpan(childActive, o.label)}
                    {!col && <Chevron open={isOpen} />}
                    {col && childActive && dot}
                  </button>
                </RailItemTooltip>
                {!col && isOpen && (
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '0 0 4px', padding: 0, listStyle: 'none' }}>
                    {kids.map((c) => {
                      const ca = c.value === val;
                      const childTitle = typeof c.label === 'string' ? c.label : c.ariaLabel;
                      return (
                        <li key={c.value} style={LIST_ITEM_STYLE}>
                          {renderLeafControl(c, {
                            active: ca,
                            parentValue: o.value,
                            ariaLabel: c.ariaLabel,
                            title: childTitle,
                            itemStyle: row(ca, c.disabled, { padding: '8px 12px 8px 42px' }, hovKey === c.value),
                            content: (
                              <React.Fragment>
                                <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--label2-size)', fontWeight: ca ? 'var(--fw-bold)' : 'var(--fw-medium)', letterSpacing: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.label}</span>
                                {c.badge != null && pill(ca, c.badge)}
                              </React.Fragment>
                            ),
                          })}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          }

          const active = o.value === val;
          return (
            <li key={o.value} style={LIST_ITEM_STYLE}>
              <RailItemTooltip label={accessibleLabel} collapsed={col}>
                {renderLeafControl(o, {
                  active,
                  ariaLabel: col || o.ariaLabel ? accessibleLabel : undefined,
                  title: col ? undefined : accessibleLabel,
                  itemStyle: row(active, o.disabled, null, hovKey === o.value),
                  content: (
                    <React.Fragment>
                      {o.icon != null && <span aria-hidden="true" style={{ flexShrink: 0, display: 'inline-flex' }}>{o.icon}</span>}
                      {!col && labelSpan(active, o.label)}
                      {!col && o.badge != null && pill(active, o.badge)}
                      {col && o.badge != null && dot}
                    </React.Fragment>
                  ),
                })}
              </RailItemTooltip>
            </li>
          );
        })}
      </ul>
      <div style={{ marginTop: 'auto', paddingTop: 8 }}>
        {footer != null && (
          <div style={{ paddingTop: 10, marginLeft: 2, marginRight: 2, borderTop: '1px solid var(--color-semantic-line-solid-normal)' }}>{footer}</div>
        )}
      </div>
    </div>
  );
  return (
    <nav ref={navRef} aria-label={ariaLabel} onClick={overlay && col ? (e) => { if (!e.target.closest('[data-sidenav-value], button')) setCol(false); } : undefined}
      onMouseEnter={overlay ? () => { pointerInside.current = true; peek(true); } : undefined}
      onMouseLeave={overlay ? () => { pointerInside.current = false; peek(false); } : undefined}
      onFocus={overlay ? (e) => {
        onFocus?.(e);
        if (col && !restoringFocus.current && !e.currentTarget.contains(e.relatedTarget)) {
          clearTimeout(peekT.current);
          setCol(false);
        }
      } : onFocus}
      onBlur={overlay ? (e) => { onBlur?.(e); if (!pointerInside.current && !e.currentTarget.contains(e.relatedTarget)) peek(false); } : onBlur}
      className={['lk-sidenav', !overlay && 'lk-sidenav__surface', className].filter(Boolean).join(' ')}
      style={overlay ? { position: 'relative', width: collapsedWidth, flexShrink: 0, ...style } : { ...shell, ...style }} {...rest} data-surface={resolvedSurface}>
      {overlay ? (
        /* The elevation shadow only makes sense where the expanded panel actually covers content,
           so clip it to the inline-end overhang on both surfaces instead of blooming on all sides. */
        <div className="lk-sidenav__surface" style={{ ...shell, position: 'absolute', top: 0, left: 0, height: '100%', zIndex: col ? 1 : 40, boxShadow: col ? 'none' : 'var(--shadow-lg)', clipPath: col ? undefined : 'inset(0 -120px 0 0)' }}>{panelContent}</div>
      ) : panelContent}
    </nav>
  );
}
