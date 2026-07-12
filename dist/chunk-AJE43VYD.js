"use client";

// components/robotics/RouteOverlay.jsx
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
var STATUS_GLYPH = {
  planned: "\u25CB",
  active: "\u25B6",
  waiting: "\u2161",
  blocked: "\xD7",
  rerouting: "\u21BB",
  completed: "\u2713"
};
var PHASE_LABEL = {
  completed: "\uD1B5\uACFC \uC644\uB8CC",
  current: "\uD604\uC7AC \uAD6C\uAC04",
  upcoming: "\uC608\uC815 \uAD6C\uAC04"
};
var CONDITION_LABEL = {
  normal: "\uC815\uC0C1",
  waiting: "\uB300\uAE30",
  blocked: "\uCC28\uB2E8",
  conflict: "\uCDA9\uB3CC"
};
var CONDITION_GLYPH = {
  waiting: "\u2161",
  blocked: "\xD7",
  conflict: "!"
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
function normalizedProgress(route) {
  if (!route?.progress) return void 0;
  return {
    segmentId: route.progress.segmentId,
    fraction: Math.max(0, Math.min(1, Number(route.progress.fraction) || 0)),
    position: finitePoint(route.progress.position) ? route.progress.position : void 0
  };
}
function statusTone(status) {
  if (status === "waiting" || status === "rerouting") return "var(--color-semantic-status-cautionary-foreground)";
  if (status === "blocked") return "var(--color-semantic-status-negative-foreground)";
  if (status === "completed") return "var(--color-semantic-status-positive-foreground)";
  if (status === "active") return "var(--color-semantic-primary-normal)";
  return "var(--viewer-muted, var(--color-semantic-label-alternative))";
}
function segmentTone(segment, invalid) {
  if (invalid || segment.condition === "blocked" || segment.condition === "conflict") {
    return "var(--color-semantic-status-negative-foreground)";
  }
  if (segment.condition === "waiting") return "var(--color-semantic-status-cautionary-foreground)";
  if (segment.phase === "completed") return "var(--color-semantic-status-positive-foreground)";
  if (segment.phase === "current") return "var(--color-semantic-primary-normal)";
  return "var(--viewer-muted, var(--color-semantic-label-alternative))";
}
function segmentDash(segment) {
  if (segment.condition === "waiting") return "10 3 2 3";
  if (segment.condition === "blocked") return "1 5";
  if (segment.condition === "conflict") return "5 3 1 3";
  if (segment.phase === "completed") return "7 4";
  if (segment.phase === "upcoming") return "2 6";
  return void 0;
}
function routeAccessibleName(route, progress, selected, invalid, stale) {
  const parts = [
    route.label ?? `\uACBD\uB85C ${route.id}`,
    STATUS_LABEL[route.status] ?? route.status
  ];
  if (progress) parts.push(`\uD604\uC7AC \uAD6C\uAC04 ${Math.round(progress.fraction * 100)}%`);
  if (selected) parts.push("\uC120\uD0DD\uB428");
  if (invalid) parts.push("\uB370\uC774\uD130 \uC624\uB958");
  if (stale) parts.push("\uC624\uB798\uB41C \uB370\uC774\uD130");
  return parts.join(", ");
}
function RouteOverlay({
  route,
  activeMapId,
  selectedSegmentId,
  viewportScale = 1,
  selected = false,
  focused = false,
  disabled = false,
  invalid = false,
  stale = false,
  showLabel = true,
  onActivate,
  "aria-label": ariaLabel,
  tabIndex,
  onFocus,
  onBlur,
  style,
  ...rest
}) {
  const [focusedSegment, setFocusedSegment] = React.useState(null);
  const [hasRootFocus, setHasRootFocus] = React.useState(false);
  const scale = Number.isFinite(viewportScale) && viewportScale > 0 ? viewportScale : 1;
  const inverseScale = 1 / scale;
  const progress = normalizedProgress(route);
  const interactive = typeof onActivate === "function";
  const visibleSegments = (route?.segments ?? []).filter((segment) => segment.mapId === activeMapId);
  const baseAccessibleName = ariaLabel ?? routeAccessibleName(route, progress, selected, invalid, stale);
  const activate = (segmentId, event) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onActivate?.({ routeId: route.id, segmentId }, event);
  };
  const handleKeyDown = (segmentId, event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activate(segmentId, event);
  };
  const progressSegment = progress ? visibleSegments.find((segment) => segment.id === progress.segmentId) : void 0;
  const statusSegment = progressSegment ?? visibleSegments.find((segment) => segment.phase === "current") ?? visibleSegments[0];
  const statusPoints = statusSegment?.points?.filter(finitePoint) ?? [];
  const statusPoint = progressSegment && progress?.position ? progress.position : pointAlong(statusPoints, progressSegment ? progress.fraction : 0.18);
  return /* @__PURE__ */ jsxs(
    "g",
    {
      ...rest,
      "data-lk-route-overlay": "",
      "data-route-id": route?.id,
      "data-active-map-id": activeMapId,
      "data-route-status": route?.status,
      "data-progress-segment-id": progress?.segmentId,
      "data-progress-fraction": progress?.fraction,
      "data-selected": selected ? "true" : "false",
      "data-focused": focused || hasRootFocus || focusedSegment != null ? "true" : "false",
      "data-disabled": disabled ? "true" : "false",
      "data-invalid": invalid ? "true" : "false",
      "data-stale": stale ? "true" : "false",
      role: interactive ? "group" : "img",
      tabIndex: !interactive ? tabIndex : void 0,
      focusable: !interactive && tabIndex != null ? "true" : void 0,
      "aria-label": baseAccessibleName,
      "aria-disabled": interactive && disabled ? true : void 0,
      "aria-invalid": invalid || void 0,
      onFocus: !interactive ? (event) => {
        setHasRootFocus(true);
        onFocus?.(event);
      } : void 0,
      onBlur: !interactive ? (event) => {
        setHasRootFocus(false);
        onBlur?.(event);
      } : void 0,
      style: { opacity: disabled ? 0.42 : stale ? 0.7 : 1, outline: "none", ...style },
      children: [
        visibleSegments.map((segment) => {
          const points = (segment.points ?? []).filter(finitePoint);
          const pathData = pathFromPoints(points);
          const midpoint = pointAlong(points, 0.5);
          const directionPoint = pointAlong(points, 0.7);
          const segmentSelected = selected || segment.id === selectedSegmentId;
          const segmentFocused = focused || hasRootFocus || focusedSegment === segment.id;
          const condition = ["normal", "waiting", "blocked", "conflict"].includes(segment.condition) ? segment.condition : "normal";
          const phase = ["completed", "current", "upcoming"].includes(segment.phase) ? segment.phase : "upcoming";
          const normalizedSegment = { ...segment, condition, phase };
          const tone = segmentTone(normalizedSegment, invalid);
          const dash = segmentDash(normalizedSegment);
          const conditionGlyph = CONDITION_GLYPH[condition];
          const segmentName = [
            segment.label ?? `\uAD6C\uAC04 ${segment.id}`,
            PHASE_LABEL[phase],
            CONDITION_LABEL[condition],
            segment.laneIds?.length ? `graph lane ${segment.laneIds.length}\uAC1C` : null,
            segment.entryTransitionId ? `\uC9C4\uC785 \uC804\uD658 ${segment.entryTransitionId}` : null,
            segment.exitTransitionId ? `\uC774\uD0C8 \uC804\uD658 ${segment.exitTransitionId}` : null
          ].filter(Boolean).join(", ");
          return /* @__PURE__ */ jsxs(
            "g",
            {
              "data-route-segment": "",
              "data-segment-id": segment.id,
              "data-map-id": segment.mapId,
              "data-phase": phase,
              "data-condition": condition,
              "data-selected": segmentSelected ? "true" : "false",
              "data-focused": segmentFocused ? "true" : "false",
              "data-disabled": disabled ? "true" : "false",
              "data-invalid": invalid ? "true" : "false",
              "data-stale": stale ? "true" : "false",
              role: interactive ? "button" : void 0,
              tabIndex: interactive ? disabled ? -1 : tabIndex ?? 0 : void 0,
              focusable: interactive ? "true" : void 0,
              "aria-label": interactive ? `${baseAccessibleName}, ${segmentName}` : void 0,
              "aria-pressed": interactive ? segmentSelected : void 0,
              "aria-disabled": interactive && disabled ? true : void 0,
              "aria-invalid": invalid || void 0,
              onClick: interactive ? (event) => activate(segment.id, event) : void 0,
              onKeyDown: interactive ? (event) => handleKeyDown(segment.id, event) : void 0,
              onFocus: (event) => {
                setFocusedSegment(segment.id);
                onFocus?.(event);
              },
              onBlur: (event) => {
                setFocusedSegment((current) => current === segment.id ? null : current);
                onBlur?.(event);
              },
              style: { cursor: interactive && !disabled ? "pointer" : "default" },
              children: [
                segmentFocused && pathData && /* @__PURE__ */ jsx(
                  "path",
                  {
                    "data-route-focus-ring": "",
                    d: pathData,
                    fill: "none",
                    stroke: "var(--color-semantic-focus-indicator)",
                    strokeWidth: "11",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    vectorEffect: "non-scaling-stroke",
                    pointerEvents: "none"
                  }
                ),
                segmentSelected && pathData && /* @__PURE__ */ jsx(
                  "path",
                  {
                    "data-route-selection-halo": "",
                    d: pathData,
                    fill: "none",
                    stroke: "var(--color-semantic-primary-normal)",
                    strokeWidth: "8",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    opacity: "0.24",
                    vectorEffect: "non-scaling-stroke",
                    pointerEvents: "none"
                  }
                ),
                pathData && /* @__PURE__ */ jsx(
                  "path",
                  {
                    "data-route-path": "",
                    d: pathData,
                    fill: "none",
                    stroke: tone,
                    strokeWidth: phase === "current" || segmentSelected ? 4 : 3,
                    strokeDasharray: dash,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    vectorEffect: "non-scaling-stroke",
                    pointerEvents: "none"
                  }
                ),
                pathData && interactive && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      "data-route-hit-target": "",
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
                      "data-route-hit-target-core": "",
                      "data-screen-target-size": "24",
                      cx: midpoint.x,
                      cy: midpoint.y,
                      r: 17 * inverseScale,
                      fill: "transparent",
                      pointerEvents: "all"
                    }
                  )
                ] }),
                pathData && /* @__PURE__ */ jsx(
                  "path",
                  {
                    "data-route-direction": "",
                    d: "M -5 -4 L 5 0 L -5 4 Z",
                    transform: `translate(${directionPoint.x} ${directionPoint.y}) rotate(${directionPoint.angle}) scale(${inverseScale})`,
                    fill: tone,
                    stroke: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))",
                    strokeWidth: "1",
                    strokeLinejoin: "round",
                    vectorEffect: "non-scaling-stroke",
                    pointerEvents: "none"
                  }
                ),
                conditionGlyph && /* @__PURE__ */ jsxs(
                  "g",
                  {
                    "data-route-condition-glyph": condition,
                    transform: `translate(${midpoint.x} ${midpoint.y}) scale(${inverseScale})`,
                    "aria-hidden": "true",
                    pointerEvents: "none",
                    children: [
                      /* @__PURE__ */ jsx(
                        "circle",
                        {
                          r: "7",
                          fill: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))",
                          stroke: tone,
                          strokeWidth: "1.5",
                          vectorEffect: "non-scaling-stroke"
                        }
                      ),
                      /* @__PURE__ */ jsx("text", { x: "0", y: "3", textAnchor: "middle", fill: tone, fontFamily: "var(--font-sans)", fontSize: "10", fontWeight: "var(--fw-bold)", children: conditionGlyph })
                    ]
                  }
                ),
                [
                  segment.entryTransitionId && points[0] ? { kind: "entry", id: segment.entryTransitionId, point: points[0] } : null,
                  segment.exitTransitionId && points[points.length - 1] ? { kind: "exit", id: segment.exitTransitionId, point: points[points.length - 1] } : null
                ].filter(Boolean).map((transition) => /* @__PURE__ */ jsxs(
                  "g",
                  {
                    "data-route-transition": transition.kind,
                    "data-transition-id": transition.id,
                    transform: `translate(${transition.point.x} ${transition.point.y}) scale(${inverseScale})`,
                    "aria-hidden": "true",
                    pointerEvents: "none",
                    children: [
                      /* @__PURE__ */ jsx(
                        "circle",
                        {
                          r: "6",
                          fill: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))",
                          stroke: "var(--viewer-muted, var(--color-semantic-label-neutral))",
                          strokeWidth: "1.5",
                          vectorEffect: "non-scaling-stroke"
                        }
                      ),
                      /* @__PURE__ */ jsx("text", { x: "0", y: "2.5", textAnchor: "middle", fill: "var(--viewer-foreground, var(--color-semantic-label-strong))", fontFamily: "var(--font-sans)", fontSize: "7", fontWeight: "var(--fw-bold)", children: "T" })
                    ]
                  },
                  transition.kind
                )),
                showLabel && segment.label && /* @__PURE__ */ jsx(
                  "text",
                  {
                    "data-route-segment-label": "",
                    x: "0",
                    y: "-12",
                    textAnchor: "middle",
                    transform: `translate(${midpoint.x} ${midpoint.y}) scale(${inverseScale})`,
                    fill: "var(--viewer-foreground, var(--color-semantic-label-strong))",
                    fontFamily: "var(--font-sans)",
                    fontSize: "9",
                    fontWeight: "var(--fw-semibold)",
                    "aria-hidden": "true",
                    pointerEvents: "none",
                    children: segment.label
                  }
                )
              ]
            },
            segment.id
          );
        }),
        statusPoints.length >= 2 && [
          invalid ? { state: "invalid", glyph: "!", ratio: 0.82, tone: "var(--color-semantic-status-negative-foreground)" } : null,
          stale ? { state: "stale", glyph: "~", ratio: invalid ? 0.9 : 0.82, tone: "var(--viewer-muted, var(--color-semantic-label-alternative))" } : null
        ].filter(Boolean).map((item) => {
          const point = pointAlong(statusPoints, item.ratio);
          return /* @__PURE__ */ jsxs(
            "g",
            {
              "data-route-overlay-state": item.state,
              transform: `translate(${point.x} ${point.y}) scale(${inverseScale})`,
              "aria-hidden": "true",
              pointerEvents: "none",
              children: [
                /* @__PURE__ */ jsx(
                  "circle",
                  {
                    r: "7",
                    fill: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))",
                    stroke: item.tone,
                    strokeWidth: "1.5",
                    strokeDasharray: item.state === "stale" ? "2 2" : void 0,
                    vectorEffect: "non-scaling-stroke"
                  }
                ),
                /* @__PURE__ */ jsx("text", { x: "0", y: "3", textAnchor: "middle", fill: item.tone, fontFamily: "var(--font-sans)", fontSize: "10", fontWeight: "var(--fw-bold)", children: item.glyph })
              ]
            },
            item.state
          );
        }),
        progressSegment && statusPoints.length >= 2 && /* @__PURE__ */ jsxs(
          "g",
          {
            "data-route-progress-marker": "",
            "data-current-segment-id": progressSegment.id,
            transform: `translate(${statusPoint.x} ${statusPoint.y}) scale(${inverseScale})`,
            "aria-hidden": "true",
            pointerEvents: "none",
            children: [
              /* @__PURE__ */ jsx(
                "circle",
                {
                  r: "8",
                  fill: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))",
                  stroke: statusTone(route.status),
                  strokeWidth: "2",
                  vectorEffect: "non-scaling-stroke"
                }
              ),
              /* @__PURE__ */ jsx(
                "text",
                {
                  x: "0",
                  y: "3",
                  textAnchor: "middle",
                  fill: statusTone(route.status),
                  fontFamily: "var(--font-sans)",
                  fontSize: "9",
                  fontWeight: "var(--fw-bold)",
                  children: STATUS_GLYPH[route.status] ?? "\u2022"
                }
              ),
              showLabel && /* @__PURE__ */ jsxs(
                "text",
                {
                  x: "0",
                  y: "19",
                  textAnchor: "middle",
                  fill: "var(--viewer-foreground, var(--color-semantic-label-strong))",
                  fontFamily: "var(--font-sans)",
                  fontSize: "9",
                  fontWeight: "var(--fw-bold)",
                  children: [
                    "\uD604\uC7AC ",
                    Math.round(progress.fraction * 100),
                    "%"
                  ]
                }
              )
            ]
          }
        ),
        !progressSegment && statusSegment && statusPoints.length >= 2 && /* @__PURE__ */ jsxs(
          "g",
          {
            "data-route-status-marker": "",
            transform: `translate(${statusPoint.x} ${statusPoint.y}) scale(${inverseScale})`,
            "aria-hidden": "true",
            pointerEvents: "none",
            children: [
              /* @__PURE__ */ jsx(
                "circle",
                {
                  r: "8",
                  fill: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))",
                  stroke: statusTone(route.status),
                  strokeWidth: "2",
                  vectorEffect: "non-scaling-stroke"
                }
              ),
              /* @__PURE__ */ jsx("text", { x: "0", y: "3", textAnchor: "middle", fill: statusTone(route.status), fontFamily: "var(--font-sans)", fontSize: "9", fontWeight: "var(--fw-bold)", children: STATUS_GLYPH[route.status] ?? "\u2022" })
            ]
          }
        )
      ]
    }
  );
}

export {
  RouteOverlay
};
//# sourceMappingURL=chunk-AJE43VYD.js.map