"use client";
import {
  ViewerFrame
} from "./chunk-YRSIO4FR.js";

// components/viz/Scene3DFrame.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Scene3DFrame({
  children,
  title,
  badges,
  hud,
  toolbar,
  overlay,
  status,
  state,
  stateLabel,
  stateDescription,
  stateIcon,
  stateAction,
  loading = false,
  empty,
  label,
  appearance = "dark",
  variant = "standalone",
  style,
  ...rest
}) {
  const usesLegacyEmpty = state == null && !loading && empty != null;
  const resolvedState = state ?? (loading ? "loading" : usesLegacyEmpty ? "no-source" : "ready");
  const resolvedStateLabel = stateLabel ?? (usesLegacyEmpty ? empty : void 0);
  const resolvedLabel = label ?? (typeof title === "string" && title.trim() ? `${title} 3D \uBDF0\uD3EC\uD2B8` : "3D \uBDF0\uD3EC\uD2B8");
  return /* @__PURE__ */ jsx(
    ViewerFrame,
    {
      ...rest,
      label: resolvedLabel,
      appearance,
      variant,
      source: title,
      badges,
      hud,
      toolbar,
      overlay,
      status,
      state: resolvedState,
      stateLabel: resolvedStateLabel,
      stateDescription,
      stateIcon,
      stateAction,
      style: { height: "100%", minHeight: 220, ...style },
      children
    }
  );
}

export {
  Scene3DFrame
};
//# sourceMappingURL=chunk-XTOWHMBR.js.map