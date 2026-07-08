import React from 'react';

/**
 * LK ROBOTICS — Modal
 * A general content dialog over a navy scrim — header (title + close), a
 * scrollable body, and an optional footer slot. Larger and more flexible than
 * Alert. Controlled via `open`; Esc / scrim-click call `onClose`.
 */
export function Modal({ open = false, title, children, footer, onClose, width = 520, closeOnScrim = true, style, ...rest }) {
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      role="presentation"
      onClick={closeOnScrim ? (e) => { if (e.target === e.currentTarget && onClose) onClose(); } : undefined}
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--component-dialog-scrim)', backdropFilter: 'blur(var(--component-dialog-scrim-blur))' }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        style={{ width: '100%', maxWidth: width, maxHeight: '86vh', display: 'flex', flexDirection: 'column', background: 'var(--bw-white)', borderRadius: 'var(--component-dialog-radius)', boxShadow: 'var(--shadow-xl)', fontFamily: 'var(--font-sans)', overflow: 'hidden', ...style }}
        {...rest}
      >
        {(title != null || onClose) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 24px', borderBottom: '1px solid var(--bw-border)' }}>
            <div style={{ fontSize: 18, fontWeight: 'var(--fw-extra)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)' }}>{title}</div>
            {onClose && (
              <button type="button" aria-label="close" onClick={onClose} style={{ display: 'inline-flex', padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-semantic-label-assistive)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        )}
        <div style={{ padding: '20px 24px', overflow: 'auto', fontSize: 15, lineHeight: 1.7, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>
        {footer != null && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 24px', borderTop: '1px solid var(--bw-border)' }}>{footer}</div>
        )}
      </div>
    </div>
  );
}
