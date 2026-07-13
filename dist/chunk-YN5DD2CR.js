"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/robotics/_NavigationFocus.js
function isFocusVisibleTarget(target) {
  if (!target || typeof target.matches !== "function") return true;
  try {
    return target.matches(":focus-visible");
  } catch {
    return true;
  }
}

// components/robotics/_NavigationStateGlyph.js
import React from "react";
var REGISTRY_ICON_BY_KIND = {
  unknown: "question",
  conflict: "exclamation",
  invalid: "exclamation",
  closed: "close",
  blocked: "close",
  waiting: "pause",
  rerouting: "refresh",
  completed: "check"
};
var CUSTOM_KINDS = /* @__PURE__ */ new Set(["planned", "active", "stale"]);
var NAVIGATION_DIRECTION_PATH = "M -2 -3.4 L 4 0 L -2 3.4 Z";
function customGlyph(kind, size) {
  const strokeWidth = Math.max(1.25, size * 0.14);
  if (kind === "planned") {
    return React.createElement("circle", {
      cx: 0,
      cy: 0,
      r: size * 0.27,
      fill: "none",
      stroke: "currentColor",
      strokeWidth,
      vectorEffect: "non-scaling-stroke"
    });
  }
  if (kind === "active") {
    const scale = size / 10;
    return React.createElement("path", {
      d: NAVIGATION_DIRECTION_PATH,
      transform: scale === 1 ? void 0 : `scale(${scale})`,
      fill: "currentColor"
    });
  }
  if (kind === "stale") {
    const offsetX = size * -0.125;
    const offsetY = size * 0.06;
    return React.createElement("path", {
      // Adapted from the hands of assets/icons/clock.svg. The badge outline
      // itself is the clock perimeter, avoiding a visually noisy double ring.
      d: `M ${offsetX} ${offsetY + size * -0.31} V ${offsetY} L ${offsetX + size * 0.25} ${offsetY + size * 0.19}`,
      fill: "none",
      stroke: "currentColor",
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      vectorEffect: "non-scaling-stroke"
    });
  }
  return null;
}
function NavigationStateGlyph({
  kind,
  size = 10,
  color = "currentColor",
  ...rest
}) {
  const resolvedKind = REGISTRY_ICON_BY_KIND[kind] || CUSTOM_KINDS.has(kind) ? kind : "unknown";
  const resolvedSize = Math.max(10, Number(size) || 10);
  const iconName = REGISTRY_ICON_BY_KIND[resolvedKind];
  const source = iconName ? `lds-icon:${iconName}` : "lds-icon:adapted-map-geometry";
  return React.createElement(
    "g",
    {
      ...rest,
      "data-navigation-state-glyph": resolvedKind,
      "data-navigation-state-glyph-source": source,
      "data-navigation-state-glyph-size": resolvedSize,
      "aria-hidden": "true",
      focusable: "false",
      pointerEvents: "none",
      style: { color }
    },
    iconName ? React.createElement(Icon, {
      name: iconName,
      size: resolvedSize,
      x: -resolvedSize / 2,
      y: -resolvedSize / 2,
      "aria-hidden": "true",
      focusable: "false",
      style: { color, overflow: "visible" }
    }) : customGlyph(resolvedKind, resolvedSize)
  );
}

export {
  isFocusVisibleTarget,
  NAVIGATION_DIRECTION_PATH,
  NavigationStateGlyph
};
//# sourceMappingURL=chunk-YN5DD2CR.js.map