import React from "react";
import { Icon } from "../icon/Icon.jsx";
import { statusToneStyle } from "../status/status-presentation.js";

// Glyphs come from the shared Icon registry (statusToneStyle grammar); the
// colours stay Toast-specific because vivid status hues read best on the
// dark transient surface.
const ICONS = {
  normal: {
    color: "var(--color-semantic-inverse-label)",
    name: "circle-info-fill",
  },
  positive: {
    color: "var(--color-semantic-status-positive)",
    name: statusToneStyle("positive").icon,
  },
  cautionary: {
    color: "var(--color-semantic-status-cautionary)",
    name: statusToneStyle("cautionary").icon,
  },
  negative: {
    color: "var(--color-semantic-status-negative)",
    name: statusToneStyle("negative").icon,
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
  closeLabel = "닫기",
  leadingIcon = true,
  icon,
  style,
  ...rest
}) {
  const [actionHover, setActionHover] = React.useState(false);
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
        borderRadius: "var(--radius-lg)",
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
          {icon || <Icon name={t.name} size={22} aria-hidden="true" />}
        </span>
      )}
      <span
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: "var(--body2-size)",
          lineHeight: "var(--body2-line)",
          fontWeight: "var(--fw-semibold)",
          letterSpacing: "var(--body2-spacing)",
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
          onMouseEnter={() => setActionHover(true)}
          onMouseLeave={() => setActionHover(false)}
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            /* WCAG 2.2 target size: keep a 24px hit area without moving the layout. */
            minWidth: 24,
            minHeight: 24,
            margin: "-4px 0",
            border: "none",
            background: "transparent",
            color: "var(--color-semantic-inverse-label)",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--label2-size)",
            fontWeight: "var(--fw-bold)",
            cursor: "pointer",
            padding: "4px 0",
            textDecoration: actionHover ? "underline" : "none",
            textUnderlineOffset: 3,
          }}
        >
          {action}
        </button>
      )}
      {onClose && (
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 24,
            minHeight: 24,
            padding: 4,
            margin: -2,
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
