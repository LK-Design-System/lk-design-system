"use client";
import {
  NAVIGATION_DIRECTION_PATH,
  NAVIGATION_ENDPOINT_ARROW
} from "./chunk-LKPSREO3.js";
import {
  NavigationStateGlyph
} from "./chunk-54Q6T6L4.js";
import {
  NAV_HIT,
  NAV_LABEL_HALO,
  NAV_STATE_BADGE,
  isFocusVisibleTarget,
  navStateOpacity
} from "./chunk-LTSTEICR.js";
import {
  NavigationAnnotationBlock,
  annotationPriority,
  useNavigationObstacles
} from "./chunk-2VOHTLP5.js";

// components/robotics/LaneOverlay.jsx
import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var VIEWER_FOREGROUND = "var(--viewer-foreground, var(--color-semantic-label-strong))";
var VIEWER_MUTED = "var(--viewer-muted, var(--color-semantic-label-neutral))";
var VIEWER_SURFACE = "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))";
var AVAILABILITY_LABEL = {
  available: "\uD1B5\uD589 \uAC00\uB2A5",
  closed: "\uD3D0\uC1C4",
  unknown: "\uC0C1\uD0DC \uBBF8\uD655\uC778"
};
function finitePoint(point) {
  return point && Number.isFinite(point.x) && Number.isFinite(point.y);
}
function pathFromPoints(points) {
  if (points.length < 2) return "";
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}
function pointAlong(points, ratio) {
  if (points.length === 0) return { x: 0, y: 0, angle: 0 };
  if (points.length === 1) return { ...points[0], angle: 0 };
  const lengths = [];
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1];
    const end = points[index];
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    lengths.push(length);
    total += length;
  }
  if (total === 0) return { ...points[0], angle: 0 };
  let remaining = total * Math.max(0, Math.min(1, ratio));
  for (let index = 0; index < lengths.length; index += 1) {
    const length = lengths[index];
    const start = points[index];
    const end = points[index + 1];
    if (remaining <= length || index === lengths.length - 1) {
      const localRatio = length === 0 ? 0 : remaining / length;
      return {
        x: start.x + (end.x - start.x) * localRatio,
        y: start.y + (end.y - start.y) * localRatio,
        angle: Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI
      };
    }
    remaining -= length;
  }
  return { ...points[points.length - 1], angle: 0 };
}
function orientationAngle(orientation, fallbackAngle) {
  if (!orientation || orientation === "unconstrained") return void 0;
  if (orientation === "backward") return fallbackAngle + 180;
  return fallbackAngle;
}
function upperScreenNormal(angle) {
  const radians = angle * Math.PI / 180;
  let x = Math.sin(radians);
  let y = -Math.cos(radians);
  if (y > 0 || Math.abs(y) < 1e-4 && x > 0) {
    x *= -1;
    y *= -1;
  }
  return { x, y };
}
function outwardTextAnchor(horizontalDirection) {
  if (horizontalDirection > 0.15) return "start";
  if (horizontalDirection < -0.15) return "end";
  return "middle";
}
function laneAccessibleName(lane, availability, conflict, selected, focused, disabled, invalid, stale) {
  const entryName = lane.entry?.waypointId ?? "\uC9C4\uC785\uC810";
  const exitName = lane.exit?.waypointId ?? "\uC774\uD0C8\uC810";
  const parts = [
    lane.label ?? `\uB808\uC778 ${lane.id}`,
    `${entryName}\uC5D0\uC11C ${exitName} \uBC29\uD5A5`,
    AVAILABILITY_LABEL[availability]
  ];
  if (lane.relation?.kind === "paired") parts.push(`\uBC18\uB300 \uBC29\uD5A5 \uB808\uC778 ${lane.relation.pairedLaneId}\uC640 \uC30D`);
  if (lane.speedLimitMps != null) parts.push(`\uC18D\uB3C4 \uC81C\uD55C ${lane.speedLimitMps} m/s`);
  if (lane.mutexGroupId) parts.push(`\uC0C1\uD638 \uBC30\uC81C \uADF8\uB8F9 ${lane.mutexGroupId}`);
  if (lane.entry?.transitionIds?.length) parts.push(`\uC9C4\uC785 \uC804\uD658 ${lane.entry.transitionIds.join(", ")}`);
  if (lane.exit?.transitionIds?.length) parts.push(`\uC774\uD0C8 \uC804\uD658 ${lane.exit.transitionIds.join(", ")}`);
  if (conflict) parts.push("\uCDA9\uB3CC \uC788\uC74C");
  if (selected) parts.push("\uC120\uD0DD\uB428");
  if (focused) parts.push("\uD3EC\uCEE4\uC2A4\uB428");
  if (disabled) parts.push("\uC120\uD0DD\uD560 \uC218 \uC5C6\uC74C");
  if (invalid) parts.push("\uB370\uC774\uD130 \uC624\uB958");
  if (stale) parts.push("\uC624\uB798\uB41C \uB370\uC774\uD130");
  return parts.join(", ");
}
function endpointMarker(point, endpoint, kind, fallbackAngle, inverseScale) {
  if (!point || !endpoint) return null;
  const orientation = orientationAngle(endpoint.orientation, fallbackAngle);
  const transitionCount = endpoint.transitionIds?.length ?? 0;
  const markerLabel = kind === "entry" ? "\uC9C4\uC785" : "\uC774\uD0C8";
  return /* @__PURE__ */ jsxs(
    "g",
    {
      "data-lane-endpoint": kind,
      "data-waypoint-id": endpoint.waypointId ?? void 0,
      transform: `translate(${point.x} ${point.y}) scale(${inverseScale})`,
      "aria-hidden": "true",
      pointerEvents: "none",
      children: [
        /* @__PURE__ */ jsx(
          "circle",
          {
            "data-lane-endpoint-point": kind,
            r: "4",
            fill: VIEWER_SURFACE,
            stroke: VIEWER_MUTED,
            strokeWidth: "1.5",
            vectorEffect: "non-scaling-stroke"
          }
        ),
        /* @__PURE__ */ jsx(
          "text",
          {
            "data-lane-endpoint-label": kind,
            x: "0",
            y: "-8",
            textAnchor: "middle",
            fill: VIEWER_MUTED,
            stroke: VIEWER_SURFACE,
            strokeWidth: NAV_LABEL_HALO.caption,
            paintOrder: "stroke",
            vectorEffect: "non-scaling-stroke",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--caption2-size)",
            fontWeight: "var(--fw-bold)",
            children: markerLabel
          }
        ),
        transitionCount > 0 && /* @__PURE__ */ jsxs("g", { "data-lane-transition-count": transitionCount, transform: "translate(0 16)", children: [
          /* @__PURE__ */ jsx(
            "circle",
            {
              "data-lane-transition-count-circle": "",
              r: "9",
              fill: VIEWER_SURFACE,
              stroke: VIEWER_MUTED,
              strokeWidth: "1.5",
              vectorEffect: "non-scaling-stroke"
            }
          ),
          /* @__PURE__ */ jsxs(
            "text",
            {
              "data-lane-transition-count-text": "",
              x: "0",
              y: "0.5",
              textAnchor: "middle",
              dominantBaseline: "middle",
              fill: VIEWER_FOREGROUND,
              stroke: VIEWER_SURFACE,
              strokeWidth: "1.5",
              paintOrder: "stroke",
              vectorEffect: "non-scaling-stroke",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--caption2-size)",
              fontWeight: "var(--fw-bold)",
              children: [
                "T",
                transitionCount
              ]
            }
          )
        ] }),
        orientation != null && /* @__PURE__ */ jsx(
          "path",
          {
            "data-lane-orientation": endpoint.orientation,
            d: NAVIGATION_ENDPOINT_ARROW,
            transform: `rotate(${orientation}) translate(10 0)`,
            fill: "none",
            stroke: VIEWER_FOREGROUND,
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            vectorEffect: "non-scaling-stroke"
          }
        )
      ]
    },
    kind
  );
}
function LaneOverlay({
  lane,
  availability = "available",
  conflict = false,
  viewportScale = 1,
  selected = false,
  focused = false,
  disabled = false,
  invalid = false,
  stale = false,
  showLabel = true,
  showEndpoints = true,
  onActivate,
  role,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  tabIndex,
  onFocus,
  onBlur,
  onMouseDown,
  style,
  ...rest
}) {
  const [hasFocus, setHasFocus] = React.useState(false);
  const obstacle = useNavigationObstacles();
  const pointerOnly = ariaHidden === true || ariaHidden === "true";
  const scale = Number.isFinite(viewportScale) && viewportScale > 0 ? viewportScale : 1;
  const inverseScale = 1 / scale;
  const resolvedAvailability = ["available", "closed", "unknown"].includes(availability) ? availability : "available";
  const hasConflict = Boolean(conflict);
  const points = (lane?.points ?? []).filter(finitePoint);
  if (points.length < 2) return null;
  const pathData = pathFromPoints(points);
  const midpoint = pointAlong(points, 0.5);
  const directionPoint = pointAlong(points, 0.64);
  const entryDirection = pointAlong(points.slice(0, 2), 0.5).angle;
  const exitDirection = pointAlong(points.slice(-2), 0.5).angle;
  const interactive = typeof onActivate === "function";
  const visibleFocus = !pointerOnly && (focused || hasFocus);
  const relation = lane?.relation?.kind === "paired" ? "paired" : "single";
  const availabilityDash = resolvedAvailability === "closed" ? "8 5" : resolvedAvailability === "unknown" ? "2 5" : void 0;
  const baseColor = invalid ? "var(--viewer-danger, var(--color-semantic-status-negative-foreground))" : resolvedAvailability === "available" ? "var(--viewer-accent, var(--color-semantic-primary-normal))" : "var(--viewer-muted, var(--color-semantic-label-alternative))";
  const stateGlyphs = [
    resolvedAvailability === "closed" ? { state: "closed", tone: VIEWER_FOREGROUND } : null,
    resolvedAvailability === "unknown" ? { state: "unknown", tone: "var(--viewer-warning, var(--color-semantic-status-cautionary-foreground))" } : null,
    hasConflict ? { state: "conflict", tone: "var(--viewer-danger, var(--color-semantic-status-negative-foreground))" } : null,
    invalid ? { state: "invalid", tone: "var(--viewer-danger, var(--color-semantic-status-negative-foreground))" } : null,
    stale ? { state: "stale", tone: VIEWER_MUTED } : null
  ].filter(Boolean);
  const midpointRadians = midpoint.angle * Math.PI / 180;
  const labelNormal = upperScreenNormal(midpoint.angle);
  const stateTangent = {
    x: Math.cos(midpointRadians),
    y: Math.sin(midpointRadians)
  };
  const positionedStateGlyphs = stateGlyphs.map((state, index) => ({
    ...state,
    slot: {
      x: stateTangent.x * (index - (stateGlyphs.length - 1) / 2) * 18 + labelNormal.x * 32,
      y: stateTangent.y * (index - (stateGlyphs.length - 1) / 2) * 18 + labelNormal.y * 32
    }
  }));
  const primaryLabelDistance = positionedStateGlyphs.length > 0 ? 56 : 22;
  const metadataDistance = positionedStateGlyphs.length > 0 ? 40 : 28;
  const primaryLabelPosition = {
    x: labelNormal.x * primaryLabelDistance,
    y: labelNormal.y * primaryLabelDistance
  };
  const primaryLabelAnchor = outwardTextAnchor(labelNormal.x);
  const metadataNormalDistance = lane?.label ? -metadataDistance : primaryLabelDistance;
  const metadataPosition = {
    x: labelNormal.x * metadataNormalDistance,
    y: labelNormal.y * metadataNormalDistance
  };
  const metadataAnchor = outwardTextAnchor(labelNormal.x * Math.sign(metadataNormalDistance));
  const metadata = [
    lane?.speedLimitMps != null ? `\u2264 ${lane.speedLimitMps} m/s` : null,
    lane?.mutexGroupId ? `mutex ${lane.mutexGroupId}` : null
  ].filter(Boolean).join(" \xB7 ");
  const activate = (event) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onActivate?.(lane.id, event);
  };
  const handleKeyDown = (event) => {
    if (!pointerOnly) setHasFocus(true);
    if (pointerOnly || disabled || !interactive || event.repeat) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activate(event);
  };
  return /* @__PURE__ */ jsxs(
    "g",
    {
      ...rest,
      "data-lk-lane-overlay": "",
      "data-lane-id": lane?.id,
      "data-map-id": lane?.mapId,
      "data-availability": resolvedAvailability,
      "data-conflict": hasConflict ? "true" : "false",
      "data-relation": relation,
      "data-paired-lane-id": lane?.relation?.kind === "paired" ? lane.relation.pairedLaneId : void 0,
      "data-selected": selected ? "true" : "false",
      "data-focused": visibleFocus ? "true" : "false",
      "data-disabled": disabled ? "true" : "false",
      "data-invalid": invalid ? "true" : "false",
      "data-stale": stale ? "true" : "false",
      role: pointerOnly ? void 0 : role ?? (interactive ? "button" : "img"),
      tabIndex: pointerOnly ? void 0 : interactive ? disabled ? -1 : tabIndex ?? 0 : tabIndex,
      focusable: pointerOnly ? "false" : interactive && !disabled ? "true" : void 0,
      "aria-hidden": pointerOnly || void 0,
      "aria-label": pointerOnly ? void 0 : ariaLabel ?? laneAccessibleName(
        lane,
        resolvedAvailability,
        hasConflict,
        selected,
        visibleFocus,
        disabled,
        invalid,
        stale
      ),
      "aria-pressed": !pointerOnly && interactive ? selected : void 0,
      "aria-disabled": !pointerOnly && interactive && disabled ? true : void 0,
      "aria-invalid": !pointerOnly && invalid ? true : void 0,
      onClick: interactive ? activate : void 0,
      onKeyDown: handleKeyDown,
      onMouseDown: (event) => {
        if (pointerOnly) event.preventDefault();
        onMouseDown?.(event);
      },
      onFocus: (event) => {
        if (!pointerOnly) setHasFocus(isFocusVisibleTarget(event.currentTarget));
        onFocus?.(event);
      },
      onBlur: (event) => {
        setHasFocus(false);
        onBlur?.(event);
      },
      style: {
        cursor: disabled ? "not-allowed" : interactive ? "pointer" : "default",
        opacity: navStateOpacity(disabled, stale),
        outline: "none",
        ...style
      },
      children: [
        visibleFocus && pathData && /* @__PURE__ */ jsx(
          "path",
          {
            "data-lane-focus-ring": "",
            d: pathData,
            fill: "none",
            stroke: "var(--color-semantic-focus-indicator)",
            strokeWidth: "10",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none"
          }
        ),
        selected && pathData && /* @__PURE__ */ jsx(
          "path",
          {
            "data-lane-selection-halo": "",
            d: pathData,
            fill: "none",
            stroke: "var(--viewer-accent, var(--color-semantic-primary-normal))",
            strokeWidth: "7",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            opacity: "0.24",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none"
          }
        ),
        pathData && !selected && !visibleFocus && /* @__PURE__ */ jsx(
          "path",
          {
            "data-lane-casing": "",
            d: pathData,
            fill: "none",
            stroke: VIEWER_SURFACE,
            strokeWidth: "6",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none"
          }
        ),
        pathData && /* @__PURE__ */ jsx(
          "path",
          {
            "data-lane-path": "",
            d: pathData,
            fill: "none",
            stroke: baseColor,
            strokeWidth: selected ? 3.5 : 2.5,
            strokeDasharray: availabilityDash,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none"
          }
        ),
        hasConflict && pathData && /* @__PURE__ */ jsx(
          "path",
          {
            "data-lane-conflict-pattern": "",
            d: pathData,
            fill: "none",
            stroke: "var(--viewer-danger, var(--color-semantic-status-negative-foreground))",
            strokeWidth: "2",
            strokeDasharray: "2 7",
            strokeLinecap: "round",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none"
          }
        ),
        pathData && interactive && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              "data-lane-hit-target": "",
              "data-screen-target-size": "24",
              d: pathData,
              fill: "none",
              stroke: "transparent",
              strokeWidth: "24",
              vectorEffect: "non-scaling-stroke",
              pointerEvents: "stroke"
            }
          ),
          /* @__PURE__ */ jsx(
            "circle",
            {
              "data-lane-hit-target-core": "",
              "data-lane-actual-hit-core": "",
              "data-screen-target-size": "24",
              "data-screen-target-diameter": "35",
              cx: midpoint.x,
              cy: midpoint.y,
              r: NAV_HIT.radius * inverseScale,
              fill: "transparent",
              pointerEvents: "all"
            }
          )
        ] }),
        pathData && /* @__PURE__ */ jsx(
          "path",
          {
            "data-lane-direction": "entry-to-exit",
            "data-lane-direction-anchor-x": directionPoint.x,
            "data-lane-direction-anchor-y": directionPoint.y,
            d: NAVIGATION_DIRECTION_PATH,
            transform: `translate(${directionPoint.x} ${directionPoint.y}) rotate(${directionPoint.angle}) scale(${inverseScale})`,
            fill: baseColor,
            stroke: VIEWER_SURFACE,
            strokeWidth: "1",
            strokeLinejoin: "round",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none"
          }
        ),
        showEndpoints && /* @__PURE__ */ jsx("g", { ...obstacle(`lane:${lane.id}:endpoint:entry`), children: endpointMarker(points[0], lane?.entry, "entry", entryDirection, inverseScale) }),
        showEndpoints && /* @__PURE__ */ jsx("g", { ...obstacle(`lane:${lane.id}:endpoint:exit`), children: endpointMarker(points[points.length - 1], lane?.exit, "exit", exitDirection, inverseScale) }),
        positionedStateGlyphs.length > 0 && /* @__PURE__ */ jsx(
          "g",
          {
            ...obstacle(`lane:${lane.id}:states`),
            "data-lane-state-slot-layer": "",
            "data-viewport-scale": scale,
            "data-lane-state-tangent-x": stateTangent.x,
            "data-lane-state-tangent-y": stateTangent.y,
            "data-lane-state-normal-x": labelNormal.x,
            "data-lane-state-normal-y": labelNormal.y,
            transform: `translate(${midpoint.x} ${midpoint.y}) scale(${inverseScale})`,
            "aria-hidden": "true",
            pointerEvents: "none",
            children: positionedStateGlyphs.map((state) => /* @__PURE__ */ jsxs(
              "g",
              {
                "data-lane-state-glyph": state.state,
                "data-lane-state": state.state,
                "data-lane-state-slot-x": state.slot.x,
                "data-lane-state-slot-y": state.slot.y,
                transform: `translate(${state.slot.x} ${state.slot.y})`,
                children: [
                  /* @__PURE__ */ jsx(
                    "circle",
                    {
                      "data-lane-state-circle": state.state,
                      r: NAV_STATE_BADGE.radius,
                      fill: VIEWER_SURFACE,
                      stroke: state.tone,
                      strokeWidth: NAV_STATE_BADGE.strokeWidth,
                      vectorEffect: "non-scaling-stroke"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    NavigationStateGlyph,
                    {
                      kind: state.state,
                      size: 10,
                      color: VIEWER_FOREGROUND,
                      "data-lane-state-glyph-geometry": ""
                    }
                  )
                ]
              },
              state.state
            ))
          }
        ),
        showLabel && (lane?.label || metadata) && /* @__PURE__ */ jsx(
          NavigationAnnotationBlock,
          {
            id: `lane:${lane.id}:label`,
            kind: "lane-label",
            anchor: midpoint,
            priority: annotationPriority({
              selected,
              focused: visibleFocus,
              alarm: invalid || hasConflict || resolvedAvailability === "closed"
            }),
            children: /* @__PURE__ */ jsxs(
              "g",
              {
                "data-lane-label": "",
                "data-lane-label-normal-x": labelNormal.x,
                "data-lane-label-normal-y": labelNormal.y,
                transform: `translate(${midpoint.x} ${midpoint.y}) scale(${inverseScale})`,
                "aria-hidden": "true",
                pointerEvents: "none",
                children: [
                  lane?.label && /* @__PURE__ */ jsx(
                    "text",
                    {
                      "data-lane-primary-label": "",
                      "data-lane-normal-distance": primaryLabelDistance,
                      "data-lane-outward-anchor": primaryLabelAnchor,
                      x: primaryLabelPosition.x,
                      y: primaryLabelPosition.y,
                      textAnchor: primaryLabelAnchor,
                      fill: VIEWER_FOREGROUND,
                      stroke: VIEWER_SURFACE,
                      strokeWidth: NAV_LABEL_HALO.primary,
                      paintOrder: "stroke",
                      vectorEffect: "non-scaling-stroke",
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--caption1-size)",
                      fontWeight: "var(--fw-bold)",
                      children: lane.label
                    }
                  ),
                  metadata && /* @__PURE__ */ jsx(
                    "text",
                    {
                      "data-lane-metadata": "",
                      "data-lane-normal-distance": metadataNormalDistance,
                      "data-lane-outward-anchor": metadataAnchor,
                      x: metadataPosition.x,
                      y: metadataPosition.y,
                      textAnchor: metadataAnchor,
                      fill: VIEWER_MUTED,
                      stroke: VIEWER_SURFACE,
                      strokeWidth: NAV_LABEL_HALO.secondary,
                      paintOrder: "stroke",
                      vectorEffect: "non-scaling-stroke",
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--caption2-size)",
                      fontWeight: "var(--fw-semibold)",
                      children: metadata
                    }
                  )
                ]
              }
            )
          }
        )
      ]
    }
  );
}

export {
  LaneOverlay
};
//# sourceMappingURL=chunk-SK6EMV55.js.map