import React from 'react';
import { Tooltip } from '@lk-design-system/lds-core/components/content/Tooltip';

const NAV_RAIL_DOCKED_MAX_ITEMS = 7;

/* Neutral colour roles carry the same values as the SideNav neutral appearance so the rail and the
   contextual panel of DashboardShell topology="rail-panel" read as one light
   shell. The default appearance keeps the primary tint selection. */
const NAV_RAIL_APPEARANCES = {
  default: {
    surface: 'var(--color-semantic-background-elevated-normal)',
    divider: 'var(--color-semantic-line-solid-normal)',
    foreground: 'var(--color-semantic-label-normal)',
    mutedForeground: 'var(--color-semantic-label-alternative)',
    hoverForeground: 'var(--color-semantic-label-alternative)',
    hoverSurface: 'var(--color-semantic-primary-surface-normal)',
    activeSurface: 'var(--color-semantic-primary-surface-strong)',
    activeHoverSurface: 'var(--color-semantic-primary-surface-strong)',
    pressedSurface: 'var(--color-semantic-primary-surface-strong)',
    focusIndicator: 'var(--color-semantic-focus-indicator)',
  },
  neutral: {
    surface: 'var(--component-nav-rail-neutral-surface)',
    divider: 'var(--component-nav-rail-neutral-divider)',
    foreground: 'var(--component-nav-rail-neutral-foreground)',
    mutedForeground: 'var(--component-nav-rail-neutral-muted-foreground)',
    hoverForeground: 'var(--component-nav-rail-neutral-hover-foreground)',
    hoverSurface: 'var(--component-nav-rail-neutral-hover-surface)',
    activeSurface: 'var(--component-nav-rail-neutral-active-surface)',
    activeHoverSurface: 'var(--component-nav-rail-neutral-active-hover-surface)',
    pressedSurface: 'var(--component-nav-rail-neutral-pressed-surface)',
    focusIndicator: 'var(--component-nav-rail-neutral-focus-indicator)',
  },
};

const NAV_RAIL_LIST_STYLES = `
  .lk-nav-rail [data-nav-rail-value]:active:not(:disabled){background:var(--_lds-nav-rail-pressed-surface)!important;color:var(--_lds-nav-rail-pressed-foreground)!important}
  .lk-nav-rail [data-nav-rail-value]:focus-visible{outline-color:var(--_lds-nav-rail-focus-indicator)!important;outline-offset:-2px!important}
  .lk-nav-rail__list::-webkit-scrollbar{display:none}
  @media(forced-colors:active){.lk-nav-rail [data-nav-rail-value][data-state="active"]{background:Highlight!important;color:HighlightText!important;background:SelectedItem!important;color:SelectedItemText!important}}
  @media(prefers-reduced-motion:reduce){.lk-nav-rail [data-nav-rail-value]{transition:none!important}}
`;

function isDevelopment() {
  const env = typeof globalThis.process !== 'undefined' ? globalThis.process.env : undefined;
  return !(env && env.NODE_ENV === 'production');
}

/**
 * Docked caption tooltip: captions are always visible, so the DS Tooltip only
 * opens (on hover and keyboard focus) when the caption is actually truncated.
 */
function DockedCaptionTooltip({ label, labelRef, children }) {
  const [open, setOpen] = React.useState(false);
  if (label == null) return children;
  const requestOpen = (next) => {
    const node = labelRef.current;
    setOpen(Boolean(next && node && node.scrollWidth > node.clientWidth + 1));
  };
  return (
    <Tooltip content={label} placement="right" size="small" open={open} onOpenChange={requestOpen} style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
      {children}
    </Tooltip>
  );
}

/**
 * LK ROBOTICS — NavRail
 * A vertical icon+label navigation rail (desktop side nav). The active item
 * takes the primary tint surface + label-normal ink and bold weight. Pass `items` as `{ value, label, icon }`.
 * Controlled (`value`) or uncontrolled (`defaultValue`).
 *
 * `surface="docked"` is the full-height area rail of DashboardShell
 * topology="rail-panel": 64px wide, 56px items with always-visible captions,
 * an optional logo `header` and account `footer`, an inline-end divider and no
 * card chrome. `appearance="neutral"` uses the achromatic selection of the
 * SideNav neutral appearance. `surface="drawer"` renders the same items as
 * horizontal rows for the rail-panel narrow drawer.
 */
export function NavRail({
  items = [],
  value,
  defaultValue,
  onChange,
  renderLink,
  surface = 'floating',
  appearance = 'default',
  header,
  footer,
  getItemCurrent,
  className,
  style,
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : (items[0] && items[0].value));
  const [hoveredValue, setHoveredValue] = React.useState(null);
  const val = isControlled ? value : internal;
  const pick = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };
  const resolvedSurface = surface === 'docked' || surface === 'drawer' ? surface : 'floating';
  const resolvedAppearance = appearance === 'neutral' ? 'neutral' : 'default';
  const tokens = NAV_RAIL_APPEARANCES[resolvedAppearance];
  const docked = resolvedSurface === 'docked';
  const drawer = resolvedSurface === 'drawer';
  const labelNodes = React.useRef(new Map());

  React.useEffect(() => {
    if (!docked || items.length <= NAV_RAIL_DOCKED_MAX_ITEMS || !isDevelopment()) return;
    // eslint-disable-next-line no-console
    console.warn(`NavRail: a docked rail holds 3-${NAV_RAIL_DOCKED_MAX_ITEMS} area destinations and must not scroll at a 600px document height; received ${items.length}. Move the rest into the contextual panel or body tabs.`);
  }, [docked, items.length]);

  const currentFor = (item, active) => (typeof getItemCurrent === 'function'
    ? getItemCurrent(item, { active }) || undefined
    : active ? 'page' : undefined);

  if (resolvedSurface === 'floating') {
    return (
      <nav aria-label="주 탐색" className={className} style={{ display: 'inline-flex', flexDirection: 'column', width: 'fit-content', maxWidth: '100%', boxSizing: 'border-box', gap: 'var(--space-1-5)', padding: 'var(--space-2-5)', background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-xl)', ...style }} {...rest}>
        {items.map((o) => {
          const active = o.value === val;
          const disabled = !!o.disabled;
          const accessibleLabel = o.ariaLabel || (typeof o.label === 'string' ? o.label : undefined);
          const content = (
            <React.Fragment>
              {o.icon != null && <span aria-hidden="true" style={{ display: 'inline-flex', flexShrink: 0 }}>{o.icon}</span>}
              <span style={{ width: '100%', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)', fontSize: 'var(--caption2-size)', fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)' }}>{o.label}</span>
            </React.Fragment>
          );
          const itemStyle = {
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-1-5)',
            width: 68, height: 60, padding: 0, boxSizing: 'border-box', border: 'none', borderRadius: 'var(--radius-lg)',
            cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, textDecoration: 'none', textAlign: 'center',
            background: active
              ? 'var(--color-semantic-primary-surface-strong)'
              : hoveredValue === o.value && !disabled
                ? 'var(--color-semantic-primary-surface-normal)'
                : 'transparent',
            color: active ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)',
            transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
          };
          const activate = (event) => {
            if (disabled) {
              event.preventDefault();
              return;
            }
            pick(o.value);
            o.onClick?.(event);
          };

          if (o.href != null) {
            const linkProps = {
              href: disabled ? undefined : o.href,
              target: o.target,
              rel: o.rel,
              'aria-label': o.ariaLabel,
              'aria-current': currentFor(o, active),
              'aria-disabled': disabled || undefined,
              tabIndex: disabled ? -1 : undefined,
              title: accessibleLabel,
              onClick: activate,
              onMouseEnter: () => setHoveredValue(o.value),
              onMouseLeave: () => setHoveredValue(null),
              style: itemStyle,
              children: content,
            };
            return (
              <React.Fragment key={o.value}>
                {renderLink ? renderLink(o, linkProps) : <a {...linkProps} />}
              </React.Fragment>
            );
          }

          return (
            <button key={o.value} type="button" aria-label={o.ariaLabel} aria-current={currentFor(o, active)} disabled={disabled} onClick={activate} onMouseEnter={() => setHoveredValue(o.value)} onMouseLeave={() => setHoveredValue(null)} title={accessibleLabel} style={itemStyle}>
              {content}
            </button>
          );
        })}
      </nav>
    );
  }

  const renderItem = (o) => {
    const active = o.value === val;
    const disabled = !!o.disabled;
    const hovered = hoveredValue === o.value && !disabled;
    const accessibleLabel = o.ariaLabel || (typeof o.label === 'string' ? o.label : undefined);
    const labelRef = { get current() { return labelNodes.current.get(o.value) || null; } };
    const itemStyle = {
      '--_lds-nav-rail-pressed-foreground': active ? tokens.foreground : tokens.hoverForeground,
      position: 'relative',
      display: 'flex',
      flexDirection: drawer ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: drawer ? 'flex-start' : 'center',
      gap: drawer ? 'var(--space-3)' : 'var(--space-1)',
      width: drawer ? '100%' : 'var(--component-nav-rail-docked-item-size)',
      minHeight: drawer ? 'var(--control-h-md)' : 'var(--component-nav-rail-docked-item-size)',
      height: drawer ? undefined : 'var(--component-nav-rail-docked-item-size)',
      padding: drawer ? '0 var(--space-3)' : '0 var(--space-0-5)',
      boxSizing: 'border-box',
      border: 'none',
      borderRadius: 'var(--radius-lg)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      textDecoration: 'none',
      textAlign: drawer ? 'start' : 'center',
      fontFamily: 'var(--font-sans)',
      background: active
        ? hovered ? tokens.activeHoverSurface : tokens.activeSurface
        : hovered ? tokens.hoverSurface : 'transparent',
      color: active ? tokens.foreground : hovered ? tokens.hoverForeground : tokens.mutedForeground,
      transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
    };
    const content = (
      <React.Fragment>
        {o.icon != null && <span data-slot="icon" aria-hidden="true" style={{ display: 'inline-flex', flexShrink: 0 }}>{o.icon}</span>}
        <span
          data-slot="label"
          ref={(node) => { if (node) labelNodes.current.set(o.value, node); else labelNodes.current.delete(o.value); }}
          style={{
            display: 'block',
            width: drawer ? undefined : '100%',
            flex: drawer ? '1 1 auto' : undefined,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: drawer ? 'var(--label1-size)' : 'var(--caption2-size)',
            lineHeight: drawer ? 'var(--label1-line)' : 'var(--caption2-line)',
            fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)',
          }}
        >
          {o.label}
        </span>
      </React.Fragment>
    );
    const activate = (event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      pick(o.value);
      o.onClick?.(event);
    };
    const common = {
      'data-nav-rail-value': o.value,
      'data-state': active ? 'active' : 'inactive',
      'aria-label': o.ariaLabel,
      'aria-current': currentFor(o, active),
      onClick: activate,
      onMouseEnter: () => setHoveredValue(o.value),
      onMouseLeave: () => setHoveredValue(null),
      style: itemStyle,
      children: content,
    };
    let control;
    if (o.href != null) {
      const linkProps = {
        ...common,
        href: disabled ? undefined : o.href,
        target: o.target,
        rel: o.rel,
        'aria-disabled': disabled || undefined,
        tabIndex: disabled ? -1 : undefined,
      };
      control = renderLink ? renderLink(o, linkProps) : <a {...linkProps} />;
    } else {
      control = <button type="button" disabled={disabled} {...common} />;
    }
    return (
      <li key={o.value} style={{ display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        {docked ? <DockedCaptionTooltip label={accessibleLabel} labelRef={labelRef}>{control}</DockedCaptionTooltip> : control}
      </li>
    );
  };

  return (
    <nav
      aria-label="주 탐색"
      data-surface={resolvedSurface}
      data-appearance={resolvedAppearance}
      className={['lk-nav-rail', className].filter(Boolean).join(' ')}
      style={{
        '--_lds-nav-rail-pressed-surface': tokens.pressedSurface,
        '--_lds-nav-rail-focus-indicator': tokens.focusIndicator,
        display: 'flex',
        flexDirection: 'column',
        width: docked ? 'var(--component-nav-rail-docked-width)' : '100%',
        height: docked ? '100%' : undefined,
        minHeight: 0,
        boxSizing: 'border-box',
        background: docked ? tokens.surface : undefined,
        borderInlineEnd: docked ? `1px solid ${tokens.divider}` : undefined,
        color: tokens.foreground,
        ...style,
      }}
      {...rest}
    >
      <style>{NAV_RAIL_LIST_STYLES}</style>
      {docked && header != null && (
        <div data-slot="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minHeight: 'var(--component-nav-rail-docked-slot-height)' }}>
          {header}
        </div>
      )}
      <ul
        data-slot="list"
        className="lk-nav-rail__list"
        data-scrollbar-exception="collapsed-navigation-rail"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: drawer ? 'stretch' : 'center',
          gap: docked ? 'var(--component-nav-rail-docked-item-gap)' : 'var(--space-0-5)',
          flex: docked ? '1 1 auto' : undefined,
          minHeight: 0,
          margin: 0,
          padding: docked ? 'var(--component-nav-rail-docked-padding-block) 0' : 'var(--space-2)',
          listStyle: 'none',
          // Within the 600px document-height budget seven items never scroll;
          // below it the list scrolls with a hidden scrollbar (WCAG 1.4.10 reflow).
          overflowX: 'hidden',
          overflowY: docked ? 'auto' : undefined,
          scrollbarWidth: docked ? 'none' : undefined,
        }}
      >
        {items.map(renderItem)}
      </ul>
      {docked && footer != null && (
        <div data-slot="footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minHeight: 'var(--component-nav-rail-docked-slot-height)' }}>
          {footer}
        </div>
      )}
    </nav>
  );
}
