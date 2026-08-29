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
  const resolvedTopology = topology === 'side-first' ? 'side-first' : 'header-first';
  const [autoNarrow, setAutoNarrow] = React.useState(false);

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

  const isNarrowLayout = layout === 'narrow' || (layout === 'auto' && autoNarrow);
  const hasTemporaryNavigation = temporaryNavigation != null;
  const temporaryOpen = hasTemporaryNavigation && temporaryNavigationOpen && isNarrowLayout;

  return (
    <div
      className={['lk-dashboard-shell', className].filter(Boolean).join(' ')}
      data-layout={layout}
      data-topology={resolvedTopology}
      data-has-narrow-navigation={narrowNavigation != null ? 'true' : 'false'}
      data-has-temporary-navigation={hasTemporaryNavigation ? 'true' : 'false'}
      data-temporary-navigation-open={temporaryOpen ? 'true' : 'false'}
      style={{
        minHeight: '100dvh',
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
      <a className="lk-dashboard-shell__skip" href={`#${resolvedMainId}`} inert={inertWhen(temporaryOpen)}>{skipLabel}</a>
      <style>{DASHBOARD_SHELL_STYLES}</style>
      {header != null && <div className="lk-dashboard-shell__header" inert={inertWhen(temporaryOpen)}>{header}</div>}
      {navigation != null && (
        <div className="lk-dashboard-shell__navigation" inert={inertWhen(temporaryOpen)}>
          {withNavigationLabel(navigation, navigationLabel)}
        </div>
      )}
      <main
        id={resolvedMainId}
        tabIndex={-1}
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
          returnFocusRef={temporaryNavigationReturnFocusRef}
          bodyStyle={{ padding: 0, overflow: 'hidden', scrollbarGutter: 'auto' }}
        >
          {withNavigationLabel(temporaryNavigation, temporaryNavigationLabel)}
        </Drawer>
      )}
    </div>
  );
}
