"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkHIFKZRWFcjs = require('./chunk-HIFKZRWF.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/robotics/TopicTree.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function TopicNode({ node, depth, onToggle }) {
  const kids = node.children || [];
  const has = kids.length > 0;
  const [open, setOpen] = _react2.default.useState(depth < 1);
  const [hover, setHover] = _react2.default.useState(false);
  const hasHz = typeof node.hz === "number";
  const toggleOpen = () => {
    if (has) setOpen((value) => !value);
  };
  const handleKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleOpen();
    }
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      "div",
      {
        role: "treeitem",
        tabIndex: has ? 0 : void 0,
        "aria-expanded": has ? open : void 0,
        onClick: toggleOpen,
        onKeyDown: handleKeyDown,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 8,
          minHeight: 36,
          padding: "8px 10px",
          paddingLeft: 10 + depth * 20,
          border: "1px solid transparent",
          borderRadius: "var(--radius-md)",
          boxSizing: "border-box",
          cursor: has ? "pointer" : "default",
          background: hover ? "var(--color-semantic-background-normal-alternative)" : "transparent",
          textAlign: "left",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--label1-size)",
          fontWeight: depth === 0 ? "var(--fw-semibold)" : "var(--fw-medium)",
          lineHeight: "18px",
          color: depth === 0 ? "var(--color-semantic-label-strong)" : "var(--color-semantic-label-normal)",
          transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)"
        },
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "span",
            {
              "aria-hidden": "true",
              style: {
                width: 14,
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-semantic-label-alternative)",
                transform: has && open ? "rotate(90deg)" : "none",
                transition: "transform var(--dur-fast) var(--ease-out)"
              },
              children: has && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "chevron-right", size: 14 })
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: node.name }),
          node.type && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "code",
            {
              style: {
                maxWidth: "42%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "var(--caption1-size)",
                lineHeight: "18px",
                color: "var(--color-semantic-label-alternative)",
                fontFamily: "var(--font-mono)"
              },
              children: node.type
            }
          ),
          (hasHz || node.subscribable) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }, children: [
            hasHz && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { fontSize: "var(--caption1-size)", lineHeight: "18px", color: "var(--color-semantic-label-alternative)", fontVariantNumeric: "tabular-nums" }, children: [
              node.hz,
              " Hz"
            ] }),
            node.subscribable && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { onClick: (e) => e.stopPropagation(), style: { display: "inline-flex" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkHIFKZRWFcjs.Switch, { size: "sm", checked: !!node.subscribed, onChange: () => onToggle && onToggle(node) }) })
          ] })
        ]
      }
    ),
    open && has && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: kids.map((k, i) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, TopicNode, { node: k, depth: depth + 1, onToggle }, i)) })
  ] });
}
function TopicTree({ nodes = [], onToggleSubscribe, style, ...rest }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "tree", style: { display: "grid", gap: 2, fontFamily: "var(--font-sans)", ...style }, ...rest, children: nodes.map((n, i) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, TopicNode, { node: n, depth: 0, onToggle: onToggleSubscribe }, i)) });
}



exports.TopicTree = TopicTree;
//# sourceMappingURL=chunk-QKH5AKJ6.cjs.map