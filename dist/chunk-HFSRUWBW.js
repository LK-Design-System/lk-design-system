"use client";
import {
  NavigationStateGlyph
} from "./chunk-54Q6T6L4.js";
import {
  NAV_DASH,
  NAV_FOCUS,
  NAV_HIT,
  NAV_LABEL_HALO,
  NAV_MARKER_SHADOW,
  NAV_ROBOT_POSE,
  isFocusVisibleTarget,
  navStateOpacity
} from "./chunk-T7OX7DEF.js";
import {
  NavigationAnnotationBlock,
  annotationPriority,
  useNavigationObstacles
} from "./chunk-XLGTXJ3N.js";

// components/robotics/RobotMarker.jsx
import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var HEADING_LABELS = ["\uB3D9\uCABD", "\uBD81\uB3D9\uCABD", "\uBD81\uCABD", "\uBD81\uC11C\uCABD", "\uC11C\uCABD", "\uB0A8\uC11C\uCABD", "\uB0A8\uCABD", "\uB0A8\uB3D9\uCABD"];
function normalizeViewportScale(value) {
  return Number.isFinite(value) && value > 0 ? value : 1;
}
function headingCompass(headingRad) {
  if (!Number.isFinite(headingRad)) return void 0;
  const octant = (Math.round(-headingRad / (Math.PI / 4)) % 8 + 8) % 8;
  return HEADING_LABELS[octant];
}
function accessibleName(pose, { selected, focused, disabled, invalid, stale }) {
  const compass = headingCompass(pose.headingRad);
  return [
    pose.label ?? `\uB85C\uBD07 ${pose.id}`,
    `\uC9C0\uB3C4 ${pose.mapId}`,
    compass && `\uBC29\uD5A5 ${compass}`,
    invalid ? "\uB370\uC774\uD130 \uC624\uB958" : stale ? "\uC624\uB798\uB41C \uB370\uC774\uD130" : "\uC2E4\uC2DC\uAC04 \uC704\uCE58",
    selected && "\uC120\uD0DD\uB428",
    focused && "\uD3EC\uCEE4\uC2A4\uB428",
    disabled && "\uC120\uD0DD\uD560 \uC218 \uC5C6\uC74C"
  ].filter(Boolean).join(", ");
}
function RobotMarker({
  pose,
  viewportScale = 1,
  selected = false,
  focused = false,
  disabled = false,
  invalid = false,
  stale = false,
  showLabel = true,
  onActivate,
  role,
  tabIndex,
  onFocus,
  onBlur,
  onMouseDown,
  style,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  ...rest
}) {
  const [hasDomFocus, setHasDomFocus] = React.useState(false);
  const obstacle = useNavigationObstacles();
  const scale = normalizeViewportScale(viewportScale);
  const inverseScale = 1 / scale;
  const interactive = typeof onActivate === "function";
  const pointerOnly = ariaHidden === true || ariaHidden === "true";
  const focusVisible = !pointerOnly && (focused || hasDomFocus);
  if (!pose || !Number.isFinite(pose.position?.x) || !Number.isFinite(pose.position?.y)) return null;
  const hasHeading = Number.isFinite(pose.headingRad);
  const headingDeg = hasHeading ? pose.headingRad * 180 / Math.PI : 0;
  const footprintRadius = Number.isFinite(pose.footprintRadius) && pose.footprintRadius > 0 ? pose.footprintRadius : void 0;
  const surface = "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))";
  const foreground = "var(--viewer-foreground, var(--color-semantic-label-strong))";
  const muted = "var(--viewer-muted, var(--color-semantic-label-neutral))";
  const accent = "var(--viewer-accent, var(--color-semantic-primary-normal))";
  const danger = "var(--viewer-danger, var(--color-semantic-status-negative-foreground))";
  const bodyColor = invalid ? danger : stale ? muted : accent;
  const label = ariaLabel ?? accessibleName(pose, {
    selected,
    focused: focusVisible,
    disabled,
    invalid,
    stale
  });
  const activate = (event) => {
    if (disabled || !interactive) return;
    onActivate(pose.id, event);
  };
  const handleKeyDown = (event) => {
    if (!pointerOnly) setHasDomFocus(true);
    if (pointerOnly || disabled || !interactive || event.repeat) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activate(event);
  };
  const silhouette = (fill, strokeProps) => /* @__PURE__ */ jsxs(Fragment, { children: [
    hasHeading && /* @__PURE__ */ jsx(
      "path",
      {
        d: NAV_ROBOT_POSE.nosePath,
        fill,
        strokeLinejoin: "round",
        ...strokeProps
      }
    ),
    /* @__PURE__ */ jsx("circle", { r: NAV_ROBOT_POSE.bodyRadius, fill, ...strokeProps })
  ] });
  return /* @__PURE__ */ jsxs(
    "g",
    {
      ...rest,
      "data-robot-marker": "",
      "data-robot-id": pose.id,
      "data-map-id": pose.mapId,
      "data-has-heading": hasHeading ? "true" : "false",
      "data-heading-deg": hasHeading ? headingDeg : void 0,
      "data-viewport-scale": scale,
      "data-selected": selected ? "true" : "false",
      "data-focused": focusVisible ? "true" : "false",
      "data-disabled": disabled ? "true" : "false",
      "data-invalid": invalid ? "true" : "false",
      "data-stale": stale ? "true" : "false",
      transform: `translate(${pose.position.x} ${pose.position.y})`,
      role: pointerOnly ? void 0 : role ?? (interactive ? "button" : "img"),
      tabIndex: pointerOnly ? void 0 : interactive ? disabled ? -1 : tabIndex ?? 0 : tabIndex,
      focusable: pointerOnly ? "false" : interactive && !disabled ? "true" : void 0,
      "aria-hidden": pointerOnly || void 0,
      "aria-label": pointerOnly ? void 0 : label,
      "aria-pressed": !pointerOnly && interactive ? selected : void 0,
      "aria-disabled": !pointerOnly && interactive && disabled ? true : void 0,
      "aria-invalid": !pointerOnly && invalid ? true : void 0,
      onClick: activate,
      onKeyDown: handleKeyDown,
      onMouseDown: (event) => {
        if (pointerOnly) event.preventDefault();
        onMouseDown?.(event);
      },
      onFocus: (event) => {
        if (!pointerOnly) setHasDomFocus(isFocusVisibleTarget(event.currentTarget));
        onFocus?.(event);
      },
      onBlur: (event) => {
        setHasDomFocus(false);
        onBlur?.(event);
      },
      style: {
        cursor: disabled ? "not-allowed" : interactive ? "pointer" : "default",
        opacity: navStateOpacity(disabled, stale),
        outline: "none",
        ...style
      },
      children: [
        footprintRadius && /* @__PURE__ */ jsx(
          "circle",
          {
            "data-robot-footprint": "",
            r: footprintRadius,
            fill: bodyColor,
            opacity: NAV_ROBOT_POSE.footprintOpacity,
            stroke: bodyColor,
            strokeWidth: "1",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none"
          }
        ),
        /* @__PURE__ */ jsxs(
          "g",
          {
            "data-robot-screen-space": "",
            transform: `scale(${inverseScale})`,
            children: [
              /* @__PURE__ */ jsx(
                "circle",
                {
                  "data-robot-hit-area": "",
                  "data-screen-target-size": NAV_HIT.screenTargetSize,
                  r: NAV_HIT.radius,
                  fill: "transparent",
                  pointerEvents: interactive ? "all" : "none"
                }
              ),
              /* @__PURE__ */ jsx(
                "g",
                {
                  "data-robot-shadow": "",
                  transform: `translate(0 ${NAV_MARKER_SHADOW.chipOffsetY})`,
                  opacity: NAV_MARKER_SHADOW.opacity,
                  pointerEvents: "none",
                  children: /* @__PURE__ */ jsx("g", { transform: `rotate(${headingDeg})`, children: silhouette(NAV_MARKER_SHADOW.fill, {}) })
                }
              ),
              stale && /* @__PURE__ */ jsx(
                "circle",
                {
                  "data-robot-stale-indicator": "",
                  r: NAV_ROBOT_POSE.bodyRadius + 3.5,
                  fill: "none",
                  stroke: muted,
                  strokeWidth: "1.5",
                  strokeDasharray: NAV_DASH.staleRing,
                  vectorEffect: "non-scaling-stroke"
                }
              ),
              focusVisible && /* @__PURE__ */ jsx(
                "g",
                {
                  "data-robot-focus-indicator": "",
                  transform: `rotate(${headingDeg}) scale(${NAV_ROBOT_POSE.focusScale})`,
                  children: silhouette("none", {
                    stroke: "var(--color-semantic-focus-indicator)",
                    strokeWidth: NAV_FOCUS.strokeWidth,
                    vectorEffect: "non-scaling-stroke"
                  })
                }
              ),
              selected && /* @__PURE__ */ jsx(
                "g",
                {
                  "data-robot-selected-indicator": "",
                  transform: `rotate(${headingDeg}) scale(${NAV_ROBOT_POSE.selectionRingScale})`,
                  children: silhouette("none", {
                    stroke: accent,
                    strokeWidth: "2",
                    vectorEffect: "non-scaling-stroke"
                  })
                }
              ),
              /* @__PURE__ */ jsxs(
                "g",
                {
                  ...obstacle(`robot:${pose.id}:body`),
                  "data-robot-body": "",
                  transform: `rotate(${headingDeg})`,
                  children: [
                    silhouette(surface, {
                      stroke: surface,
                      strokeWidth: NAV_ROBOT_POSE.casingWidth * 2,
                      vectorEffect: "non-scaling-stroke"
                    }),
                    silhouette(bodyColor, {})
                  ]
                }
              ),
              invalid && /* @__PURE__ */ jsx(
                "g",
                {
                  "data-robot-invalid-indicator": "",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ jsx(
                    NavigationStateGlyph,
                    {
                      kind: "invalid",
                      size: 10,
                      color: "var(--color-semantic-static-white)",
                      "data-robot-state-glyph-geometry": "invalid"
                    }
                  )
                }
              ),
              showLabel && (pose.label || pose.id) && /* @__PURE__ */ jsx(
                NavigationAnnotationBlock,
                {
                  id: `robot:${pose.id}:label`,
                  kind: "robot-label",
                  anchor: pose.position,
                  priority: annotationPriority({
                    selected,
                    focused: focusVisible,
                    alarm: invalid,
                    emphasized: true
                  }),
                  children: /* @__PURE__ */ jsx("g", { "data-robot-label": "", "data-robot-label-offset-x": "15", pointerEvents: "none", "aria-hidden": "true", children: /* @__PURE__ */ jsx(
                    "text",
                    {
                      "data-robot-primary-label": "",
                      x: "15",
                      y: "3.5",
                      fill: foreground,
                      stroke: surface,
                      strokeWidth: NAV_LABEL_HALO.primary,
                      strokeLinejoin: "round",
                      paintOrder: "stroke",
                      vectorEffect: "non-scaling-stroke",
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--label2-size)",
                      fontWeight: "var(--fw-bold)",
                      children: pose.label ?? `\uB85C\uBD07 ${pose.id}`
                    }
                  ) })
                }
              )
            ]
          }
        )
      ]
    }
  );
}

export {
  RobotMarker
};
//# sourceMappingURL=chunk-HFSRUWBW.js.map