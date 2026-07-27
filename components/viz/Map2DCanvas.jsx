import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';
import { ViewerFrame, VIEWER_BLOCKING_STATES } from './ViewerFrame.jsx';
import { ViewerToolbar, ViewerToolbarButton } from './ViewerToolbar.jsx';
import { resolveViewerState } from '../internal/viewer-state.js';
import { usePanZoomViewport } from '../internal/usePanZoomViewport.js';

const DEFAULT_VIEWPORT = { x: 0, y: 0, z: 1 };

/**
 * LK ROBOTICS — Map2DCanvas
 *
 * Renderer-independent pan / zoom shell for 2D maps. Ordinary image, SVG, and
 * canvas content starts at the viewport's top-left by default. Renderers that
 * use a world-space origin may opt into `contentOrigin="center"` explicitly.
 */
export function Map2DCanvas({
  children,
  minZoom = 0.25,
  maxZoom = 8,
  grid = true,
  controls = true,
  panEnabled = true,
  wheelZoom = true,
  keyboard = true,
  contentOrigin = 'top-left',
  viewport,
  defaultViewport = DEFAULT_VIEWPORT,
  onViewportChange,
  onFit,
  toolbar,
  overlay,
  status,
  source,
  badges,
  hud,
  state,
  availability,
  connection,
  freshness,
  playback,
  stateLabel,
  stateDescription,
  stateIcon,
  stateAction,
  appearance = 'light',
  variant = 'standalone',
  label = '2D 맵 캔버스',
  style,
  tabIndex,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onWheel,
  onKeyDown,
  ...rootProps
}) {
  const interactionState = resolveViewerState({
    state,
    availability,
    connection,
    freshness,
    playback,
  });
  const interactionBlocked = VIEWER_BLOCKING_STATES.includes(interactionState);
  const {
    rootRef,
    renderedViewport,
    commitViewport,
    zoomAt,
    resetViewport,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleKeyDown,
  } = usePanZoomViewport({
    viewport,
    defaultViewport,
    minZoom,
    maxZoom,
    contentOrigin,
    interactionBlocked,
    panEnabled,
    wheelZoom,
    keyboard,
    onViewportChange,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onWheel,
    onKeyDown,
  });

  const t = renderedViewport;
  const renderedChildren = typeof children === 'function'
    ? children({ viewport: t, setViewport: commitViewport })
    : children;
  const centeredContent = contentOrigin === 'center';
  const gridPosition = centeredContent
    ? `calc(50% + ${t.x}px) calc(50% + ${t.y}px)`
    : `${t.x}px ${t.y}px`;
  const viewerToolbar = controls ? (
    <ViewerToolbar
      orientation="vertical"
      appearance={appearance === 'dark' ? 'on-dark' : 'surface'}
      label="지도 보기"
      data-lk-viewport-control=""
    >
      <ViewerToolbarButton label="확대" onClick={() => zoomAt(1.2)}>
        <Icon name="plus" size={16} aria-hidden="true" />
      </ViewerToolbarButton>
      <ViewerToolbarButton label="축소" onClick={() => zoomAt(0.8)}>
        <Icon name="minus" size={16} aria-hidden="true" />
      </ViewerToolbarButton>
      {onFit != null && (
        <ViewerToolbarButton label="전체 보기" onClick={onFit}>
          <Icon name="full" size={16} aria-hidden="true" />
        </ViewerToolbarButton>
      )}
      <ViewerToolbarButton label="보기 초기화" onClick={resetViewport}>
        <Icon name="reset" size={16} aria-hidden="true" />
      </ViewerToolbarButton>
    </ViewerToolbar>
  ) : undefined;

  return (
    <ViewerFrame
      {...rootProps}
      ref={rootRef}
      label={label}
      appearance={appearance}
      variant={variant}
      source={source}
      badges={badges}
      hud={hud}
      toolbar={toolbar !== undefined ? toolbar : viewerToolbar}
      toolbarPlacement="bottom-right"
      overlay={overlay}
      status={status ?? (controls ? `${Math.round(t.z * 100)}%` : undefined)}
      state={state}
      availability={availability}
      connection={connection}
      freshness={freshness}
      playback={playback}
      stateLabel={stateLabel}
      stateDescription={stateDescription}
      stateIcon={stateIcon}
      stateAction={stateAction}
      data-lk-map-canvas=""
      tabIndex={interactionBlocked ? undefined : keyboard ? 0 : tabIndex}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        minHeight: 200,
        '--map-grid-line': 'var(--viewer-border)',
        backgroundColor: appearance === 'dark' ? 'var(--viewer-surface)' : 'var(--viewer-surface-elevated)',
        cursor: interactionBlocked ? 'default' : panEnabled ? 'grab' : 'default',
        touchAction: !interactionBlocked && panEnabled ? 'none' : 'auto',
        backgroundImage: grid
          ? 'linear-gradient(var(--map-grid-line) 1px,transparent 1px),linear-gradient(90deg,var(--map-grid-line) 1px,transparent 1px)'
          : 'none',
        backgroundSize: grid ? `${24 * t.z}px ${24 * t.z}px` : undefined,
        backgroundPosition: grid ? gridPosition : undefined,
        ...style,
      }}
    >
      <div
        data-lk-map-content=""
        style={{
          position: 'absolute',
          left: centeredContent ? '50%' : 0,
          top: centeredContent ? '50%' : 0,
          transform: `translate(${t.x}px, ${t.y}px) scale(${t.z})`,
          transformOrigin: '0 0',
        }}
      >
        {renderedChildren}
      </div>
    </ViewerFrame>
  );
}
