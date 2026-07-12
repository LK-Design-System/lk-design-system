"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/forms/PinInput.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function toCells(source, length) {
  const characters = Array.from(String(_nullishCoalesce(source, () => ( "")))).slice(0, length);
  return Array.from({ length }, (_, index) => characters[index] === " " ? "" : _nullishCoalesce(characters[index], () => ( "")));
}
function serializeCells(cells) {
  return cells.map((character) => character || " ").join("").trimEnd();
}
function PinInput({ length = 6, value, defaultValue = "", onChange, onComplete, mask = false, disabled = false, size = "md", style, "aria-label": ariaLabel, ...rest }) {
  const normalizedLength = Math.max(1, Math.floor(Number(length) || 1));
  const isControlled = value !== void 0;
  const [cells, setCells] = _react2.default.useState(() => toCells(isControlled ? value : defaultValue, normalizedLength));
  const refs = _react2.default.useRef([]);
  const [focusedIndex, setFocusedIndex] = _react2.default.useState(-1);
  _react2.default.useEffect(() => {
    setCells((current) => {
      if (isControlled) return toCells(value, normalizedLength);
      return Array.from({ length: normalizedLength }, (_, index) => _nullishCoalesce(current[index], () => ( "")));
    });
  }, [isControlled, normalizedLength, value]);
  const commit = (next) => {
    const normalized = Array.from({ length: normalizedLength }, (_, index) => _nullishCoalesce(next[index], () => ( "")));
    const serialized = serializeCells(normalized);
    if (!isControlled) setCells(normalized);
    _optionalChain([onChange, 'optionalCall', _2 => _2(serialized)]);
    if (normalized.every(Boolean)) _optionalChain([onComplete, 'optionalCall', _3 => _3(normalized.join(""))]);
  };
  const onInput = (i, e) => {
    const c = e.target.value.slice(-1);
    const arr = [...cells];
    arr[i] = c;
    commit(arr);
    if (c && refs.current[i + 1]) refs.current[i + 1].focus();
  };
  const onKey = (i, e) => {
    if (e.key !== "Backspace" && e.key !== "Delete") return;
    e.preventDefault();
    const next = [...cells];
    if (e.key === "Backspace" && !next[i] && i > 0) {
      next[i - 1] = "";
      commit(next);
      _optionalChain([refs, 'access', _4 => _4.current, 'access', _5 => _5[i - 1], 'optionalAccess', _6 => _6.focus, 'call', _7 => _7()]);
      return;
    }
    next[i] = "";
    commit(next);
  };
  const boxH = size === "sm" ? 40 : 48;
  const boxW = size === "sm" ? 36 : 44;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { ...rest, role: "group", "aria-label": _nullishCoalesce(ariaLabel, () => ( "PIN")), style: { display: "inline-flex", gap: 8, ...style }, children: Array.from({ length: normalizedLength }).map((_, i) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "input",
    {
      ref: (el) => {
        refs.current[i] = el;
      },
      value: cells[i] || "",
      disabled,
      inputMode: "numeric",
      "aria-label": `${_nullishCoalesce(ariaLabel, () => ( "PIN"))} ${i + 1}`,
      maxLength: 1,
      type: mask ? "password" : "text",
      onChange: (e) => onInput(i, e),
      onKeyDown: (e) => onKey(i, e),
      onFocus: () => setFocusedIndex(i),
      onBlur: () => setFocusedIndex(-1),
      onPaste: (event) => {
        const pasted = event.clipboardData.getData("text").replace(/\s+/g, "").slice(0, normalizedLength - i);
        if (!pasted) return;
        event.preventDefault();
        const next = [...cells];
        pasted.split("").forEach((character, offset) => {
          next[i + offset] = character;
        });
        commit(next);
        _optionalChain([refs, 'access', _8 => _8.current, 'access', _9 => _9[Math.min(normalizedLength - 1, i + pasted.length)], 'optionalAccess', _10 => _10.focus, 'call', _11 => _11()]);
      },
      style: { width: boxW, height: boxH, textAlign: "center", border: `1px solid ${focusedIndex === i ? "var(--component-input-border-color-focus)" : cells[i] ? "var(--color-semantic-primary-normal)" : "var(--component-input-border-color)"}`, borderRadius: "var(--radius-md)", outline: "none", boxShadow: focusedIndex === i ? "var(--component-input-focus-shadow)" : "none", fontFamily: "var(--font-sans)", fontSize: "var(--headline1-size)", fontWeight: "var(--fw-bold)", color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)", background: disabled ? "var(--color-semantic-fill-normal)" : "var(--component-input-bg)", transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)" }
    },
    i
  )) });
}



exports.PinInput = PinInput;
//# sourceMappingURL=chunk-OJNR2NPB.cjs.map