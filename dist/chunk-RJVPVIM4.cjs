"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkSDHSC2JCcjs = require('./chunk-SDHSC2JC.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/overlay/CommandPalette.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function CommandPalette({
  open = false,
  onClose,
  commands = [],
  placeholder = "\uBA85\uB839 \uAC80\uC0C9\u2026",
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = "\uBA85\uB839 \uD314\uB808\uD2B8",
  style,
  ...rest
}) {
  const [q, setQ] = _react2.default.useState("");
  const [activeIndex, setActiveIndex] = _react2.default.useState(0);
  const inputRef = _react2.default.useRef(null);
  const listboxId = _react2.default.useId();
  const optionIdBase = _react2.default.useId();
  const { dialogRef, zIndex } = _chunkSDHSC2JCcjs.useDialogFocus.call(void 0, {
    open,
    onDismiss: onClose,
    initialFocusRef: _nullishCoalesce(initialFocusRef, () => ( inputRef)),
    returnFocusRef,
    restoreFocus
  });
  _react2.default.useEffect(() => {
    if (!open) return void 0;
    setQ("");
    setActiveIndex(0);
    return void 0;
  }, [open]);
  const filtered = q ? commands.filter((c) => String(c.label).toLowerCase().includes(q.toLowerCase())) : commands;
  _react2.default.useEffect(() => {
    setActiveIndex((current) => Math.max(0, Math.min(current, filtered.length - 1)));
  }, [filtered.length]);
  if (!open) return null;
  const selectCommand = (command) => {
    _optionalChain([onClose, 'optionalCall', _ => _()]);
    _optionalChain([command, 'optionalAccess', _2 => _2.onSelect, 'optionalCall', _3 => _3()]);
  };
  const onInputKeyDown = (event) => {
    if (filtered.length === 0) return;
    let nextIndex;
    if (event.key === "ArrowDown") nextIndex = (activeIndex + 1) % filtered.length;
    if (event.key === "ArrowUp") nextIndex = (activeIndex - 1 + filtered.length) % filtered.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = filtered.length - 1;
    if (nextIndex !== void 0) {
      event.preventDefault();
      setActiveIndex(nextIndex);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      selectCommand(filtered[activeIndex]);
    }
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "presentation", onClick: (e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  }, style: { position: "fixed", inset: 0, zIndex, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "12vh", background: "var(--component-dialog-scrim)", backdropFilter: "blur(var(--component-dialog-scrim-blur))" }, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { ref: dialogRef, role: "dialog", "aria-modal": "true", "aria-label": ariaLabel, tabIndex: -1, style: { width: "100%", maxWidth: 560, background: "var(--color-semantic-background-elevated-normal)", borderRadius: "var(--radius-2xl)", boxShadow: "var(--shadow-xl)", overflow: "hidden", fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--color-semantic-line-solid-normal)" }, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "search", size: 20, color: "var(--color-semantic-label-assistive)", "aria-hidden": "true" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "input", { ref: inputRef, role: "combobox", "aria-autocomplete": "list", "aria-expanded": "true", "aria-controls": listboxId, "aria-activedescendant": filtered.length > 0 ? `${optionIdBase}-${activeIndex}` : void 0, value: q, onChange: (e) => {
        setQ(e.target.value);
        setActiveIndex(0);
      }, onKeyDown: onInputKeyDown, placeholder, "aria-label": typeof placeholder === "string" ? placeholder : "\uBA85\uB839 \uAC80\uC0C9", style: { flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: "var(--headline2-size)", color: "var(--color-semantic-label-normal)" } })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: listboxId, role: "listbox", "aria-label": "\uBA85\uB839", style: { maxHeight: 340, overflowY: "auto", padding: 8 }, children: filtered.length === 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "status", style: { padding: 28, textAlign: "center", color: "var(--color-semantic-label-alternative)", fontSize: "var(--label1-size)" }, children: "\uACB0\uACFC \uC5C6\uC74C" }) : filtered.map((c, i) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      "button",
      {
        id: `${optionIdBase}-${i}`,
        type: "button",
        role: "option",
        "aria-selected": activeIndex === i,
        tabIndex: -1,
        onClick: () => selectCommand(c),
        onMouseEnter: () => setActiveIndex(i),
        style: { width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", border: "none", background: activeIndex === i ? "var(--color-semantic-fill-normal)" : "transparent", cursor: "pointer", borderRadius: "var(--radius-md)", textAlign: "left", fontFamily: "var(--font-sans)", fontSize: "var(--body2-size)", fontWeight: "var(--fw-medium)", color: "var(--color-semantic-label-normal)" },
        children: [
          c.icon && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-primary-normal)", display: "inline-flex" }, children: c.icon }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flex: 1 }, children: c.label }),
          c.shortcut && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: "var(--caption1-size)", color: "var(--color-semantic-label-assistive)", fontWeight: "var(--fw-semibold)" }, children: c.shortcut })
        ]
      },
      i
    )) })
  ] }) });
}



exports.CommandPalette = CommandPalette;
//# sourceMappingURL=chunk-RJVPVIM4.cjs.map