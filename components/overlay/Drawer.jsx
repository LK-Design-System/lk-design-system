import React from 'react';

/**
 * LK ROBOTICS — Drawer
 * A side panel that slides in over a navy scrim (filters, detail, settings).
 * `side` right/left; header (title + close), scrollable body, optional footer.
 * Controlled via `open`; Esc / scrim-click close.
 */
export function Drawer({ open = false, side = 'right', width = 380, title, children, footer, onClose, closeOnScrim = true, style, ...rest }) {
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    if (open) { const id = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(id); }
    setShown(false); return undefined;
  }, [open]);
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const isRight = side === 'right';
  const hidden = isRight ? 'translateX(100%)' : 'translateX(-100%)';
  return (
    <div
      role="presentation"
      onClick={closeOnScrim ? (e) => { if (e.target === e.currentTarget && onClose) onClose(); } : undefined}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--scrim-dark)', backdropFilter: 'blur(2px)', opacity: shown ? 1 : 0, transition: 'opacity var(--dur-base) var(--ease-out)' }}
    >
      <div
        role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}
        style={{ position: 'absolute', top: 0, bottom: 0, [isRight ? 'right' : 'left']: 0, width, maxWidth: '92vw', display: 'flex', flexDirection: 'column', background: 'var(--color-semantic-background-elevated-normal)', boxShadow: 'var(--shadow-xl)', fontFamily: 'var(--font-sans)', transform: shown ? 'none' : hidden, transition: 'transform var(--dur-slow) var(--ease-out)', ...style }}
        {...rest}
      >
        {(title != null || onClose) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 22px', borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }}>
            <div style={{ flex: 1, minWidth: 0, fontSize: 18, fontWeight: 'var(--fw-extra)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
            {onClose && (
              <button type="button" aria-label="close" onClick={onClose} style={{ display: 'inline-flex', padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-semantic-label-assistive)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        )}
        <div style={{ flex: 1, padding: '20px 22px', overflow: 'auto', fontSize: 15, lineHeight: 1.7, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>
        {footer != null && <div style={{ padding: '16px 22px', borderTop: '1px solid var(--color-semantic-line-solid-normal)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>{footer}</div>}
      </div>
    </div>
  );
}
