"use strict";Object.defineProperty(exports, "__esModule", {value: true});"use client";

// components/viz/_viewerOverlaySurface.js
var surfaceAt = (opacity) => `color-mix(in srgb, var(--viewer-surface-elevated, var(--color-semantic-static-black)) ${opacity}%, transparent)`;
var SHARED = {
  border: "1px solid color-mix(in srgb, var(--color-semantic-static-white) 20%, transparent)",
  shadow: "0 2px 8px color-mix(in srgb, var(--color-semantic-static-black) 24%, transparent)",
  blur: "blur(8px)",
  ink: "var(--color-semantic-static-white)",
  inkMuted: "color-mix(in srgb, var(--color-semantic-static-white) 76%, transparent)",
  hairline: "color-mix(in srgb, var(--color-semantic-static-white) 28%, transparent)",
  /** Text outside a scrim sits on raw footage; the shadow is its legibility floor. */
  textShadow: "0 1px 2px color-mix(in srgb, var(--color-semantic-static-black) 60%, transparent)"
};
var VIEWER_OVERLAY_SURFACE = {
  strong: { surface: surfaceAt(94), ...SHARED },
  soft: { surface: surfaceAt(72), ...SHARED }
};



exports.VIEWER_OVERLAY_SURFACE = VIEWER_OVERLAY_SURFACE;
//# sourceMappingURL=chunk-2NP74HUD.cjs.map