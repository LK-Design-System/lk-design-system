"use client";
import {
  Button
} from "./chunk-4I4M7JVV.js";
import {
  Icon
} from "./chunk-IKUN5X7H.js";

// components/communication/MessageComposer.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var INERT_VALUE = Number.parseInt(React.version, 10) >= 19 ? true : "true";
var inertWhen = (isInert) => isInert ? INERT_VALUE : void 0;
var VISUALLY_HIDDEN_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0
};
var STATE_LABELS = {
  idle: null,
  submitting: "\uBA54\uC2DC\uC9C0\uB97C \uBCF4\uB0B4\uB294 \uC911\uC785\uB2C8\uB2E4.",
  streaming: "\uC751\uB2F5\uC744 \uC0DD\uC131\uD558\uB294 \uC911\uC785\uB2C8\uB2E4.",
  stopping: "\uC751\uB2F5 \uC911\uC9C0\uB97C \uC694\uCCAD\uD558\uB294 \uC911\uC785\uB2C8\uB2E4."
};
var LINE_HEIGHT = 24;
var ACTION_SLOT_SIZE_TOKEN = "var(--component-button-height-sm)";
var DENSITY_LAYOUT = {
  comfortable: {
    textareaHeight: 48,
    textareaHeightToken: "var(--space-12)",
    textareaVerticalInset: 24,
    formGap: "var(--space-2)",
    shellPadding: "var(--space-1)",
    attachmentsPadding: "var(--space-2) var(--space-2) 0",
    textareaPadding: "var(--space-3) var(--space-2)",
    actionGap: "var(--space-1)",
    actionsPadding: "0 var(--space-1) var(--space-1)",
    statusGap: "var(--space-3)"
  },
  compact: {
    textareaHeight: 40,
    textareaHeightToken: "var(--space-10)",
    textareaVerticalInset: 16,
    formGap: "var(--space-1)",
    shellPadding: "var(--space-0-5)",
    attachmentsPadding: "var(--space-1) var(--space-2) 0",
    textareaPadding: "var(--space-2)",
    actionGap: "var(--space-0-5)",
    actionsPadding: "0 var(--space-0-5) var(--space-0-5)",
    statusGap: "var(--space-2)"
  }
};
var useSafeLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
function mergeIds(...ids) {
  const merged = ids.flatMap((id) => String(id || "").split(/\s+/)).filter(Boolean);
  return merged.length > 0 ? [...new Set(merged)].join(" ") : void 0;
}
function MessageComposer({
  value,
  onValueChange,
  onSubmit,
  state = "idle",
  density = "comfortable",
  submitMode = "enter",
  canSubmit,
  readOnly = false,
  statusLabel,
  formLabel = "\uBA54\uC2DC\uC9C0 \uC791\uC131",
  inputLabel = "\uBA54\uC2DC\uC9C0 \uC785\uB825",
  placeholder = "\uBA54\uC2DC\uC9C0\uB97C \uC785\uB825\uD558\uC138\uC694.",
  description,
  maxLength,
  minRows = 1,
  maxRows = 6,
  attachments,
  leadingActions,
  trailingActions,
  submitLabel = "\uBA54\uC2DC\uC9C0 \uBCF4\uB0B4\uAE30",
  stopLabel = "\uC751\uB2F5 \uC911\uC9C0",
  onStop,
  textareaProps = {},
  disabled = false,
  disabledReason,
  className,
  style,
  ...formProps
}) {
  const missingDisabledReason = disabledReason == null || typeof disabledReason === "string" && disabledReason.trim().length === 0;
  if (disabled && missingDisabledReason) {
    throw new Error("MessageComposer requires disabledReason when disabled is true.");
  }
  const generatedId = React.useId();
  const textareaRef = React.useRef(null);
  const primaryActionRef = React.useRef(null);
  const primaryActionHadFocusRef = React.useRef(false);
  const compositionSessionRef = React.useRef(false);
  const [focused, setFocused] = React.useState(false);
  const {
    id: providedId,
    className: textareaClassName,
    style: textareaStyle,
    onChange: onTextareaChange,
    onKeyDown: onTextareaKeyDown,
    onFocus: onTextareaFocus,
    onBlur: onTextareaBlur,
    onCompositionStart: onTextareaCompositionStart,
    onCompositionEnd: onTextareaCompositionEnd,
    "aria-describedby": externalDescriptionIds,
    enterKeyHint: providedEnterKeyHint,
    ...restTextareaProps
  } = textareaProps;
  const textareaId = providedId || `message-composer-${generatedId}`;
  const descriptionId = description != null ? `${textareaId}-description` : void 0;
  const disabledReasonId = disabled ? `${textareaId}-disabled-reason` : void 0;
  const counterId = maxLength != null ? `${textareaId}-counter` : void 0;
  const statusId = `${textareaId}-status`;
  const normalizedDensity = density === "compact" ? "compact" : "comfortable";
  const densityLayout = DENSITY_LAYOUT[normalizedDensity];
  const primaryActionVars = normalizedDensity === "compact" ? { "--lds-button-radius": "var(--radius-md)" } : void 0;
  const normalizedMinRows = Math.max(1, Math.floor(Number(minRows) || 1));
  const normalizedMaxRows = Math.max(normalizedMinRows, Math.floor(Number(maxRows) || 6));
  const minimumHeight = Math.max(
    densityLayout.textareaHeight,
    normalizedMinRows * LINE_HEIGHT + densityLayout.textareaVerticalInset
  );
  const maximumHeight = Math.max(
    minimumHeight,
    normalizedMaxRows * LINE_HEIGHT + densityLayout.textareaVerticalInset
  );
  const nonIdle = state !== "idle";
  const previousNonIdleRef = React.useRef(nonIdle);
  const valueCanSubmit = String(value).trim().length > 0;
  const submitAllowed = !disabled && !readOnly && !nonIdle && (canSubmit ?? valueCanSubmit);
  const stopAllowed = !disabled && (state === "submitting" || state === "streaming") && typeof onStop === "function";
  const resolvedStatusLabel = statusLabel !== void 0 ? statusLabel : STATE_LABELS[state] ?? null;
  const resizeTextarea = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    const nextHeight = Math.min(maximumHeight, Math.max(minimumHeight, textarea.scrollHeight));
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maximumHeight ? "auto" : "hidden";
  }, [maximumHeight, minimumHeight]);
  useSafeLayoutEffect(() => {
    resizeTextarea();
  }, [resizeTextarea, value]);
  const restoreTextareaFocus = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || disabled) return;
    try {
      textarea.focus({ preventScroll: true });
    } catch {
      textarea.focus();
    }
  }, [disabled]);
  useSafeLayoutEffect(() => {
    const wasNonIdle = previousNonIdleRef.current;
    previousNonIdleRef.current = nonIdle;
    if (nonIdle || !wasNonIdle || !primaryActionHadFocusRef.current) return;
    const slot = primaryActionRef.current;
    const ownerDocument = slot?.ownerDocument;
    if (!slot || !ownerDocument) return;
    const active = ownerDocument.activeElement;
    const lostFocus = !active || active === ownerDocument.body || active === ownerDocument.documentElement;
    const blockedInSlot = !lostFocus && slot.contains(active) && (active.disabled === true || active.getAttribute?.("aria-disabled") === "true");
    if (!lostFocus && !blockedInSlot) return;
    restoreTextareaFocus();
  }, [nonIdle, restoreTextareaFocus]);
  useSafeLayoutEffect(() => {
    const slot = primaryActionRef.current;
    const active = slot?.ownerDocument?.activeElement;
    primaryActionHadFocusRef.current = !!(slot && active && slot.contains(active));
  });
  const submitValue = React.useCallback((reason) => {
    if (!submitAllowed) return;
    onSubmit?.(value, reason);
    restoreTextareaFocus();
  }, [onSubmit, restoreTextareaFocus, submitAllowed, value]);
  const handleKeyDown = (event) => {
    onTextareaKeyDown?.(event);
    if (event.defaultPrevented || event.key !== "Enter") return;
    const nativeEvent = event.nativeEvent || event;
    const composing = compositionSessionRef.current || nativeEvent.isComposing === true || event.isComposing === true || nativeEvent.keyCode === 229;
    if (composing || event.shiftKey || submitMode === "button-only") return;
    if (submitMode === "modifier-enter") {
      if (event.altKey || !event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      submitValue("modifier-enter");
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    submitValue("enter");
  };
  const hasLeadingActions = leadingActions != null;
  const hasTrailingActions = trailingActions != null;
  const textareaDescriptionIds = mergeIds(
    externalDescriptionIds,
    descriptionId,
    disabledReasonId,
    counterId
  );
  return /* @__PURE__ */ jsxs(
    "form",
    {
      ...formProps,
      className: ["lk-message-composer", className].filter(Boolean).join(" "),
      "aria-label": formLabel,
      "aria-busy": nonIdle || void 0,
      "aria-disabled": disabled || void 0,
      "data-state": state,
      "data-density": normalizedDensity,
      "data-submit-mode": submitMode,
      onSubmit: (event) => {
        event.preventDefault();
        submitValue("button");
      },
      style: {
        display: "grid",
        alignContent: "start",
        gap: densityLayout.formGap,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        color: "var(--color-semantic-label-normal)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("label", { htmlFor: textareaId, style: VISUALLY_HIDDEN_STYLE, children: inputLabel }),
        description != null && /* @__PURE__ */ jsx(
          "p",
          {
            id: descriptionId,
            "data-composer-description": "",
            style: {
              margin: 0,
              color: "var(--color-semantic-label-neutral)",
              fontSize: "var(--caption1-size)",
              lineHeight: "var(--caption1-line)"
            },
            children: description
          }
        ),
        disabled && /* @__PURE__ */ jsx(
          "p",
          {
            id: disabledReasonId,
            "data-composer-disabled-reason": "",
            style: {
              margin: 0,
              color: "var(--color-semantic-label-neutral)",
              fontSize: "var(--caption1-size)",
              lineHeight: "var(--caption1-line)"
            },
            children: disabledReason
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            "data-composer-shell": "",
            "data-focused": focused ? "true" : void 0,
            "aria-disabled": disabled || void 0,
            inert: inertWhen(disabled),
            onClickCapture: disabled ? (event) => {
              event.preventDefault();
              event.stopPropagation();
            } : void 0,
            style: {
              display: "grid",
              gap: 0,
              width: "100%",
              minWidth: 0,
              padding: densityLayout.shellPadding,
              boxSizing: "border-box",
              background: disabled ? "var(--color-semantic-fill-normal)" : readOnly ? "var(--color-semantic-background-normal-alternative)" : "var(--color-semantic-background-elevated-normal)",
              border: `var(--component-input-border-width) solid ${focused && !disabled ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-normal-normal)"}`,
              borderRadius: "var(--radius-xl)",
              boxShadow: focused && !disabled ? "0 0 0 var(--space-1) var(--color-semantic-focus-ring)" : "var(--shadow-sm)",
              transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)"
            },
            children: [
              attachments != null && /* @__PURE__ */ jsx(
                "div",
                {
                  "data-composer-attachments": "",
                  style: {
                    minWidth: 0,
                    padding: densityLayout.attachmentsPadding,
                    overflowWrap: "anywhere"
                  },
                  children: attachments
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  "data-composer-control-row": "",
                  style: {
                    display: "grid",
                    gap: 0,
                    width: "100%",
                    minWidth: 0,
                    boxSizing: "border-box"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      "textarea",
                      {
                        ...restTextareaProps,
                        ref: textareaRef,
                        id: textareaId,
                        className: textareaClassName,
                        "data-composer-input": "",
                        rows: 1,
                        value,
                        disabled,
                        readOnly,
                        maxLength,
                        placeholder,
                        enterKeyHint: providedEnterKeyHint ?? (submitMode === "enter" ? "send" : "enter"),
                        "aria-describedby": textareaDescriptionIds,
                        onChange: (event) => {
                          onValueChange?.(event.target.value, event);
                          onTextareaChange?.(event);
                        },
                        onKeyDown: handleKeyDown,
                        onFocus: (event) => {
                          setFocused(true);
                          onTextareaFocus?.(event);
                        },
                        onBlur: (event) => {
                          setFocused(false);
                          onTextareaBlur?.(event);
                        },
                        onCompositionStart: (event) => {
                          compositionSessionRef.current = true;
                          onTextareaCompositionStart?.(event);
                        },
                        onCompositionEnd: (event) => {
                          compositionSessionRef.current = false;
                          onTextareaCompositionEnd?.(event);
                        },
                        style: {
                          display: "block",
                          width: "100%",
                          minWidth: 0,
                          minHeight: normalizedMinRows === 1 ? densityLayout.textareaHeightToken : minimumHeight,
                          maxHeight: maximumHeight,
                          height: normalizedMinRows === 1 ? densityLayout.textareaHeightToken : minimumHeight,
                          padding: densityLayout.textareaPadding,
                          boxSizing: "border-box",
                          resize: "none",
                          overflowX: "hidden",
                          overflowY: "hidden",
                          border: 0,
                          outline: 0,
                          background: "transparent",
                          color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
                          caretColor: "var(--color-semantic-primary-normal)",
                          fontFamily: "var(--font-sans)",
                          fontSize: "var(--component-input-font-size)",
                          lineHeight: "var(--body1-line)",
                          letterSpacing: "var(--component-input-letter-spacing)",
                          cursor: disabled ? "not-allowed" : "text",
                          ...textareaStyle
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        "data-composer-actions-row": "",
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: densityLayout.actionGap,
                          width: "100%",
                          minWidth: 0,
                          minHeight: ACTION_SLOT_SIZE_TOKEN,
                          padding: densityLayout.actionsPadding,
                          boxSizing: "border-box",
                          flexWrap: "wrap"
                        },
                        children: [
                          hasLeadingActions && /* @__PURE__ */ jsx(
                            "div",
                            {
                              role: "group",
                              "aria-label": "\uBA54\uC2DC\uC9C0 \uC55E\uCABD \uB3D9\uC791",
                              "data-composer-leading-actions": "",
                              style: {
                                display: "flex",
                                alignItems: "center",
                                gap: densityLayout.actionGap,
                                flex: "1 1 auto",
                                minWidth: 0,
                                flexWrap: "wrap"
                              },
                              children: leadingActions
                            }
                          ),
                          !hasLeadingActions && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { flex: "1 1 auto" } }),
                          hasTrailingActions && /* @__PURE__ */ jsx(
                            "div",
                            {
                              role: "group",
                              "aria-label": "\uBA54\uC2DC\uC9C0 \uB4A4\uCABD \uB3D9\uC791",
                              "data-composer-trailing-actions": "",
                              style: {
                                display: "flex",
                                alignItems: "center",
                                gap: densityLayout.actionGap,
                                minWidth: 0,
                                marginInlineStart: hasLeadingActions ? "auto" : 0,
                                flexWrap: "wrap"
                              },
                              children: trailingActions
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              ref: primaryActionRef,
                              "data-composer-primary-action": "",
                              style: {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: ACTION_SLOT_SIZE_TOKEN,
                                minWidth: ACTION_SLOT_SIZE_TOKEN,
                                minHeight: ACTION_SLOT_SIZE_TOKEN,
                                boxSizing: "border-box"
                              },
                              children: nonIdle ? /* @__PURE__ */ jsx(
                                Button,
                                {
                                  type: "button",
                                  size: "sm",
                                  variant: "primary",
                                  iconOnly: true,
                                  vars: primaryActionVars,
                                  "aria-label": stopLabel,
                                  "aria-disabled": stopAllowed ? void 0 : "true",
                                  onClick: () => {
                                    if (!stopAllowed) return;
                                    onStop();
                                  },
                                  children: /* @__PURE__ */ jsx(Icon, { name: "square-fill", size: 16, "aria-hidden": "true" })
                                }
                              ) : /* @__PURE__ */ jsx(
                                Button,
                                {
                                  type: "submit",
                                  size: "sm",
                                  variant: "primary",
                                  iconOnly: true,
                                  vars: primaryActionVars,
                                  "aria-label": submitLabel,
                                  disabled: !submitAllowed,
                                  children: /* @__PURE__ */ jsx(Icon, { name: "send-fill", size: 18, "aria-hidden": "true" })
                                }
                              )
                            }
                          )
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        (resolvedStatusLabel != null || maxLength != null) && /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              gap: densityLayout.statusGap,
              minWidth: 0,
              color: "var(--color-semantic-label-alternative)",
              fontSize: "var(--caption2-size)",
              lineHeight: "var(--caption2-line)"
            },
            children: [
              /* @__PURE__ */ jsx("span", { id: statusId, "aria-hidden": "true", children: resolvedStatusLabel }),
              maxLength != null && /* @__PURE__ */ jsxs("span", { id: counterId, "data-composer-counter": "", style: { marginInlineStart: "auto", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }, children: [
                String(value).length,
                "/",
                maxLength
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-composer-live-status": "",
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
            style: VISUALLY_HIDDEN_STYLE,
            children: resolvedStatusLabel
          }
        )
      ]
    }
  );
}

export {
  MessageComposer
};
//# sourceMappingURL=chunk-EYW7B4CK.js.map