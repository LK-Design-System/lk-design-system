import React from 'react';
import { ActionArea } from '../buttons/ActionArea.jsx';
import { Button } from '../buttons/Button.jsx';
import { useDialogFocus } from './dialog-focus.js';

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
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = '확인 다이얼로그',
  style,
  ...rest
}) {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const cancelFocusRef = React.useRef(null);
  const dismiss = onCancel || onClose;
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  const { dialogRef, zIndex } = useDialogFocus({
    open,
    onDismiss: dismiss,
    initialFocusRef: initialFocusRef ?? cancelFocusRef,
    returnFocusRef,
    restoreFocus,
  });
  const setDialogRef = React.useCallback((node) => {
    dialogRef.current = node;
    cancelFocusRef.current = node?.querySelector('[data-confirm-dialog-cancel]') ?? null;
  }, [dialogRef]);
  if (!open) return null;
  return (
    <div
      role="presentation"
      onClick={closeOnScrim ? (event) => { if (event.target === event.currentTarget && dismiss) dismiss(); } : undefined}
      style={{ position: 'fixed', inset: 0, zIndex, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)', background: 'var(--component-dialog-scrim)', backdropFilter: 'blur(var(--component-dialog-scrim-blur))' }}
    >
      <div
        ref={setDialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        aria-label={title == null ? ariaLabel : undefined}
        aria-describedby={children != null ? descriptionId : undefined}
        data-tone={tone}
        tabIndex={-1}
        style={{ width: '100%', maxWidth: 'var(--component-confirm-dialog-max-width)', display: 'grid', gap: 'var(--space-4)', background: 'var(--color-semantic-background-elevated-normal)', borderRadius: 'var(--component-dialog-radius)', boxShadow: 'var(--shadow-xl)', padding: 'var(--space-6)', fontFamily: 'var(--font-sans)', ...style }}
        {...rest}
      >
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          {title != null && <Heading id={titleId} style={{ margin: 0, color: 'var(--color-semantic-label-normal)', fontSize: 'var(--heading3-size)', lineHeight: 'var(--heading3-line)', fontWeight: 'var(--fw-extra)' }}>{title}</Heading>}
          {children != null && <div id={descriptionId} style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', wordBreak: 'keep-all' }}>{children}</div>}
        </div>
        <ActionArea compact divider={false} align="end" style={{ padding: 0, background: 'transparent' }}>
          <Button data-confirm-dialog-cancel variant="outlined" color="assistive" onClick={() => dismiss?.()}>
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
