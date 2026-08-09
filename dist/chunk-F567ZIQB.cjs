"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk2HYMUCSDcjs = require('./chunk-2HYMUCSD.cjs');


var _chunkF72KSGF7cjs = require('./chunk-F72KSGF7.cjs');

// components/overlay/CommandPalette.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
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
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
function defaultResultsLabel(count) {
  return count > 0 ? `\uBA85\uB839 ${count}\uAC1C` : "\uACB0\uACFC \uC5C6\uC74C";
}
function CommandPalette({
  open = false,
  onClose,
  commands = [],
  placeholder = "\uBA85\uB839 \uAC80\uC0C9\u2026",
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = "\uBA85\uB839 \uD314\uB808\uD2B8",
  resultsLabel = defaultResultsLabel,
  style,
  ...rest
}) {
  const [q, setQ] = _react2.default.useState("");
  const [activeIndex, setActiveIndex] = _react2.default.useState(0);
  const inputRef = _react2.default.useRef(null);
  const listRef = _react2.default.useRef(null);
  const listboxId = _react2.default.useId();
  const optionIdBase = _react2.default.useId();
  const { dialogRef, zIndex } = _chunk2HYMUCSDcjs.useDialogFocus.call(void 0, {
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
  useSafeLayoutEffect(() => {
    const list = listRef.current;
    const option = _optionalChain([list, 'optionalAccess', _ => _.querySelector, 'call', _2 => _2('[data-command-active="true"]')]);
    if (!list || !option) return;
    const listRect = list.getBoundingClientRect();
    const optionRect = option.getBoundingClientRect();
    if (optionRect.top < listRect.top) list.scrollTop -= listRect.top - optionRect.top;
    else if (optionRect.bottom > listRect.bottom) list.scrollTop += optionRect.bottom - listRect.bottom;
  }, [activeIndex, filtered.length, open]);
  if (!open) return null;
  const resultsText = String(resultsLabel(filtered.length));
  const selectCommand = (command) => {
    _optionalChain([onClose, 'optionalCall', _3 => _3()]);
    _optionalChain([command, 'optionalAccess', _4 => _4.onSelect, 'optionalCall', _5 => _5()]);
  };
  const onInputKeyDown = (event) => {
    if (event.key === "Escape" && q !== "") {
      event.preventDefault();
      setQ("");
      setActiveIndex(0);
      return;
    }
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
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "search", size: 20, color: "var(--color-semantic-label-assistive)", "aria-hidden": "true" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "input", { ref: inputRef, role: "combobox", "aria-autocomplete": "list", "aria-expanded": "true", "aria-controls": listboxId, "aria-activedescendant": filtered.length > 0 ? `${optionIdBase}-${activeIndex}` : void 0, value: q, onChange: (e) => {
        setQ(e.target.value);
        setActiveIndex(0);
      }, onKeyDown: onInputKeyDown, placeholder, "aria-label": typeof placeholder === "string" ? placeholder : "\uBA85\uB839 \uAC80\uC0C9", style: { flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: "var(--headline2-size)", color: "var(--color-semantic-label-normal)" } })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { ref: listRef, className: "lk-scroll-surface", "data-scrollbar": "compact", "data-scroll-gutter": "stable", style: { maxHeight: 340, overflowY: "auto", scrollbarGutter: "stable", padding: 8 }, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: listboxId, role: "listbox", "aria-label": "\uBA85\uB839", children: filtered.map((c, i) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        "button",
        {
          id: `${optionIdBase}-${i}`,
          type: "button",
          role: "option",
          "aria-selected": activeIndex === i,
          "data-command-active": activeIndex === i ? "true" : void 0,
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
      )) }),
      filtered.length === 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-command-palette-empty": true, style: { padding: "var(--space-8)", textAlign: "center", color: "var(--color-semantic-label-alternative)", fontSize: "var(--label1-size)" }, children: resultsText })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-command-palette-live": true, role: "status", "aria-live": "polite", "aria-atomic": "true", style: SR_ONLY_STYLE, children: resultsText })
  ] }) });
}



exports.CommandPalette = CommandPalette;
//# sourceMappingURL=chunk-F567ZIQB.cjs.map