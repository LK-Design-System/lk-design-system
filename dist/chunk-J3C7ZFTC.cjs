"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/content/Accordion.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Accordion({ items = [], multiple = false, defaultOpen = [], style, ...rest }) {
  const [open, setOpen] = _react2.default.useState(() => new Set(defaultOpen));
  const toggle = (i) => setOpen((prev) => {
    const next = new Set(multiple ? prev : []);
    if (prev.has(i)) next.delete(i);
    else next.add(i);
    return next;
  });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { borderTop: "1px solid var(--color-semantic-line-solid-normal)", ...style }, ...rest, children: items.map((it, i) => {
    const isOpen = open.has(i);
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { borderBottom: "1px solid var(--color-semantic-line-solid-normal)" }, children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
        "button",
        {
          type: "button",
          "aria-expanded": isOpen,
          onClick: () => toggle(i),
          style: {
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "18px 4px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--headline2-size)",
            fontWeight: "var(--fw-bold)",
            letterSpacing: 0,
            color: isOpen ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-normal)",
            transition: "color var(--dur-fast) var(--ease-out)"
          },
          children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { wordBreak: "keep-all" }, children: it.title }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "chevron-down-small", size: 20, "aria-hidden": "true", style: { flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform var(--dur-base) var(--ease-out)" } })
          ]
        }
      ),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows var(--dur-base) var(--ease-out)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { overflow: "hidden" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { padding: "0 4px 20px", fontFamily: "var(--font-sans)", fontSize: "var(--body2-size)", lineHeight: 1.7, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children: it.content }) }) })
    ] }, i);
  }) });
}



exports.Accordion = Accordion;
//# sourceMappingURL=chunk-J3C7ZFTC.cjs.map