"use strict";Object.defineProperty(exports, "__esModule", {value: true});"use client";

// components/robotics/_NavigationFocus.js
function isFocusVisibleTarget(target) {
  if (!target || typeof target.matches !== "function") return true;
  try {
    return target.matches(":focus-visible");
  } catch (e) {
    return true;
  }
}

// components/robotics/_navigationVectorGlyph.js
var NAV_DIRECTION_CHEVRON = Object.freeze({
  // Cut window along the tangent (+x = travel direction), local units around
  // the anchor. The window is erased in viewer-surface color so every line
  // layer beneath (status dash, conflict pattern) clears with it. It spans
  // EXACTLY the V's extent — the incoming line ends where the arms start and
  // the outgoing line resumes at the tip, so the round caps overlap and the
  // stroke reads as one continuous line folding into the arrow (no white gap).
  window: Object.freeze({ from: -6, to: 5, clearWidth: 5 }),
  // The open V that replaces the erased run. Stroked at the usage site in the
  // lane path's own tone and stroke width — the line folds into the arrow.
  path: "M -6 -6 L 5 0 L -6 6"
});
var NAV_PROGRESS_TRIANGLE = Object.freeze({
  // Solid concave-back dart, tip at the origin, body extending backward over
  // the elapsed line. Rendered as fill + thin surface outline (strokeLinejoin
  // round), so no second casing marker is needed. Dimensions are sized against
  // NAV_PROGRESS_HEAD.tipSetback: with the shaft trimmed 8px behind the tip,
  // the widest round cap (casing 7 → r 3.5) stays inside the solid body and
  // clear of the concave notch (axis-solid region is [-11.5, 0]).
  path: "M 0 0 L -14 -7 Q -11.5 0 -14 7 Z",
  viewBox: "-16 -9 18 18",
  refX: 0,
  refY: 0,
  width: 18,
  height: 18
});
var NAV_ROBOT_POSE = Object.freeze({
  // Screen-fixed body silhouette, heading = +x. The round footprint body is
  // the differentiator from every path arrow; the heading nose protrudes from
  // the body edge along the bearing and its base chord sits inside the disc so
  // body + nose paint as ONE silhouette (surface casing halo underneath,
  // marker tone on top — the NAV_PIN shadow/silhouette pattern).
  bodyRadius: 8,
  casingWidth: 2,
  // Heading nose: apex 5px past the r=8 edge, base chord inside the disc.
  nosePath: "M 13 0 L 4 -5.5 L 4 5.5 Z",
  // Focus traces the OWN silhouette scaled out; selection hugs it tighter in.
  focusScale: 1.45,
  selectionRingScale: 1.18,
  // Optional world-space footprint ring (grows with zoom, unlike the body).
  footprintOpacity: 0.14
});

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
var NAV_MARKER_SHADOW = {
  fill: "var(--color-semantic-static-black)",
  opacity: 0.16,
  chipOffsetY: 1,
  pointOffsetY: 1.4,
  pinOffsetY: 0.8
};
var NAV_PIN = {
  path: "M0 15 Q-6 10 -9.2 5 A10.5 10.5 0 1 1 9.2 5 Q6 10 0 15 Z",
  shadow: {
    transform: `translate(0 ${NAV_MARKER_SHADOW.pinOffsetY})`,
    fill: NAV_MARKER_SHADOW.fill,
    opacity: NAV_MARKER_SHADOW.opacity
  },
  focusRing: { scale: 1.34, strokeWidth: 2.5 },
  selectionRing: { scale: 1.16, strokeWidth: 2 }
};
var NAV_HIT = { radius: 17.5, screenTargetSize: 24 };
var NAV_STATE_BADGE = { radius: 7, strokeWidth: 1.5, pathNormalOffset: 16 };
var NAV_BADGE_LEADER = {
  lineClearance: 2,
  length: NAV_STATE_BADGE.pathNormalOffset - 2,
  strokeWidth: 1.5
};
var NAV_PROGRESS_HEAD = {
  ...NAV_PROGRESS_TRIANGLE,
  outlineWidth: 1.5,
  // The painted shaft stops `tipSetback` px short of the tip and the marker's
  // refX shifts by the same amount, so the shaft's round cap hides inside the
  // triangle body instead of poking past the tip — while the tip itself still
  // paints exactly on the source anchor.
  tipSetback: 8,
  futureGap: 6,
  futureOpacity: 0.3,
  collisionRadius: 20,
  obstacle: { x: -16, y: -9, width: 24, height: 18 },
  route: { casingWidth: 7, coreWidth: 4 },
  trajectory: { casingWidth: 6.5, coreWidth: 3.5 }
};
var NAV_LABEL_HALO = { primary: 4, secondary: 3, caption: 3 };
















exports.isFocusVisibleTarget = isFocusVisibleTarget; exports.NAV_DIRECTION_CHEVRON = NAV_DIRECTION_CHEVRON; exports.NAV_ROBOT_POSE = NAV_ROBOT_POSE; exports.navStateOpacity = navStateOpacity; exports.NAV_FOCUS = NAV_FOCUS; exports.NAV_SELECTION = NAV_SELECTION; exports.NAV_DASH = NAV_DASH; exports.NAV_MARKER_SHADOW = NAV_MARKER_SHADOW; exports.NAV_PIN = NAV_PIN; exports.NAV_HIT = NAV_HIT; exports.NAV_STATE_BADGE = NAV_STATE_BADGE; exports.NAV_BADGE_LEADER = NAV_BADGE_LEADER; exports.NAV_PROGRESS_HEAD = NAV_PROGRESS_HEAD; exports.NAV_LABEL_HALO = NAV_LABEL_HALO;
//# sourceMappingURL=chunk-YXXTXTP5.cjs.map