import React from "react";
import { Icon } from "../icon/Icon.jsx";
import { normalizeStatusTone, statusToneStyle } from "../status/status-presentation.js";
import { ToastLiveRegionContext } from "./ToastStack.jsx";

/**
 * Documented policy duration for an action-free confirmation toast (7s).
 * Kept module-local: the generated public entry classifies component exports,
 * so this stays a documented literal instead of a new package export.
 */
const POLICY_DURATION = 7000;

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
  const normalized = normalizeStatusTone(value || "normal");
  return normalized === "signal" || normalized === "offline" ? "normal" : normalized;
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
  duration = null,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  style,
  ...rest
}) {
  const [actionHover, setActionHover] = React.useState(false);
  const normalized = normalizeTone(variant || tone);
  const t = ICONS[normalized] || ICONS.normal;
  const urgent = normalized === "negative";

  const announce = React.useContext(ToastLiveRegionContext);
  const hosted = typeof announce === "function";
  const messageRef = React.useRef(null);
  const announcedRef = React.useRef(null);

  // Hosted in a ToastStack: the stack owns the persistent live regions, so this
  // surface must not double as one. Standalone: keep the inline live region.
  React.useEffect(() => {
    if (!hosted) return;
    const message = messageRef.current?.textContent?.trim() ?? "";
    if (!message || message === announcedRef.current) return;
    announcedRef.current = message;
    announce(message, urgent);
  });

  // WCAG 2.2.1: a toast the user has to act on must never time out. An action
  // button makes the toast actionable, so auto-dismiss is refused outright
  // rather than merely defaulting off.
  const actionable = action != null;
  // `duration` accepts the policy shorthand `true` (7s), an explicit ms number,
  // or null/false for "stays until dismissed".
  const requestedDuration = duration === true ? POLICY_DURATION : duration;
  const autoDismissMs = actionable || typeof onClose !== "function" || !(requestedDuration > 0)
    ? null
    : requestedDuration;
  const [paused, setPaused] = React.useState(false);
  const remainingRef = React.useRef(autoDismissMs);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;

  React.useEffect(() => { remainingRef.current = autoDismissMs; }, [autoDismissMs]);

  React.useEffect(() => {
    if (autoDismissMs == null || paused) return undefined;
    // Pause keeps the remaining time instead of restarting the full duration,
    // so a hover never resets what the reader has already been given.
    const startedAt = Date.now();
    const wait = remainingRef.current ?? autoDismissMs;
    const timer = setTimeout(() => {
      remainingRef.current = null;
      closeRef.current?.();
    }, Math.max(0, wait));
    return () => {
      clearTimeout(timer);
      if (remainingRef.current != null) {
        remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAt));
      }
    };
  }, [autoDismissMs, paused]);

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  return (
    <div
      role={hosted ? undefined : (urgent ? "alert" : "status")}
      aria-live={hosted ? undefined : (urgent ? "assertive" : "polite")}
      data-toast-paused={autoDismissMs != null && paused ? "" : undefined}
      onMouseEnter={(event) => { pause(); onMouseEnter?.(event); }}
      onMouseLeave={(event) => { resume(); onMouseLeave?.(event); }}
      onFocus={(event) => { pause(); onFocus?.(event); }}
      onBlur={(event) => { resume(); onBlur?.(event); }}
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
        ref={messageRef}
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
          <Icon name="close" size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
