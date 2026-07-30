"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkXWY5DDJVcjs = require('./chunk-XWY5DDJV.cjs');


var _chunkFS5I4U5Mcjs = require('./chunk-FS5I4U5M.cjs');

// components/forms/PropertyField.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function getLabelText(label) {
  if (label == null || typeof label === "boolean") return "";
  if (typeof label === "string" || typeof label === "number") return String(label);
  if (Array.isArray(label)) return label.map(getLabelText).join("");
  if (_react2.default.isValidElement(label)) return getLabelText(_optionalChain([label, 'access', _ => _.props, 'optionalAccess', _2 => _2.children]));
  return "";
}
function normalizeNumberValue(value) {
  if (value === "") return "";
  const numeric = Number(value);
  return Number.isNaN(numeric) ? "" : numeric;
}
function PropertyField({
  label,
  hint,
  value: committed,
  type = "text",
  min,
  max,
  step = 1,
  unit,
  disabled = false,
  readOnly = false,
  applyLabel = "\uC801\uC6A9",
  dirtyLabel = "\uBCC0\uACBD\uB428",
  onApply,
  style,
  ...rest
}) {
  const fieldId = _react2.default.useId();
  const inputId = `property-${fieldId}`;
  const labelId = `${inputId}-label`;
  const hintId = hint != null ? `${inputId}-hint` : void 0;
  const unitId = type !== "toggle" && unit != null ? `${inputId}-unit` : void 0;
  const dirtyId = `${inputId}-dirty`;
  const labelText = getLabelText(label).trim() || "\uC18D\uC131";
  const applyText = typeof applyLabel === "string" ? applyLabel : "\uC801\uC6A9";
  const [draft, setDraft] = _react2.default.useState(committed);
  const [focused, setFocused] = _react2.default.useState(false);
  _react2.default.useEffect(() => {
    setDraft(committed);
  }, [committed]);
  const dirty = draft !== committed;
  const interactionDisabled = disabled || readOnly;
  const canApply = dirty && !interactionDisabled && typeof onApply === "function";
  const controlDisabled = disabled;
  const controlReadOnly = readOnly;
  const isToggle = type === "toggle";
  const descriptionIds = [hintId, unitId, dirty ? dirtyId : null].filter(Boolean).join(" ") || void 0;
  const apply = () => {
    if (canApply) onApply(draft);
  };
  const activateToggle = () => {
    if (typeof document === "undefined") return;
    _optionalChain([document, 'access', _3 => _3.getElementById, 'call', _4 => _4(inputId), 'optionalAccess', _5 => _5.click, 'call', _6 => _6()]);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      "data-disabled": disabled ? "" : void 0,
      style: {
        display: "grid",
        gridTemplateColumns: "minmax(128px, 1fr) auto auto",
        alignItems: "center",
        columnGap: "var(--space-3)",
        rowGap: "var(--space-2)",
        width: "100%",
        minWidth: 0,
        padding: "8px 0",
        fontFamily: "var(--font-sans)",
        boxSizing: "border-box",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-0-5)", minWidth: 0 }, children: [
          _react2.default.createElement(
            isToggle ? "span" : "label",
            {
              id: labelId,
              htmlFor: isToggle ? void 0 : inputId,
              onClick: isToggle ? activateToggle : void 0,
              style: {
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "var(--label2-size)",
                lineHeight: "var(--label2-line)",
                fontWeight: "var(--fw-semibold)",
                letterSpacing: 0,
                cursor: isToggle && !disabled && !readOnly ? "pointer" : void 0,
                color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)"
              }
            },
            label,
            dirty && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "span",
              {
                "aria-hidden": "true",
                title: dirtyLabel,
                style: {
                  marginLeft: 4,
                  color: "var(--color-semantic-status-cautionary)"
                },
                children: "\u2022"
              },
              "dirty-dot"
            )
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { id: dirtyId, hidden: true, children: dirtyLabel }),
          hint != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "span",
            {
              id: hintId,
              style: {
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "var(--caption1-size)",
                lineHeight: "var(--caption1-line)",
                fontWeight: "var(--fw-medium)",
                letterSpacing: 0,
                color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)"
              },
              children: hint
            }
          )
        ] }),
        isToggle ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkXWY5DDJVcjs.Switch,
          {
            size: "sm",
            id: inputId,
            checked: !!draft,
            disabled,
            readOnly,
            "aria-labelledby": labelId,
            "aria-describedby": descriptionIds,
            onChange: (next) => setDraft(next)
          }
        ) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "span",
          {
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "var(--space-1-5)",
              minWidth: 0
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "input",
                {
                  id: inputId,
                  type: type === "number" ? "number" : "text",
                  value: _nullishCoalesce(draft, () => ( "")),
                  min,
                  max,
                  step,
                  disabled: controlDisabled,
                  readOnly: controlReadOnly,
                  "aria-describedby": descriptionIds,
                  onFocus: () => setFocused(true),
                  onBlur: () => setFocused(false),
                  onChange: (event) => {
                    setDraft(
                      type === "number" ? normalizeNumberValue(event.target.value) : event.target.value
                    );
                  },
                  onKeyDown: (event) => {
                    if (event.key === "Enter") apply();
                    if (event.key === "Escape") setDraft(committed);
                  },
                  style: {
                    width: type === "number" ? 88 : 160,
                    height: 34,
                    padding: "0 10px",
                    border: `1px solid ${focused ? "var(--component-input-border-color-focus)" : dirty ? "var(--color-semantic-status-cautionary)" : "var(--component-input-border-color)"}`,
                    borderRadius: "var(--radius-md)",
                    outline: "none",
                    boxShadow: focused ? "var(--component-input-focus-shadow)" : "none",
                    background: controlDisabled ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-background-elevated-normal)",
                    fontFamily: "inherit",
                    fontSize: "var(--label2-size)",
                    lineHeight: "var(--label2-line)",
                    fontWeight: "var(--fw-semibold)",
                    letterSpacing: 0,
                    color: controlDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
                    textAlign: type === "number" ? "right" : "left",
                    fontVariantNumeric: "tabular-nums",
                    boxSizing: "border-box",
                    transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
                  }
                }
              ),
              unit != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "span",
                {
                  id: unitId,
                  style: {
                    minWidth: 24,
                    fontSize: "var(--caption1-size)",
                    lineHeight: "var(--caption1-line)",
                    fontWeight: "var(--fw-medium)",
                    letterSpacing: 0,
                    color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)"
                  },
                  children: unit
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkFS5I4U5Mcjs.Button,
          {
            size: "sm",
            variant: "solid",
            color: "primary",
            disabled: !canApply,
            onClick: apply,
            "aria-label": `${labelText} ${applyText}`,
            children: applyLabel
          }
        )
      ]
    }
  );
}



exports.PropertyField = PropertyField;
//# sourceMappingURL=chunk-YG765H7A.cjs.map