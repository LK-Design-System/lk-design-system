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
function sanitize(source, charset) {
  const text = String(_nullishCoalesce(source, () => ( ""))).replace(/\s+/g, "");
  if (charset === "any") return text;
  if (charset === "alphanumeric") return text.replace(/[^0-9a-zA-Z]/g, "");
  return text.replace(/[^0-9]/g, "");
}
function PinInput({ length = 6, value, defaultValue = "", onChange, onComplete, mask = false, disabled = false, invalid = false, charset = "numeric", autoComplete = "one-time-code", size = "md", style, "aria-label": ariaLabel, ...rest }) {
  const normalizedLength = Math.max(1, Math.floor(Number(length) || 1));
  const isControlled = value !== void 0;
  const [cells, setCells] = _react2.default.useState(() => toCells(isControlled ? value : defaultValue, normalizedLength));
  const refs = _react2.default.useRef([]);
  const [focusedIndex, setFocusedIndex] = _react2.default.useState(-1);
  const groupLabel = _nullishCoalesce(ariaLabel, () => ( "\uC778\uC99D \uCF54\uB4DC"));
  const inputMode = charset === "numeric" ? "numeric" : "text";
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
  const focusCell = (index) => {
    _optionalChain([refs, 'access', _4 => _4.current, 'access', _5 => _5[Math.max(0, Math.min(normalizedLength - 1, index))], 'optionalAccess', _6 => _6.focus, 'call', _7 => _7()]);
  };
  const fill = (start, text) => {
    const chunk = text.slice(0, normalizedLength - start);
    if (!chunk) return;
    const next = [...cells];
    chunk.split("").forEach((character, offset) => {
      next[start + offset] = character;
    });
    commit(next);
    focusCell(start + chunk.length);
  };
  const onInput = (i, e) => {
    const raw = String(_nullishCoalesce(e.target.value, () => ( "")));
    const previous = cells[i] || "";
    const incoming = previous && raw.length > 1 && raw.startsWith(previous) ? raw.slice(previous.length) : raw;
    const accepted = sanitize(incoming, charset);
    if (!accepted) {
      e.target.value = previous;
      if (raw === "" && previous) {
        const cleared = [...cells];
        cleared[i] = "";
        commit(cleared);
      }
      return;
    }
    fill(i, accepted);
  };
  const onKey = (i, e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusCell(i - 1);
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusCell(i + 1);
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      focusCell(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      focusCell(normalizedLength - 1);
      return;
    }
    if (e.key !== "Backspace" && e.key !== "Delete") return;
    e.preventDefault();
    const next = [...cells];
    if (e.key === "Backspace" && !next[i] && i > 0) {
      next[i - 1] = "";
      commit(next);
      _optionalChain([refs, 'access', _8 => _8.current, 'access', _9 => _9[i - 1], 'optionalAccess', _10 => _10.focus, 'call', _11 => _11()]);
      return;
    }
    next[i] = "";
    commit(next);
  };
  const cellBorderColor = (i) => {
    if (invalid) return "var(--component-input-border-color-invalid)";
    if (focusedIndex === i) return "var(--component-input-border-color-focus)";
    if (cells[i]) return "var(--color-semantic-primary-normal)";
    return "var(--component-input-border-color)";
  };
  const boxH = size === "sm" ? 40 : 48;
  const boxW = size === "sm" ? 36 : 44;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { ...rest, role: "group", "aria-label": groupLabel, style: { display: "inline-flex", gap: 8, ...style }, children: Array.from({ length: normalizedLength }).map((_, i) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "input",
    {
      ref: (el) => {
        refs.current[i] = el;
      },
      value: cells[i] || "",
      disabled,
      inputMode,
      autoComplete,
      "aria-label": `${groupLabel} ${i + 1}/${normalizedLength}`,
      "aria-invalid": invalid || void 0,
      maxLength: 1,
      type: mask ? "password" : "text",
      onChange: (e) => onInput(i, e),
      onKeyDown: (e) => onKey(i, e),
      onFocus: () => setFocusedIndex(i),
      onBlur: () => setFocusedIndex(-1),
      onPaste: (event) => {
        const pasted = sanitize(event.clipboardData.getData("text"), charset);
        if (!pasted) return;
        event.preventDefault();
        fill(i, pasted);
      },
      style: { width: boxW, height: boxH, textAlign: "center", border: `1px solid ${cellBorderColor(i)}`, borderRadius: "var(--radius-md)", outline: "none", boxShadow: focusedIndex === i ? "var(--component-input-focus-shadow)" : "none", fontFamily: "var(--font-sans)", fontSize: "var(--headline1-size)", fontWeight: "var(--fw-bold)", color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)", background: disabled ? "var(--color-semantic-fill-normal)" : "var(--component-input-bg)", transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)" }
    },
    i
  )) });
}



exports.PinInput = PinInput;
//# sourceMappingURL=chunk-DIY6THSH.cjs.map