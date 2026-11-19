"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkMDCYFZDPcjs = require('./chunk-MDCYFZDP.cjs');


var _chunkLFAXMEAWcjs = require('./chunk-LFAXMEAW.cjs');


var _chunkTSDK26KYcjs = require('./chunk-TSDK26KY.cjs');


var _chunkV2N47AGDcjs = require('./chunk-V2N47AGD.cjs');

// components/forms/DatePicker.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function DatePicker({ value, defaultValue, onChange, isDateDisabled, minDate, maxDate, placeholder = "\uB0A0\uC9DC\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.", size = "md", disabled = false, invalid = false, full = false, style, "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, onKeyDown, onBlur, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue || null);
  const sel = isControlled ? value : internal;
  const [open, setOpen] = _react2.default.useState(false);
  const [focused, setFocused] = _react2.default.useState(false);
  const ref = _react2.default.useRef(null);
  const calendarRootRef = _react2.default.useRef(null);
  const buttonRef = _react2.default.useRef(null);
  const expanded = open && !disabled;
  const expandedRef = _react2.default.useRef(expanded);
  expandedRef.current = expanded;
  _react2.default.useEffect(() => {
    if (disabled && open) setOpen(false);
  }, [disabled, open]);
  const fmt = (d) => {
    if (!d) return "";
    const dt = d instanceof Date ? d : new Date(d);
    return `${dt.getFullYear()}. ${String(dt.getMonth() + 1).padStart(2, "0")}. ${String(dt.getDate()).padStart(2, "0")}`;
  };
  const h = size === "sm" || size === "small" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const borderColor = invalid ? "var(--component-input-border-color-invalid)" : focused || open ? "var(--component-input-border-color-focus)" : "var(--component-input-border-color)";
  const formattedValue = sel ? fmt(sel) : "";
  const triggerLabel = `${_nullishCoalesce(ariaLabel, () => ( placeholder))}${formattedValue ? `, ${formattedValue}` : ""}`;
  const pick = (d) => {
    if (!isControlled) setInternal(d);
    _optionalChain([onChange, 'optionalCall', _ => _(d)]);
    setOpen(false);
    window.requestAnimationFrame(() => _optionalChain([buttonRef, 'access', _2 => _2.current, 'optionalAccess', _3 => _3.focus, 'call', _4 => _4()]));
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkTSDK26KYcjs.Popover,
    {
      ref,
      open: expanded,
      onOpenChange: (next) => {
        if (!disabled) setOpen(next);
      },
      ariaLabel: _nullishCoalesce(ariaLabel, () => ( placeholder)),
      width: 334,
      styles: { trigger: { width: full ? "100%" : void 0 }, panel: { padding: 0, border: 0, borderRadius: "var(--radius-xl)", background: "transparent", scrollbarGutter: "auto" } },
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
      onBlur: (event) => {
        _optionalChain([onBlur, 'optionalCall', _9 => _9(event)]);
        if (!open) return;
        if (!event.relatedTarget) return;
        queueMicrotask(() => {
          if (!expandedRef.current || !ref.current) return;
          const nextTarget = ref.current.ownerDocument.activeElement;
          if (ref.current.contains(nextTarget) || _optionalChain([calendarRootRef, 'access', _10 => _10.current, 'optionalAccess', _11 => _11.contains, 'call', _12 => _12(nextTarget)])) return;
          setOpen(false);
        });
      },
      ...rest,
      trigger: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        "button",
        {
          ref: buttonRef,
          type: "button",
          disabled,
          "aria-label": triggerLabel,
          "aria-invalid": invalid || void 0,
          "aria-describedby": ariaDescribedBy,
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
          style: { display: "inline-flex", alignItems: "center", gap: "var(--component-input-gap)", width: full ? "100%" : void 0, height: h, padding: "0 var(--component-input-padding-x)", minWidth: full ? 0 : 200, boxSizing: "border-box", background: disabled ? "var(--color-semantic-fill-normal)" : "var(--component-input-bg)", border: `1px solid ${borderColor}`, borderRadius: "var(--component-input-radius)", boxShadow: focused || open ? "var(--component-input-focus-shadow)" : "none", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)", ..._chunkLFAXMEAWcjs.fieldTypography.call(void 0, size), color: disabled ? "var(--color-semantic-label-disable)" : sel ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)", transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)" },
          children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkV2N47AGDcjs.Icon, { name: "calendar", size: 18, color: "var(--color-semantic-label-alternative)", "aria-hidden": "true" }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flex: 1, textAlign: "left" }, children: formattedValue || placeholder })
          ]
        }
      ),
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { ref: calendarRootRef, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkMDCYFZDPcjs.Calendar, { value: sel || void 0, onChange: pick, isDateDisabled, minDate, maxDate, autoFocus: true, style: { width: "100%", boxSizing: "border-box" } }) })
    }
  );
}



exports.DatePicker = DatePicker;
//# sourceMappingURL=chunk-ZC6YRZJI.cjs.map