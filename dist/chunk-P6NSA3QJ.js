"use client";
import {
  Button
} from "./chunk-WQ42MZRF.js";
import {
  Icon
} from "./chunk-B2YSRUC3.js";

// components/buttons/CopyButton.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var SR_ONLY_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0
};
var FEEDBACK_DURATION_MS = 1400;
async function writeToClipboard(value) {
  const clipboard = typeof navigator === "undefined" ? void 0 : navigator.clipboard;
  if (!clipboard || typeof clipboard.writeText !== "function") {
    throw new Error("Clipboard API is unavailable in this context.");
  }
  await clipboard.writeText(String(value));
}
function CopyButton({
  value,
  children = "\uBCF5\uC0AC",
  copiedLabel = "\uBCF5\uC0AC\uB428",
  errorLabel = "\uBCF5\uC0AC \uC2E4\uD328",
  size = "md",
  style,
  onClick,
  ...rest
}) {
  const [status, setStatus] = React.useState("idle");
  const timerRef = React.useRef(null);
  const liveRef = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timerRef.current), []);
  const announce = React.useCallback((message) => {
    const node = liveRef.current;
    if (!node || !message) return;
    if (node.textContent !== message) {
      node.textContent = message;
      return;
    }
    const view = node.ownerDocument?.defaultView ?? window;
    node.textContent = "";
    view.setTimeout(() => {
      if (node.isConnected) node.textContent = message;
    }, 50);
  }, []);
  const copy = async (event) => {
    onClick?.(event);
    let copied2 = true;
    try {
      await writeToClipboard(value);
    } catch {
      copied2 = false;
    }
    clearTimeout(timerRef.current);
    setStatus(copied2 ? "copied" : "error");
    announce(copied2 ? copiedLabel : errorLabel);
    timerRef.current = setTimeout(() => setStatus("idle"), FEEDBACK_DURATION_MS);
  };
  const copied = status === "copied";
  const failed = status === "error";
  const feedbackBackground = copied ? { background: "var(--color-semantic-primary-surface-strong)" } : failed ? { background: "var(--color-semantic-status-negative-surface)" } : null;
  return /* @__PURE__ */ jsxs("span", { style: { position: "relative", display: "inline-flex" }, children: [
    /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "flat",
        size,
        "data-copy-status": status,
        onClick: copy,
        style: {
          // Overrides that intentionally diverge from the Button md/sm recipe —
          // kept to avoid any visual change; normalize in a future pass.
          gap: "var(--space-2)",
          height: size === "sm" ? 36 : 44,
          padding: "0 14px",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--label1-size)",
          lineHeight: "normal",
          fontWeight: "var(--fw-bold)",
          letterSpacing: 0,
          color: copied ? "var(--color-semantic-primary-normal)" : failed ? "var(--color-semantic-status-negative-text)" : "var(--color-semantic-label-normal)",
          ...feedbackBackground,
          ...style
        },
        ...rest,
        children: [
          /* @__PURE__ */ jsx(Icon, { name: copied ? "check" : failed ? "triangle-exclamation" : "copy", size: 16, "aria-hidden": "true" }),
          copied ? copiedLabel : failed ? errorLabel : children
        ]
      }
    ),
    /* @__PURE__ */ jsx("span", { ref: liveRef, role: "status", "aria-live": "polite", "aria-atomic": "true", style: SR_ONLY_STYLE })
  ] });
}

export {
  CopyButton
};
//# sourceMappingURL=chunk-P6NSA3QJ.js.map