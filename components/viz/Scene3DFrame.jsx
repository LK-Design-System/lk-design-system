import React from 'react';

/**
 * LK ROBOTICS — Scene3DFrame
 * Chrome shell for a 3D viewport (three / @react-three/fiber). Dark framed
 * surface with a top-left HUD (title + badges), a top-right toolbar slot, and
 * loading / empty overlays. The actual 3D canvas is passed as `children`.
 */
export function Scene3DFrame({ children, title, badges, hud, toolbar, overlay, status, loading = false, empty, label = '3D 뷰포트', style, ...rest }) {
  return (
    <div role="region" aria-label={label} style={{ position: 'relative', width: '100%', height: '100%', minHeight: 220, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      background: 'var(--color-semantic-inverse-background)', border: '1px solid var(--color-semantic-line-normal-normal)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {children}
      {overlay != null && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>{overlay}</div>}
      {(title != null || badges != null || hud != null) && (
        <div style={{ position: 'absolute', left: 12, top: 12, display: 'grid', gap: 8, pointerEvents: 'none' }}>
          {(title != null || badges != null) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {title != null && <span style={{ fontSize: 12, fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', color: 'var(--color-semantic-inverse-label)', opacity: 0.9 }}>{title}</span>}
              {badges}
            </div>
          )}
          {hud}
        </div>
      )}
      {toolbar != null && <div style={{ position: 'absolute', right: 12, top: 12 }}>{toolbar}</div>}
      {status != null && <div style={{ position: 'absolute', left: 12, bottom: 12, display: 'inline-flex', alignItems: 'center', maxWidth: 'calc(100% - 24px)', padding: '4px 9px', borderRadius: 'var(--radius-sm)', background: 'var(--material-control-dimmer)', color: 'var(--inverse-label-neutral)', fontSize: 11, fontWeight: 'var(--fw-semibold)', fontVariantNumeric: 'tabular-nums' }}>{status}</div>}
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--scrim-dark)', color: 'var(--color-semantic-inverse-label)', fontSize: 13, fontWeight: 'var(--fw-semibold)' }}>
          불러오는 중…
        </div>
      )}
      {!loading && empty != null && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--inverse-label-alternative)', fontSize: 13 }}>{empty}</div>
      )}
    </div>
  );
}
