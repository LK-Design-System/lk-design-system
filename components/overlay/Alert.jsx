import React from "react";

const platformStyle = {
  /* iOS internals retained as an LDS simplification (WDS iOS table layout
   * is not decodable from the source). */
  ios: {
    maxWidth: 290,
    radius: 22,
    padding: "22px 18px 16px",
    buttonHeight: 40,
    buttonPadding: "0 14px",
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
    footer: "flex-end",
    footerGap: 24,
    titleSize: "var(--headline1-size)",
    titleWeight: "var(--fw-semibold)",
  },
};

const variantColor = {
  normal: "var(--color-semantic-primary-normal)",
  assistive: "var(--color-semantic-label-neutral)",
  negative: "var(--bw-red)",
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
  style,
  ...rest
}) {
  const dismiss = onClose || onCancel;
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") dismiss?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open) return null;

  const p = platformStyle[platform] || platformStyle.web;
  const primary = primaryLabel ?? confirmLabel ?? "Confirm";
  const secondary = secondaryLabel ?? cancelLabel;
  const normalizedVariant = normalizeVariant(variant ?? tone);
  const accent = variantColor[normalizedVariant] || variantColor.normal;
  const body = description ?? children;
  const buttonBase = {
    height: p.buttonHeight,
    padding: p.buttonPadding,
    border: "none",
    borderRadius:
      platform === "ios" ? "var(--radius-pill)" : "var(--radius-md)",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    fontSize: 14,
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
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--material-control-dimmer)",
        backdropFilter: "blur(1px)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        style={{
          width: "100%",
          maxWidth: p.maxWidth,
          background: "var(--bw-white)",
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
