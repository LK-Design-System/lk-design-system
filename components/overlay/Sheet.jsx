import React from 'react';

/**
 * LK ROBOTICS — Sheet
 * A bottom sheet that slides up over a navy scrim (mobile actions, pickers). A
 * grab handle, optional title, scrollable body, optional footer. Controlled via
 * `open`; Esc / scrim-click close.
 */
export function Sheet({ open = false, title, children, footer, onClose, closeOnScrim = true, height, style, ...rest }) {
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
  return (
    <div
      role="presentation"
      onClick={closeOnScrim ? (e) => { if (e.target === e.currentTarget && onClose) onClose(); } : undefined}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--scrim-dark)', backdropFilter: 'blur(2px)', opacity: shown ? 1 : 0, transition: 'opacity var(--dur-base) var(--ease-out)' }}
    >
      <div
        role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '88vh', height, display: 'flex', flexDirection: 'column', background: 'var(--color-semantic-background-elevated-normal)', borderTopLeftRadius: 'var(--radius-3xl)', borderTopRightRadius: 'var(--radius-3xl)', boxShadow: 'var(--shadow-xl)', fontFamily: 'var(--font-sans)', transform: shown ? 'none' : 'translateY(100%)', transition: 'transform var(--dur-slow) var(--ease-out)', ...style }}
        {...rest}
      >
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <span style={{ width: 40, height: 4, borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-interaction-inactive)' }} />
        </div>
        {title != null && <div style={{ padding: '14px 22px 4px', fontSize: 'var(--headline1-size)', fontWeight: 'var(--fw-extra)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)' }}>{title}</div>}
        <div style={{ flex: 1, padding: '14px 22px', overflow: 'auto', fontSize: 'var(--body2-size)', lineHeight: 1.7, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>
        {footer != null && <div style={{ padding: '14px 22px 22px', display: 'flex', gap: 10 }}>{footer}</div>}
      </div>
    </div>
  );
}
