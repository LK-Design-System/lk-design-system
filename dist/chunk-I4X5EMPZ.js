"use client";
import {
  ViewerFrame
} from "./chunk-YRSIO4FR.js";

// components/viz/VideoStreamTile.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function VideoStreamTile({
  children,
  label,
  ariaLabel,
  status,
  state,
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
  style,
  ...rest
}) {
  const resolvedState = state ?? status ?? "idle";
  const resolvedAriaLabel = ariaLabel ?? (typeof label === "string" && label.trim() ? `${label} \uC601\uC0C1 \uC2A4\uD2B8\uB9BC` : "\uC601\uC0C1 \uC2A4\uD2B8\uB9BC");
  return /* @__PURE__ */ jsx(
    ViewerFrame,
    {
      ...rest,
      label: resolvedAriaLabel,
      source: label,
      variant,
      badges,
      hud,
      toolbar,
      overlay,
      status: metadata,
      state: resolvedState,
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
//# sourceMappingURL=chunk-I4X5EMPZ.js.map