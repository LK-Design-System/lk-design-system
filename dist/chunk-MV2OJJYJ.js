"use client";
import {
  NavigationProgressHeadDefs,
  ProgressHeadObstacle,
  trajectoryProgressGeometry
} from "./chunk-OTORPXO6.js";
import {
  NavigationStateGlyph
} from "./chunk-54Q6T6L4.js";
import {
  NAV_BADGE_LEADER,
  NAV_DASH,
  NAV_FOCUS,
  NAV_HIT,
  NAV_LABEL_HALO,
  NAV_MARKER_SHADOW,
  NAV_PROGRESS_HEAD,
  NAV_SELECTION,
  NAV_STATE_BADGE,
  isFocusVisibleTarget,
  navStateOpacity
} from "./chunk-T7OX7DEF.js";
import {
  NavigationAnnotationBlock,
  annotationPriority,
  useNavigationObstacles
} from "./chunk-XLGTXJ3N.js";

// components/robotics/TrajectoryOverlay.jsx
import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var STATUS_LABEL = {
  planned: "\uACC4\uD68D\uB428",
  active: "\uC774\uB3D9 \uC911",
  waiting: "\uB300\uAE30 \uC911",
  blocked: "\uCC28\uB2E8\uB428",
  rerouting: "\uACBD\uB85C \uC7AC\uACC4\uC0B0 \uC911",
  completed: "\uC644\uB8CC\uB428"
};
var STATUS_GLYPH_KIND = {
  planned: "planned",
  active: "active",
  waiting: "waiting",
  blocked: "blocked",
  rerouting: "rerouting",
  completed: "completed"
};
var MARKER_GAP_PX = 4;
var MARKER_ROW_CLEARANCE_PX = 8;
var LABEL_ROW_GAP_PX = 12;
var STATE_BADGE_FOOTPRINT_PX = NAV_STATE_BADGE.radius + NAV_STATE_BADGE.strokeWidth / 2;
var MARKER_RADIUS_PX = {
  status: STATE_BADGE_FOOTPRINT_PX,
  invalid: STATE_BADGE_FOOTPRINT_PX,
  stale: STATE_BADGE_FOOTPRINT_PX
};
function finitePoint(point) {
  return point && Number.isFinite(point.x) && Number.isFinite(point.y);
}
function pathFromPoints(points) {
  if (points.length < 2) return "";
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}
function markerTransform(point, inverseScale, screenSlot) {
  const anchor = `translate(${point.x} ${point.y}) scale(${inverseScale})`;
  return screenSlot ? `${anchor} translate(${screenSlot.x} ${screenSlot.y})` : anchor;
}
function badgeNormalSlot(point) {
  const radians = (point.angle ?? 0) * Math.PI / 180;
  let x = Math.sin(radians);
  let y = -Math.cos(radians);
  if (y > 0 || Math.abs(y) < 1e-4 && x > 0) {
    x *= -1;
    y *= -1;
  }
  return { x: x * NAV_STATE_BADGE.pathNormalOffset, y: y * NAV_STATE_BADGE.pathNormalOffset };
}
function BadgeShadow(props) {
  return /* @__PURE__ */ jsx(
    "circle",
    {
      ...props,
      "data-marker-shadow": "",
      cy: NAV_MARKER_SHADOW.chipOffsetY,
      r: NAV_STATE_BADGE.radius + NAV_STATE_BADGE.strokeWidth / 2,
      fill: NAV_MARKER_SHADOW.fill,
      opacity: NAV_MARKER_SHADOW.opacity,
      pointerEvents: "none"
    }
  );
}
function BadgeLeaderTick({ slot, tone, hook }) {
  const reach = NAV_BADGE_LEADER.length / NAV_STATE_BADGE.pathNormalOffset;
  return /* @__PURE__ */ jsx(
    "line",
    {
      ...hook,
      x1: "0",
      y1: "0",
      x2: -slot.x * reach,
      y2: -slot.y * reach,
      stroke: tone,
      strokeWidth: NAV_BADGE_LEADER.strokeWidth,
      strokeLinecap: "round",
      vectorEffect: "non-scaling-stroke",
      pointerEvents: "none"
    }
  );
}
function markerCollisionLayout(markers, scale, fixedMarkers = []) {
  const candidates = [...markers, ...fixedMarkers];
  if (candidates.length < 2) return void 0;
  const collisionParticipants = /* @__PURE__ */ new Set();
  const collidingMovableIndexes = /* @__PURE__ */ new Set();
  for (let first = 0; first < candidates.length; first += 1) {
    for (let second = first + 1; second < candidates.length; second += 1) {
      const a = candidates[first];
      const b = candidates[second];
      const naturalDistance = Math.hypot(
        a.point.x - b.point.x,
        a.point.y - b.point.y
      ) * scale;
      if (naturalDistance < a.radius + b.radius + MARKER_GAP_PX) {
        collisionParticipants.add(first);
        collisionParticipants.add(second);
        if (first < markers.length) collidingMovableIndexes.add(first);
        if (second < markers.length) collidingMovableIndexes.add(second);
      }
    }
  }
  if (collidingMovableIndexes.size === 0) return void 0;
  const collisionMarkers = [...collisionParticipants].map((index) => candidates[index]);
  const reference = collisionMarkers.reduce((point, marker) => ({
    x: point.x + marker.point.x / collisionMarkers.length,
    y: point.y + marker.point.y / collisionMarkers.length
  }), { x: 0, y: 0 });
  const maxRadius = Math.max(...markers.map((marker) => marker.radius));
  const totalWidth = markers.reduce((width, marker) => width + marker.radius * 2, 0) + MARKER_GAP_PX * (markers.length - 1);
  const rowY = -(maxRadius + MARKER_ROW_CLEARANCE_PX);
  const slots = {};
  let cursor = -totalWidth / 2;
  markers.forEach((marker) => {
    const centerX = cursor + marker.radius;
    slots[marker.name] = {
      x: (reference.x - marker.point.x) * scale + centerX,
      y: (reference.y - marker.point.y) * scale + rowY
    };
    cursor += marker.radius * 2 + MARKER_GAP_PX;
  });
  return {
    reference,
    slots,
    totalWidth,
    labelY: rowY - maxRadius - LABEL_ROW_GAP_PX
  };
}
function labelScreenSlot(point, layout, scale) {
  if (!layout) return void 0;
  return {
    x: (layout.reference.x - point.x) * scale,
    y: (layout.reference.y - point.y) * scale + layout.labelY
  };
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
function statusTone(status, invalid) {
  if (invalid || status === "blocked") return "var(--viewer-danger, var(--color-semantic-status-negative-foreground))";
  if (status === "waiting" || status === "rerouting") return "var(--viewer-warning, var(--color-semantic-status-cautionary-foreground))";
  if (status === "completed") return "var(--viewer-positive, var(--color-semantic-status-positive-foreground))";
  if (status === "active") return "var(--viewer-accent, var(--color-semantic-primary-normal))";
  return "var(--viewer-muted, var(--color-semantic-label-alternative))";
}
function statusDash(status) {
  if (status === "planned") return "3 5";
  if (status === "waiting") return "9 3 2 3";
  if (status === "blocked") return "1 5";
  if (status === "rerouting") return "6 4";
  if (status === "completed") return "8 4";
  return void 0;
}
function trajectoryAccessibleName(trajectory, selected, focused, disabled, invalid, stale) {
  const samples = trajectory?.samples ?? [];
  const currentIndex = Number.isInteger(trajectory?.currentSampleIndex) && trajectory.currentSampleIndex >= 0 && trajectory.currentSampleIndex < samples.length ? trajectory.currentSampleIndex : void 0;
  const timedSamples = samples.filter((sample) => Number.isFinite(sample.timeMs));
  const firstTime = timedSamples[0]?.timeMs;
  const lastTime = timedSamples[timedSamples.length - 1]?.timeMs;
  const currentTime = currentIndex == null ? void 0 : samples[currentIndex]?.timeMs;
  const parts = [
    trajectory.label ?? `\uADA4\uC801 ${trajectory.id}`,
    `\uC9C0\uB3C4 ${trajectory.mapId}`,
    STATUS_LABEL[trajectory.status] ?? trajectory.status,
    `sample ${samples.length}\uAC1C`
  ];
  if (firstTime != null && lastTime != null) parts.push(`\uC2DC\uAC04 ${firstTime}\uC5D0\uC11C ${lastTime} \uBC00\uB9AC\uCD08`);
  if (currentIndex != null) parts.push(`\uD604\uC7AC sample ${currentIndex + 1}`);
  if (currentTime != null) parts.push(`\uD604\uC7AC \uC2DC\uAC04 ${currentTime} \uBC00\uB9AC\uCD08`);
  if (selected) parts.push("\uC120\uD0DD\uB428");
  if (focused) parts.push("\uD3EC\uCEE4\uC2A4\uB428");
  if (disabled) parts.push("\uC120\uD0DD\uD560 \uC218 \uC5C6\uC74C");
  if (invalid) parts.push("\uB370\uC774\uD130 \uC624\uB958");
  if (stale) parts.push("\uC624\uB798\uB41C \uB370\uC774\uD130");
  return parts.join(", ");
}
function TrajectoryOverlay({
  trajectory,
  viewportScale = 1,
  selected = false,
  focused = false,
  disabled = false,
  invalid = false,
  stale = false,
  showLabel = true,
  showProgressHead = true,
  onActivate,
  tabIndex,
  onFocus,
  onBlur,
  onPointerDown,
  onMouseDown,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  style,
  ...rest
}) {
  const [hasDomFocus, setHasDomFocus] = React.useState(false);
  const obstacle = useNavigationObstacles();
  const progressHeadId = `lk-trajectory-progress-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const scale = Number.isFinite(viewportScale) && viewportScale > 0 ? viewportScale : 1;
  const inverseScale = 1 / scale;
  const interactive = typeof onActivate === "function";
  const hiddenFromAccessibility = ariaHidden === true || ariaHidden === "true";
  const pointerOnly = interactive && hiddenFromAccessibility;
  const focusVisible = !hiddenFromAccessibility && (focused || hasDomFocus);
  const samples = trajectory?.samples ?? [];
  const finiteSamples = samples.map((sample, sourceIndex) => ({
    sourceIndex,
    point: sample.position
  })).filter(({ point }) => finitePoint(point));
  const points = finiteSamples.map(({ point }) => point);
  const pathData = pathFromPoints(points);
  if (points.length < 2) return null;
  const currentIndex = Number.isInteger(trajectory?.currentSampleIndex) && trajectory.currentSampleIndex >= 0 && trajectory.currentSampleIndex < samples.length ? trajectory.currentSampleIndex : void 0;
  const currentPointIndex = currentIndex == null ? -1 : finiteSamples.findIndex(({ sourceIndex }) => sourceIndex === currentIndex);
  const currentProgress = trajectoryProgressGeometry(points, currentPointIndex, scale, { suppressHead: !showProgressHead });
  const markerPoint = currentProgress?.point ?? pointAlong(points, 0.5);
  const currentHeadVisible = Boolean(currentProgress?.headVisible);
  const currentPrefixPath = currentProgress ? pathFromPoints(currentProgress.prefixPoints) : "";
  const currentFuturePath = currentProgress ? pathFromPoints(currentProgress.suffixPoints) : "";
  const trajectoryBodyPath = currentHeadVisible ? currentFuturePath : pathData;
  const statePoint = pointAlong(points, 0.12);
  const tone = statusTone(trajectory?.status, invalid);
  const dash = statusDash(trajectory?.status);
  const foreground = "var(--viewer-foreground, var(--color-semantic-label-strong))";
  const surface = "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))";
  const trajectoryStateMarkers = [
    invalid ? {
      state: "invalid",
      glyphKind: "invalid",
      point: pointAlong(points, 0.8),
      tone: "var(--viewer-danger, var(--color-semantic-status-negative-foreground))"
    } : null,
    stale ? {
      state: "stale",
      glyphKind: "stale",
      point: pointAlong(points, invalid ? 0.9 : 0.8),
      tone: "var(--viewer-muted, var(--color-semantic-label-alternative))"
    } : null
  ].filter(Boolean);
  const naturalMarkers = [
    // The default working status draws NO badge — the strong line, progress
    // head, and robot already say "moving"; badges are exception-state chrome.
    trajectory?.status !== "active" ? { name: "status", point: statePoint, radius: MARKER_RADIUS_PX.status } : null,
    ...trajectoryStateMarkers.map((item) => ({
      name: item.state,
      point: item.point,
      radius: MARKER_RADIUS_PX[item.state]
    }))
  ].filter(Boolean);
  const fixedProgressMarkers = currentHeadVisible ? [{
    name: "current",
    point: currentProgress.point,
    radius: NAV_PROGRESS_HEAD.collisionRadius
  }] : [];
  const markerLayout = markerCollisionLayout(naturalMarkers, scale, fixedProgressMarkers);
  const trajectoryMarkerSlot = (name) => markerLayout?.slots[name];
  const trajectoryLabelSlot = labelScreenSlot(markerPoint, markerLayout, scale);
  const activate = (event) => {
    if (disabled || !interactive) return;
    onActivate(trajectory.id, event);
  };
  const handleKeyDown = (event) => {
    if (!hiddenFromAccessibility) setHasDomFocus(true);
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (!interactive || disabled || event.repeat || pointerOnly) return;
    activate(event);
  };
  const handlePointerDown = (event) => {
    if (pointerOnly) event.preventDefault();
    onPointerDown?.(event);
  };
  const handleMouseDown = (event) => {
    if (pointerOnly) event.preventDefault();
    onMouseDown?.(event);
  };
  return /* @__PURE__ */ jsxs(
    "g",
    {
      ...rest,
      "data-lk-trajectory-overlay": "",
      "data-trajectory-id": trajectory?.id,
      "data-map-id": trajectory?.mapId,
      "data-trajectory-status": trajectory?.status,
      "data-current-sample-index": currentIndex,
      "data-viewport-scale": scale,
      "data-trajectory-marker-layout": markerLayout ? "screen-slots" : "path-anchored",
      "data-trajectory-marker-row-width": markerLayout?.totalWidth,
      "data-pointer-only": pointerOnly ? "true" : void 0,
      "data-selected": selected ? "true" : "false",
      "data-focused": focusVisible ? "true" : "false",
      "data-disabled": disabled ? "true" : "false",
      "data-invalid": invalid ? "true" : "false",
      "data-stale": stale ? "true" : "false",
      role: hiddenFromAccessibility ? void 0 : interactive ? "button" : "img",
      tabIndex: hiddenFromAccessibility ? void 0 : interactive ? disabled ? -1 : tabIndex ?? 0 : tabIndex,
      focusable: hiddenFromAccessibility ? "false" : interactive ? "true" : void 0,
      "aria-hidden": hiddenFromAccessibility || void 0,
      "aria-label": hiddenFromAccessibility ? void 0 : ariaLabel ?? trajectoryAccessibleName(trajectory, selected, focused, disabled, invalid, stale),
      "aria-pressed": !hiddenFromAccessibility && interactive ? selected : void 0,
      "aria-disabled": !hiddenFromAccessibility && interactive && disabled ? true : void 0,
      "aria-invalid": !hiddenFromAccessibility && invalid ? true : void 0,
      onClick: activate,
      onKeyDown: !hiddenFromAccessibility ? handleKeyDown : void 0,
      onPointerDown: pointerOnly || onPointerDown ? handlePointerDown : void 0,
      onMouseDown: pointerOnly || onMouseDown ? handleMouseDown : void 0,
      onFocus: !hiddenFromAccessibility ? (event) => {
        setHasDomFocus(isFocusVisibleTarget(event.currentTarget));
        onFocus?.(event);
      } : void 0,
      onBlur: !hiddenFromAccessibility ? (event) => {
        setHasDomFocus(false);
        onBlur?.(event);
      } : void 0,
      style: {
        cursor: disabled ? "not-allowed" : interactive ? "pointer" : "default",
        opacity: navStateOpacity(disabled, stale),
        outline: "none",
        ...style
      },
      children: [
        focusVisible && pathData && /* @__PURE__ */ jsx(
          "path",
          {
            "data-trajectory-focus-indicator": "",
            d: pathData,
            fill: "none",
            stroke: "var(--color-semantic-focus-indicator)",
            strokeWidth: NAV_FOCUS.pathHaloWidth,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none"
          }
        ),
        selected && pathData && /* @__PURE__ */ jsx(
          "path",
          {
            "data-trajectory-selected-indicator": "",
            d: pathData,
            fill: "none",
            stroke: "var(--viewer-accent, var(--color-semantic-primary-normal))",
            strokeWidth: NAV_SELECTION.pathHaloWidth,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            opacity: NAV_SELECTION.haloOpacity,
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none"
          }
        ),
        trajectoryBodyPath && !selected && !focusVisible && /* @__PURE__ */ jsx(
          "path",
          {
            "data-trajectory-casing": "",
            d: trajectoryBodyPath,
            fill: "none",
            stroke: surface,
            strokeWidth: "5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none"
          }
        ),
        trajectoryBodyPath && /* @__PURE__ */ jsx(
          "path",
          {
            "data-trajectory-path": "",
            d: trajectoryBodyPath,
            fill: "none",
            stroke: tone,
            strokeWidth: currentProgress ? 2.5 : selected || trajectory?.status === "active" ? 3.5 : 2.5,
            strokeDasharray: dash,
            opacity: currentProgress ? NAV_PROGRESS_HEAD.futureOpacity : void 0,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none"
          }
        ),
        currentHeadVisible && /* @__PURE__ */ jsx(
          NavigationProgressHeadDefs,
          {
            idPrefix: progressHeadId,
            tone,
            surface,
            inverseScale,
            tipSetbackPx: currentProgress.tipSetbackPx
          }
        ),
        currentProgress && currentPrefixPath && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              "data-trajectory-progress-casing": "",
              d: currentPrefixPath,
              fill: "none",
              stroke: surface,
              strokeWidth: NAV_PROGRESS_HEAD.trajectory.casingWidth,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              vectorEffect: "non-scaling-stroke",
              pointerEvents: "none"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              "data-trajectory-progress-past": "",
              "data-trajectory-current-marker": currentHeadVisible ? "" : void 0,
              "data-trajectory-progress-marker": currentHeadVisible ? "" : void 0,
              "data-navigation-progress-head": currentHeadVisible ? "trajectory" : void 0,
              "data-head-rendering": currentHeadVisible ? "marker-end" : void 0,
              "data-trajectory-anchor-x": currentHeadVisible ? currentProgress.point.x : void 0,
              "data-trajectory-anchor-y": currentHeadVisible ? currentProgress.point.y : void 0,
              d: currentPrefixPath,
              fill: "none",
              stroke: tone,
              strokeWidth: NAV_PROGRESS_HEAD.trajectory.coreWidth,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              vectorEffect: "non-scaling-stroke",
              markerEnd: currentHeadVisible ? `url(#${progressHeadId}-head)` : void 0,
              pointerEvents: "none"
            }
          )
        ] }),
        pathData && interactive && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              "data-trajectory-hit-target": "",
              "data-screen-target-size": NAV_HIT.screenTargetSize,
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
              "data-trajectory-hit-target-core": "",
              "data-trajectory-actual-hit-core": "",
              "data-screen-target-size": NAV_HIT.screenTargetSize,
              "data-screen-target-diameter": "35",
              cx: statePoint.x,
              cy: statePoint.y,
              r: NAV_HIT.radius * inverseScale,
              fill: "transparent",
              pointerEvents: "all"
            }
          )
        ] }),
        currentHeadVisible && /* @__PURE__ */ jsx(
          ProgressHeadObstacle,
          {
            obstacle,
            id: `trajectory:${trajectory.id}:progress-head`,
            point: currentProgress.point,
            angle: currentProgress.angle,
            inverseScale,
            dataPrefix: "trajectory"
          }
        ),
        pathData && trajectory?.status !== "active" && /* @__PURE__ */ jsxs(
          "g",
          {
            "data-trajectory-status-marker": "",
            "data-trajectory-status-glyph": trajectory?.status,
            "data-trajectory-screen-slot": markerLayout ? "status" : void 0,
            "data-trajectory-anchor-x": statePoint.x,
            "data-trajectory-anchor-y": statePoint.y,
            transform: markerTransform(statePoint, inverseScale, trajectoryMarkerSlot("status") ?? badgeNormalSlot(statePoint)),
            "aria-hidden": "true",
            pointerEvents: "none",
            children: [
              !trajectoryMarkerSlot("status") && /* @__PURE__ */ jsx(
                BadgeLeaderTick,
                {
                  slot: badgeNormalSlot(statePoint),
                  tone,
                  hook: { "data-trajectory-badge-leader": "status" }
                }
              ),
              /* @__PURE__ */ jsx(BadgeShadow, { "data-trajectory-badge-shadow": "status" }),
              /* @__PURE__ */ jsx(
                "circle",
                {
                  ...obstacle(`trajectory:${trajectory.id}:status`),
                  "data-trajectory-marker-badge": "status",
                  "data-navigation-marker-circle": "",
                  r: NAV_STATE_BADGE.radius,
                  fill: surface,
                  stroke: tone,
                  strokeWidth: NAV_STATE_BADGE.strokeWidth,
                  vectorEffect: "non-scaling-stroke"
                }
              ),
              /* @__PURE__ */ jsx(
                NavigationStateGlyph,
                {
                  kind: STATUS_GLYPH_KIND[trajectory?.status] ?? "unknown",
                  size: 10,
                  color: foreground
                }
              )
            ]
          }
        ),
        pathData && trajectoryStateMarkers.map((item) => {
          const point = item.point;
          const stateSlot = trajectoryMarkerSlot(item.state);
          return /* @__PURE__ */ jsxs(
            "g",
            {
              "data-trajectory-overlay-state": item.state,
              "data-trajectory-screen-slot": stateSlot ? item.state : void 0,
              "data-trajectory-anchor-x": point.x,
              "data-trajectory-anchor-y": point.y,
              transform: markerTransform(point, inverseScale, stateSlot ?? badgeNormalSlot(point)),
              "aria-hidden": "true",
              pointerEvents: "none",
              children: [
                !stateSlot && /* @__PURE__ */ jsx(
                  BadgeLeaderTick,
                  {
                    slot: badgeNormalSlot(point),
                    tone: item.tone,
                    hook: { "data-trajectory-badge-leader": item.state }
                  }
                ),
                /* @__PURE__ */ jsx(BadgeShadow, { "data-trajectory-badge-shadow": item.state }),
                /* @__PURE__ */ jsx(
                  "circle",
                  {
                    ...obstacle(`trajectory:${trajectory.id}:state:${item.state}`),
                    "data-trajectory-marker-badge": item.state,
                    "data-navigation-marker-circle": "",
                    r: NAV_STATE_BADGE.radius,
                    fill: surface,
                    stroke: item.tone,
                    strokeWidth: NAV_STATE_BADGE.strokeWidth,
                    strokeDasharray: item.state === "stale" ? NAV_DASH.staleRing : void 0,
                    vectorEffect: "non-scaling-stroke"
                  }
                ),
                /* @__PURE__ */ jsx(NavigationStateGlyph, { kind: item.glyphKind, size: 10, color: foreground })
              ]
            },
            item.state
          );
        }),
        showLabel && trajectory?.label && pathData && /* @__PURE__ */ jsx(
          NavigationAnnotationBlock,
          {
            id: `trajectory:${trajectory.id}:label`,
            kind: "trajectory-label",
            anchor: markerPoint,
            nudgeDirection: "up",
            priority: annotationPriority({
              selected,
              focused: focusVisible,
              alarm: invalid || trajectory?.status === "blocked",
              emphasized: trajectory?.status === "active"
            }),
            children: /* @__PURE__ */ jsx(
              "text",
              {
                "data-trajectory-label": "",
                "data-trajectory-screen-row": trajectoryLabelSlot ? "label" : void 0,
                "data-trajectory-label-anchor-x": markerPoint.x,
                "data-trajectory-label-anchor-y": markerPoint.y,
                x: "0",
                y: trajectoryLabelSlot ? 0 : -13,
                textAnchor: "middle",
                transform: markerTransform(markerPoint, inverseScale, trajectoryLabelSlot),
                fill: foreground,
                stroke: surface,
                strokeWidth: NAV_LABEL_HALO.primary,
                strokeLinejoin: "round",
                paintOrder: "stroke",
                vectorEffect: "non-scaling-stroke",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--caption1-size)",
                fontWeight: "var(--fw-bold)",
                "aria-hidden": "true",
                pointerEvents: "none",
                children: trajectory.label
              }
            )
          }
        )
      ]
    }
  );
}

export {
  TrajectoryOverlay
};
//# sourceMappingURL=chunk-MV2OJJYJ.js.map