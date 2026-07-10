import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { ViewerToolbar, ViewerToolbarButton } from './ViewerToolbar.jsx';

/**
 * LK ROBOTICS — Map2DCanvas
 * A pan / zoom canvas shell for 2D maps (occupancy grid / PGM). Drag to pan,
 * wheel to zoom, grid background, zoom controls + % readout. The actual map
 * (image, SVG overlays, konva stage) is passed as `children` and is transformed
 * together — heavy rendering stays in the app.
 */
export function Map2DCanvas({
  children,
  minZoom = 0.25,
  maxZoom = 8,
  grid = true,
  controls = true,
  panEnabled = true,
  keyboard = true,
  viewport,
  defaultViewport = { x: 0, y: 0, z: 1 },
  onViewportChange,
  overlay,
  status,
  label = '2D 맵 캔버스',
  style,
  ...rest
}) {
  const controlled = viewport !== undefined;
  const [internalViewport, setInternalViewport] = React.useState(defaultViewport);
  const t = { x: 0, y: 0, z: 1, ...(controlled ? viewport : internalViewport) };
  const drag = React.useRef(null);
  const clamp = (z) => Math.max(minZoom, Math.min(maxZoom, z));
  const commitViewport = (nextOrUpdater) => {
    const next = typeof nextOrUpdater === 'function' ? nextOrUpdater(t) : nextOrUpdater;
    const normalized = { x: next.x || 0, y: next.y || 0, z: clamp(next.z == null ? 1 : next.z) };
    if (!controlled) setInternalViewport(normalized);
    onViewportChange && onViewportChange(normalized);
  };
  const down = (e) => {
    const target = e.target;
    if (!panEnabled || e.button !== 0 || (target && target.closest && target.closest('[data-lk-viewport-control]'))) return;
    drag.current = { x: e.clientX, y: e.clientY, tx: t.x, ty: t.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e) => {
    const d = drag.current;
    if (!d) return;
    // Snapshot d locally — drag.current can be nulled by `up` before this functional
    // update actually flushes, which crashed with "Cannot read properties of null (reading 'tx')".
    commitViewport((p) => ({ ...p, x: d.tx + (e.clientX - d.x), y: d.ty + (e.clientY - d.y) }));
  };
  const up = () => { drag.current = null; };
  const wheel = (e) => { e.preventDefault(); commitViewport((p) => ({ ...p, z: clamp(p.z * (e.deltaY < 0 ? 1.1 : 0.9)) })); };
  const zoom = (f) => commitViewport((p) => ({ ...p, z: clamp(p.z * f) }));
  const reset = () => commitViewport({ x: 0, y: 0, z: 1 });
  const renderedChildren = typeof children === 'function' ? children({ viewport: t, setViewport: commitViewport }) : children;
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={keyboard ? 0 : undefined}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onWheel={wheel}
      onKeyDown={(event) => {
        if (!keyboard) return;
        const step = event.shiftKey ? 48 : 18;
        if (event.key === '+' || event.key === '=') {
          event.preventDefault();
          zoom(1.12);
        } else if (event.key === '-' || event.key === '_') {
          event.preventDefault();
          zoom(0.88);
        } else if (event.key === '0') {
          event.preventDefault();
          reset();
        } else if (panEnabled && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
          event.preventDefault();
          commitViewport((p) => ({
            ...p,
            x: p.x + (event.key === 'ArrowLeft' ? step : event.key === 'ArrowRight' ? -step : 0),
            y: p.y + (event.key === 'ArrowUp' ? step : event.key === 'ArrowDown' ? -step : 0),
          }));
        }
      }}
      style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', minHeight: 200, borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-semantic-line-normal-normal)', background: 'var(--color-semantic-background-normal-alternative)', cursor: panEnabled ? 'grab' : 'default', touchAction: 'none', fontFamily: 'var(--font-sans)', outline: 'none',
        backgroundImage: grid ? 'linear-gradient(var(--color-semantic-line-normal-neutral) 1px,transparent 1px),linear-gradient(90deg,var(--color-semantic-line-normal-neutral) 1px,transparent 1px)' : 'none',
        backgroundSize: grid ? `${24 * t.z}px ${24 * t.z}px` : undefined,
        backgroundPosition: grid ? `${t.x}px ${t.y}px` : undefined, ...style }} {...rest}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(${t.x}px, ${t.y}px) scale(${t.z})`, transformOrigin: '0 0' }}>
        {renderedChildren}
      </div>
      {overlay != null && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>{overlay}</div>}
      {controls && (
        <ViewerToolbar orientation="vertical" style={{ position: 'absolute', right: 10, bottom: 10 }} data-lk-viewport-control="">
          <ViewerToolbarButton label="확대" onClick={() => zoom(1.2)}><Icon name="plus" size={18} /></ViewerToolbarButton>
          <ViewerToolbarButton label="축소" onClick={() => zoom(0.8)}><Icon name="minus" size={18} /></ViewerToolbarButton>
          <ViewerToolbarButton label="초기화" onClick={reset}><Icon name="reset" size={18} /></ViewerToolbarButton>
        </ViewerToolbar>
      )}
      {(status != null || controls) && <span style={{ position: 'absolute', left: 10, bottom: 10, fontSize: 11, fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-neutral)', background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-sm)', padding: '2px 7px', fontVariantNumeric: 'tabular-nums', boxShadow: 'var(--shadow-xs)' }}>{status ?? `${Math.round(t.z * 100)}%`}</span>}
    </div>
  );
}
