"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk3BBCS67Wcjs = require('./chunk-3BBCS67W.cjs');

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
var LINE_HEIGHT = 22;
var TEXTAREA_VERTICAL_INSET = 22;
var COMPACT_TEXTAREA_HEIGHT = 44;
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
function mergeIds(...ids) {
  const merged = ids.flatMap((id) => String(id || "").split(/\s+/)).filter(Boolean);
  return merged.length > 0 ? [...new Set(merged)].join(" ") : void 0;
}
function SendIcon() {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "svg", { "aria-hidden": "true", viewBox: "0 0 20 20", width: "18", height: "18", fill: "none", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M3 9.3 16.2 3l-4.7 13.7-2.2-5.2L3 9.3Z", stroke: "currentColor", strokeWidth: "1.7", strokeLinejoin: "round" }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "m9.3 11.5 3.1-3.1", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" })
  ] });
}
function StopIcon() {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { "aria-hidden": "true", viewBox: "0 0 20 20", width: "16", height: "16", fill: "currentColor", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "rect", { x: "4.5", y: "4.5", width: "11", height: "11", rx: "2" }) });
}
function MessageComposer({
  value,
  onValueChange,
  onSubmit,
  state = "idle",
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
  attachmentAction,
  secondaryActions,
  submitLabel = "\uBA54\uC2DC\uC9C0 \uBCF4\uB0B4\uAE30",
  stopLabel = "\uC751\uB2F5 \uC911\uC9C0",
  onStop,
  textareaProps = {},
  disabled = false,
  disabledReason
}) {
  const missingDisabledReason = disabledReason == null || typeof disabledReason === "string" && disabledReason.trim().length === 0;
  if (disabled && missingDisabledReason) {
    throw new Error("MessageComposer requires disabledReason when disabled is true.");
  }
  const generatedId = _react2.default.useId();
  const textareaRef = _react2.default.useRef(null);
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
  const normalizedMinRows = Math.max(1, Math.floor(Number(minRows) || 1));
  const normalizedMaxRows = Math.max(normalizedMinRows, Math.floor(Number(maxRows) || 6));
  const minimumHeight = Math.max(
    COMPACT_TEXTAREA_HEIGHT,
    normalizedMinRows * LINE_HEIGHT + TEXTAREA_VERTICAL_INSET
  );
  const maximumHeight = Math.max(
    minimumHeight,
    normalizedMaxRows * LINE_HEIGHT + TEXTAREA_VERTICAL_INSET
  );
  const nonIdle = state !== "idle";
  const valueCanSubmit = String(value).trim().length > 0;
  const submitAllowed = !disabled && !readOnly && !nonIdle && (_nullishCoalesce(canSubmit, () => ( valueCanSubmit)));
  const stopAllowed = !disabled && (state === "submitting" || state === "streaming") && typeof onStop === "function";
  const resolvedStatusLabel = _nullishCoalesce(_nullishCoalesce(statusLabel, () => ( STATE_LABELS[state])), () => ( null));
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
  const submitValue = _react2.default.useCallback((reason) => {
    if (!submitAllowed) return;
    _optionalChain([onSubmit, 'optionalCall', _ => _(value, reason)]);
    restoreTextareaFocus();
  }, [onSubmit, restoreTextareaFocus, submitAllowed, value]);
  const handleKeyDown = (event) => {
    _optionalChain([onTextareaKeyDown, 'optionalCall', _2 => _2(event)]);
    if (event.defaultPrevented || event.key !== "Enter") return;
    const nativeEvent = event.nativeEvent || event;
    const composing = compositionSessionRef.current || nativeEvent.isComposing === true || event.isComposing === true || nativeEvent.keyCode === 229;
    if (composing || event.shiftKey || submitMode === "button-only") return;
    if (submitMode === "modifier-enter") {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      submitValue("modifier-enter");
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    submitValue("enter");
  };
  const hasUtilities = attachmentAction != null || secondaryActions != null;
  const textareaDescriptionIds = mergeIds(
    externalDescriptionIds,
    descriptionId,
    disabledReasonId,
    counterId
  );
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "form",
    {
      className: "lk-message-composer",
      "aria-label": formLabel,
      "aria-busy": nonIdle || void 0,
      "aria-disabled": disabled || void 0,
      "data-state": state,
      "data-submit-mode": submitMode,
      onSubmit: (event) => {
        event.preventDefault();
        submitValue("button");
      },
      style: {
        display: "grid",
        gap: "var(--space-2)",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        color: "var(--color-semantic-label-normal)",
        fontFamily: "var(--font-sans)"
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
        attachments != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            "data-composer-attachments": "",
            style: { minWidth: 0, overflowWrap: "anywhere" },
            children: attachments
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "div",
          {
            "data-composer-control-row": "",
            "data-focused": focused ? "true" : void 0,
            style: {
              display: "grid",
              gridTemplateColumns: `${hasUtilities ? "auto " : ""}minmax(0, 1fr) auto`,
              alignItems: "end",
              gap: "var(--space-1)",
              width: "100%",
              minWidth: 0,
              padding: "0 var(--space-1)",
              boxSizing: "border-box",
              background: disabled ? "var(--color-semantic-fill-normal)" : readOnly ? "var(--color-semantic-background-normal-alternative)" : "var(--color-semantic-background-elevated-normal)",
              border: `var(--component-input-border-width) solid ${focused && !disabled ? "var(--component-input-border-color-focus)" : "var(--component-input-border-color)"}`,
              borderRadius: "var(--component-input-radius)",
              boxShadow: focused && !disabled ? "var(--component-input-focus-shadow)" : "none",
              transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)"
            },
            children: [
              hasUtilities && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                "div",
                {
                  role: "group",
                  "aria-label": "\uBA54\uC2DC\uC9C0 \uC791\uC131 \uB3C4\uAD6C",
                  "data-composer-utilities": "",
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-1)",
                    minHeight: 44,
                    paddingBlock: 6,
                    boxSizing: "border-box",
                    flexWrap: "wrap"
                  },
                  children: [
                    attachmentAction,
                    secondaryActions
                  ]
                }
              ),
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
                    _optionalChain([onValueChange, 'optionalCall', _3 => _3(event.target.value, event)]);
                    _optionalChain([onTextareaChange, 'optionalCall', _4 => _4(event)]);
                  },
                  onKeyDown: handleKeyDown,
                  onFocus: (event) => {
                    setFocused(true);
                    _optionalChain([onTextareaFocus, 'optionalCall', _5 => _5(event)]);
                  },
                  onBlur: (event) => {
                    setFocused(false);
                    _optionalChain([onTextareaBlur, 'optionalCall', _6 => _6(event)]);
                  },
                  onCompositionStart: (event) => {
                    compositionSessionRef.current = true;
                    _optionalChain([onTextareaCompositionStart, 'optionalCall', _7 => _7(event)]);
                  },
                  onCompositionEnd: (event) => {
                    compositionSessionRef.current = false;
                    _optionalChain([onTextareaCompositionEnd, 'optionalCall', _8 => _8(event)]);
                  },
                  style: {
                    display: "block",
                    width: "100%",
                    minWidth: 0,
                    minHeight: minimumHeight,
                    maxHeight: maximumHeight,
                    height: minimumHeight,
                    padding: "11px var(--space-2)",
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
                    lineHeight: `${LINE_HEIGHT}px`,
                    letterSpacing: "var(--component-input-letter-spacing)",
                    cursor: disabled ? "not-allowed" : "text",
                    ...textareaStyle
                  }
                }
              ),
              nonIdle ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _chunk3BBCS67Wcjs.Button,
                {
                  type: "button",
                  size: "md",
                  variant: "primary",
                  iconOnly: true,
                  "aria-label": stopLabel,
                  disabled: !stopAllowed,
                  onClick: () => {
                    if (!stopAllowed) return;
                    onStop();
                  },
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, StopIcon, {})
                }
              ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _chunk3BBCS67Wcjs.Button,
                {
                  type: "submit",
                  size: "md",
                  variant: "primary",
                  iconOnly: true,
                  "aria-label": submitLabel,
                  disabled: !submitAllowed,
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, SendIcon, {})
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
              gap: "var(--space-3)",
              minWidth: 0,
              color: "var(--color-semantic-label-alternative)",
              fontSize: "var(--caption2-size)",
              lineHeight: "var(--caption2-line)"
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { id: statusId, role: resolvedStatusLabel != null ? "status" : void 0, children: resolvedStatusLabel }),
              maxLength != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { id: counterId, "data-composer-counter": "", style: { marginInlineStart: "auto", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }, children: [
                String(value).length,
                "/",
                maxLength
              ] })
            ]
          }
        )
      ]
    }
  );
}



exports.MessageComposer = MessageComposer;
//# sourceMappingURL=chunk-4YEFR2XW.cjs.map