import React from 'react';
import { ScrollArea } from '@lk-design-system/lds-core/components/layout/ScrollArea';
import { ShellPanelContext } from './shell-panel-context.js';

const SHELL_PANEL_MAX_ACTIONS = 2;

const SHELL_PANEL_STYLES = `
  .lk-shell-panel__primary:active{background:var(--component-shell-panel-pressed-surface)!important;color:var(--_lds-shell-panel-pressed-foreground)!important}
  .lk-shell-panel__primary:focus-visible{outline-offset:-2px!important}
  @media(forced-colors:active){.lk-shell-panel__primary[aria-current="page"]{color:Highlight!important;font-weight:bold!important}}
  @media(prefers-reduced-motion:reduce){.lk-shell-panel__primary{transition:none!important}}
`;

function isDevelopment() {
  const env = typeof globalThis.process !== 'undefined' ? globalThis.process.env : undefined;
  return !(env && env.NODE_ENV === 'production');
}

/**
 * LK Product — ShellPanel
 *
 * The contextual panel of DashboardShell topology="rail-panel": a fixed header
 * (title + at most two actions), an optional primary action row that reads as a
 * list row ("새 질문"), an optional fixed region and exactly zero or one scroll
 * region. The panel itself is not a landmark; the list inside owns the `nav`
 * named by the panel title. No collapse toggle lives here — the shell's header
 * owns the single toggle.
 */
export function ShellPanel({
  title,
  headingLevel = 2,
  density = 'comfortable',
  actions,
  primaryAction,
  renderLink,
  children,
  scrollRegion,
  scrollRegionLabel,
  footer,
  titleId,
  className,
  style,
  ...rest
}) {
  const generatedId = React.useId().replace(/:/g, '');
  const resolvedTitleId = titleId || `lk-shell-panel-title-${generatedId}`;
  const [scrolled, setScrolled] = React.useState(false);
  const [primaryHovered, setPrimaryHovered] = React.useState(false);
  const actionList = React.Children.toArray(actions);
  const HeadingTag = `h${Math.min(6, Math.max(1, Number(headingLevel) || 2))}`;
  const compact = density === 'compact';

  React.useEffect(() => {
    if (actionList.length <= SHELL_PANEL_MAX_ACTIONS || !isDevelopment()) return;
    // eslint-disable-next-line no-console
    console.warn(`ShellPanel: the header holds at most ${SHELL_PANEL_MAX_ACTIONS} actions; received ${actionList.length}. Move the rest into an overflow menu.`);
  }, [actionList.length]);

  const primary = primaryAction && typeof primaryAction === 'object' && !React.isValidElement(primaryAction) ? primaryAction : null;
  const primaryCurrent = !!primary?.current;
  const primaryStyle = primary && {
    '--_lds-shell-panel-pressed-foreground': primaryCurrent ? 'var(--component-shell-panel-foreground)' : 'var(--component-shell-panel-hover-foreground)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    width: '100%',
    minHeight: 'var(--component-conversation-list-row-height)',
    padding: '0 var(--space-3)',
    boxSizing: 'border-box',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    background: primaryHovered ? 'var(--component-shell-panel-hover-surface)' : 'transparent',
    color: primaryCurrent || !primaryHovered ? 'var(--component-shell-panel-foreground)' : 'var(--component-shell-panel-hover-foreground)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--label1-size)',
    lineHeight: 'var(--label1-line)',
    fontWeight: primaryCurrent ? 'var(--fw-semibold)' : 'var(--fw-medium)',
    textAlign: 'start',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
  };
  let primaryControl = null;
  if (primary) {
    const content = (
      <React.Fragment>
        {primary.icon != null && <span data-slot="icon" aria-hidden="true" style={{ display: 'inline-flex', flexShrink: 0 }}>{primary.icon}</span>}
        <span style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{primary.label}</span>
      </React.Fragment>
    );
    const common = {
      className: 'lk-shell-panel__primary',
      'data-slot': 'primaryAction',
      'aria-current': primaryCurrent ? 'page' : undefined,
      onClick: primary.onClick,
      onMouseEnter: () => setPrimaryHovered(true),
      onMouseLeave: () => setPrimaryHovered(false),
      style: primaryStyle,
      children: content,
    };
    if (primary.href != null) {
      const linkProps = { ...common, href: primary.href };
      primaryControl = renderLink ? renderLink(primary, linkProps) : <a {...linkProps} />;
    } else {
      primaryControl = <button type="button" {...common} />;
    }
  } else if (primaryAction != null) {
    primaryControl = primaryAction;
  }

  return (
    <ShellPanelContext.Provider value={{ titleId: resolvedTitleId }}>
      <div
        data-slot="root"
        data-density={compact ? 'compact' : 'comfortable'}
        className={['lk-shell-panel', className].filter(Boolean).join(' ')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          minHeight: 0,
          boxSizing: 'border-box',
          background: 'var(--component-shell-panel-surface)',
          borderInlineEnd: '1px solid var(--component-shell-panel-divider)',
          color: 'var(--component-shell-panel-foreground)',
          fontFamily: 'var(--font-sans)',
          ...style,
        }}
        {...rest}
      >
        <style>{SHELL_PANEL_STYLES}</style>
        <div data-slot="header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0, minHeight: compact ? 'var(--space-10)' : 'var(--component-shell-panel-header-height)', padding: '0 var(--space-2) 0 var(--space-4)', boxSizing: 'border-box' }}>
          <HeadingTag id={resolvedTitleId} style={{ flex: '1 1 auto', minWidth: 0, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: compact ? 'var(--label1-size)' : 'var(--body1-size)', lineHeight: compact ? 'var(--label1-line)' : 'var(--body1-line)', fontWeight: 'var(--fw-bold)', color: 'var(--component-shell-panel-foreground)' }}>
            {title}
          </HeadingTag>
          {actionList.length > 0 && <div data-slot="actions" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', flexShrink: 0 }}>{actionList}</div>}
        </div>
        {primaryControl != null && (
          <div data-slot="primary" style={{ flexShrink: 0, padding: '0 var(--space-2) var(--space-1)' }}>{primaryControl}</div>
        )}
        {children != null && (
          <div data-slot="fixed" style={{ flexShrink: 0, padding: '0 var(--space-2)' }}>{children}</div>
        )}
        {scrollRegion != null && (
          <ScrollArea
            data-slot="scroll"
            data-scroll-region=""
            data-scrolled={scrolled ? 'true' : 'false'}
            // A distinct name from the list's nav, which is named by the panel title.
            label={scrollRegionLabel ?? (typeof title === 'string' ? `${title} 목록` : undefined)}
            labelledBy={scrollRegionLabel == null && typeof title !== 'string' ? resolvedTitleId : undefined}
            maxHeight="none"
            scrollbar="compact"
            gutter="stable"
            onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 0)}
            style={{
              flex: '1 1 auto',
              minHeight: 0,
              padding: 'var(--space-1) var(--space-2) var(--space-2)',
              boxSizing: 'border-box',
              // The edge appears only while the region is scrolled, like an editor panel toolbar.
              borderTop: `1px solid ${scrolled ? 'var(--component-shell-panel-divider)' : 'transparent'}`,
            }}
          >
            {scrollRegion}
          </ScrollArea>
        )}
        {footer != null && (
          <div data-slot="footer" style={{ flexShrink: 0, padding: 'var(--space-2)', borderTop: '1px solid var(--component-shell-panel-divider)' }}>{footer}</div>
        )}
      </div>
    </ShellPanelContext.Provider>
  );
}
