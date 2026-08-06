"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/navigation/Anchor.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var listStyle = { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-0-5)" };
function buildTree(items) {
  const roots = [];
  const stack = [];
  items.forEach((item) => {
    const node = { item, children: [] };
    const level = item.level || 0;
    while (stack.length > 0 && stack[stack.length - 1].level >= level) stack.pop();
    if (stack.length === 0) roots.push(node);
    else stack[stack.length - 1].node.children.push(node);
    stack.push({ level, node });
  });
  return roots;
}
function Anchor({ items = [], active, onChange, style, ...rest }) {
  const isControlled = active !== void 0;
  const [internal, setInternal] = _react2.default.useState(items[0] && items[0].href);
  const [hovered, setHovered] = _react2.default.useState(null);
  const cur = isControlled ? active : internal;
  const renderNodes = (nodes) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { style: listStyle, children: nodes.map(({ item: it, children }) => {
    const on = it.href === cur;
    const hov = hovered === it.href;
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "li", { style: { display: "flex", flexDirection: "column", gap: "var(--space-0-5)" }, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        "a",
        {
          href: it.href,
          "aria-current": on ? "location" : void 0,
          onClick: () => {
            if (!isControlled) setInternal(it.href);
            onChange && onChange(it.href);
          },
          onMouseEnter: () => setHovered(it.href),
          onMouseLeave: () => setHovered(null),
          style: { display: "block", padding: "7px 12px", paddingLeft: 12 + (it.level || 0) * 16, borderLeft: `2px solid ${on ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"}`, color: on ? "var(--color-semantic-label-normal)" : hov ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)", fontSize: (it.level || 0) > 0 ? "var(--label2-size)" : "var(--label1-size)", fontWeight: on ? "var(--fw-bold)" : "var(--fw-medium)", textDecoration: "none", transition: "color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)" },
          children: it.label
        }
      ),
      children.length > 0 && renderNodes(children)
    ] }, it.href);
  }) });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "nav", { "aria-label": "\uBAA9\uCC28", style: { fontFamily: "var(--font-sans)", ...style }, ...rest, children: renderNodes(buildTree(items)) });
}



exports.Anchor = Anchor;
//# sourceMappingURL=chunk-M32DHJUW.cjs.map