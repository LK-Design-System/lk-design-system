import React from 'react';
import { Tooltip } from '@lk-design-system/lds-core/components/content/Tooltip';
import { Icon } from '@lk-design-system/lds-core/components/icon/Icon';
import { useLightDismiss } from '@lk-design-system/lds-core/components/overlay/anchored-overlay';
import { componentVars, partClassName, partStyle, useMergedRefs } from '@lk-design-system/lds-core/components/internal/surface';

const Chevron = ({ open }) => (
  <Icon name="chevron-down-small" size={14} aria-hidden="true" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }} />
);

const LIST_ITEM_STYLE = { display: 'flex', flexDirection: 'column', gap: 'var(--space-0-5)', minWidth: 0 };

function cssLength(value) {
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Collapsed-rail label surface. Persistent rails keep the wrapper mounted in
 * both states so the item control retains its DOM identity (and focus) across
 * collapse transitions. Overlay rails expand on pointer/focus intent instead,
 * so they omit this competing tooltip surface entirely.
 */
function RailItemTooltip({ label, collapsed, enabled = true, children }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => { if (!enabled || !collapsed) setOpen(false); }, [collapsed, enabled]);
  if (!enabled || label == null) return children;
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
 * product-shell-owned collapse control. Active item takes the cyan wash +
 * signal ink. Collapsed = icon rail (labels become tooltips, badges become
 * dots, headings become hairlines). Controlled or uncontrolled for both
 * `value` and `collapsed`; SideNav never renders the collapse control itself.
 * Compact fixed rail → `NavRail`; mobile → `BottomNav`.
 */
export const SideNav = React.forwardRef(function SideNav({
  items = [], value, defaultValue, onChange,
  header, headerCollapsed, footer, width = 240,
  brandAlign = 'center', footerGap = 'var(--space-2)',
  surface = 'floating',
  collapsed, defaultCollapsed = false, onCollapsedChange, collapsedWidth = 64, overlay = false,
  autoExpandActiveGroup = true,
  multiple = true,
  renderLink, className, style, classNames, styles, vars,
  onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
  'aria-label': ariaLabel = '사이드 탐색',
  ...rest
}, forwardedRef) {
  const isControlled = value !== undefined;
  const flat = [];
  items.forEach((i) => { if (i && !i.heading && i.value != null) { flat.push(i); (i.children || []).forEach((c) => flat.push(c)); } });
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : (flat[0] && flat[0].value));
  const val = isControlled ? value : internal;
  const pick = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };

  const colControlled = collapsed !== undefined;
  const persistentCollapsedRef = React.useRef(defaultCollapsed);
  const previousOverlayRef = React.useRef(overlay);
  const [colInternal, setColInternal] = React.useState(defaultCollapsed || overlay);
  const col = colControlled ? collapsed : colInternal;
  const setCol = (c) => {
    if (!colControlled) {
      setColInternal(c);
      if (!overlay) persistentCollapsedRef.current = c;
    }
    onCollapsedChange && onCollapsedChange(c);
  };
  const generatedPanelId = React.useId().replace(/:/g, '');
  const panelId = `lk-sidenav-panel-${generatedPanelId}`;

  const navRef = React.useRef(null);
  const mergedNavRef = useMergedRefs(navRef, forwardedRef);
  const hasPopover = () => !!(navRef.current && navRef.current.querySelector('[role="menu"]'));
  const peekT = React.useRef(null);
  const pointerInside = React.useRef(false);
  const restoringFocus = React.useRef(false);
  React.useEffect(() => {
    const previousOverlay = previousOverlayRef.current;
    previousOverlayRef.current = overlay;
    if (colControlled || previousOverlay === overlay) return;
    clearTimeout(peekT.current);
    setColInternal(overlay ? true : persistentCollapsedRef.current);
  }, [colControlled, overlay]);
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
  // An expanded overlay rail is a light-dismiss surface, so the shared engine
  // owns the outside press and the stack-aware Escape. Two things stay local:
  // a menu a consumer nested in the rail is invisible to the engine's stack, so
  // `shouldDismiss` vetoes while one is open; and the rail restores focus to a
  // rail item chosen *after* the collapse, which `getTrigger` resolves too early
  // to express.
  useLightDismiss({
    open: overlay && !col,
    rootRef: navRef,
    shouldDismiss: () => !hasPopover(),
    onDismiss: (reason) => { if (reason === 'escape') collapseAndRestoreFocus(); else setCol(true); },
  });

  const [open, setOpen] = React.useState(() => {
    if (!autoExpandActiveGroup) return {};
    const activeParent = items.find((item) => (
      item
      && !item.heading
      && item.children?.some((child) => child.value === val)
    ));
    return activeParent ? { [activeParent.value]: true } : {};
  });

  const openGroup = (groupValue) => setOpen((current) => (
    multiple ? { ...current, [groupValue]: true } : { [groupValue]: true }
  ));
  const toggleGroup = (groupValue) => setOpen((current) => {
    if (current[groupValue]) return { ...current, [groupValue]: false };
    return multiple ? { ...current, [groupValue]: true } : { [groupValue]: true };
  });

  React.useEffect(() => {
    if (!autoExpandActiveGroup) return;
    const activeParent = items.find((item) => (
      item
      && !item.heading
      && item.children?.some((child) => child.value === val)
    ));
    if (!activeParent) return;
    setOpen((current) => (
      current[activeParent.value]
        ? current
        : multiple ? { ...current, [activeParent.value]: true } : { [activeParent.value]: true }
    ));
  }, [autoExpandActiveGroup, items, multiple, val]);

  React.useEffect(() => {
    if (multiple) return;
    setOpen((current) => {
      const opened = Object.keys(current).filter((key) => current[key]);
      if (opened.length <= 1) return current;
      const activeParent = items.find((item) => (
        item
        && !item.heading
        && item.children?.some((child) => child.value === val)
      ));
      const keep = activeParent && current[activeParent.value] ? activeParent.value : opened[0];
      return keep ? { [keep]: true } : {};
    });
  }, [items, multiple, val]);

  const [hovKey, setHovKey] = React.useState(null);
  const hoverProps = (k) => ({ onMouseEnter: () => setHovKey(k), onMouseLeave: () => setHovKey(null) });
  const row = (active, disabled, extra, hovered) => ({
    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: col ? 'center' : 'flex-start', gap: 'var(--space-3)',
    // Width may animate between rail and panel, but vertical hit targets stay
    // fixed so pointer/focus positions do not drift during an overlay peek.
    width: '100%', minHeight: 'var(--lds-side-nav-item-height, 44px)', padding: col ? '11px 0' : '10px 12px', boxSizing: 'border-box', border: 'none', borderRadius: 'var(--lds-side-nav-item-radius, var(--radius-lg))',
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, textAlign: 'left', textDecoration: 'none', fontFamily: 'var(--font-sans)',
    fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)',
    background: active ? 'var(--color-semantic-primary-surface-strong)' : hovered && !disabled ? 'var(--color-semantic-fill-alternative)' : 'transparent', color: active ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)',
    transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)', ...extra, ...partStyle(styles, 'item'),
  });
  const labelSpan = (active, children) => (
    <span data-slot="label" className={partClassName(classNames, 'label') || undefined} style={{ flex: 1, minWidth: 0, fontSize: 'var(--label1-size)', fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)', letterSpacing: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...partStyle(styles, 'label') }}>{children}</span>
  );
  const pill = (active, badge) => (
    <span data-slot="badge" className={partClassName(classNames, 'badge') || undefined} style={{ flexShrink: 0, minWidth: 18, height: 18, padding: '0 6px', boxSizing: 'border-box', borderRadius: 'var(--radius-pill)', fontSize: 'var(--caption2-size)', fontWeight: 'var(--fw-bold)', lineHeight: '18px', textAlign: 'center', background: active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-primary-surface-strong)', color: active ? 'var(--color-semantic-background-elevated-normal)' : 'var(--color-semantic-label-normal)', ...partStyle(styles, 'badge') }}>{badge}</span>
  );
  const dot = <span data-slot="badge" className={partClassName(classNames, 'badge') || undefined} style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: 'var(--color-semantic-primary-normal)', ...partStyle(styles, 'badge') }} />;

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
      'data-slot': 'item',
      'data-sidenav-value': item.value,
      'data-sidenav-parent': parentValue,
      'data-state': active ? 'active' : 'inactive',
      'data-disabled': disabled ? 'true' : undefined,
      'aria-label': ariaLabel,
      'aria-current': active ? 'page' : undefined,
      title,
      onClick: activate,
      ...hoverProps(item.value),
      className: partClassName(classNames, 'item', item.className) || undefined,
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
  const resolvedFooter = typeof footer === 'function'
    ? footer({ collapsed: col, expanded: !col, overlay })
    : footer;

  const resolvedSurface = surface === 'docked' ? 'docked' : 'floating';
  const docked = resolvedSurface === 'docked';
  const resolvedWidth = cssLength(width);
  const resolvedCollapsedWidth = cssLength(collapsedWidth);
  const shell = { position: 'relative', display: 'flex', flexDirection: 'column', width: col ? `var(--lds-side-nav-collapsed-width, ${resolvedCollapsedWidth})` : `var(--lds-side-nav-width, ${resolvedWidth})`, boxSizing: 'border-box', background: 'var(--color-semantic-background-elevated-normal)', border: docked ? 'none' : '1px solid var(--color-semantic-line-solid-normal)', borderInlineEnd: docked ? '1px solid var(--color-semantic-line-solid-normal)' : undefined, borderRadius: docked ? 0 : 'var(--lds-side-nav-radius, var(--radius-xl))', boxShadow: docked ? 'none' : undefined, padding: 'var(--lds-side-nav-padding, var(--space-2-5))', transition: 'width var(--dur-base, 200ms) var(--ease-out), box-shadow var(--dur-base, 200ms) var(--ease-out)' };
  const sideNavStyles = `
    [data-sidenav-value]:active:not(:disabled){background:var(--color-semantic-fill-normal)!important}
    [data-collapsed="true"] .lk-sidenav__scroll::-webkit-scrollbar{display:none}
    @media(prefers-reduced-motion:reduce){.lk-sidenav__surface{transition-duration:0s!important;animation-duration:0s!important}}
  `;
  const brandRegionStyle = { position: 'relative', display: 'flex', flexDirection: col ? 'column' : 'row', alignItems: 'center', justifyContent: col || brandAlign === 'center' ? 'center' : 'flex-start', gap: 'var(--space-1-5)', minHeight: 24, padding: '14px 10px 18px' };
  const panelContent = (
    <div id={panelId} data-slot="panel" className={partClassName(classNames, 'panel', 'lk-sidenav__panel-content') || undefined} data-collapsed={col ? 'true' : 'false'} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, ...partStyle(styles, 'panel') }}>
      <style>{sideNavStyles}</style>
      {brand != null && (
        <div data-slot="brand" className={partClassName(classNames, 'brand', 'lk-sidenav__brand') || undefined} style={{ ...brandRegionStyle, ...partStyle(styles, 'brand') }}>
          {brand}
        </div>
      )}
      <ul data-slot="list" className={partClassName(classNames, 'list', 'lk-scroll-surface', 'lk-sidenav__scroll') || undefined} data-scrollbar="compact" data-scroll-gutter={col ? 'auto' : 'stable'} data-scrollbar-exception="collapsed-navigation-rail" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-0-5)', flex: '1 1 auto', minHeight: 0, margin: 0, padding: 0, listStyle: 'none', overflowX: 'hidden', overflowY: 'auto', scrollbarWidth: col ? 'none' : undefined, ...partStyle(styles, 'list') }}>
        {items.map((o, i) => {
          if (o.heading) return col
            ? <li key={'h' + i} style={LIST_ITEM_STYLE}><div data-slot="heading" className={partClassName(classNames, 'heading') || undefined} aria-hidden="true" style={{ height: 1, flexShrink: 0, background: 'var(--color-semantic-line-solid-normal)', margin: i === 0 ? '2px 12px 6px' : '10px 12px 6px', ...partStyle(styles, 'heading') }} /></li>
            : <li key={'h' + i} style={LIST_ITEM_STYLE}><div data-slot="heading" className={partClassName(classNames, 'heading') || undefined} style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--caption2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)', padding: i === 0 ? '4px 12px 6px' : '14px 12px 6px', ...partStyle(styles, 'heading') }}>{o.heading}</div></li>;

          const kids = o.children || [];
          const title = typeof o.label === 'string' ? o.label : undefined;
          const accessibleLabel = o.ariaLabel || title;

          if (kids.length > 0) {
            const isOpen = !!open[o.value];
            const childActive = kids.some((c) => c.value === val);
            const hasChildIcons = kids.some((c) => c.icon != null);
            const onParent = () => { if (col) { setCol(false); openGroup(o.value); } else { toggleGroup(o.value); } };
            return (
              <li key={o.value} style={LIST_ITEM_STYLE}>
                <RailItemTooltip label={accessibleLabel} collapsed={col} enabled={!overlay}>
                  <button type="button" data-slot="item" data-state={childActive ? 'active-descendant' : 'inactive'} data-disabled={o.disabled ? 'true' : undefined} className={partClassName(classNames, 'item', o.className) || undefined} data-sidenav-value={o.value} aria-label={col || o.ariaLabel ? accessibleLabel : undefined} aria-expanded={col ? undefined : isOpen} disabled={o.disabled} onClick={onParent} title={col ? undefined : accessibleLabel} {...hoverProps(o.value)}
                    style={row(false, o.disabled, { color: childActive ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)' }, hovKey === o.value)}>
                    {o.icon != null && <span data-slot="icon" className={partClassName(classNames, 'icon') || undefined} aria-hidden="true" style={{ flexShrink: 0, display: 'inline-flex', ...partStyle(styles, 'icon') }}>{o.icon}</span>}
                    {!col && labelSpan(childActive, o.label)}
                    {!col && <Chevron open={isOpen} />}
                    {/* Active descendant state already uses stronger icon ink.
                        Reserve the collapsed dot exclusively for a real badge. */}
                  </button>
                </RailItemTooltip>
                {!col && isOpen && (
                  <ul data-slot="childList" className={partClassName(classNames, 'childList') || undefined} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-0-5)', margin: '0 0 4px', padding: 0, listStyle: 'none', ...partStyle(styles, 'childList') }}>
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
                            itemStyle: row(ca, c.disabled, { padding: hasChildIcons ? '8px 12px 8px 24px' : '8px 12px 8px 42px', gap: hasChildIcons ? 'var(--space-2)' : undefined }, hovKey === c.value),
                            content: (
                              <React.Fragment>
                                {hasChildIcons && (
                                  <span data-slot="icon" className={partClassName(classNames, 'icon') || undefined} data-sidenav-child-icon aria-hidden="true" style={{ width: 'var(--space-4-5)', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...partStyle(styles, 'icon') }}>
                                    {c.icon}
                                  </span>
                                )}
                                <span data-slot="label" className={partClassName(classNames, 'label') || undefined} style={{ flex: 1, minWidth: 0, fontSize: 'var(--label2-size)', fontWeight: ca ? 'var(--fw-bold)' : 'var(--fw-medium)', letterSpacing: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...partStyle(styles, 'label') }}>{c.label}</span>
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
              <RailItemTooltip label={accessibleLabel} collapsed={col} enabled={!overlay}>
                {renderLeafControl(o, {
                  active,
                  ariaLabel: col || o.ariaLabel ? accessibleLabel : undefined,
                  title: col ? undefined : accessibleLabel,
                  itemStyle: row(active, o.disabled, null, hovKey === o.value),
                  content: (
                    <React.Fragment>
                      {o.icon != null && <span data-slot="icon" className={partClassName(classNames, 'icon') || undefined} aria-hidden="true" style={{ flexShrink: 0, display: 'inline-flex', ...partStyle(styles, 'icon') }}>{o.icon}</span>}
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
      <div data-slot="footer" className={partClassName(classNames, 'footer') || undefined} style={{ marginTop: 'auto', paddingTop: footerGap, ...partStyle(styles, 'footer') }}>
        {resolvedFooter != null && (
          <div style={{ paddingTop: 'var(--space-2-5)', marginLeft: 'var(--space-0-5)', marginRight: 'var(--space-0-5)', borderTop: '1px solid var(--color-semantic-line-solid-normal)' }}>{resolvedFooter}</div>
        )}
      </div>
    </div>
  );
  return (
    <nav ref={mergedNavRef} {...rest} aria-label={ariaLabel} onClick={onClick || (overlay && col) ? (e) => {
      onClick?.(e);
      if (!e.defaultPrevented && overlay && col && !e.target.closest('[data-sidenav-value], button')) setCol(false);
    } : undefined}
      onMouseEnter={onMouseEnter || overlay ? (e) => { onMouseEnter?.(e); if (!e.defaultPrevented && overlay) { pointerInside.current = true; peek(true); } } : undefined}
      onMouseLeave={onMouseLeave || overlay ? (e) => { onMouseLeave?.(e); if (!e.defaultPrevented && overlay) { pointerInside.current = false; peek(false); } } : undefined}
      onFocus={overlay ? (e) => {
        onFocus?.(e);
        if (col && !restoringFocus.current && !e.currentTarget.contains(e.relatedTarget)) {
          clearTimeout(peekT.current);
          setCol(false);
        }
      } : onFocus}
      onBlur={overlay ? (e) => { onBlur?.(e); if (!pointerInside.current && !e.currentTarget.contains(e.relatedTarget)) peek(false); } : onBlur}
      data-slot="root"
      data-state={col ? 'collapsed' : 'expanded'}
      data-overlay={overlay ? 'true' : undefined}
      className={partClassName(classNames, 'root', 'lk-sidenav', !overlay && 'lk-sidenav__surface', className) || undefined}
      style={overlay
        ? { ...componentVars(vars, '--lds-side-nav-'), position: 'relative', width: `var(--lds-side-nav-collapsed-width, ${resolvedCollapsedWidth})`, flexShrink: 0, ...partStyle(styles, 'root'), ...style }
        : { ...componentVars(vars, '--lds-side-nav-'), ...shell, ...partStyle(styles, 'root'), ...style }}
      data-surface={resolvedSurface}>
      {overlay ? (
        /* The elevation shadow only makes sense where the expanded panel actually covers content,
           so clip it to the inline-end overhang on both surfaces instead of blooming on all sides. */
        <div data-slot="overlaySurface" className={partClassName(classNames, 'overlaySurface', 'lk-sidenav__surface') || undefined} style={{ ...shell, position: 'absolute', top: 0, left: 0, height: '100%', zIndex: col ? 1 : 40, boxShadow: col ? 'none' : 'var(--shadow-lg)', clipPath: col ? undefined : 'inset(0 -120px 0 0)', ...partStyle(styles, 'overlaySurface') }}>{panelContent}</div>
      ) : panelContent}
    </nav>
  );
});
