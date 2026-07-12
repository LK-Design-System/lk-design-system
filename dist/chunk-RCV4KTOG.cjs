"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/forms/TagInput.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function TagInput({ value, defaultValue = [], onChange, placeholder = "\uC785\uB825 \uD6C4 Enter", disabled = false, style, "aria-label": ariaLabel, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const tags = isControlled ? value : internal;
  const [draft, setDraft] = _react2.default.useState("");
  const set = (next) => {
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const add = (t) => {
    const v = t.trim();
    if (v && !tags.includes(v)) set([...tags, v]);
    setDraft("");
  };
  const remove = (t) => set(tags.filter((x) => x !== t));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", minHeight: 50, padding: "8px 10px", border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-input)", background: "var(--color-semantic-background-elevated-normal)", opacity: disabled ? 0.45 : 1, ...style }, ...rest, children: [
    tags.map((t) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: 5, height: 28, padding: "0 6px 0 11px", background: "var(--color-semantic-primary-surface-strong)", color: "var(--color-semantic-label-normal)", borderRadius: "var(--radius-pill)", fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)" }, children: [
      t,
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", "aria-label": "remove", onClick: () => remove(t), style: { display: "inline-flex", border: "none", background: "transparent", cursor: "pointer", color: "currentColor", padding: 2 }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "close", size: 12, "aria-hidden": "true" }) })
    ] }, t)),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "input",
      {
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
  ] });
}



exports.TagInput = TagInput;
//# sourceMappingURL=chunk-RCV4KTOG.cjs.map