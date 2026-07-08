import React from "react";

const ICONS = {
  normal: {
    color: "var(--color-semantic-inverse-label)",
    node: <circle cx="12" cy="12" r="8" />,
  },
  positive: {
    color: "var(--bw-green)",
    node: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12.2 2.2 2.2 4.8-5" />
      </>
    ),
  },
  cautionary: {
    color: "var(--bw-amber)",
    node: (
      <>
        <path d="M12 3.8 21 19H3L12 3.8Z" />
        <path d="M12 9v4" />
        <path d="M12 16h.01" />
      </>
    ),
  },
  negative: {
    color: "var(--bw-red)",
    node: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5" />
        <path d="M12 16h.01" />
      </>
    ),
  },
};

function normalizeTone(value) {
  if (value === "success") return "positive";
  if (value === "warning") return "cautionary";
  if (value === "error") return "negative";
  if (value === "info") return "normal";
  return value || "normal";
}

/**
 * LK ROBOTICS - Toast
 * transient feedback message with dark surface and optional leading icon.
 */
export function Toast({
  tone = "normal",
  variant,
  children,
  action,
  onAction,
  onClose,
  leadingIcon = true,
  icon,
  style,
  ...rest
}) {
  const normalized = normalizeTone(variant || tone);
  const t = ICONS[normalized] || ICONS.normal;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        minWidth: 335,
        maxWidth: 520,
        padding: "11px 16px",
        background: "var(--component-transient-feedback-bg)",
        backdropFilter: "blur(var(--component-transient-feedback-blur))",
        WebkitBackdropFilter: "blur(var(--component-transient-feedback-blur))",
        color: "var(--color-semantic-inverse-label)",
        borderRadius: 12,
        boxShadow: "var(--shadow-lg)",
        fontFamily: "var(--font-sans)",
        ...style,
      }}
      {...rest}
    >
      {leadingIcon && (
        <span
          aria-hidden="true"
          style={{ display: "inline-flex", flexShrink: 0, color: t.color }}
        >
          {icon || (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {t.node}
            </svg>
          )}
        </span>
      )}
      <span
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: 15,
          lineHeight: 1.45,
          fontWeight: "var(--fw-semibold)",
          letterSpacing: 0,
          color: "var(--color-semantic-inverse-label)",
          wordBreak: "keep-all",
        }}
      >
        {children}
      </span>
      {action != null && (
        <button
          type="button"
          onClick={onAction}
          style={{
            flexShrink: 0,
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
      {onClose && (
        <button
          type="button"
          aria-label="close"
          onClick={onClose}
          style={{
            flexShrink: 0,
            display: "inline-flex",
            padding: 2,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--color-semantic-inverse-label)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
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
