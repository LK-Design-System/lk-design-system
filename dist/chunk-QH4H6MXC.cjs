"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkLTT2YMNXcjs = require('./chunk-LTT2YMNX.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/forms/DatePicker.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function DatePicker({ value, defaultValue, onChange, isDateDisabled, minDate, maxDate, placeholder = "\uB0A0\uC9DC\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.", size = "md", disabled = false, full = false, style, "aria-label": ariaLabel, onKeyDown, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue || null);
  const sel = isControlled ? value : internal;
  const [open, setOpen] = _react2.default.useState(false);
  const [focused, setFocused] = _react2.default.useState(false);
  const ref = _react2.default.useRef(null);
  const buttonRef = _react2.default.useRef(null);
  const popupId = _react2.default.useId();
  const expanded = open && !disabled;
  _react2.default.useEffect(() => {
    if (!open) return void 0;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  _react2.default.useEffect(() => {
    if (disabled && open) setOpen(false);
  }, [disabled, open]);
  const fmt = (d) => {
    if (!d) return "";
    const dt = d instanceof Date ? d : new Date(d);
    return `${dt.getFullYear()}. ${String(dt.getMonth() + 1).padStart(2, "0")}. ${String(dt.getDate()).padStart(2, "0")}`;
  };
  const h = size === "sm" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const formattedValue = sel ? fmt(sel) : "";
  const triggerLabel = `${_nullishCoalesce(ariaLabel, () => ( placeholder))}${formattedValue ? `, ${formattedValue}` : ""}`;
  const pick = (d) => {
    if (!isControlled) setInternal(d);
    _optionalChain([onChange, 'optionalCall', _ => _(d)]);
    setOpen(false);
    window.requestAnimationFrame(() => _optionalChain([buttonRef, 'access', _2 => _2.current, 'optionalAccess', _3 => _3.focus, 'call', _4 => _4()]));
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      ref,
      style: { position: "relative", display: full ? "block" : "inline-block", width: full ? "100%" : void 0, ...style },
      onKeyDown: (event) => {
        _optionalChain([onKeyDown, 'optionalCall', _5 => _5(event)]);
        if (event.defaultPrevented) return;
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false);
          _optionalChain([buttonRef, 'access', _6 => _6.current, 'optionalAccess', _7 => _7.focus, 'call', _8 => _8()]);
        }
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "button",
          {
            ref: buttonRef,
            type: "button",
            disabled,
            "aria-label": triggerLabel,
            "aria-haspopup": "dialog",
            "aria-expanded": expanded,
            "aria-controls": expanded ? popupId : void 0,
            onClick: () => setOpen((current) => !current),
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
            style: { display: "inline-flex", alignItems: "center", gap: "var(--component-input-gap)", width: full ? "100%" : void 0, height: h, padding: "0 var(--component-input-padding-x)", minWidth: full ? 0 : 200, boxSizing: "border-box", background: disabled ? "var(--color-semantic-fill-normal)" : "var(--component-input-bg)", border: `1px solid ${focused || open ? "var(--component-input-border-color-focus)" : "var(--component-input-border-color)"}`, borderRadius: "var(--component-input-radius)", boxShadow: focused || open ? "var(--component-input-focus-shadow)" : "none", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)", fontSize: "var(--component-input-font-size)", color: disabled ? "var(--color-semantic-label-disable)" : sel ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)", transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)" },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "calendar", size: 18, color: "var(--color-semantic-label-alternative)", "aria-hidden": "true" }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flex: 1, textAlign: "left" }, children: formattedValue || placeholder })
            ]
          }
        ),
        expanded && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: popupId, role: "dialog", "aria-label": _nullishCoalesce(ariaLabel, () => ( placeholder)), style: { position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 40 }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkLTT2YMNXcjs.Calendar, { value: sel || void 0, onChange: pick, isDateDisabled, minDate, maxDate, autoFocus: true }) })
      ]
    }
  );
}



exports.DatePicker = DatePicker;
//# sourceMappingURL=chunk-QH4H6MXC.cjs.map