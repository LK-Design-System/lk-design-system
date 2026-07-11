import React from "react";

const ICON = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8h.01" />
    <path d="M11 12h1v5h1" />
  </svg>
);

/**
 * LDS Core - Snackbar
 * feedback bar with optional heading, description, leading icon, action,
 * and close affordance.
 */
export function Snackbar({
  heading,
  description,
  children,
  action,
  onAction,
  icon = ICON,
  leadingIcon = false,
  closeButton = false,
  onClose,
  width = 384,
  style,
  ...rest
}) {
  const hasDescription = description != null || children != null;
  const minHeight =
    heading != null && hasDescription ? 72 : hasDescription ? 68 : 54;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "inline-flex",
        alignItems: hasDescription ? "flex-start" : "center",
        gap: 12,
        width,
        maxWidth: "100%",
        minHeight,
        padding: "11px 16px",
        borderRadius: 12,
        background: "var(--component-transient-feedback-bg)",
        backdropFilter: "blur(var(--component-transient-feedback-blur))",
        WebkitBackdropFilter: "blur(var(--component-transient-feedback-blur))",
        color: "var(--color-semantic-inverse-label)",
        boxShadow: "var(--shadow-lg)",
        fontFamily: "var(--font-sans)",
        ...style,
      }}
      {...rest}
    >
      {leadingIcon && (
        <span
          style={{
            display: "inline-flex",
            flexShrink: 0,
            marginTop: hasDescription ? 1 : 0,
          }}
        >
          {icon}
        </span>
      )}
      <span style={{ display: "grid", gap: 3, minWidth: 0, flex: 1 }}>
        {heading != null && (
          <strong
            style={{
              fontSize: "var(--body2-size)",
              lineHeight: 1.35,
              fontWeight: "var(--fw-semibold)",
              letterSpacing: 0,
            }}
          >
            {heading}
          </strong>
        )}
        {hasDescription && (
          <span
            style={{
              fontSize: 13,
              lineHeight: 1.45,
              color: "var(--color-semantic-inverse-label-strong-soft)",
              letterSpacing: 0,
              wordBreak: "keep-all",
            }}
          >
            {description ?? children}
          </span>
        )}
        {heading == null && !hasDescription && (
          <span style={{ fontSize: 14, lineHeight: 1.4 }}>{children}</span>
        )}
      </span>
      {action != null && (
        <button
          type="button"
          onClick={onAction}
          style={{
            flexShrink: 0,
            alignSelf: "center",
            /* WDS content-to-action gap is 32px (container gap 12 + 20). */
            marginLeft: 20,
            border: "none",
            background: "transparent",
            color: "var(--color-semantic-inverse-label)",
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: "var(--fw-bold)",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {action}
        </button>
      )}
      {(closeButton || onClose) && (
        <button
          type="button"
          aria-label="close"
          onClick={onClose}
          style={{
            flexShrink: 0,
            alignSelf: "center",
            border: "none",
            background: "transparent",
            color: "var(--color-semantic-inverse-label)",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
