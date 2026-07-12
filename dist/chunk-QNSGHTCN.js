"use client";
import {
  Switch
} from "./chunk-JJBPUVTR.js";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/robotics/TopicTree.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function TopicNode({ node, depth, onToggle }) {
  const kids = node.children || [];
  const has = kids.length > 0;
  const [open, setOpen] = React.useState(depth < 1);
  const [hover, setHover] = React.useState(false);
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
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs(
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
          /* @__PURE__ */ jsx(
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
              children: has && /* @__PURE__ */ jsx(Icon, { name: "chevron-right", size: 14 })
            }
          ),
          /* @__PURE__ */ jsx("span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: node.name }),
          node.type && /* @__PURE__ */ jsx(
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
          (hasHz || node.subscribable) && /* @__PURE__ */ jsxs("span", { style: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }, children: [
            hasHz && /* @__PURE__ */ jsxs("span", { style: { fontSize: "var(--caption1-size)", lineHeight: "18px", color: "var(--color-semantic-label-alternative)", fontVariantNumeric: "tabular-nums" }, children: [
              node.hz,
              " Hz"
            ] }),
            node.subscribable && /* @__PURE__ */ jsx("span", { onClick: (e) => e.stopPropagation(), style: { display: "inline-flex" }, children: /* @__PURE__ */ jsx(Switch, { size: "sm", checked: !!node.subscribed, onChange: () => onToggle && onToggle(node) }) })
          ] })
        ]
      }
    ),
    open && has && /* @__PURE__ */ jsx("div", { children: kids.map((k, i) => /* @__PURE__ */ jsx(TopicNode, { node: k, depth: depth + 1, onToggle }, i)) })
  ] });
}
function TopicTree({ nodes = [], onToggleSubscribe, style, ...rest }) {
  return /* @__PURE__ */ jsx("div", { role: "tree", style: { display: "grid", gap: 2, fontFamily: "var(--font-sans)", ...style }, ...rest, children: nodes.map((n, i) => /* @__PURE__ */ jsx(TopicNode, { node: n, depth: 0, onToggle: onToggleSubscribe }, i)) });
}

export {
  TopicTree
};
//# sourceMappingURL=chunk-QNSGHTCN.js.map