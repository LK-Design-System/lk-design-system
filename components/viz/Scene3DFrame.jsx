import React from 'react';

/**
 * LK ROBOTICS — Scene3DFrame
 * Chrome shell for a 3D viewport (three / @react-three/fiber). Dark framed
 * surface with a top-left HUD (title + badges), a top-right toolbar slot, and
 * loading / empty overlays. The actual 3D canvas is passed as `children`.
 */
export function Scene3DFrame({ children, title, badges, toolbar, loading = false, empty, style, ...rest }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 220, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      background: 'var(--surface-inverse)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {children}
      {(title != null || badges != null) && (
        <div style={{ position: 'absolute', left: 12, top: 12, display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
          {title != null && <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-on-inverse)', opacity: 0.9 }}>{title}</span>}
          {badges}
        </div>
      )}
      {toolbar != null && <div style={{ position: 'absolute', right: 12, top: 12 }}>{toolbar}</div>}
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'rgba(8,14,33,0.45)', color: 'var(--text-on-inverse)', fontSize: 13, fontWeight: 600 }}>
          불러오는 중…
        </div>
      )}
      {!loading && empty != null && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.52)', fontSize: 13 }}>{empty}</div>
      )}
    </div>
  );
}
