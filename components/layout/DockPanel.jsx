import React from 'react';

/**
 * LK ROBOTICS — DockPanel
 * An over-canvas side panel that collapses to a protruding chevron handle —
 * for map/editor overlays where a properties panel must tuck away without
 * leaving the canvas. `side` = 'left' | 'right'; controlled (`open`) or
 * uncontrolled (`defaultOpen`). The handle stays visible when collapsed.
 */
export function DockPanel({ side = 'right', open, defaultOpen = true, onOpenChange, title, width = 300, children, style, ...rest }) {
  const controlled = open !== undefined;
  const [internal, setInternal] = React.useState(defaultOpen);
  const isOpen = controlled ? open : internal;
  const setOpen = (v) => { if (!controlled) setInternal(v); onOpenChange && onOpenChange(v); };
  const isLeft = side === 'left';

  const Handle = (
    <button type="button" aria-label={isOpen ? '패널 접기' : '패널 펼치기'} aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}
      style={{ position: 'absolute', top: 16, [isLeft ? 'right' : 'left']: -20, width: 20, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid var(--bw-border)', [isLeft ? 'borderLeft' : 'borderRight']: 'none',
        borderRadius: isLeft ? '0 var(--radius-sm) var(--radius-sm) 0' : 'var(--radius-sm) 0 0 var(--radius-sm)',
        background: 'var(--color-semantic-background-elevated-normal)', cursor: 'pointer', color: 'var(--color-semantic-label-neutral)', boxShadow: 'var(--shadow-sm)' }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: (isOpen === isLeft) ? 'rotate(180deg)' : 'none' }}><path d="m9 18 6-6-6-6" /></svg>
    </button>
  );

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', justifyContent: isLeft ? 'flex-start' : 'flex-end', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ position: 'relative', width: isOpen ? width : 0, height: '100%', overflow: 'visible', transition: 'width var(--dur-normal, 220ms) var(--ease-out)' }}>
        {Handle}
        <div aria-hidden={!isOpen} style={{ width, height: '100%', boxSizing: 'border-box', overflow: 'auto', opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none', transition: 'opacity var(--dur-fast) var(--ease-out)',
          background: 'var(--color-semantic-background-elevated-normal)', borderLeft: isLeft ? 'none' : '1px solid var(--bw-border)', borderRight: isLeft ? '1px solid var(--bw-border)' : 'none' }}>
          {title != null && <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--bw-border)', fontSize: 14, fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-strong)' }}>{title}</div>}
          <div style={{ padding: 16 }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
