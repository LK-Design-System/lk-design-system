import React from 'react';

function usePulseKeyframes() {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('lk-stream-kf')) return;
    const el = document.createElement('style');
    el.id = 'lk-stream-kf';
    el.textContent = '@keyframes lk-stream-pulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes lk-stream-spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(el);
  }, []);
}

/**
 * LK ROBOTICS — VideoStreamTile
 * Chrome shell for a live video stream (RTSP/WebRTC iframe or <video>), styled
 * to match its viz-group sibling Scene3DFrame — a dark aspect-ratio frame with
 * a top scrim, a top-left HUD (live dot + uppercase mono label), and centered
 * loading / disconnected overlays. The video element is passed as children and
 * stays the app's job (DS owns chrome, app owns the render).
 */
export function VideoStreamTile({ children, label, status = 'live', aspectRatio = '16 / 9', style, ...rest }) {
  usePulseKeyframes();
  const showHud = label != null;
  return (
    <div
      style={{
        position: 'relative', width: '100%', aspectRatio, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        background: 'var(--surface-inverse)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      {children}
      {showHud && (
        <React.Fragment>
          <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 52, pointerEvents: 'none',
            background: 'linear-gradient(180deg, var(--material-control-dimmer), transparent)' }} />
          <div style={{ position: 'absolute', left: 12, top: 12, display: 'flex', alignItems: 'center', gap: 7, pointerEvents: 'none' }}>
            {status === 'live' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-danger)', flexShrink: 0,
              animation: 'lk-stream-pulse 1.4s var(--ease-in-out) infinite' }} />}
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase',
              color: 'var(--text-on-inverse)', opacity: 0.9 }}>{label}</span>
          </div>
        </React.Fragment>
      )}
      {status === 'loading' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--scrim-dark)' }}>
          <span style={{ width: 30, height: 30, borderRadius: '50%', border: '3px solid var(--inverse-line-strong)', borderTopColor: 'var(--lk-accent)', animation: 'lk-stream-spin 0.8s linear infinite' }} />
        </div>
      )}
      {status === 'disconnected' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center',
          background: 'var(--material-dimmer)', color: 'var(--inverse-label-neutral)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
          연결 끊김
        </div>
      )}
    </div>
  );
}
