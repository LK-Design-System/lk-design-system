import React from 'react';

/**
 * LK ROBOTICS — CanvasEditorShell
 * Editor layout scaffold — optional title bar, left tool rail (`tools`), center
 * canvas (`children`), right properties panel (`panel`), bottom status bar
 * (`status`). Domain editors (PGM paint, zone polygons) drop their canvas +
 * controls into the slots; the shell owns the frame + regions.
 */
export function CanvasEditorShell({ title, tools, children, panel, status, panelWidth = 280, style, ...rest }) {
  const shellClass = 'lk-canvas-editor-shell';
  const bodyClass = `lk-canvas-editor-shell__body${tools != null ? ' lk-canvas-editor-shell__body--tools' : ''}`;

  return (
    <div className={shellClass} style={{ '--lk-editor-panel-width': `${panelWidth}px`, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 320, border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--surface-raised)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <style>
        {`@media (max-width: 640px) {
          .${shellClass} .lk-canvas-editor-shell__body--tools {
            grid-template-columns: auto minmax(0, 1fr) !important;
            grid-template-rows: minmax(260px, 1fr) auto !important;
          }
          .${shellClass} .lk-canvas-editor-shell__body:not(.lk-canvas-editor-shell__body--tools) {
            grid-template-columns: minmax(0, 1fr) !important;
            grid-template-rows: minmax(260px, 1fr) auto !important;
          }
          .${shellClass} .lk-canvas-editor-shell__panel {
            grid-column: 1 / -1 !important;
            width: auto !important;
            max-height: 180px !important;
            border-left: 0 !important;
            border-top: 1px solid var(--border-subtle) !important;
          }
        }`}
      </style>
      {title != null && <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: 13, fontWeight: 700, color: 'var(--label-strong)' }}>{title}</div>}
      <div className={bodyClass} style={{ display: 'grid', gridTemplateColumns: `${tools != null ? 'auto ' : ''}minmax(0, 1fr)${panel != null ? ' var(--lk-editor-panel-width)' : ''}`, flex: 1, minHeight: 0 }}>
        {tools != null && <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 8, borderRight: '1px solid var(--border-subtle)', background: 'var(--surface-subtle)' }}>{tools}</div>}
        <div style={{ minWidth: 0, position: 'relative', background: 'var(--surface-sunken)' }}>{children}</div>
        {panel != null && <div className="lk-canvas-editor-shell__panel" style={{ width: panelWidth, borderLeft: '1px solid var(--border-subtle)', overflow: 'auto', background: 'var(--surface-raised)' }}>{panel}</div>}
      </div>
      {status != null && <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 14px', borderTop: '1px solid var(--border-subtle)', fontSize: 12, color: 'var(--label-alternative)', background: 'var(--surface-subtle)' }}>{status}</div>}
    </div>
  );
}
