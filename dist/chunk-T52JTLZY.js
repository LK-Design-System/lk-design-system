"use client";
import {
  NavigationAnnotationContext,
  createAnnotationStore,
  useIsomorphicLayoutEffect
} from "./chunk-XLGTXJ3N.js";

// components/robotics/NavigationAnnotationLayer.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function NavigationAnnotationLayer({
  children,
  maxLabelDisplacementPx = 56,
  labelGapPx = 4,
  ...rest
}) {
  const [store] = React.useState(createAnnotationStore);
  const hostRef = React.useRef(null);
  useIsomorphicLayoutEffect(() => {
    store.setOptions({ maxLabelDisplacementPx, labelGapPx, host: hostRef.current });
    store.flush();
  });
  React.useEffect(() => {
    const svg = hostRef.current?.ownerSVGElement;
    let observer;
    if (typeof ResizeObserver === "function" && svg) {
      observer = new ResizeObserver(() => store.schedule());
      observer.observe(svg);
    }
    let cancelled = false;
    if (typeof document !== "undefined" && typeof document.fonts?.ready?.then === "function") {
      document.fonts.ready.then(() => {
        if (!cancelled) store.schedule();
      });
    }
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [store]);
  return /* @__PURE__ */ jsx("g", { ...rest, ref: hostRef, "data-lk-navigation-annotation-layer": "", children: /* @__PURE__ */ jsx(NavigationAnnotationContext.Provider, { value: store, children }) });
}

export {
  NavigationAnnotationLayer
};
//# sourceMappingURL=chunk-T52JTLZY.js.map