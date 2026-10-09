import React from 'react';
import { Drawer } from '../overlay/Drawer.jsx';

/* `inert` only became a first-class boolean DOM prop in React 19. React 18 — a
   supported peer (`react: ">=18 <20"`) — warns and then drops it, which here
   means the shell behind an open temporary-navigation drawer stays reachable by
   Tab instead of being inert. React 19 in turn drops `inert=""` and warns on
   `inert="true"`, so the value is resolved from the running React major. */
const INERT_VALUE = Number.parseInt(React.version, 10) >= 19 ? true : 'true';
const inertWhen = (isInert) => (isInert ? INERT_VALUE : undefined);

const DASHBOARD_SHELL_STYLES = `
/* On mobile the Drawer body owns the entire navigation scroll. Desktop's
   fixed panel regions retain their own contract. */
[data-rail-panel-drawer] .lk-shell-panel{height:auto!important;flex:1 0 auto}
[data-rail-panel-drawer] [data-scroll-region]{overflow:visible!important;max-height:none!important;flex:1 0 auto!important}
.lk-dashboard-shell{
  display:grid;
  grid-template-columns:auto minmax(0,1fr);
  grid-template-rows:auto minmax(0,1fr);
}
.lk-dashboard-shell__skip{
  position:fixed;
  inset-block-start:var(--space-3);
  inset-inline-start:var(--space-3);
  z-index:1000;
  display:inline-flex;
  align-items:center;
  min-height:var(--control-h-sm);
  padding:0 var(--space-3);
  border:2px solid var(--color-semantic-primary-normal);
  border-radius:var(--radius-md);
  background:var(--color-semantic-background-elevated-normal);
  color:var(--color-semantic-label-normal);
  box-shadow:var(--shadow-md);
  font-family:var(--font-sans);
  font-size:var(--label1-size);
  font-weight:var(--fw-bold);
  text-decoration:none;
  transform:translateY(calc(-100% - var(--space-6)));
  transition:transform var(--dur-fast) var(--ease-out);
}
.lk-dashboard-shell__skip:focus,
.lk-dashboard-shell__skip:focus-visible{transform:translateY(0)}
.lk-dashboard-shell__header{grid-column:1/-1;grid-row:1;min-width:0;z-index:50}
.lk-dashboard-shell__navigation{grid-column:1;grid-row:2;min-width:0;min-height:0;z-index:20}
.lk-dashboard-shell__main{grid-column:2;grid-row:2;min-width:0;min-height:0;width:100%;max-width:100%;box-sizing:border-box}
.lk-dashboard-shell__narrow-navigation{display:none;min-width:0;z-index:40;background:var(--color-semantic-background-elevated-normal)}
.lk-dashboard-shell[data-topology="side-first"] .lk-dashboard-shell__header{grid-column:2;grid-row:1}
.lk-dashboard-shell[data-topology="side-first"] .lk-dashboard-shell__navigation{grid-column:1;grid-row:1/-1;z-index:60}
.lk-dashboard-shell[data-topology="side-first"] .lk-dashboard-shell__main{grid-column:2;grid-row:2}
.lk-dashboard-shell[data-layout="narrow"]{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto}
.lk-dashboard-shell[data-layout="narrow"] .lk-dashboard-shell__header{grid-column:1;grid-row:1}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="true"] .lk-dashboard-shell__navigation{display:none}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="true"] .lk-dashboard-shell__main{grid-column:1;grid-row:2}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="true"] .lk-dashboard-shell__narrow-navigation{display:block;grid-column:1;grid-row:3;position:sticky;bottom:0;padding-bottom:var(--mobile-safe-area-bottom)}
.lk-dashboard-shell[data-layout="narrow"][data-has-temporary-navigation="true"]{grid-template-rows:auto minmax(0,1fr)}
.lk-dashboard-shell[data-layout="narrow"][data-has-temporary-navigation="true"] .lk-dashboard-shell__navigation{display:none}
.lk-dashboard-shell[data-layout="narrow"][data-has-temporary-navigation="true"] .lk-dashboard-shell__main{grid-column:1;grid-row:2}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="false"][data-has-temporary-navigation="false"]{grid-template-rows:auto auto minmax(0,1fr)}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="false"][data-has-temporary-navigation="false"] .lk-dashboard-shell__navigation{display:block;grid-column:1;grid-row:2}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="false"][data-has-temporary-navigation="false"] .lk-dashboard-shell__main{grid-column:1;grid-row:3}
/* topology="rail-panel": a fixed-height app shell. The docked rail and the
   contextual panel span both rows and never scroll with the page; main is the
   scroll container. */
.lk-dashboard-shell[data-topology="rail-panel"]{position:relative;grid-template-columns:auto auto minmax(0,1fr);overflow:hidden}
.lk-dashboard-shell[data-topology="rail-panel"] .lk-dashboard-shell__navigation{grid-column:1;grid-row:1/-1;z-index:60;display:flex}
.lk-dashboard-shell[data-topology="rail-panel"] .lk-dashboard-shell__panel{grid-column:2;grid-row:1/-1;z-index:55;display:flex;min-width:0;min-height:0;overflow:hidden;width:var(--lds-dashboard-shell-panel-width,var(--component-shell-panel-width));transition:width var(--dur-base) var(--ease-out)}
.lk-dashboard-shell[data-topology="rail-panel"] .lk-dashboard-shell__panel[data-state="closed"]{width:0}
.lk-dashboard-shell[data-topology="rail-panel"] .lk-dashboard-shell__panel-content{display:flex;flex-direction:column;flex:0 0 auto;width:var(--lds-dashboard-shell-panel-width,var(--component-shell-panel-width));min-height:0}
.lk-dashboard-shell[data-topology="rail-panel"] .lk-dashboard-shell__header{grid-column:3;grid-row:1}
.lk-dashboard-shell[data-topology="rail-panel"] .lk-dashboard-shell__main{grid-column:3;grid-row:2;overflow-y:auto}
.lk-dashboard-shell[data-topology="rail-panel"][data-panel-mode="overlay"]{grid-template-columns:auto 0 minmax(0,1fr)}
/* The overlay panel sits in the (zero-width) panel column of the body row, so
   it covers main but never the header and its panel toggle. */
.lk-dashboard-shell[data-topology="rail-panel"][data-panel-mode="overlay"] .lk-dashboard-shell__panel{position:absolute;grid-row:2;inset-block:0;inset-inline-start:0;z-index:70;box-shadow:var(--shadow-lg);clip-path:inset(0 -120px 0 0)}
.lk-dashboard-shell[data-topology="rail-panel"][data-panel-mode="overlay"] .lk-dashboard-shell__panel[data-state="closed"]{box-shadow:none}
.lk-dashboard-shell[data-topology="rail-panel"][data-narrow="true"]{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr)}
.lk-dashboard-shell[data-topology="rail-panel"][data-narrow="true"] .lk-dashboard-shell__header{grid-column:1;grid-row:1}
.lk-dashboard-shell[data-topology="rail-panel"][data-narrow="true"] .lk-dashboard-shell__main{grid-column:1;grid-row:2}
@media(prefers-reduced-motion:reduce){.lk-dashboard-shell__panel{transition:none!important}}
@media(max-width:767px){
  .lk-dashboard-shell[data-layout="auto"]{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto}
  .lk-dashboard-shell[data-layout="auto"] .lk-dashboard-shell__header{grid-column:1;grid-row:1}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="true"] .lk-dashboard-shell__navigation{display:none}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="true"] .lk-dashboard-shell__main{grid-column:1;grid-row:2}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="true"] .lk-dashboard-shell__narrow-navigation{display:block;grid-column:1;grid-row:3;position:sticky;bottom:0;padding-bottom:var(--mobile-safe-area-bottom)}
  .lk-dashboard-shell[data-layout="auto"][data-has-temporary-navigation="true"]{grid-template-rows:auto minmax(0,1fr)}
  .lk-dashboard-shell[data-layout="auto"][data-has-temporary-navigation="true"] .lk-dashboard-shell__navigation{display:none}
  .lk-dashboard-shell[data-layout="auto"][data-has-temporary-navigation="true"] .lk-dashboard-shell__main{grid-column:1;grid-row:2}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="false"][data-has-temporary-navigation="false"]{grid-template-rows:auto auto minmax(0,1fr)}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="false"][data-has-temporary-navigation="false"] .lk-dashboard-shell__navigation{display:block;grid-column:1;grid-row:2}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="false"][data-has-temporary-navigation="false"] .lk-dashboard-shell__main{grid-column:1;grid-row:3}
}
`;

function withNavigationLabel(node, label) {
  if (!React.isValidElement(node)) return node;
  return React.cloneElement(node, {
    'aria-label': node.props['aria-label'] ?? label,
  });
}

function isDevelopment() {
  const env = typeof globalThis.process !== 'undefined' ? globalThis.process.env : undefined;
  return !(env && env.NODE_ENV === 'production');
}

/* The rail-panel narrow drawer: the same rail items as rows (NavRail
   surface="drawer"), the current area's panel (its one scroll region is the
   drawer's only scroll), and the account footer last. */
function RailPanelDrawerBody({ navigation, panel, navigationLabel }) {
  const footer = React.isValidElement(navigation) ? navigation.props.footer : null;
  return (
    <div data-rail-panel-drawer="" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {React.isValidElement(navigation) && (
        <div data-rail-panel-drawer-areas="" style={{ flexShrink: 0, padding: 'var(--space-2)' }}>
          {React.cloneElement(navigation, {
            surface: 'drawer',
            header: null,
            footer: null,
            'aria-label': navigation.props['aria-label'] ?? navigationLabel,
          })}
        </div>
      )}
      {panel != null && (
        <div data-rail-panel-drawer-panel="" style={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto', borderTop: '1px solid var(--color-semantic-line-solid-normal)' }}>
          {panel}
        </div>
      )}
      {footer != null && (
        <div data-rail-panel-drawer-footer="" style={{ flexShrink: 0, padding: 'var(--space-2) var(--space-3)', borderTop: '1px solid var(--color-semantic-line-solid-normal)' }}>
          {footer}
        </div>
      )}
    </div>
  );
}

/**
 * LK Product — DashboardShell
 *
 * Landmark and responsive composition contract for dashboard products. The
 * header and navigation slots keep ownership of their visual surfaces; the
 * shell only orders them, provides one main landmark, switches the wide and
 * narrow navigation regions, and supports header-first or side-first desktop
 * topology. `header` is expected to own its header/banner landmark (TopBar is
 * the canonical LDS slot component).
 */
export function DashboardShell({
  header,
  navigation,
  narrowNavigation,
  temporaryNavigation,
  temporaryNavigationOpen = false,
  onTemporaryNavigationClose,
  temporaryNavigationId,
  temporaryNavigationTitle,
  temporaryNavigationLabel = '주 탐색',
  temporaryNavigationCloseLabel = '탐색 닫기',
  temporaryNavigationCloseButtonVariant,
  temporaryNavigationWidth = 320,
  temporaryNavigationAppearance = 'default',
  temporaryNavigationInitialFocusRef,
  temporaryNavigationReturnFocusRef,
  children,
  layout = 'auto',
  topology = 'header-first',
  panel,
  panelOpen = true,
  onPanelOpenChange,
  panelId,
  panelMode = 'auto',
  panelReturnFocusRef,
  mainId,
  mainLabel,
  mainClassName,
  mainStyle,
  skipLabel = '본문으로 건너뛰기',
  navigationLabel = '주 탐색',
  narrowNavigationLabel = '주 탐색',
  className,
  style,
  ...rest
}) {
  const generatedId = React.useId().replace(/:/g, '');
  const resolvedMainId = mainId || `lk-dashboard-main-${generatedId}`;
  const resolvedTemporaryNavigationId = temporaryNavigationId || `lk-dashboard-temporary-navigation-${generatedId}`;
  const resolvedTopology = topology === 'side-first' || topology === 'rail-panel' ? topology : 'header-first';
  const railPanel = resolvedTopology === 'rail-panel';
  const resolvedPanelId = panelId || `lk-dashboard-panel-${generatedId}`;
  const [autoNarrow, setAutoNarrow] = React.useState(false);
  const [autoOverlay, setAutoOverlay] = React.useState(false);
  const panelRef = React.useRef(null);
  const mainRef = React.useRef(null);
  const [mainOverflows, setMainOverflows] = React.useState(false);

  React.useEffect(() => {
    if (layout !== 'auto' || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      setAutoNarrow(false);
      return undefined;
    }
    const query = window.matchMedia('(max-width: 767px)');
    const update = () => setAutoNarrow(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, [layout]);

  React.useEffect(() => {
    if (!railPanel || panelMode !== 'auto' || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      setAutoOverlay(false);
      return undefined;
    }
    const query = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const update = () => setAutoOverlay(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, [railPanel, panelMode]);

  const isNarrowLayout = layout === 'narrow' || (layout === 'auto' && autoNarrow);
  const hasPanel = railPanel && panel != null;
  const resolvedPanelMode = panelMode === 'overlay' || (panelMode === 'auto' && autoOverlay) ? 'overlay' : 'inline';
  const panelExpanded = hasPanel && !!panelOpen && !isNarrowLayout;
  const hasTemporaryNavigation = temporaryNavigation != null || (railPanel && navigation != null);
  const temporaryOpen = hasTemporaryNavigation && temporaryNavigationOpen && isNarrowLayout;

  // A controlled open intent must be cleared when the mobile surface goes
  // away. Otherwise returning to mobile reopens yesterday's modal state.
  const previousNarrowLayoutRef = React.useRef(isNarrowLayout);
  React.useEffect(() => {
    const wasNarrow = previousNarrowLayoutRef.current;
    previousNarrowLayoutRef.current = isNarrowLayout;
    if (wasNarrow && !isNarrowLayout && hasTemporaryNavigation && temporaryNavigationOpen) {
      onTemporaryNavigationClose?.();
    }
  }, [isNarrowLayout, hasTemporaryNavigation, temporaryNavigationOpen, onTemporaryNavigationClose]);

  // Entering the 768–1023px overlay range closes an open panel: there the panel
  // covers the body, so it starts collapsed and the product reopens it.
  const previousPanelModeRef = React.useRef(resolvedPanelMode);
  React.useEffect(() => {
    const previous = previousPanelModeRef.current;
    previousPanelModeRef.current = resolvedPanelMode;
    if (hasPanel && previous === 'inline' && resolvedPanelMode === 'overlay' && panelOpen) onPanelOpenChange?.(false);
  }, [hasPanel, resolvedPanelMode, panelOpen, onPanelOpenChange]);

  // Collapsing the panel while focus is inside it hands focus back to the
  // product's toggle instead of leaving it inside an inert subtree.
  const previousPanelExpandedRef = React.useRef(panelExpanded);
  React.useLayoutEffect(() => {
    const wasExpanded = previousPanelExpandedRef.current;
    previousPanelExpandedRef.current = panelExpanded;
    if (!wasExpanded || panelExpanded || typeof document === 'undefined') return;
    if (panelRef.current?.contains(document.activeElement)) panelReturnFocusRef?.current?.focus?.();
  }, [panelExpanded, panelReturnFocusRef]);

  React.useEffect(() => {
    if (!railPanel || !isDevelopment()) return;
    const railName = React.isValidElement(navigation) ? navigation.props['aria-label'] ?? navigationLabel : null;
    const panelTitle = React.isValidElement(panel) ? panel.props.title : null;
    if (typeof railName === 'string' && typeof panelTitle === 'string' && railName.trim() === panelTitle.trim()) {
      // eslint-disable-next-line no-console
      console.warn(`DashboardShell: the rail navigation and the panel navigation share the name "${railName}". Give each navigation landmark a unique name (WAI-ARIA APG landmark regions).`);
    }
  }, [railPanel, navigation, panel, navigationLabel]);

  // In rail-panel, main is the scroll container. Like ScrollArea, it joins the
  // tab order only while it actually overflows (WCAG 2.1.1, axe
  // scrollable-region-focusable); otherwise it stays the -1 skip-link target.
  React.useEffect(() => {
    if (!railPanel) return undefined;
    const node = mainRef.current;
    if (!node) return undefined;
    const measure = () => {
      const next = node.scrollHeight - node.clientHeight > 1;
      setMainOverflows((previous) => (previous === next ? previous : next));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    for (const child of Array.from(node.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [railPanel, children]);

  const onPanelKeyDown = (event) => {
    if (event.key !== 'Escape' || resolvedPanelMode !== 'overlay' || !panelExpanded) return;
    event.stopPropagation();
    onPanelOpenChange?.(false);
    panelReturnFocusRef?.current?.focus?.();
  };

  const skipLink = <a className="lk-dashboard-shell__skip" href={`#${resolvedMainId}`} inert={inertWhen(temporaryOpen)}>{skipLabel}</a>;
  const headerRegion = header != null && <div className="lk-dashboard-shell__header" inert={inertWhen(temporaryOpen)}>{header}</div>;
  const navigationRegion = navigation != null && !(railPanel && isNarrowLayout) && (
    <div className="lk-dashboard-shell__navigation" inert={inertWhen(temporaryOpen)}>
      {withNavigationLabel(navigation, navigationLabel)}
    </div>
  );
  const panelRegion = hasPanel && !isNarrowLayout && (
    <div
      ref={panelRef}
      id={resolvedPanelId}
      className="lk-dashboard-shell__panel"
      data-state={panelExpanded ? 'open' : 'closed'}
      aria-hidden={panelExpanded ? undefined : true}
      inert={inertWhen(!panelExpanded || temporaryOpen)}
      onKeyDown={onPanelKeyDown}
    >
      <div className="lk-dashboard-shell__panel-content">{panel}</div>
    </div>
  );
  const temporaryContent = temporaryNavigation != null
    ? withNavigationLabel(temporaryNavigation, temporaryNavigationLabel)
    : railPanel
      ? <RailPanelDrawerBody navigation={navigation} panel={panel} navigationLabel={navigationLabel} />
      : null;

  return (
    <div
      className={['lk-dashboard-shell', className].filter(Boolean).join(' ')}
      data-layout={layout}
      data-topology={resolvedTopology}
      data-has-narrow-navigation={narrowNavigation != null ? 'true' : 'false'}
      data-has-temporary-navigation={hasTemporaryNavigation ? 'true' : 'false'}
      data-temporary-navigation-open={temporaryOpen ? 'true' : 'false'}
      data-narrow={railPanel ? (isNarrowLayout ? 'true' : 'false') : undefined}
      data-panel-mode={hasPanel ? resolvedPanelMode : undefined}
      data-panel-open={hasPanel ? (panelExpanded ? 'true' : 'false') : undefined}
      style={{
        minHeight: railPanel ? undefined : '100dvh',
        height: railPanel ? '100dvh' : undefined,
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        background: 'var(--color-semantic-background-normal-normal)',
        color: 'var(--color-semantic-label-normal)',
        fontFamily: 'var(--font-sans)',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {skipLink}
      <style>{DASHBOARD_SHELL_STYLES}</style>
      {/* rail-panel follows the visual left-to-right order (L-S6): skip → rail →
          panel → header → main. The other topologies keep skip → header → nav → main. */}
      {railPanel ? <React.Fragment>{navigationRegion}{panelRegion}{headerRegion}</React.Fragment> : <React.Fragment>{headerRegion}{navigationRegion}</React.Fragment>}
      <main
        ref={mainRef}
        id={resolvedMainId}
        tabIndex={railPanel && mainOverflows ? 0 : -1}
        aria-label={mainLabel}
        className={['lk-dashboard-shell__main', mainClassName].filter(Boolean).join(' ')}
        style={mainStyle}
        inert={inertWhen(temporaryOpen)}
      >
        {children}
      </main>
      {narrowNavigation != null && (
        <div className="lk-dashboard-shell__narrow-navigation" inert={inertWhen(temporaryOpen)}>
          {withNavigationLabel(narrowNavigation, narrowNavigationLabel)}
        </div>
      )}
      {hasTemporaryNavigation && (
        <Drawer
          id={resolvedTemporaryNavigationId}
          open={temporaryOpen}
          side="left"
          width={temporaryNavigationWidth}
          appearance={temporaryNavigationAppearance}
          title={temporaryNavigationTitle}
          ariaLabel={temporaryNavigationLabel}
          closeLabel={temporaryNavigationCloseLabel}
          closeButtonVariant={temporaryNavigationCloseButtonVariant}
          onClose={onTemporaryNavigationClose}
          initialFocusRef={temporaryNavigationInitialFocusRef}
          returnFocusRef={isNarrowLayout ? temporaryNavigationReturnFocusRef : mainRef}
          bodyStyle={railPanel && temporaryNavigation == null
            ? { padding: 0, overflow: 'auto', scrollbarGutter: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }
            : { padding: 0, overflow: 'auto', scrollbarGutter: 'auto' }}
        >
          {temporaryContent}
        </Drawer>
      )}
    </div>
  );
}
