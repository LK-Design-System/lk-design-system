"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkE2EQSM2Kcjs = require('./chunk-E2EQSM2K.cjs');


var _chunkF72KSGF7cjs = require('./chunk-F72KSGF7.cjs');

// components/communication/MessageComposer.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
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
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
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
  const generatedId = _react2.default.useId();
  const textareaRef = _react2.default.useRef(null);
  const primaryActionRef = _react2.default.useRef(null);
  const primaryActionHadFocusRef = _react2.default.useRef(false);
  const compositionSessionRef = _react2.default.useRef(false);
  const [focused, setFocused] = _react2.default.useState(false);
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
  const previousNonIdleRef = _react2.default.useRef(nonIdle);
  const valueCanSubmit = String(value).trim().length > 0;
  const submitAllowed = !disabled && !readOnly && !nonIdle && (_nullishCoalesce(canSubmit, () => ( valueCanSubmit)));
  const stopAllowed = !disabled && (state === "submitting" || state === "streaming") && typeof onStop === "function";
  const resolvedStatusLabel = statusLabel !== void 0 ? statusLabel : _nullishCoalesce(STATE_LABELS[state], () => ( null));
  const resizeTextarea = _react2.default.useCallback(() => {
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
  const restoreTextareaFocus = _react2.default.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || disabled) return;
    try {
      textarea.focus({ preventScroll: true });
    } catch (e) {
      textarea.focus();
    }
  }, [disabled]);
  useSafeLayoutEffect(() => {
    const wasNonIdle = previousNonIdleRef.current;
    previousNonIdleRef.current = nonIdle;
    if (nonIdle || !wasNonIdle || !primaryActionHadFocusRef.current) return;
    const slot = primaryActionRef.current;
    const ownerDocument = _optionalChain([slot, 'optionalAccess', _ => _.ownerDocument]);
    if (!slot || !ownerDocument) return;
    const active = ownerDocument.activeElement;
    const lostFocus = !active || active === ownerDocument.body || active === ownerDocument.documentElement;
    const blockedInSlot = !lostFocus && slot.contains(active) && (active.disabled === true || _optionalChain([active, 'access', _2 => _2.getAttribute, 'optionalCall', _3 => _3("aria-disabled")]) === "true");
    if (!lostFocus && !blockedInSlot) return;
    restoreTextareaFocus();
  }, [nonIdle, restoreTextareaFocus]);
  useSafeLayoutEffect(() => {
    const slot = primaryActionRef.current;
    const active = _optionalChain([slot, 'optionalAccess', _4 => _4.ownerDocument, 'optionalAccess', _5 => _5.activeElement]);
    primaryActionHadFocusRef.current = !!(slot && active && slot.contains(active));
  });
  const submitValue = _react2.default.useCallback((reason) => {
    if (!submitAllowed) return;
    _optionalChain([onSubmit, 'optionalCall', _6 => _6(value, reason)]);
    restoreTextareaFocus();
  }, [onSubmit, restoreTextareaFocus, submitAllowed, value]);
  const handleKeyDown = (event) => {
    _optionalChain([onTextareaKeyDown, 'optionalCall', _7 => _7(event)]);
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
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
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
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "label", { htmlFor: textareaId, style: VISUALLY_HIDDEN_STYLE, children: inputLabel }),
        description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
        disabled && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            "data-composer-shell": "",
            "data-focused": focused ? "true" : void 0,
            "aria-disabled": disabled || void 0,
            inert: disabled || void 0,
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
              attachments != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
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
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
                        enterKeyHint: _nullishCoalesce(providedEnterKeyHint, () => ( (submitMode === "enter" ? "send" : "enter"))),
                        "aria-describedby": textareaDescriptionIds,
                        onChange: (event) => {
                          _optionalChain([onValueChange, 'optionalCall', _8 => _8(event.target.value, event)]);
                          _optionalChain([onTextareaChange, 'optionalCall', _9 => _9(event)]);
                        },
                        onKeyDown: handleKeyDown,
                        onFocus: (event) => {
                          setFocused(true);
                          _optionalChain([onTextareaFocus, 'optionalCall', _10 => _10(event)]);
                        },
                        onBlur: (event) => {
                          setFocused(false);
                          _optionalChain([onTextareaBlur, 'optionalCall', _11 => _11(event)]);
                        },
                        onCompositionStart: (event) => {
                          compositionSessionRef.current = true;
                          _optionalChain([onTextareaCompositionStart, 'optionalCall', _12 => _12(event)]);
                        },
                        onCompositionEnd: (event) => {
                          compositionSessionRef.current = false;
                          _optionalChain([onTextareaCompositionEnd, 'optionalCall', _13 => _13(event)]);
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
                    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
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
                          hasLeadingActions && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
                          !hasLeadingActions && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { flex: "1 1 auto" } }),
                          hasTrailingActions && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
                          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
                              children: nonIdle ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                                _chunkE2EQSM2Kcjs.Button,
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
                                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "square-fill", size: 16, "aria-hidden": "true" })
                                }
                              ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                                _chunkE2EQSM2Kcjs.Button,
                                {
                                  type: "submit",
                                  size: "sm",
                                  variant: "primary",
                                  iconOnly: true,
                                  vars: primaryActionVars,
                                  "aria-label": submitLabel,
                                  disabled: !submitAllowed,
                                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "send-fill", size: 18, "aria-hidden": "true" })
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
        (resolvedStatusLabel != null || maxLength != null) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
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
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { id: statusId, "aria-hidden": "true", children: resolvedStatusLabel }),
              maxLength != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { id: counterId, "data-composer-counter": "", style: { marginInlineStart: "auto", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }, children: [
                String(value).length,
                "/",
                maxLength
              ] })
            ]
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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



exports.MessageComposer = MessageComposer;
//# sourceMappingURL=chunk-QFCJ47AX.cjs.map