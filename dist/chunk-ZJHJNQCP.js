"use client";

// components/overlay/ToastStack.jsx
import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var ToastLiveRegionContext = React.createContext(null);
var SR_ONLY_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0
};
function ToastStack({ children, position = "bottom-right", gap = 10, liveRegion = true, style, ...rest }) {
  const politeRef = React.useRef(null);
  const assertiveRef = React.useRef(null);
  const announce = React.useCallback((message, urgent) => {
    const node = urgent ? assertiveRef.current : politeRef.current;
    if (!node || !message) return;
    if (node.textContent !== message) {
      node.textContent = message;
      return;
    }
    const view = node.ownerDocument?.defaultView ?? window;
    node.textContent = "";
    view.setTimeout(() => {
      if (node.isConnected) node.textContent = message;
    }, 50);
  }, []);
  const pos = {
    "bottom-right": { bottom: 20, right: 20, alignItems: "flex-end" },
    "bottom-left": { bottom: 20, left: 20, alignItems: "flex-start" },
    "top-right": { top: 20, right: 20, alignItems: "flex-end" },
    "top-left": { top: 20, left: 20, alignItems: "flex-start" },
    "bottom-center": { bottom: 20, left: "50%", transform: "translateX(-50%)", alignItems: "center" }
  }[position] || {};
  return /* @__PURE__ */ jsxs(ToastLiveRegionContext.Provider, { value: liveRegion ? announce : null, children: [
    /* @__PURE__ */ jsx("div", { style: { position: "fixed", zIndex: 120, display: "flex", flexDirection: "column", gap, ...pos, ...style }, ...rest, children }),
    liveRegion && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { ref: politeRef, "data-toast-live": "polite", role: "status", "aria-live": "polite", "aria-atomic": "true", style: SR_ONLY_STYLE }),
      /* @__PURE__ */ jsx("div", { ref: assertiveRef, "data-toast-live": "assertive", role: "alert", "aria-live": "assertive", "aria-atomic": "true", style: SR_ONLY_STYLE })
    ] })
  ] });
}

export {
  ToastLiveRegionContext,
  ToastStack
};
//# sourceMappingURL=chunk-ZJHJNQCP.js.map