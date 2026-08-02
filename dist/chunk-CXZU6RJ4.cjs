"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/content/Accordion.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Accordion({ items = [], multiple = false, defaultOpen = [], headingLevel = 3, style, ...rest }) {
  const noHeading = headingLevel === false || headingLevel == null;
  const HeadingTag = noHeading ? _react2.default.Fragment : `h${headingLevel}`;
  const headingProps = noHeading ? {} : { style: { margin: 0, font: "inherit" } };
  const [open, setOpen] = _react2.default.useState(() => new Set(defaultOpen));
  const rawId = _react2.default.useId();
  const toggle = (i) => setOpen((prev) => {
    const next = new Set(multiple ? prev : []);
    if (prev.has(i)) next.delete(i);
    else next.add(i);
    return next;
  });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { borderTop: "1px solid var(--color-semantic-line-solid-normal)", ...style }, ...rest, children: items.map((it, i) => {
    const isOpen = open.has(i);
    const triggerId = `${rawId}-${i}-trigger`;
    const panelId = `${rawId}-${i}-panel`;
    const titleId = `${rawId}-${i}-title`;
    const descriptionId = `${rawId}-${i}-description`;
    const hasDescription = it.description != null && it.description !== "";
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { borderBottom: "1px solid var(--color-semantic-line-solid-normal)" }, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, HeadingTag, { ...headingProps, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        "button",
        {
          type: "button",
          id: triggerId,
          "aria-expanded": isOpen,
          "aria-controls": panelId,
          "aria-labelledby": titleId,
          "aria-describedby": hasDescription ? descriptionId : void 0,
          onClick: () => toggle(i),
          style: {
            width: "100%",
            display: "flex",
            alignItems: "center",
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
            it.leading != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flexShrink: 0, display: "inline-flex", alignItems: "center" }, children: it.leading }),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { flex: 1, minWidth: 0, display: "grid", gap: "var(--space-1)" }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { id: titleId, style: { wordBreak: "keep-all" }, children: it.title }),
              hasDescription && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "span",
                {
                  id: descriptionId,
                  style: {
                    fontSize: "var(--caption1-size)",
                    lineHeight: "var(--caption1-line)",
                    fontWeight: "var(--fw-regular)",
                    color: "var(--color-semantic-label-neutral)",
                    wordBreak: "keep-all"
                  },
                  children: it.description
                }
              )
            ] }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "chevron-down-small", size: 20, "aria-hidden": "true", style: { flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform var(--dur-base) var(--ease-out)" } })
          ]
        }
      ) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: panelId, role: "region", "aria-labelledby": triggerId, inert: isOpen ? void 0 : true, style: { display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows var(--dur-base) var(--ease-out)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { overflow: "hidden" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { padding: "0 4px 20px", fontFamily: "var(--font-sans)", fontSize: "var(--body2-size)", lineHeight: 1.7, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children: it.content }) }) })
    ] }, i);
  }) });
}



exports.Accordion = Accordion;
//# sourceMappingURL=chunk-CXZU6RJ4.cjs.map