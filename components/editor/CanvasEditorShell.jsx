import React from 'react';

const DRAWER_EXIT_MS = 220;

/**
 * LK ROBOTICS - CanvasEditorShell
 * Stable frame for canvas-based editors. The shell owns regions and their
 * responsive relationship; domain workflows own the content inside each slot.
 */
export function CanvasEditorShell({
  title,
  description,
  headerStart,
  toolbar,
  subheader,
  tools,
  layers,
  children,
  panel,
  panelMode = 'docked',
  panelOpen = true,
  onPanelOpenChange,
  status,
  panelWidth = 280,
  layerPanelWidth = 236,
  toolsLabel = '편집 도구',
  layersLabel = '레이어',
  canvasLabel = '편집 캔버스',
  panelLabel = '속성 패널',
  statusLabel = '편집 상태',
  style,
  ...rest
}) {
  const shellClass = 'lk-canvas-editor-shell';
  const hasTools = tools != null;
  const hasLayers = layers != null;
  const hasPanelContent = panel != null;
  const wantsPanel = hasPanelContent && panelOpen !== false;
  const isPanelDrawer = panelMode === 'drawer';
  const wantsDrawerPanel = wantsPanel && isPanelDrawer;
  const [drawerRendered, setDrawerRendered] = React.useState(wantsDrawerPanel);
  const [drawerVisible, setDrawerVisible] = React.useState(false);

  React.useEffect(() => {
    if (!isPanelDrawer) {
      setDrawerRendered(false);
      setDrawerVisible(false);
      return undefined;
    }

    if (wantsDrawerPanel) {
      setDrawerRendered(true);
      const frame = requestAnimationFrame(() => setDrawerVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setDrawerVisible(false);
    const timeout = setTimeout(() => setDrawerRendered(false), DRAWER_EXIT_MS);
    return () => clearTimeout(timeout);
  }, [isPanelDrawer, wantsDrawerPanel]);

  React.useEffect(() => {
    if (!isPanelDrawer || !wantsDrawerPanel || typeof onPanelOpenChange !== 'function') return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onPanelOpenChange(false, 'escape');
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPanelDrawer, onPanelOpenChange, wantsDrawerPanel]);

  const hasDockedPanel = wantsPanel && !isPanelDrawer;
  const hasDrawerPanel = isPanelDrawer && drawerRendered;
  const bodyClass = [
    'lk-canvas-editor-shell__body',
    hasTools ? 'lk-canvas-editor-shell__body--tools' : '',
    hasLayers ? 'lk-canvas-editor-shell__body--layers' : '',
    hasDockedPanel ? 'lk-canvas-editor-shell__body--panel' : '',
    hasDrawerPanel ? 'lk-canvas-editor-shell__body--drawer' : '',
  ].filter(Boolean).join(' ');
  const hasHeader = title != null || description != null || headerStart != null || toolbar != null;

  return (
    <div
      className={shellClass}
      style={{
        '--lk-editor-panel-width': `${panelWidth}px`,
        '--lk-editor-layer-panel-width': `${layerPanelWidth}px`,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minWidth: 0,
        minHeight: 320,
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--color-semantic-background-elevated-normal)',
        color: 'var(--color-semantic-label-normal)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <style>
        {`@media (max-width: 760px) {
          .${shellClass} .lk-canvas-editor-shell__body {
            grid-template-columns: minmax(0, 1fr) !important;
            grid-template-rows: minmax(260px, 1fr) auto auto !important;
          }
          .${shellClass} .lk-canvas-editor-shell__body--tools {
            grid-template-columns: auto minmax(0, 1fr) !important;
          }
          .${shellClass} .lk-canvas-editor-shell__tools {
            grid-column: 1 !important;
            grid-row: 1 !important;
          }
          .${shellClass} .lk-canvas-editor-shell__canvas {
            grid-column: 1 / -1 !important;
            grid-row: 1 !important;
          }
          .${shellClass} .lk-canvas-editor-shell__body--tools .lk-canvas-editor-shell__canvas {
            grid-column: 2 !important;
          }
          .${shellClass} .lk-canvas-editor-shell__layers {
            grid-column: 1 / -1 !important;
            grid-row: 2 !important;
            width: auto !important;
            max-height: 200px !important;
            border-right: 0 !important;
            border-top: 1px solid var(--color-semantic-line-normal-normal) !important;
          }
          .${shellClass} .lk-canvas-editor-shell__panel--docked {
            grid-column: 1 / -1 !important;
            grid-row: 3 !important;
            width: auto !important;
            max-height: 220px !important;
            border-left: 0 !important;
            border-top: 1px solid var(--color-semantic-line-normal-normal) !important;
          }
          .${shellClass} .lk-canvas-editor-shell__panel--drawer {
            width: min(var(--lk-editor-panel-width), calc(100% - 48px)) !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .${shellClass} .lk-canvas-editor-shell__panel--drawer {
            transition: none !important;
          }
        }`}
      </style>

      {hasHeader && (
        <header
          className="lk-canvas-editor-shell__header"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            minHeight: 56,
            padding: headerStart != null ? '8px 14px 8px 8px' : '8px 14px',
            borderBottom: '1px solid var(--color-semantic-line-normal-normal)',
            boxSizing: 'border-box',
            flexShrink: 0,
          }}
        >
          {headerStart != null && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              {headerStart}
            </div>
          )}
          {(title != null || description != null) && (
            <div style={{ display: 'grid', gap: 1, minWidth: 0, flex: 1 }}>
              {title != null && (
                <h2 style={{ minWidth: 0, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--headline2-size)', lineHeight: 'var(--headline2-line)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-strong)', letterSpacing: 0 }}>
                  {title}
                </h2>
              )}
              {description != null && (
                <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-medium)', color: 'var(--color-semantic-label-neutral)', letterSpacing: 0 }}>
                  {description}
                </div>
              )}
            </div>
          )}
          {toolbar != null && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: title == null && description == null ? 'auto' : 0, flexShrink: 0 }}>
              {toolbar}
            </div>
          )}
        </header>
      )}

      {subheader != null && (
        <div className="lk-canvas-editor-shell__subheader" style={{ flexShrink: 0 }}>
          {subheader}
        </div>
      )}

      <div
        className={bodyClass}
        style={{
          display: 'grid',
          gridTemplateColumns: `${hasTools ? 'auto ' : ''}${hasLayers ? 'var(--lk-editor-layer-panel-width) ' : ''}minmax(0, 1fr)${hasDockedPanel ? ' var(--lk-editor-panel-width)' : ''}`,
          gridTemplateRows: 'minmax(0, 1fr)',
          position: 'relative',
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {hasTools && (
          <nav
            className="lk-canvas-editor-shell__tools"
            aria-label={toolsLabel}
            style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0, padding: 8, borderRight: '1px solid var(--color-semantic-line-normal-normal)', background: 'var(--color-semantic-background-elevated-normal)', boxSizing: 'border-box' }}
          >
            {tools}
          </nav>
        )}
        {hasLayers && (
          <aside
            className="lk-canvas-editor-shell__layers"
            aria-label={layersLabel}
            style={{ width: layerPanelWidth, minWidth: 0, minHeight: 0, borderRight: '1px solid var(--color-semantic-line-normal-normal)', overflow: 'auto', background: 'var(--color-semantic-background-elevated-normal)', boxSizing: 'border-box' }}
          >
            {layers}
          </aside>
        )}
        <section
          className="lk-canvas-editor-shell__canvas"
          aria-label={canvasLabel}
          style={{ minWidth: 0, minHeight: 0, position: 'relative', overflow: 'hidden', background: 'var(--color-semantic-background-normal-alternative)' }}
        >
          {children}
        </section>
        {hasDockedPanel && (
          <aside
            aria-label={panelLabel}
            className="lk-canvas-editor-shell__panel lk-canvas-editor-shell__panel--docked"
            style={{ width: panelWidth, minWidth: 0, minHeight: 0, borderLeft: '1px solid var(--color-semantic-line-normal-normal)', overflow: 'auto', background: 'var(--color-semantic-background-elevated-normal)', boxSizing: 'border-box' }}
          >
            {panel}
          </aside>
        )}
        {hasDrawerPanel && (
          <aside
            aria-label={panelLabel}
            aria-hidden={!drawerVisible}
            inert={!drawerVisible ? '' : undefined}
            className="lk-canvas-editor-shell__panel lk-canvas-editor-shell__panel--drawer"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 3,
              width: panelWidth,
              maxWidth: 'calc(100% - 48px)',
              minWidth: 0,
              overflow: 'auto',
              borderLeft: '1px solid var(--color-semantic-line-normal-normal)',
              background: 'var(--color-semantic-background-elevated-normal)',
              boxShadow: 'var(--shadow-lg)',
              boxSizing: 'border-box',
              opacity: drawerVisible ? 1 : 0,
              pointerEvents: drawerVisible ? 'auto' : 'none',
              transform: drawerVisible ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform var(--dur-slow) var(--ease-out), opacity var(--dur-base) var(--ease-out)',
              willChange: 'transform, opacity',
            }}
          >
            {panel}
          </aside>
        )}
      </div>

      {status != null && (
        <footer
          aria-label={statusLabel}
          style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 34, padding: '5px 14px', borderTop: '1px solid var(--color-semantic-line-normal-normal)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', color: 'var(--color-semantic-label-neutral)', background: 'var(--color-semantic-background-normal-alternative)', boxSizing: 'border-box', flexShrink: 0 }}
        >
          {status}
        </footer>
      )}
    </div>
  );
}
