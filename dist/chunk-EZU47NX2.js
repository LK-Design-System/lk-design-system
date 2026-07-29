"use client";
import {
  ViewerFrame
} from "./chunk-XC7RDVAQ.js";

// components/viz/VideoStreamTile.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function VideoStreamTile({
  children,
  label,
  ariaLabel,
  status,
  state,
  availability,
  connection,
  freshness,
  playback,
  aspectRatio = "16 / 9",
  badges,
  hud,
  toolbar,
  overlay,
  metadata,
  stateLabel,
  stateDescription,
  stateIcon,
  stateAction,
  variant = "standalone",
  chromeVariant = "overlay",
  toolbarVisibility = "interaction",
  style,
  ...rest
}) {
  const usesExplicitAxes = availability != null || connection != null || freshness != null || playback != null;
  const resolvedState = usesExplicitAxes ? state : state ?? status ?? "idle";
  const resolvedAriaLabel = ariaLabel ?? (typeof label === "string" && label.trim() ? `${label} \uC601\uC0C1 \uC2A4\uD2B8\uB9BC` : "\uC601\uC0C1 \uC2A4\uD2B8\uB9BC");
  return /* @__PURE__ */ jsx(
    ViewerFrame,
    {
      ...rest,
      label: resolvedAriaLabel,
      source: label,
      variant,
      chromeVariant,
      badges,
      hud,
      toolbar,
      toolbarVisibility,
      toolbarPlacement: "top-right",
      overlay,
      status: metadata,
      state: resolvedState,
      availability,
      connection,
      freshness,
      playback,
      stateLabel,
      stateDescription,
      stateIcon,
      stateAction,
      style: { aspectRatio, ...style },
      children
    }
  );
}

export {
  VideoStreamTile
};
//# sourceMappingURL=chunk-EZU47NX2.js.map