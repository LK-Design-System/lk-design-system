import React from "react";
import { Icon } from "../icon/Icon.jsx";
import { normalizeStatusTone, statusToneStyle } from "../status/status-presentation.js";

// Default leading glyph comes from the shared Icon registry so Snackbar's
// info mark matches Toast/Banner instead of a hand-drawn variant.
const ICON = <Icon name="circle-info-fill" size={22} aria-hidden="true" />;

// Severity axis shared with Toast: same names, same normalization, same
// announcement rule — a failure must not be read politely just because it
// landed on a Snackbar instead of a Toast.
const TONE_ICON_COLOR = {
  normal: "var(--color-semantic-inverse-label)",
  positive: "var(--color-semantic-status-positive)",
  cautionary: "var(--color-semantic-status-cautionary)",
  negative: "var(--color-semantic-status-negative)",
};

function normalizeTone(value) {
  const normalized = normalizeStatusTone(value || "normal");
  return normalized === "signal" || normalized === "offline" ? "normal" : normalized;
}

function toneIcon(tone) {
  if (tone === "normal") return ICON;
  return <Icon name={statusToneStyle(tone).icon} size={22} aria-hidden="true" />;
}

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
  tone = "normal",
  variant,
  icon,
  leadingIcon = false,
  closeButton = true,
  onClose,
  closeLabel = "닫기",
  width = 384,
  style,
  ...rest
}) {
  const [actionHover, setActionHover] = React.useState(false);
  const hasDescription = description != null || children != null;
  const normalized = normalizeTone(variant || tone);
  const urgent = normalized === "negative";
  // A close affordance with nothing to call is a dead control: the axis only
  // decides whether an available `onClose` is exposed.
  const showClose = closeButton !== false && typeof onClose === "function";
  const minHeight =
    heading != null && hasDescription ? 72 : hasDescription ? 68 : 54;
  return (
    <div
      role={urgent ? "alert" : "status"}
      aria-live={urgent ? "assertive" : "polite"}
      data-tone={normalized}
      style={{
        display: "inline-flex",
        alignItems: hasDescription ? "flex-start" : "center",
        gap: 12,
        width,
        maxWidth: "100%",
        minHeight,
        padding: "11px 16px",
        borderRadius: "var(--radius-lg)",
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
          aria-hidden="true"
          style={{
            display: "inline-flex",
            flexShrink: 0,
            marginTop: hasDescription ? 1 : 0,
            color: TONE_ICON_COLOR[normalized],
          }}
        >
          {icon ?? toneIcon(normalized)}
        </span>
      )}
      <span style={{ display: "grid", gap: 3, minWidth: 0, flex: 1 }}>
        {heading != null && (
          <strong
            style={{
              fontSize: "var(--body2-size)",
              lineHeight: "var(--body2-line)",
              fontWeight: "var(--fw-semibold)",
              letterSpacing: "var(--body2-spacing)",
            }}
          >
            {heading}
          </strong>
        )}
        {hasDescription && (
          <span
            style={{
              fontSize: "var(--label2-size)",
              lineHeight: "var(--label2-line)",
              color: "var(--color-semantic-inverse-label-strong-soft)",
              letterSpacing: "var(--label2-spacing)",
              wordBreak: "keep-all",
            }}
          >
            {description ?? children}
          </span>
        )}
        {heading == null && !hasDescription && (
          /* Single-line message matches Toast's one-liner step (body2) so the
             two transient surfaces speak the same size for the same role. */
          <span style={{ fontSize: "var(--body2-size)", lineHeight: "var(--body2-line)", letterSpacing: "var(--body2-spacing)" }}>{children}</span>
        )}
      </span>
      {action != null && (
        <button
          type="button"
          onClick={onAction}
          onMouseEnter={() => setActionHover(true)}
          onMouseLeave={() => setActionHover(false)}
          style={{
            flexShrink: 0,
            alignSelf: "center",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            /* WDS content-to-action gap is 32px (container gap 12 + 20). */
            marginLeft: 20,
            /* WCAG 2.2 target size: 24px hit area without moving the layout. */
            minWidth: 24,
            minHeight: 24,
            marginTop: -4,
            marginBottom: -4,
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
      {showClose && (
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          style={{
            flexShrink: 0,
            alignSelf: "center",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 24,
            minHeight: 24,
            padding: 4,
            margin: -4,
            border: "none",
            background: "transparent",
            color: "var(--color-semantic-inverse-label)",
            cursor: "pointer",
          }}
        >
          <Icon name="close" size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
