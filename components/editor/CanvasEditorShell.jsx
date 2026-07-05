import React from 'react';

/**
 * LK ROBOTICS — CanvasEditorShell
 * Editor layout scaffold — optional title bar, left tool rail (`tools`), center
 * canvas (`children`), right properties panel (`panel`), bottom status bar
 * (`status`). Domain editors (PGM paint, zone polygons) drop their canvas +
 * controls into the slots; the shell owns the frame + regions.
 */
export function CanvasEditorShell({ title, tools, children, panel, status, panelWidth = 280, style, ...rest }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 320, border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--surface-raised)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {title != null && <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: '1px solid var(--bw-band)', fontSize: 13, fontWeight: 700, color: 'var(--label-strong)' }}>{title}</div>}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {tools != null && <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 8, borderRight: '1px solid var(--bw-band)', background: 'var(--surface-subtle)' }}>{tools}</div>}
        <div style={{ flex: 1, minWidth: 0, position: 'relative', background: 'var(--surface-sunken)' }}>{children}</div>
        {panel != null && <div style={{ width: panelWidth, flexShrink: 0, borderLeft: '1px solid var(--bw-band)', overflow: 'auto', background: 'var(--surface-raised)' }}>{panel}</div>}
      </div>
      {status != null && <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 14px', borderTop: '1px solid var(--bw-band)', fontSize: 12, color: 'var(--label-alternative)', background: 'var(--surface-subtle)' }}>{status}</div>}
    </div>
  );
}
