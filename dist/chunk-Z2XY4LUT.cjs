"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkVHQHPPYQcjs = require('./chunk-VHQHPPYQ.cjs');

// components/forms/TagInput.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var FOCUS_INPUT = /* @__PURE__ */ Symbol("tag-input-field");
function TagInput({
  value,
  defaultValue = [],
  onChange,
  placeholder = "\uC785\uB825 \uD6C4 Enter",
  disabled = false,
  removeLabel = (tag) => `${tag} \uC0AD\uC81C`,
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const tags = isControlled ? value : internal;
  const [draft, setDraft] = _react2.default.useState("");
  const inputRef = _react2.default.useRef(null);
  const removeRefs = _react2.default.useRef(/* @__PURE__ */ new Map());
  const pendingFocus = _react2.default.useRef(null);
  const set = (next) => {
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const add = (t) => {
    const v = t.trim();
    if (v && !tags.includes(v)) set([...tags, v]);
    setDraft("");
  };
  const remove = (t) => {
    const index = tags.indexOf(t);
    if (index < 0) return;
    const next = tags.filter((x) => x !== t);
    pendingFocus.current = _nullishCoalesce(next[index], () => ( FOCUS_INPUT));
    set(next);
  };
  _react2.default.useEffect(() => {
    const target = pendingFocus.current;
    if (target == null) return;
    pendingFocus.current = null;
    if (target === FOCUS_INPUT) _optionalChain([inputRef, 'access', _ => _.current, 'optionalAccess', _2 => _2.focus, 'call', _3 => _3()]);
    else _optionalChain([removeRefs, 'access', _4 => _4.current, 'access', _5 => _5.get, 'call', _6 => _6(target), 'optionalAccess', _7 => _7.focus, 'call', _8 => _8()]);
  }, [tags]);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      "aria-disabled": disabled || void 0,
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
        minHeight: 50,
        padding: "8px 10px",
        border: "1px solid var(--color-semantic-line-solid-normal)",
        borderRadius: "var(--radius-input)",
        background: disabled ? "var(--color-semantic-background-normal-alternative)" : "var(--color-semantic-background-elevated-normal)",
        ...style
      },
      ...rest,
      children: [
        tags.map((t) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-0-5)", height: 28, padding: "0 2px 0 11px", background: "var(--color-semantic-primary-surface-strong)", color: "var(--color-semantic-label-normal)", borderRadius: "var(--radius-pill)", fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)" }, children: [
          t,
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "button",
            {
              type: "button",
              "aria-label": removeLabel(t),
              disabled,
              ref: (node) => {
                if (node) removeRefs.current.set(t, node);
                else removeRefs.current.delete(t);
              },
              onClick: () => remove(t),
              style: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, flexShrink: 0, border: "none", background: "transparent", cursor: "pointer", color: "currentColor", padding: 0 },
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVHQHPPYQcjs.Icon, { name: "close", size: 12, "aria-hidden": "true" })
            }
          )
        ] }, t)),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "input",
          {
            ref: inputRef,
            value: draft,
            disabled,
            placeholder: tags.length ? "" : placeholder,
            "aria-label": _nullishCoalesce(ariaLabel, () => ( (typeof placeholder === "string" ? placeholder : "\uD0DC\uADF8 \uC785\uB825"))),
            onChange: (e) => setDraft(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add(draft);
              } else if (e.key === "Backspace" && !draft && tags.length) remove(tags[tags.length - 1]);
            },
            style: { flex: 1, minWidth: 90, height: 28, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: "var(--label1-size)", color: "var(--color-semantic-label-normal)" }
          }
        )
      ]
    }
  );
}



exports.TagInput = TagInput;
//# sourceMappingURL=chunk-Z2XY4LUT.cjs.map