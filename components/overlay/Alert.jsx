import React from 'react';

/**
 * LK ROBOTICS — Alert (modal dialog)
 * A centered confirmation dialog over a navy scrim. Controlled via `open`. Pass
 * `title` + body children; default footer renders a graphite confirm (and an
 * optional cancel), or supply your own `actions` node. Esc / scrim-click close.
 */
export function Alert({
  open = false, title, children, tone = 'default',
  confirmLabel = '확인', cancelLabel, onConfirm, onCancel, onClose,
  actions, closeOnScrim = true, style, ...rest
}) {
  const dismiss = onClose || onCancel;
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape' && dismiss) dismiss(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, dismiss]);
  if (!open) return null;
  const accent = tone === 'danger' ? 'var(--bw-red)' : 'var(--color-primary)';
  const confirmStyle = { height: 44, padding: '0 20px', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--text-on-signal)', background: accent };
  const cancelStyle = { height: 44, padding: '0 20px', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--label-normal)', background: 'var(--bw-white)' };
  return (
    <div
      role="presentation"
      onClick={closeOnScrim ? (e) => { if (e.target === e.currentTarget && dismiss) dismiss(); } : undefined}
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--scrim-dark)', backdropFilter: 'blur(2px)' }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        style={{ width: '100%', maxWidth: 420, background: 'var(--bw-white)', borderRadius: 'var(--radius-3xl)', boxShadow: 'var(--shadow-xl)', padding: '28px 28px 24px', fontFamily: 'var(--font-sans)', ...style }}
        {...rest}
      >
        {title != null && <div style={{ fontSize: 20, fontWeight: 'var(--fw-extra)', letterSpacing: 0, color: 'var(--label-normal)', marginBottom: 10 }}>{title}</div>}
        {children != null && <div style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--label-neutral)', wordBreak: 'keep-all' }}>{children}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          {actions != null ? actions : (
            <React.Fragment>
              {cancelLabel && <button type="button" style={cancelStyle} onClick={onCancel || dismiss}>{cancelLabel}</button>}
              <button type="button" style={confirmStyle} onClick={onConfirm || dismiss}>{confirmLabel}</button>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
