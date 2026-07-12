"use client";

// components/layout/ScrollArea.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function useScrollStyles() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-scrollarea-css")) return;
    const el = document.createElement("style");
    el.id = "lk-scrollarea-css";
    el.textContent = ".lk-scrollarea{scrollbar-width:thin;scrollbar-color:var(--color-semantic-interaction-inactive) transparent;}.lk-scrollarea::-webkit-scrollbar{width:7px;height:7px;}.lk-scrollarea::-webkit-scrollbar-thumb{background:var(--color-semantic-interaction-inactive);border-radius:99px;}.lk-scrollarea::-webkit-scrollbar-thumb:hover{background:var(--color-semantic-label-alternative);}.lk-scrollarea::-webkit-scrollbar-track{background:transparent;}";
    document.head.appendChild(el);
  }, []);
}
function ScrollArea({ children, maxHeight = 280, style, ...rest }) {
  useScrollStyles();
  return /* @__PURE__ */ jsx("div", { className: "lk-scrollarea", style: { maxHeight, overflow: "auto", ...style }, ...rest, children });
}

export {
  ScrollArea
};
//# sourceMappingURL=chunk-K5ZQ5N2D.js.map