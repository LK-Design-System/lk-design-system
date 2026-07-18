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
  NAV_STATE_BADGE,
  isFocusVisibleTarget,
  navStateOpacity
} from "./chunk-T7OX7DEF.js";
import {
  NavigationAnnotationBlock,
  annotationPriority,
  useNavigationObstacles
} from "./chunk-XLGTXJ3N.js";

// components/robotics/WaypointMarker.jsx
import React from "react";

// components/robotics/_navigationEncoding.js
var ROLE_CODE = {
  holding: "H",
  passthrough: "T",
  parking: "P",
  charger: "C"
};
var ANNOTATION_CODE = {
  dock: "dock",
  cleaning: "clean",
  dispenser: "disp",
  ingestor: "ing",
  "lift-approach": "lift",
  "door-approach": "door",
  mutex: "mutex",
  custom: "custom"
};

// components/robotics/WaypointMarker.jsx
import { jsx, jsxs } from "react/jsx-runtime";
var ROLE_LABELS = {
  holding: "\uB300\uAE30 \uC9C0\uC810",
  passthrough: "\uD1B5\uACFC \uC9C0\uC810",
  parking: "\uC8FC\uCC28 \uC9C0\uC810",
  charger: "\uCDA9\uC804 \uC9C0\uC810"
};
var ANNOTATION_LABELS = {
  dock: "\uB3C4\uD0B9",
  cleaning: "\uCCAD\uC18C",
  dispenser: "\uC790\uC7AC \uACF5\uAE09",
  ingestor: "\uC790\uC7AC \uC218\uAC70",
  "lift-approach": "\uC2B9\uAC15\uAE30 \uC811\uADFC",
  "door-approach": "\uBB38 \uC811\uADFC",
  mutex: "\uC0C1\uD638 \uBC30\uC81C",
  custom: "\uC0AC\uC6A9\uC790 \uC815\uC758"
};
var AVAILABILITY_LABELS = {
  available: "\uC0AC\uC6A9 \uAC00\uB2A5",
  unavailable: "\uC0AC\uC6A9 \uBD88\uAC00",
  unknown: "\uC0C1\uD0DC \uBBF8\uD655\uC778"
};
function normalizeViewportScale(value) {
  return Number.isFinite(value) && value > 0 ? value : 1;
}
function semanticSummary(waypoint) {
  const roleCodes = (waypoint.roles || []).map((role) => ROLE_CODE[role]);
  const annotationCodes = (waypoint.annotations || []).map((annotation) => ANNOTATION_CODE[annotation.kind]);
  const codes = [...roleCodes, ...annotationCodes].filter(Boolean);
  if (codes.length <= 3) return codes.join(" \xB7 ");
  return `${codes.slice(0, 3).join(" \xB7 ")} +${codes.length - 3}`;
}
function accessibleName(waypoint, { selected, focused, disabled, invalid, stale }) {
  const roles = (waypoint.roles || []).map((role) => ROLE_LABELS[role] || role);
  const annotations = (waypoint.annotations || []).map((annotation) => {
    const kind = ANNOTATION_LABELS[annotation.kind] || annotation.kind;
    return annotation.label ? `${annotation.label} (${kind})` : kind;
  });
  const availability = waypoint.availability || "unknown";
  const states = [
    `\uAC00\uC6A9\uC131 ${AVAILABILITY_LABELS[availability] || availability}`,
    selected && "\uC120\uD0DD\uB428",
    focused && "\uD3EC\uCEE4\uC2A4\uB428",
    disabled && "\uC120\uD0DD\uD560 \uC218 \uC5C6\uC74C",
    invalid && "\uB370\uC774\uD130 \uC624\uB958",
    stale && "\uC624\uB798\uB41C \uB370\uC774\uD130"
  ].filter(Boolean);
  return [
    waypoint.label,
    `\uC9C0\uB3C4 ${waypoint.mapId}`,
    roles.length > 0 && `\uC5ED\uD560 ${roles.join(", ")}`,
    annotations.length > 0 && `\uC8FC\uC11D ${annotations.join(", ")}`,
    ...states
  ].filter(Boolean).join(", ");
}
function WaypointMarker({
  waypoint,
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
  const availability = waypoint.availability || "unknown";
  const compoundUnknownInvalid = availability === "unknown" && invalid;
  const details = semanticSummary(waypoint);
  const label = ariaLabel ?? accessibleName(waypoint, {
    selected,
    focused: focusVisible,
    disabled,
    invalid,
    stale
  });
  const foreground = "var(--viewer-foreground, var(--color-semantic-label-strong))";
  const muted = "var(--viewer-muted, var(--color-semantic-label-neutral))";
  const surface = "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))";
  const stateColor = invalid || availability === "unavailable" ? "var(--viewer-danger, var(--color-semantic-status-negative-foreground))" : availability === "unknown" ? "var(--viewer-warning, var(--color-semantic-status-cautionary-foreground))" : foreground;
  const selectedGlyphInk = "var(--color-semantic-static-white)";
  const activate = (event) => {
    if (disabled || !interactive) return;
    onActivate(waypoint.id, event);
  };
  const handleKeyDown = (event) => {
    if (!pointerOnly) setHasDomFocus(true);
    if (pointerOnly || disabled || !interactive || event.repeat) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activate(event);
  };
  return /* @__PURE__ */ jsx(
    "g",
    {
      ...rest,
      "data-waypoint-marker": "",
      "data-waypoint-id": waypoint.id,
      "data-map-id": waypoint.mapId,
      "data-availability": availability,
      "data-selected": selected ? "true" : "false",
      "data-focused": focusVisible ? "true" : "false",
      "data-disabled": disabled ? "true" : "false",
      "data-invalid": invalid ? "true" : "false",
      "data-stale": stale ? "true" : "false",
      "data-role-codes": (waypoint.roles || []).map((role2) => ROLE_CODE[role2]).filter(Boolean).join(""),
      "data-annotation-count": (waypoint.annotations || []).length,
      transform: `translate(${waypoint.position.x} ${waypoint.position.y})`,
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
      children: /* @__PURE__ */ jsxs(
        "g",
        {
          "data-waypoint-screen-space": "",
          "data-viewport-scale": scale,
          transform: `scale(${inverseScale})`,
          children: [
            /* @__PURE__ */ jsx(
              "polygon",
              {
                "data-waypoint-shadow": "",
                points: "0,-7.5 7.5,0 0,7.5 -7.5,0",
                transform: `translate(0 ${NAV_MARKER_SHADOW.pointOffsetY})`,
                fill: NAV_MARKER_SHADOW.fill,
                opacity: NAV_MARKER_SHADOW.opacity,
                pointerEvents: "none"
              }
            ),
            (invalid || availability === "unavailable") && /* @__PURE__ */ jsx(
              "circle",
              {
                "data-waypoint-attention": "",
                r: "10.5",
                fill: "none",
                stroke: stateColor,
                strokeWidth: "2.5",
                opacity: "0.4",
                vectorEffect: "non-scaling-stroke",
                pointerEvents: "none"
              }
            ),
            /* @__PURE__ */ jsx(
              "circle",
              {
                "data-waypoint-hit-area": "",
                "data-screen-target-size": NAV_HIT.screenTargetSize,
                r: NAV_HIT.radius,
                fill: "transparent",
                pointerEvents: interactive ? "all" : "none"
              }
            ),
            focusVisible && /* @__PURE__ */ jsx(
              "polygon",
              {
                "data-waypoint-focus-indicator": "",
                points: "0,-7 7,0 0,7 -7,0",
                transform: `scale(${NAV_FOCUS.waypointShellScale})`,
                fill: "none",
                stroke: "var(--color-semantic-focus-indicator)",
                strokeWidth: NAV_FOCUS.strokeWidth,
                strokeLinejoin: "round",
                vectorEffect: "non-scaling-stroke"
              }
            ),
            stale && /* @__PURE__ */ jsx(
              "circle",
              {
                "data-waypoint-stale-indicator": "",
                r: "9.5",
                fill: "none",
                stroke: muted,
                strokeWidth: "1.5",
                strokeDasharray: NAV_DASH.staleRing,
                vectorEffect: "non-scaling-stroke"
              }
            ),
            /* @__PURE__ */ jsx(
              "polygon",
              {
                ...obstacle(`waypoint:${waypoint.id}:point`),
                "data-waypoint-point": "",
                "data-waypoint-selected-indicator": selected ? "" : void 0,
                points: "0,-7 7,0 0,7 -7,0",
                fill: selected ? "var(--viewer-accent, var(--color-semantic-primary-normal))" : surface,
                stroke: selected ? "var(--viewer-accent, var(--color-semantic-primary-normal))" : stateColor,
                strokeWidth: "2.25",
                strokeLinejoin: "round",
                vectorEffect: "non-scaling-stroke"
              }
            ),
            availability === "unavailable" && /* @__PURE__ */ jsx(
              "path",
              {
                "data-waypoint-unavailable-indicator": "",
                d: "M-4.5 4.5 L4.5 -4.5",
                fill: "none",
                stroke: selected ? selectedGlyphInk : "var(--viewer-danger, var(--color-semantic-status-negative-foreground))",
                strokeWidth: "2",
                strokeLinecap: "round",
                vectorEffect: "non-scaling-stroke"
              }
            ),
            availability === "unknown" && /* @__PURE__ */ jsxs(
              "g",
              {
                ...obstacle(`waypoint:${waypoint.id}:unknown`),
                "data-waypoint-unknown-indicator": "",
                "data-waypoint-state-slot": "unknown",
                transform: compoundUnknownInvalid ? "translate(-8 -8)" : void 0,
                "aria-hidden": "true",
                children: [
                  compoundUnknownInvalid && /* @__PURE__ */ jsx(
                    "circle",
                    {
                      "data-waypoint-state-shadow": "unknown",
                      "data-marker-shadow": "",
                      cy: NAV_MARKER_SHADOW.chipOffsetY,
                      r: NAV_STATE_BADGE.radius + NAV_STATE_BADGE.strokeWidth / 2,
                      fill: NAV_MARKER_SHADOW.fill,
                      opacity: NAV_MARKER_SHADOW.opacity,
                      pointerEvents: "none"
                    }
                  ),
                  compoundUnknownInvalid && /* @__PURE__ */ jsx(
                    "circle",
                    {
                      "data-waypoint-state-circle": "unknown",
                      r: NAV_STATE_BADGE.radius,
                      fill: surface,
                      stroke: "var(--viewer-warning, var(--color-semantic-status-cautionary-foreground))",
                      strokeWidth: NAV_STATE_BADGE.strokeWidth,
                      vectorEffect: "non-scaling-stroke"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    NavigationStateGlyph,
                    {
                      kind: "unknown",
                      size: 10,
                      color: selected && !compoundUnknownInvalid ? selectedGlyphInk : foreground,
                      "data-waypoint-state-glyph-geometry": "unknown"
                    }
                  )
                ]
              }
            ),
            invalid && /* @__PURE__ */ jsxs(
              "g",
              {
                ...obstacle(`waypoint:${waypoint.id}:invalid`),
                "data-waypoint-invalid-indicator": "",
                "data-waypoint-state-slot": "invalid",
                transform: compoundUnknownInvalid ? "translate(-8 8)" : void 0,
                "aria-hidden": "true",
                children: [
                  compoundUnknownInvalid && /* @__PURE__ */ jsx(
                    "circle",
                    {
                      "data-waypoint-state-shadow": "invalid",
                      "data-marker-shadow": "",
                      cy: NAV_MARKER_SHADOW.chipOffsetY,
                      r: NAV_STATE_BADGE.radius + NAV_STATE_BADGE.strokeWidth / 2,
                      fill: NAV_MARKER_SHADOW.fill,
                      opacity: NAV_MARKER_SHADOW.opacity,
                      pointerEvents: "none"
                    }
                  ),
                  compoundUnknownInvalid && /* @__PURE__ */ jsx(
                    "circle",
                    {
                      "data-waypoint-state-circle": "invalid",
                      r: NAV_STATE_BADGE.radius,
                      fill: surface,
                      stroke: "var(--viewer-danger, var(--color-semantic-status-negative-foreground))",
                      strokeWidth: NAV_STATE_BADGE.strokeWidth,
                      vectorEffect: "non-scaling-stroke"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    NavigationStateGlyph,
                    {
                      kind: "invalid",
                      size: 10,
                      color: selected && !compoundUnknownInvalid ? selectedGlyphInk : foreground,
                      "data-waypoint-state-glyph-geometry": "invalid"
                    }
                  )
                ]
              }
            ),
            showLabel && /* @__PURE__ */ jsx(
              NavigationAnnotationBlock,
              {
                id: `waypoint:${waypoint.id}:label`,
                kind: "waypoint-label",
                anchor: waypoint.position,
                priority: annotationPriority({
                  selected,
                  focused: focusVisible,
                  alarm: invalid || availability === "unavailable"
                }),
                children: /* @__PURE__ */ jsxs("g", { "data-waypoint-label": "", "data-waypoint-label-offset-x": "15", pointerEvents: "none", "aria-hidden": "true", children: [
                  /* @__PURE__ */ jsx(
                    "text",
                    {
                      "data-waypoint-primary-label": "",
                      x: "15",
                      y: details ? "-1.5" : "3.5",
                      fill: foreground,
                      stroke: surface,
                      strokeWidth: NAV_LABEL_HALO.primary,
                      strokeLinejoin: "round",
                      paintOrder: "stroke",
                      vectorEffect: "non-scaling-stroke",
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--label2-size)",
                      fontWeight: "var(--fw-bold)",
                      children: waypoint.label
                    }
                  ),
                  details && /* @__PURE__ */ jsx(
                    "text",
                    {
                      "data-waypoint-details": "",
                      x: "15",
                      y: "10",
                      fill: muted,
                      stroke: surface,
                      strokeWidth: NAV_LABEL_HALO.secondary,
                      strokeLinejoin: "round",
                      paintOrder: "stroke",
                      vectorEffect: "non-scaling-stroke",
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--caption2-size)",
                      fontWeight: "var(--fw-semibold)",
                      children: details
                    }
                  )
                ] })
              }
            )
          ]
        }
      )
    }
  );
}

export {
  WaypointMarker
};
//# sourceMappingURL=chunk-HFH6YEBD.js.map