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
export function Map2DCanvas({ children, minZoom = 0.25, maxZoom = 8, grid = true, controls = true, style, ...rest }) {
  const [t, setT] = React.useState({ x: 0, y: 0, z: 1 });
  const drag = React.useRef(null);
  const clamp = (z) => Math.max(minZoom, Math.min(maxZoom, z));
  const down = (e) => { drag.current = { x: e.clientX, y: e.clientY, tx: t.x, ty: t.y }; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => {
    const d = drag.current;
    if (!d) return;
    // Snapshot d locally — drag.current can be nulled by `up` before this functional
    // update actually flushes, which crashed with "Cannot read properties of null (reading 'tx')".
    setT((p) => ({ ...p, x: d.tx + (e.clientX - d.x), y: d.ty + (e.clientY - d.y) }));
  };
  const up = () => { drag.current = null; };
  const wheel = (e) => { e.preventDefault(); setT((p) => ({ ...p, z: clamp(p.z * (e.deltaY < 0 ? 1.1 : 0.9)) })); };
  const zoom = (f) => setT((p) => ({ ...p, z: clamp(p.z * f) }));
  return (
    <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={wheel}
      style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', minHeight: 200, borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)', cursor: 'grab', touchAction: 'none', fontFamily: 'var(--font-sans)',
        backgroundImage: grid ? 'linear-gradient(var(--line-neutral) 1px,transparent 1px),linear-gradient(90deg,var(--line-neutral) 1px,transparent 1px)' : 'none',
        backgroundSize: grid ? `${24 * t.z}px ${24 * t.z}px` : undefined,
        backgroundPosition: grid ? `${t.x}px ${t.y}px` : undefined, ...style }} {...rest}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(${t.x}px, ${t.y}px) scale(${t.z})`, transformOrigin: '0 0' }}>
        {children}
      </div>
      {controls && (
        <ViewerToolbar orientation="vertical" style={{ position: 'absolute', right: 10, bottom: 10 }}>
          <ViewerToolbarButton label="확대" onClick={() => zoom(1.2)}><Icon name="plus" size={18} /></ViewerToolbarButton>
          <ViewerToolbarButton label="축소" onClick={() => zoom(0.8)}><Icon name="minus" size={18} /></ViewerToolbarButton>
          <ViewerToolbarButton label="초기화" onClick={() => setT({ x: 0, y: 0, z: 1 })}><Icon name="reset" size={18} /></ViewerToolbarButton>
        </ViewerToolbar>
      )}
      {controls && <span style={{ position: 'absolute', left: 10, bottom: 10, fontSize: 11, fontWeight: 'var(--fw-bold)', color: 'var(--label-alternative)', background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '2px 7px', fontVariantNumeric: 'tabular-nums' }}>{Math.round(t.z * 100)}%</span>}
    </div>
  );
}
