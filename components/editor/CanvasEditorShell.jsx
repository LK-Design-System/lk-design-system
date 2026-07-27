import React from 'react';
import { DockPanel } from '../layout/DockPanel.jsx';

function useControllableOpen(value, defaultValue, onChange) {
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const current = controlled ? value : internal;

  const setCurrent = React.useCallback((next, reason = 'toggle') => {
    if (!controlled) setInternal(next);
    onChange?.(next, reason);
  }, [controlled, onChange]);

  return [current, setCurrent];
}

function CanvasEditorDockRegion({
  className,
  side,
  open,
  onOpenChange,
  reasonRef,
  width,
  minWidth,
  maxWidth,
  resizable,
  onWidthChange,
  label,
  style,
  children,
}) {
  return (
    <div
      className={className}
      onKeyDownCapture={(event) => {
        if (event.key === 'Escape') reasonRef.current = 'escape';
      }}
      style={{ minWidth: 0, minHeight: 0, zIndex: 2, ...style }}
    >
      <DockPanel
        side={side}
        open={open}
        onOpenChange={onOpenChange}
        width={width}
        minWidth={minWidth}
        maxWidth={maxWidth}
        resizable={resizable}
        onWidthChange={onWidthChange}
        bodyPadding={0}
        bodyStyle={{ overflow: 'hidden' }}
        aria-label={label}
        style={{ width: '100%' }}
      >
        {children}
      </DockPanel>
    </div>
  );
}

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
  responsiveNavigation,
  tools,
  layers,
  children,
  panel,
  panelMode = 'docked',
  panelOpen,
  defaultPanelOpen = true,
  onPanelOpenChange,
  layersOpen,
  defaultLayersOpen = true,
  onLayersOpenChange,
  status,
  panelWidth = 280,
  panelMinWidth = 240,
  panelMaxWidth = 420,
  onPanelWidthChange,
  layerPanelWidth = 236,
  layerPanelMinWidth = 200,
  layerPanelMaxWidth = 360,
  onLayerPanelWidthChange,
  resizablePanels = true,
  mobileActiveRegion = 'canvas',
  toolsLabel = '편집 도구',
  layersLabel = '레이어',
  canvasLabel = '편집 캔버스',
  panelLabel = '속성 패널',
  statusLabel = '편집 상태',
  className,
  style,
  ...rest
}) {
  const shellClass = 'lk-canvas-editor-shell';
  const rootClassName = [shellClass, className].filter(Boolean).join(' ');
  const hasTools = tools != null;
  const hasLayers = layers != null;
  const hasPanel = panel != null;
  const isPanelDrawer = panelMode === 'drawer';
  const [isPanelOpen, setPanelOpen] = useControllableOpen(
    panelOpen,
    defaultPanelOpen,
    onPanelOpenChange,
  );
  const [isLayersOpen, setLayersOpen] = useControllableOpen(
    layersOpen,
    defaultLayersOpen,
    onLayersOpenChange,
  );
  const panelReasonRef = React.useRef('toggle');
  const layersReasonRef = React.useRef('toggle');
  const hasHeader = title != null || description != null || headerStart != null || toolbar != null;

  const bodyClass = [
    'lk-canvas-editor-shell__body',
    hasTools ? 'lk-canvas-editor-shell__body--tools' : '',
    hasLayers ? 'lk-canvas-editor-shell__body--layers' : '',
    hasPanel && !isPanelDrawer ? 'lk-canvas-editor-shell__body--panel' : '',
    hasPanel && isPanelDrawer ? 'lk-canvas-editor-shell__body--drawer' : '',
  ].filter(Boolean).join(' ');

  const handlePanelOpenChange = (open) => {
    const reason = panelReasonRef.current;
    panelReasonRef.current = 'toggle';
    setPanelOpen(open, reason);
  };

  const handleLayersOpenChange = (open) => {
    const reason = layersReasonRef.current;
    layersReasonRef.current = 'toggle';
    setLayersOpen(open, reason);
  };

  return (
    <div
      className={rootClassName}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minWidth: 0,
        minHeight: 320,
        containerType: 'inline-size',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--color-semantic-background-elevated-normal)',
        color: 'var(--color-semantic-label-normal)',
        fontFamily: 'var(--font-sans)',
        '--canvas-editor-panel-width': `${panelWidth}px`,
        ...style,
      }}
      {...rest}
    >
      {hasHeader && (
        <header
          className="lk-canvas-editor-shell__header"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            minHeight: 56,
            padding: headerStart != null ? 'var(--space-2) var(--space-4) var(--space-2) var(--space-2)' : 'var(--space-2) var(--space-4)',
            borderBottom: '1px solid var(--color-semantic-line-normal-normal)',
            boxSizing: 'border-box',
            flexShrink: 0,
          }}
        >
          {headerStart != null && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', flexShrink: 0 }}>
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
                <div className="lk-canvas-editor-shell__header-description" style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-medium)', color: 'var(--color-semantic-label-neutral)', letterSpacing: 0 }}>
                  {description}
                </div>
              )}
            </div>
          )}
          {toolbar != null && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginLeft: title == null && description == null ? 'auto' : 0, flexShrink: 0 }}>
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

      {responsiveNavigation != null && (
        <div className="lk-canvas-editor-shell__responsive-navigation" style={{ flexShrink: 0 }}>
          {responsiveNavigation}
        </div>
      )}

      <div
        className={bodyClass}
        data-mobile-region={mobileActiveRegion}
        data-mobile-has-tools={hasTools ? 'true' : 'false'}
        style={{
          display: 'grid',
          gridTemplateColumns: `${hasTools ? 'auto ' : ''}${hasLayers ? 'auto ' : ''}minmax(0, 1fr)${hasPanel && !isPanelDrawer ? ' auto' : ''}`,
          gridTemplateRows: 'minmax(0, 1fr)',
          position: 'relative',
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {hasTools && (
          <div
            role="group"
            aria-label={toolsLabel}
            className="lk-canvas-editor-shell__tools"
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minHeight: 0, padding: 'var(--space-2)', borderRight: '1px solid var(--color-semantic-line-normal-normal)', background: 'var(--color-semantic-background-elevated-normal)', boxSizing: 'border-box' }}
          >
            {tools}
          </div>
        )}

        {hasLayers && (
          <CanvasEditorDockRegion
            className="lk-canvas-editor-shell__layers"
            side="left"
            open={isLayersOpen}
            onOpenChange={handleLayersOpenChange}
            reasonRef={layersReasonRef}
            width={layerPanelWidth}
            minWidth={layerPanelMinWidth}
            maxWidth={layerPanelMaxWidth}
            resizable={resizablePanels}
            onWidthChange={onLayerPanelWidthChange}
            label={layersLabel}
          >
            {layers}
          </CanvasEditorDockRegion>
        )}

        <section
          className="lk-canvas-editor-shell__canvas"
          aria-label={canvasLabel}
          style={{ minWidth: 0, minHeight: 0, position: 'relative', overflow: 'hidden', background: 'var(--color-semantic-background-normal-alternative)' }}
        >
          {children}
        </section>

        {hasPanel && !isPanelDrawer && (
          <CanvasEditorDockRegion
            className="lk-canvas-editor-shell__panel lk-canvas-editor-shell__panel--docked"
            side="right"
            open={isPanelOpen}
            onOpenChange={handlePanelOpenChange}
            reasonRef={panelReasonRef}
            width={panelWidth}
            minWidth={panelMinWidth}
            maxWidth={panelMaxWidth}
            resizable={resizablePanels}
            onWidthChange={onPanelWidthChange}
            label={panelLabel}
          >
            {panel}
          </CanvasEditorDockRegion>
        )}

        {hasPanel && isPanelDrawer && (
          <CanvasEditorDockRegion
            className="lk-canvas-editor-shell__panel lk-canvas-editor-shell__panel--drawer"
            side="right"
            open={isPanelOpen}
            onOpenChange={handlePanelOpenChange}
            reasonRef={panelReasonRef}
            width={panelWidth}
            minWidth={panelMinWidth}
            maxWidth={panelMaxWidth}
            resizable={resizablePanels}
            onWidthChange={onPanelWidthChange}
            label={panelLabel}
            style={{ position: 'absolute', inset: '0 0 0 auto', zIndex: 4, width: isPanelOpen ? panelWidth : 0, minWidth: 0, pointerEvents: 'auto' }}
          >
            {panel}
          </CanvasEditorDockRegion>
        )}
      </div>

      {status != null && (
        <div
          role="group"
          aria-label={statusLabel}
          className="lk-canvas-editor-shell__status"
          style={{ display: 'flex', alignItems: 'center', minWidth: 0, minHeight: 32, padding: 'var(--space-1) var(--space-4)', borderTop: '1px solid var(--color-semantic-line-normal-normal)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', color: 'var(--color-semantic-label-neutral)', background: 'var(--color-semantic-background-normal-alternative)', boxSizing: 'border-box', flexShrink: 0 }}
        >
          {status}
        </div>
      )}
    </div>
  );
}
