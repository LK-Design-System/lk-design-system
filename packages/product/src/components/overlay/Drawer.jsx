import React from 'react';
import { IconButton } from '@lk-design-system/lds-core/components/buttons/IconButton';
import { Icon } from '@lk-design-system/lds-core/components/icon/Icon';
import { useDialogFocus } from '@lk-design-system/lds-core/components/overlay/dialog-focus';

/**
 * LDS Product Extension — Drawer
 * A side panel that slides in over a navy scrim (filters, detail, settings).
 * `side` right/left; header (title + close), scrollable body, optional footer.
 * Controlled via `open`; Esc / scrim-click close.
 */
export function Drawer({
  open = false,
  side = 'right',
  width = 380,
  title,
  children,
  footer,
  onClose,
  closeOnScrim = true,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = '서랍 패널',
  closeLabel = '닫기',
  style,
  ...rest
}) {
  const [shown, setShown] = React.useState(false);
  const titleId = React.useId();
  const { dialogRef, zIndex } = useDialogFocus({
    open,
    onDismiss: onClose,
    initialFocusRef,
    returnFocusRef,
    restoreFocus,
  });
  React.useEffect(() => {
    if (open) { const id = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(id); }
    setShown(false); return undefined;
  }, [open]);
  if (!open) return null;
  const isRight = side === 'right';
  const hidden = isRight ? 'translateX(100%)' : 'translateX(-100%)';
  return (
    <div
      role="presentation"
      onClick={closeOnScrim ? (e) => { if (e.target === e.currentTarget && onClose) onClose(); } : undefined}
      style={{ position: 'fixed', inset: 0, zIndex, background: 'var(--component-dialog-scrim)', backdropFilter: 'blur(var(--component-dialog-scrim-blur))', opacity: shown ? 1 : 0, transition: 'opacity var(--dur-base) var(--ease-out)' }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        aria-label={title == null ? ariaLabel : undefined}
        tabIndex={-1}
        style={{ position: 'absolute', top: 0, bottom: 0, [isRight ? 'right' : 'left']: 0, width, maxWidth: '92vw', display: 'flex', flexDirection: 'column', background: 'var(--color-semantic-background-elevated-normal)', boxShadow: 'var(--shadow-xl)', fontFamily: 'var(--font-sans)', transform: shown ? 'none' : hidden, transition: 'transform var(--dur-slow) var(--ease-out)', ...style }}
        {...rest}
      >
        {(title != null || onClose) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }}>
            <div id={titleId} style={{ flex: 1, minWidth: 0, fontSize: 'var(--headline1-size)', fontWeight: 'var(--fw-extra)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
            {onClose && (
              <IconButton size="sm" variant="plain" label={closeLabel} onClick={onClose}>
                <Icon name="close" size={20} aria-hidden="true" />
              </IconButton>
            )}
          </div>
        )}
        <div className="lk-scroll-surface" data-scrollbar="auto" data-scroll-gutter="stable" style={{ flex: 1, padding: 'var(--space-5) var(--space-6)', overflow: 'auto', scrollbarGutter: 'stable', fontSize: 'var(--body2-size)', lineHeight: 1.7, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>
        {footer != null && <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--color-semantic-line-solid-normal)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>{footer}</div>}
      </div>
    </div>
  );
}
