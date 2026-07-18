"use client";

// components/robotics/_NavigationFocus.js
function isFocusVisibleTarget(target) {
  if (!target || typeof target.matches !== "function") return true;
  try {
    return target.matches(":focus-visible");
  } catch {
    return true;
  }
}

// components/robotics/_navigationVocabulary.js
var NAV_STATE_OPACITY = { disabled: 0.45, stale: 0.76, default: 1 };
function navStateOpacity(disabled, stale) {
  return disabled ? NAV_STATE_OPACITY.disabled : stale ? NAV_STATE_OPACITY.stale : NAV_STATE_OPACITY.default;
}
var NAV_FOCUS = {
  waypointShellScale: 1.5,
  strokeWidth: 2,
  regionStrokeWidth: 6.5,
  pathHaloWidth: 10,
  routeHaloWidth: 11
};
var NAV_SELECTION = {
  regionStrokeWidth: 3.5,
  haloOpacity: 0.24,
  pathHaloWidth: 7,
  routeHaloWidth: 8
};
var NAV_DASH = {
  staleRing: "2 2",
  staleShape: "2 4",
  unknown: "1 3",
  invalid: "4 3"
};
var NAV_PIN = {
  path: "M0 15 Q-6 10 -9.2 5 A10.5 10.5 0 1 1 9.2 5 Q6 10 0 15 Z",
  shadow: { transform: "translate(0 0.8)", fill: "var(--color-semantic-static-black)", opacity: 0.16 },
  focusRing: { scale: 1.34, strokeWidth: 2.5 },
  selectionRing: { scale: 1.16, strokeWidth: 2 }
};
var NAV_HIT = { radius: 17.5, screenTargetSize: 24 };
var NAV_STATE_BADGE = { radius: 7, strokeWidth: 1.5 };
var NAV_PROGRESS_HEAD = {
  path: "M 2 1.5 L 16 8 L 2 14.5",
  viewBox: "0 0 18 16",
  refX: 16,
  refY: 8,
  width: 18,
  height: 16,
  collisionRadius: 20,
  obstacle: { x: -20, y: -10, width: 24, height: 20 },
  route: { casingWidth: 7, coreWidth: 4, futureOpacity: 0.34 },
  trajectory: { casingWidth: 6.5, coreWidth: 3.5, futureOpacity: 0.28 }
};
var NAV_LABEL_HALO = { primary: 4, secondary: 3, caption: 3 };

export {
  isFocusVisibleTarget,
  navStateOpacity,
  NAV_FOCUS,
  NAV_SELECTION,
  NAV_DASH,
  NAV_PIN,
  NAV_HIT,
  NAV_STATE_BADGE,
  NAV_PROGRESS_HEAD,
  NAV_LABEL_HALO
};
//# sourceMappingURL=chunk-3IFGQEHY.js.map