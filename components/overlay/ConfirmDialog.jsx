import React from 'react';
import { ActionArea } from '../buttons/ActionArea.jsx';
import { Button } from '../buttons/Button.jsx';
import { StatusBadge } from '../content/StatusBadge.jsx';

const TONE_META = {
  danger: { badge: 'negative', label: '위험' },
  warning: { badge: 'cautionary', label: '주의' },
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
  toneLabel,
  headingLevel = 2,
  confirmLabel = '확인',
  cancelLabel = '취소',
  confirmDisabled = false,
  confirmLoading = false,
  confirmLoadingLabel = '처리 중',
  onConfirm,
  onCancel,
  onClose,
  closeOnScrim = true,
  style,
  ...rest
}) {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const dialogRef = React.useRef(null);
  const restoreFocusRef = React.useRef(null);
  const dismiss = onCancel || onClose;
  const dismissRef = React.useRef(dismiss);
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  const toneMeta = TONE_META[tone];

  React.useEffect(() => {
    dismissRef.current = dismiss;
  });

  React.useEffect(() => {
    if (!open) return undefined;
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusInitial = window.requestAnimationFrame(() => {
      const focusables = Array.from(dialogRef.current?.querySelectorAll(focusableSelector) ?? []);
      const cancel = dialogRef.current?.querySelector('[data-confirm-dialog-cancel]');
      (cancel ?? focusables[0] ?? dialogRef.current)?.focus();
    });
    const onKey = (event) => {
      if (event.key === 'Escape' && dismissRef.current) {
        event.preventDefault();
        dismissRef.current();
      }
      if (event.key === 'Tab') {
        const focusables = Array.from(dialogRef.current?.querySelectorAll(focusableSelector) ?? []);
        if (focusables.length === 0) {
          event.preventDefault();
          dialogRef.current?.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (active === last || !dialogRef.current?.contains(active))) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.cancelAnimationFrame(focusInitial);
      document.removeEventListener('keydown', onKey);
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);
  if (!open) return null;
  return (
    <div
      role="presentation"
      onClick={closeOnScrim ? (event) => { if (event.target === event.currentTarget && dismiss) dismiss(); } : undefined}
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)', background: 'var(--component-dialog-scrim)', backdropFilter: 'blur(var(--component-dialog-scrim-blur))' }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        aria-label={title == null ? '확인 다이얼로그' : undefined}
        aria-describedby={children != null ? descriptionId : undefined}
        data-tone={tone}
        tabIndex={-1}
        style={{ width: '100%', maxWidth: 'var(--component-confirm-dialog-max-width)', display: 'grid', gap: 'var(--space-4)', background: 'var(--color-semantic-background-elevated-normal)', borderRadius: 'var(--component-dialog-radius)', boxShadow: 'var(--shadow-xl)', padding: 'var(--space-6)', fontFamily: 'var(--font-sans)', ...style }}
        {...rest}
      >
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          {toneMeta != null && <span style={{ justifySelf: 'start' }}><StatusBadge tone={toneMeta.badge}>{toneLabel ?? toneMeta.label}</StatusBadge></span>}
          {title != null && <Heading id={titleId} style={{ margin: 0, color: 'var(--color-semantic-label-normal)', fontSize: 'var(--heading3-size)', lineHeight: 'var(--heading3-line)', fontWeight: 'var(--fw-extra)' }}>{title}</Heading>}
          {children != null && <div id={descriptionId} style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', wordBreak: 'keep-all' }}>{children}</div>}
        </div>
        <ActionArea compact divider={false} align="end" style={{ padding: 0, background: 'transparent' }}>
          <Button data-confirm-dialog-cancel variant="ghost" onClick={() => dismissRef.current?.()}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={confirmDisabled}
            loading={confirmLoading}
            loadingLabel={confirmLoadingLabel}
          >
            {confirmLabel}
          </Button>
        </ActionArea>
      </div>
    </div>
  );
}
