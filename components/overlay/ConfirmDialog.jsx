import React from 'react';
import { Button } from '../buttons/Button.jsx';

const TONES = {
  default: 'var(--color-primary)',
  danger: 'var(--bw-red)',
  warning: 'var(--bw-amber)',
};

/**
 * LK ROBOTICS — ConfirmDialog
 * Purpose-built confirmation dialog for irreversible or safety-related
 * actions. Unlike the generic Alert, this component always presents cancel and
 * confirm actions with explicit labels.
 */
export function ConfirmDialog({
  open = false,
  title,
  children,
  tone = 'default',
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  onClose,
  closeOnScrim = true,
  style,
  ...rest
}) {
  const titleId = React.useId();
  const dismiss = onCancel || onClose;
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape' && dismiss) dismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, dismiss]);
  if (!open) return null;
  const accent = TONES[tone] || TONES.default;
  return (
    <div
      role="presentation"
      onClick={closeOnScrim ? (event) => { if (event.target === event.currentTarget && dismiss) dismiss(); } : undefined}
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--component-dialog-scrim)', backdropFilter: 'blur(var(--component-dialog-scrim-blur))' }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        aria-label={title == null ? '확인 다이얼로그' : undefined}
        style={{ width: '100%', maxWidth: 420, display: 'grid', gap: 'var(--space-4)', background: 'var(--bw-white)', borderRadius: 'var(--component-dialog-radius)', boxShadow: 'var(--shadow-xl)', padding: '28px 28px 24px', fontFamily: 'var(--font-sans)', ...style }}
        {...rest}
      >
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          {title != null && <h2 id={titleId} style={{ margin: 0, color: 'var(--label-normal)', fontSize: 20, lineHeight: 1.35, fontWeight: 'var(--fw-extra)', letterSpacing: 0 }}>{title}</h2>}
          {children != null && <div style={{ color: 'var(--label-neutral)', fontSize: 15, lineHeight: 1.7, wordBreak: 'keep-all' }}>{children}</div>}
        </div>
        {/* Footer actions ride the shared Button (size md = 15px type, 0 20px
            padding — the legacy metrics). The style override pins the legacy
            44px height / 12px radius / bold weight exactly; normalization
            candidate: drop the override and adopt size="lg" (48px, token
            radius) in a future sanctioned pass. */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Button variant="ghost" onClick={() => dismiss && dismiss()} style={{ height: 44, borderRadius: 'var(--radius-md)', fontWeight: 'var(--fw-bold)', letterSpacing: 0 }}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            style={{
              height: 44, borderRadius: 'var(--radius-md)', fontWeight: 'var(--fw-bold)', letterSpacing: 0, boxShadow: 'none',
              ...(tone !== 'default' ? { background: accent } : null),
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
