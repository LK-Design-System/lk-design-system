"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/content/ContentEditor.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_TOOLBAR_ITEMS = [
  { value: "body", label: "\uBCF8\uBB38", icon: "document" },
  { value: "tag", label: "\uD0DC\uADF8", icon: "tag" },
  { value: "attachment", label: "\uCCA8\uBD80", icon: "attachment" },
  { value: "preview", label: "\uBBF8\uB9AC\uBCF4\uAE30", icon: "eye" }
];
function ToolbarButton({ item, active, disabled, onAction }) {
  const [hover, setHover] = _react2.default.useState(false);
  const isDisabled = disabled || item.disabled;
  const label = item.label || item.value;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "button",
    {
      type: "button",
      "aria-label": label,
      "aria-pressed": active || void 0,
      title: label,
      disabled: isDisabled,
      onClick: (event) => {
        if (!isDisabled) onAction && onAction(item.value, item, event);
      },
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 34,
        height: 34,
        border: "1px solid var(--color-semantic-line-normal-normal)",
        borderRadius: "var(--radius-sm)",
        background: active ? "var(--color-semantic-primary-surface-strong)" : hover && !isDisabled ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-background-elevated-normal)",
        color: active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-alternative)",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.45 : 1,
        transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)"
      },
      children: item.icon ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: item.icon, size: 17, "aria-hidden": "true" }) : item.children
    }
  );
}
function ContentEditor({
  "aria-label": ariaLabel = "\uAE00 \uC791\uC131 \uC5D0\uB514\uD130",
  titleLabel = "\uC81C\uBAA9",
  titlePlaceholder = "\uC81C\uBAA9\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
  titleValue,
  defaultTitleValue = "",
  onTitleChange,
  bodyLabel = "\uBCF8\uBB38",
  placeholder = "\uB0B4\uC6A9\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
  value,
  defaultValue = "",
  onValueChange,
  toolbar,
  toolbarItems = DEFAULT_TOOLBAR_ITEMS,
  activeToolbarItems = [],
  onToolbarAction,
  meta,
  status,
  helper,
  actions,
  footer,
  required = false,
  invalid = false,
  disabled = false,
  readOnly = false,
  busy = false,
  rows = 12,
  maxLength,
  id,
  titleId,
  bodyId,
  titleInputProps,
  textareaProps,
  style,
  ...rest
}) {
  const generatedId = _react2.default.useId();
  const rootId = id || `content-editor-${generatedId}`;
  const resolvedTitleId = titleId || `${rootId}-title`;
  const resolvedBodyId = bodyId || `${rootId}-body`;
  const [titleFocus, setTitleFocus] = _react2.default.useState(false);
  const [bodyFocus, setBodyFocus] = _react2.default.useState(false);
  const [internalTitle, setInternalTitle] = _react2.default.useState(defaultTitleValue);
  const [internalValue, setInternalValue] = _react2.default.useState(defaultValue);
  const isTitleControlled = titleValue !== void 0;
  const isValueControlled = value !== void 0;
  const currentTitle = isTitleControlled ? titleValue : internalTitle;
  const currentValue = isValueControlled ? value : internalValue;
  const activeSet = _react2.default.useMemo(() => new Set(activeToolbarItems), [activeToolbarItems]);
  const hasFooter = meta != null || status != null || helper != null || actions != null || footer != null || maxLength != null;
  const bodyLength = String(_nullishCoalesce(currentValue, () => ( ""))).length;
  const ring = invalid ? "var(--color-semantic-status-negative)" : titleFocus || bodyFocus ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-normal-normal)";
  const handleTitleChange = (event) => {
    const next = event.target.value;
    if (!isTitleControlled) setInternalTitle(next);
    onTitleChange && onTitleChange(next, event);
    titleInputProps && titleInputProps.onChange && titleInputProps.onChange(event);
  };
  const handleValueChange = (event) => {
    const next = event.target.value;
    if (!isValueControlled) setInternalValue(next);
    onValueChange && onValueChange(next, event);
    textareaProps && textareaProps.onChange && textareaProps.onChange(event);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "section",
    {
      id: rootId,
      "aria-label": ariaLabel,
      "aria-busy": busy || void 0,
      style: {
        display: "grid",
        gridTemplateRows: "auto auto minmax(180px, 1fr) auto",
        width: "100%",
        minWidth: 0,
        overflow: "hidden",
        border: `1px solid ${ring}`,
        borderRadius: "var(--radius-md)",
        background: "var(--color-semantic-background-elevated-normal)",
        boxShadow: titleFocus || bodyFocus ? "0 0 0 4px var(--color-semantic-focus-ring)" : "none",
        fontFamily: "var(--font-sans)",
        color: "var(--color-semantic-label-normal)",
        transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-2)", padding: "var(--space-4) var(--space-4) var(--space-3)" }, children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "label", { htmlFor: resolvedTitleId, style: { fontSize: "var(--label2-size)", lineHeight: 1.4, fontWeight: "var(--fw-bold)", color: invalid ? "var(--color-semantic-status-negative-text)" : "var(--color-semantic-label-alternative)" }, children: [
            titleLabel,
            required && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-status-negative)" }, children: " *" })
          ] }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "input",
            {
              id: resolvedTitleId,
              value: currentTitle,
              placeholder: titlePlaceholder,
              disabled,
              readOnly,
              ...titleInputProps,
              onChange: handleTitleChange,
              onFocus: (event) => {
                setTitleFocus(true);
                titleInputProps && titleInputProps.onFocus && titleInputProps.onFocus(event);
              },
              onBlur: (event) => {
                setTitleFocus(false);
                titleInputProps && titleInputProps.onBlur && titleInputProps.onBlur(event);
              },
              style: {
                width: "100%",
                minWidth: 0,
                border: "none",
                outline: "none",
                background: "transparent",
                color: "var(--color-semantic-label-strong)",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--heading1-size)",
                lineHeight: 1.35,
                fontWeight: "var(--fw-extra)",
                letterSpacing: 0,
                opacity: disabled ? 0.45 : 1,
                ..._optionalChain([titleInputProps, 'optionalAccess', _ => _.style])
              }
            }
          )
        ] }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "div",
          {
            role: "toolbar",
            "aria-label": "\uAE00 \uD3B8\uC9D1 \uB3C4\uAD6C",
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-3)",
              padding: "8px var(--space-4)",
              borderTop: "1px solid var(--color-semantic-line-normal-normal)",
              borderBottom: "1px solid var(--color-semantic-line-normal-normal)",
              background: "var(--color-semantic-background-normal-alternative)"
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", minWidth: 0 }, children: toolbar != null ? toolbar : toolbarItems.map((item) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                ToolbarButton,
                {
                  item,
                  active: activeSet.has(item.value),
                  disabled: disabled || readOnly,
                  onAction: onToolbarAction
                },
                item.value
              )) }),
              status != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "status", "aria-live": "polite", style: { flexShrink: 0, color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", lineHeight: 1.35 }, children: status })
            ]
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-2)", padding: "var(--space-4)" }, children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "label", { htmlFor: resolvedBodyId, style: { fontSize: "var(--label2-size)", lineHeight: 1.4, fontWeight: "var(--fw-bold)", color: invalid ? "var(--color-semantic-status-negative-text)" : "var(--color-semantic-label-alternative)" }, children: [
            bodyLabel,
            required && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-status-negative)" }, children: " *" })
          ] }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "textarea",
            {
              id: resolvedBodyId,
              value: currentValue,
              placeholder,
              disabled,
              readOnly,
              rows,
              maxLength,
              "aria-invalid": invalid || void 0,
              ...textareaProps,
              onChange: handleValueChange,
              onFocus: (event) => {
                setBodyFocus(true);
                textareaProps && textareaProps.onFocus && textareaProps.onFocus(event);
              },
              onBlur: (event) => {
                setBodyFocus(false);
                textareaProps && textareaProps.onBlur && textareaProps.onBlur(event);
              },
              style: {
                width: "100%",
                minHeight: 220,
                resize: "vertical",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "var(--color-semantic-label-normal)",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--body2-size)",
                lineHeight: 1.68,
                letterSpacing: 0,
                boxSizing: "border-box",
                opacity: disabled ? 0.45 : 1,
                ..._optionalChain([textareaProps, 'optionalAccess', _2 => _2.style])
              }
            }
          )
        ] }),
        hasFooter && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-3)",
              flexWrap: "wrap",
              padding: "10px var(--space-4)",
              borderTop: "1px solid var(--color-semantic-line-normal-normal)",
              background: "var(--color-semantic-background-normal-alternative)"
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0, color: "var(--color-semantic-label-alternative)", fontSize: "var(--caption1-size)", lineHeight: 1.45 }, children: [
                meta != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: meta }),
                helper != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: helper }),
                maxLength != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { children: [
                  bodyLength,
                  "/",
                  maxLength
                ] }),
                footer
              ] }),
              actions != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap" }, children: actions })
            ]
          }
        )
      ]
    }
  );
}



exports.ContentEditor = ContentEditor;
//# sourceMappingURL=chunk-CWAZMK2U.cjs.map