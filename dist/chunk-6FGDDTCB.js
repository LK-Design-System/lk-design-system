"use client";
import {
  Input
} from "./chunk-5F4U2CWO.js";
import {
  IconButton
} from "./chunk-EFNOOM3R.js";
import {
  Icon
} from "./chunk-ON44Y65B.js";

// components/forms/SecretField.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function textLabel(value, fallback) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() || fallback : fallback;
}
function contextualActionLabel(fieldLabel, actionLabel) {
  const action = textLabel(actionLabel, "\uB3D9\uC791");
  if (!fieldLabel) return action;
  return action.includes(fieldLabel) ? action : `${fieldLabel} ${action}`;
}
async function writeToClipboard(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  if (typeof document === "undefined" || typeof document.execCommand !== "function") {
    throw new Error("Clipboard API is unavailable.");
  }
  const carrier = document.createElement("textarea");
  carrier.value = value;
  carrier.readOnly = true;
  carrier.setAttribute("aria-hidden", "true");
  carrier.tabIndex = -1;
  Object.assign(carrier.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "1px",
    height: "1px",
    padding: "0",
    border: "0",
    opacity: "0"
  });
  const previouslyFocused = document.activeElement;
  document.body.appendChild(carrier);
  try {
    carrier.select();
    carrier.setSelectionRange(0, value.length);
    if (!document.execCommand("copy")) throw new Error("Clipboard API is unavailable.");
  } finally {
    carrier.remove();
    if (previouslyFocused && typeof previouslyFocused.focus === "function") previouslyFocused.focus();
  }
}
function SecretField({
  label = "\uBE44\uBC00 \uAC12",
  value = "",
  helper,
  error,
  invalid = false,
  actionContext,
  revealable = true,
  copyable = true,
  revealDurationMs = 1e4,
  revealed,
  defaultRevealed = false,
  onRevealChange,
  onCopy,
  onCopyError,
  revealLabel = "\uBCF4\uAE30",
  hideLabel = "\uC228\uAE30\uAE30",
  copyLabel = "\uBCF5\uC0AC",
  copiedLabel = "\uBCF5\uC0AC\uB428",
  copyErrorLabel = "\uBCF5\uC0AC \uC2E4\uD328",
  disabled = false,
  size = "md",
  id,
  style,
  ...rest
}) {
  const controlled = revealed !== void 0;
  const [internalRevealed, setInternalRevealed] = React.useState(defaultRevealed);
  const [copyState, setCopyState] = React.useState("idle");
  const requestedShow = controlled ? revealed : internalRevealed;
  const hasValue = String(value).length > 0;
  const canReveal = revealable && !disabled && hasValue;
  const show = canReveal && requestedShow;
  const timerRef = React.useRef(null);
  const copyTimerRef = React.useRef(null);
  const copyRequestRef = React.useRef(0);
  const onRevealChangeRef = React.useRef(onRevealChange);
  const autoId = React.useId();
  const inputId = id ?? `secret-${autoId}`;
  const fieldLabel = actionContext === false ? "" : textLabel(actionContext ?? label, "\uBE44\uBC00 \uAC12");
  onRevealChangeRef.current = onRevealChange;
  React.useEffect(() => {
    if (!requestedShow || canReveal) return;
    if (!controlled) setInternalRevealed(false);
    onRevealChangeRef.current?.(false);
  }, [canReveal, controlled, requestedShow]);
  React.useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (!show || revealDurationMs <= 0) return void 0;
    timerRef.current = window.setTimeout(() => {
      if (!controlled) setInternalRevealed(false);
      onRevealChangeRef.current?.(false);
    }, revealDurationMs);
    return () => window.clearTimeout(timerRef.current);
  }, [controlled, revealDurationMs, show]);
  React.useEffect(() => {
    copyRequestRef.current += 1;
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    setCopyState("idle");
  }, [copyable, disabled, value]);
  React.useEffect(() => () => {
    copyRequestRef.current += 1;
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
  }, []);
  const setShow = (next) => {
    if (next && !canReveal) return;
    if (!controlled) setInternalRevealed(next);
    onRevealChangeRef.current?.(next);
  };
  const copy = async () => {
    if (disabled || !copyable || !hasValue) return;
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    const copiedValue = String(value);
    const requestId = ++copyRequestRef.current;
    try {
      await writeToClipboard(copiedValue);
      onCopy?.(copiedValue);
      if (requestId !== copyRequestRef.current) return;
      setCopyState("success");
    } catch (error2) {
      onCopyError?.(error2);
      if (requestId !== copyRequestRef.current) return;
      setCopyState("error");
    }
    copyTimerRef.current = window.setTimeout(() => setCopyState("idle"), 1400);
  };
  const revealActionLabel = contextualActionLabel(fieldLabel, show ? hideLabel : revealLabel);
  const copyActionText = copyState === "success" ? copiedLabel : copyState === "error" ? copyErrorLabel : copyLabel;
  const copyActionLabel = contextualActionLabel(fieldLabel, copyActionText);
  const copyTone = disabled || !hasValue ? void 0 : copyState === "success" ? "var(--color-semantic-status-positive)" : copyState === "error" ? "var(--color-semantic-status-negative)" : void 0;
  const actions = revealable || copyable ? /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-0)" }, children: [
    revealable && /* @__PURE__ */ jsx(IconButton, { variant: "plain", round: false, size: "sm", disabled: disabled || !hasValue, "aria-controls": inputId, onClick: () => setShow(!show), label: revealActionLabel, children: /* @__PURE__ */ jsx(Icon, { name: show ? "eye-slash" : "eye", size: 16, "aria-hidden": "true" }) }),
    copyable && /* @__PURE__ */ jsx(IconButton, { variant: "plain", round: false, size: "sm", disabled: disabled || !hasValue, "aria-controls": inputId, onClick: copy, label: copyActionLabel, style: copyTone ? { color: copyTone } : void 0, children: /* @__PURE__ */ jsx(Icon, { name: copyState === "success" ? "circle-check" : copyState === "error" ? "circle-close" : "copy", size: 16, "aria-hidden": "true" }) })
  ] }) : void 0;
  const autoHideNotice = show && revealDurationMs > 0 ? `${Math.ceil(revealDurationMs / 1e3)}\uCD08 \uD6C4 \uC790\uB3D9\uC73C\uB85C \uC228\uAE41\uB2C8\uB2E4.` : "";
  return (
    // `position: relative` anchors the sr-only announcer below to this field
    // instead of the document body.
    /* @__PURE__ */ jsxs("div", { style: { position: "relative", display: "grid", gap: "var(--space-1)", ...style }, children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          ...rest,
          id: inputId,
          label,
          value,
          type: show ? "text" : "password",
          readOnly: true,
          disabled,
          invalid,
          error,
          size,
          helper: helper ?? (autoHideNotice || void 0),
          actionRight: actions,
          autoComplete: "off",
          autoCapitalize: "off",
          autoCorrect: "off",
          spellCheck: false
        }
      ),
      /* @__PURE__ */ jsx("span", { role: "status", "aria-live": "polite", style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }, children: copyState === "success" || copyState === "error" ? copyActionLabel : autoHideNotice })
    ] })
  );
}

export {
  SecretField
};
//# sourceMappingURL=chunk-6FGDDTCB.js.map