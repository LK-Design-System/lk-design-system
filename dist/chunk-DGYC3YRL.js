"use client";
import {
  ViewerFrame
} from "./chunk-YYLPRCSV.js";

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
  availability,
  connection,
  freshness,
  playback,
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
  const usesExplicitAxes = availability != null || connection != null || freshness != null || playback != null;
  const usesLegacyEmpty = !usesExplicitAxes && state == null && !loading && empty != null;
  const resolvedState = usesExplicitAxes ? state : state ?? (loading ? "loading" : usesLegacyEmpty ? "no-source" : "ready");
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
      toolbarPlacement: "bottom-right",
      overlay,
      status,
      state: resolvedState,
      availability,
      connection,
      freshness,
      playback,
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
//# sourceMappingURL=chunk-DGYC3YRL.js.map