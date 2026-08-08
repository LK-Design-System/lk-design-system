"use client";
import {
  ToastLiveRegionContext
} from "./chunk-ZJHJNQCP.js";
import {
  normalizeStatusTone,
  statusToneStyle
} from "./chunk-L2ZEGNVF.js";
import {
  Icon
} from "./chunk-B3OCRDVS.js";

// components/overlay/Toast.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var POLICY_DURATION = 7e3;
var ICONS = {
  normal: {
    color: "var(--color-semantic-inverse-label)",
    name: "circle-info-fill"
  },
  positive: {
    color: "var(--color-semantic-status-positive)",
    name: statusToneStyle("positive").icon
  },
  cautionary: {
    color: "var(--color-semantic-status-cautionary)",
    name: statusToneStyle("cautionary").icon
  },
  negative: {
    color: "var(--color-semantic-status-negative)",
    name: statusToneStyle("negative").icon
  }
};
function normalizeTone(value) {
  const normalized = normalizeStatusTone(value || "normal");
  return normalized === "signal" || normalized === "offline" ? "normal" : normalized;
}
function Toast({
  tone = "normal",
  variant,
  children,
  action,
  onAction,
  onClose,
  closeLabel = "\uB2EB\uAE30",
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
  React.useEffect(() => {
    if (!hosted) return;
    const message = messageRef.current?.textContent?.trim() ?? "";
    if (!message || message === announcedRef.current) return;
    announcedRef.current = message;
    announce(message, urgent);
  });
  const actionable = action != null;
  const requestedDuration = duration === true ? POLICY_DURATION : duration;
  const autoDismissMs = actionable || typeof onClose !== "function" || !(requestedDuration > 0) ? null : requestedDuration;
  const [paused, setPaused] = React.useState(false);
  const remainingRef = React.useRef(autoDismissMs);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  React.useEffect(() => {
    remainingRef.current = autoDismissMs;
  }, [autoDismissMs]);
  React.useEffect(() => {
    if (autoDismissMs == null || paused) return void 0;
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
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: hosted ? void 0 : urgent ? "alert" : "status",
      "aria-live": hosted ? void 0 : urgent ? "assertive" : "polite",
      "data-toast-paused": autoDismissMs != null && paused ? "" : void 0,
      onMouseEnter: (event) => {
        pause();
        onMouseEnter?.(event);
      },
      onMouseLeave: (event) => {
        resume();
        onMouseLeave?.(event);
      },
      onFocus: (event) => {
        pause();
        onFocus?.(event);
      },
      onBlur: (event) => {
        resume();
        onBlur?.(event);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2-5)",
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
        ...style
      },
      ...rest,
      children: [
        leadingIcon && /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            style: { display: "inline-flex", flexShrink: 0, color: t.color },
            children: icon || /* @__PURE__ */ jsx(Icon, { name: t.name, size: 22, "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            ref: messageRef,
            style: {
              flex: 1,
              minWidth: 0,
              fontSize: "var(--body2-size)",
              lineHeight: "var(--body2-line)",
              fontWeight: "var(--fw-semibold)",
              letterSpacing: "var(--body2-spacing)",
              color: "var(--color-semantic-inverse-label)",
              wordBreak: "keep-all"
            },
            children
          }
        ),
        action != null && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onAction,
            onMouseEnter: () => setActionHover(true),
            onMouseLeave: () => setActionHover(false),
            style: {
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
              textUnderlineOffset: 3
            },
            children: action
          }
        ),
        onClose && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "aria-label": closeLabel,
            onClick: onClose,
            style: {
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
              color: "var(--color-semantic-inverse-label)"
            },
            children: /* @__PURE__ */ jsx(Icon, { name: "close", size: 16, "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}

export {
  Toast
};
//# sourceMappingURL=chunk-N5IACPBL.js.map