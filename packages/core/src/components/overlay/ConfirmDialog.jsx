import React from 'react';
import { ActionArea } from '../buttons/ActionArea.jsx';
import { Button } from '../buttons/Button.jsx';
import { useDialogFocus } from './dialog-focus.js';
import { OverlayPortal } from './overlay-platform.js';

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
  withinPortal = true,
  portalTarget,
  zIndex,
  style,
  ...rest
}) {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const cancelFocusRef = React.useRef(null);
  const portalRef = React.useRef(null);
  const portalAnchorRef = React.useRef(null);
  if (open && !portalAnchorRef.current && typeof document !== 'undefined') {
    portalAnchorRef.current = returnFocusRef?.current ?? document.activeElement;
  }
  if (!open) portalAnchorRef.current = null;
  const dismiss = onCancel || onClose;
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  const { dialogRef, zIndex: resolvedZIndex } = useDialogFocus({
    open,
    onDismiss: dismiss,
    initialFocusRef: initialFocusRef ?? cancelFocusRef,
    returnFocusRef,
    restoreFocus,
    portalRef,
    inert: withinPortal,
    zIndex,
  });
  const setDialogRef = React.useCallback((node) => {
    dialogRef.current = node;
    cancelFocusRef.current = node?.querySelector('[data-confirm-dialog-cancel]') ?? null;
  }, [dialogRef]);
  if (!open) return null;
  return (
    <OverlayPortal open={open} withinPortal={withinPortal} portalTarget={portalTarget} anchorRef={portalAnchorRef} portalRef={portalRef} layer="modal">
    <div
      role="presentation"
      onClick={closeOnScrim ? (event) => { if (event.target === event.currentTarget && dismiss) dismiss(); } : undefined}
      style={{ position: 'fixed', inset: 0, zIndex: resolvedZIndex, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)', background: 'var(--component-dialog-scrim)', backdropFilter: 'blur(var(--component-dialog-scrim-blur))' }}
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
          {/* 제목과 본문은 Modal·Sheet·Drawer와 같은 단을 쓴다 — 이 넷은 같은
              가족이고, 묻는 창만 다른 활자 위계를 가질 이유가 없다.

              여기에는 `--heading3-*`이 적혀 있었는데 그 토큰은 존재하지 않는다.
              램프는 heading 22/20, headline 18/17, body 16/15, label 14/13이고
              heading3은 어느 단계도 아니다. 없는 커스텀 속성을 참조한 `font-size`
              선언은 계산 시점에 무효가 되어 상속값으로 떨어지므로, 제목은
              18px이 아니라 부모의 14px로 그려졌다 — 본문(label1, 역시 14px)과
              «완전히 같은 크기»가 되어 위계가 굵기 하나에만 걸려 있었다.
              본문이 두 줄이면 제목보다 커 보이는 것이 당연했다. */}
          {title != null && <Heading id={titleId} style={{ margin: 0, color: 'var(--color-semantic-label-normal)', fontSize: 'var(--headline1-size)', lineHeight: 'var(--headline1-line)', letterSpacing: 0, fontWeight: 'var(--fw-extra)' }}>{title}</Heading>}
          {children != null && <div id={descriptionId} style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--body2-size)', lineHeight: 1.7, wordBreak: 'keep-all' }}>{children}</div>}
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
    </OverlayPortal>
  );
}
