import React from "react";
import { useDialogFocus } from './dialog-focus.js';

const platformStyle = {
  /* iOS internals retained as an LDS simplification (WDS iOS table layout
   * is not decodable from the source). */
  ios: {
    maxWidth: 290,
    radius: 22,
    padding: "22px 18px 16px",
    buttonHeight: 40,
    buttonPadding: "0 14px",
    buttonFontSize: 17, // WDS Control/Alert iOS action = 17 SemiBold
    footer: "center",
    footerGap: 8,
    titleSize: 17,
    titleWeight: "var(--fw-extra)",
  },
  android: {
    maxWidth: 320,
    radius: 16,
    padding: "28px",
    buttonHeight: 32,
    buttonPadding: 0,
    buttonFontSize: 16, // WDS Android action = 16 SemiBold
    footer: "flex-end",
    footerGap: 24,
    titleSize: "var(--heading2-size)",
    titleWeight: "var(--fw-semibold)",
  },
  web: {
    maxWidth: 335,
    radius: 12,
    padding: "20px",
    buttonHeight: 32,
    buttonPadding: 0,
    buttonFontSize: 16, // WDS Web action = 16 SemiBold
    footer: "flex-end",
    footerGap: 24,
    titleSize: "var(--headline1-size)",
    titleWeight: "var(--fw-semibold)",
  },
};

const variantColor = {
  normal: "var(--color-semantic-primary-normal)",
  assistive: "var(--color-semantic-label-neutral)",
  negative: "var(--color-semantic-status-negative-text)",
};

function normalizeVariant(value) {
  if (value === "danger" || value === "error") return "negative";
  if (value === "default" || value === "info") return "normal";
  return value || "normal";
}

/**
 * LDS Core - Alert
 * modal feedback alert with iOS, Android, and Web platform treatments.
 */
export function Alert({
  open = false,
  title,
  heading = true,
  children,
  description,
  platform = "web",
  tone = "default",
  variant,
  confirmLabel,
  cancelLabel,
  primaryLabel,
  secondaryLabel,
  onConfirm,
  onCancel,
  onClose,
  actions,
  closeOnScrim = true,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = '알림',
  style,
  ...rest
}) {
  const dismiss = onClose || onCancel;
  const titleId = React.useId();
  const descriptionId = React.useId();
  const defaultFocusRef = React.useRef(null);
  const { dialogRef, zIndex } = useDialogFocus({
    open,
    onDismiss: dismiss,
    initialFocusRef: initialFocusRef ?? defaultFocusRef,
    returnFocusRef,
    restoreFocus,
  });
  const setDialogRef = React.useCallback((node) => {
    dialogRef.current = node;
    defaultFocusRef.current = node?.querySelector('[data-alert-secondary], [data-alert-primary]') ?? null;
  }, [dialogRef]);

  if (!open) return null;

  const p = platformStyle[platform] || platformStyle.web;
  const primary = primaryLabel ?? confirmLabel ?? "Confirm";
  const secondary = secondaryLabel ?? cancelLabel;
  const normalizedVariant = normalizeVariant(variant ?? tone);
  const accent = variantColor[normalizedVariant] || variantColor.normal;
  const body = description ?? children;
  const hasVisibleTitle = heading && title != null;
  const buttonBase = {
    height: p.buttonHeight,
    padding: p.buttonPadding,
    border: "none",
    borderRadius:
      platform === "ios" ? "var(--radius-pill)" : "var(--radius-md)",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    fontSize: p.buttonFontSize ?? 16,
    fontWeight: "var(--fw-bold)",
    letterSpacing: 0,
    whiteSpace: "nowrap",
  };

  return (
    <div
      role="presentation"
      onClick={
        closeOnScrim
          ? (e) => {
              if (e.target === e.currentTarget) dismiss?.();
            }
          : undefined
      }
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--component-dialog-scrim)",
        backdropFilter: "blur(var(--component-dialog-scrim-blur))",
      }}
    >
      <div
        ref={setDialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={hasVisibleTitle ? titleId : undefined}
        aria-label={!hasVisibleTitle ? (typeof title === 'string' ? title : ariaLabel) : undefined}
        aria-describedby={body != null ? descriptionId : undefined}
        tabIndex={-1}
        style={{
          width: "100%",
          maxWidth: p.maxWidth,
          background: "var(--color-semantic-background-elevated-normal)",
          borderRadius: p.radius,
          boxShadow: "var(--shadow-xl)",
          padding: p.padding,
          fontFamily: "var(--font-sans)",
          ...style,
        }}
        {...rest}
      >
        {heading && title != null && (
          <div
            id={titleId}
            style={{
              fontSize: p.titleSize,
              fontWeight: p.titleWeight,
              letterSpacing: 0,
              color: "var(--color-semantic-label-normal)",
              marginBottom: 8,
            }}
          >
            {title}
          </div>
        )}
        {body != null && (
          <div
            id={descriptionId}
            style={{
              fontSize: "var(--body2-size)",
              lineHeight: 1.55,
              color: "var(--color-semantic-label-neutral)",
              wordBreak: "keep-all",
            }}
          >
            {body}
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: p.footer,
            gap: p.footerGap,
            marginTop: 20,
          }}
        >
          {actions != null ? (
            actions
          ) : (
            <React.Fragment>
              {secondary && (
                <button
                  data-alert-secondary
                  type="button"
                  style={{
                    ...buttonBase,
                    color: "var(--color-semantic-label-normal)",
                    background:
                      platform === "ios" ? "var(--color-semantic-fill-normal)" : "transparent",
                  }}
                  onClick={onCancel || dismiss}
                >
                  {secondary}
                </button>
              )}
              <button
                data-alert-primary
                type="button"
                style={{
                  ...buttonBase,
                  color: platform === "ios" ? "var(--color-semantic-inverse-label)" : accent,
                  background: platform === "ios" ? accent : "transparent",
                }}
                onClick={onConfirm || dismiss}
              >
                {primary}
              </button>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
