"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/content/StepList.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Mini({ children, onClick, disabled, label }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "button",
    {
      type: "button",
      onClick,
      disabled,
      title: label,
      "aria-label": label,
      style: {
        width: 28,
        height: 28,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid var(--color-semantic-line-normal-normal)",
        borderRadius: "var(--radius-sm)",
        background: "var(--color-semantic-background-elevated-normal)",
        color: "var(--color-semantic-label-neutral)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        fontFamily: "inherit",
        fontSize: "var(--label2-size)"
      },
      children
    }
  );
}
function StepList({ steps = [], onChange, editable = true, onAdd, addLabel = "\uB2E8\uACC4 \uCD94\uAC00", style, ...rest }) {
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= steps.length) return;
    const s = [...steps];
    const tmp = s[i];
    s[i] = s[j];
    s[j] = tmp;
    onChange && onChange(s);
  };
  const remove = (i) => {
    onChange && onChange(steps.filter((_, k) => k !== i));
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    steps.map((st, i) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", border: "1px solid var(--color-semantic-line-normal-normal)", borderRadius: "var(--radius-md)", background: "var(--color-semantic-background-elevated-normal)", marginBottom: 8 }, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: 24, height: 24, borderRadius: "50%", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--color-semantic-primary-surface-normal)", color: "var(--color-semantic-primary-normal)", fontSize: "var(--caption1-size)", fontWeight: 800, fontVariantNumeric: "tabular-nums" }, children: i + 1 }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontSize: "var(--label1-size)", fontWeight: 700, color: "var(--color-semantic-label-strong)" }, children: st.label }),
        st.detail != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontSize: "var(--caption1-size)", color: "var(--color-semantic-label-alternative)", marginTop: 1 }, children: st.detail })
      ] }),
      editable && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "inline-flex", gap: 2, flexShrink: 0 }, children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Mini, { onClick: () => move(i, -1), disabled: i === 0, label: "\uC704\uB85C", children: "\u2191" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Mini, { onClick: () => move(i, 1), disabled: i === steps.length - 1, label: "\uC544\uB798\uB85C", children: "\u2193" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Mini, { onClick: () => remove(i), label: "\uC0AD\uC81C", children: "\u2715" })
      ] })
    ] }, st.id != null ? st.id : i)),
    editable && onAdd && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      "button",
      {
        type: "button",
        onClick: onAdd,
        style: { width: "100%", padding: 10, border: "1px dashed var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-md)", background: "transparent", color: "var(--color-semantic-label-alternative)", cursor: "pointer", fontSize: "var(--label2-size)", fontWeight: 700, fontFamily: "var(--font-sans)" },
        children: [
          "+ ",
          addLabel
        ]
      }
    )
  ] });
}



exports.StepList = StepList;
//# sourceMappingURL=chunk-GNZHK234.cjs.map