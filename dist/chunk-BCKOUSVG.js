"use client";

// components/robotics/TrajectoryOverlay.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
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
function statusTone(status, invalid) {
  if (invalid || status === "blocked") return "var(--color-semantic-status-negative-foreground)";
  if (status === "waiting" || status === "rerouting") return "var(--color-semantic-status-cautionary-foreground)";
  if (status === "completed") return "var(--color-semantic-status-positive-foreground)";
  if (status === "active") return "var(--color-semantic-primary-normal)";
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
function trajectoryAccessibleName(trajectory, selected, invalid, stale) {
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
  onActivate,
  tabIndex,
  onFocus,
  onBlur,
  "aria-label": ariaLabel,
  style,
  ...rest
}) {
  const [hasDomFocus, setHasDomFocus] = React.useState(false);
  const scale = Number.isFinite(viewportScale) && viewportScale > 0 ? viewportScale : 1;
  const inverseScale = 1 / scale;
  const interactive = typeof onActivate === "function";
  const focusVisible = focused || hasDomFocus;
  const samples = trajectory?.samples ?? [];
  const points = samples.map((sample) => sample.position).filter(finitePoint);
  const pathData = pathFromPoints(points);
  const currentIndex = Number.isInteger(trajectory?.currentSampleIndex) && trajectory.currentSampleIndex >= 0 && trajectory.currentSampleIndex < samples.length ? trajectory.currentSampleIndex : void 0;
  const currentSample = currentIndex == null ? void 0 : samples[currentIndex];
  const markerPoint = finitePoint(currentSample?.position) ? currentSample.position : pointAlong(points, 0.5);
  const statePoint = pointAlong(points, 0.12);
  const headingDegrees = Number.isFinite(currentSample?.headingRad) ? currentSample.headingRad * 180 / Math.PI : void 0;
  const tone = statusTone(trajectory?.status, invalid);
  const dash = statusDash(trajectory?.status);
  const foreground = "var(--viewer-foreground, var(--color-semantic-label-strong))";
  const surface = "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))";
  const activate = (event) => {
    if (disabled || !interactive) return;
    onActivate(trajectory.id, event);
  };
  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activate(event);
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
      "data-selected": selected ? "true" : "false",
      "data-focused": focusVisible ? "true" : "false",
      "data-disabled": disabled ? "true" : "false",
      "data-invalid": invalid ? "true" : "false",
      "data-stale": stale ? "true" : "false",
      role: interactive ? "button" : "img",
      tabIndex: interactive ? disabled ? -1 : tabIndex ?? 0 : tabIndex,
      focusable: interactive ? "true" : void 0,
      "aria-label": ariaLabel ?? trajectoryAccessibleName(trajectory, selected, invalid, stale),
      "aria-pressed": interactive ? selected : void 0,
      "aria-disabled": interactive && disabled ? true : void 0,
      "aria-invalid": invalid || void 0,
      onClick: activate,
      onKeyDown: handleKeyDown,
      onFocus: (event) => {
        setHasDomFocus(true);
        onFocus?.(event);
      },
      onBlur: (event) => {
        setHasDomFocus(false);
        onBlur?.(event);
      },
      style: {
        cursor: disabled ? "not-allowed" : interactive ? "pointer" : "default",
        opacity: disabled ? 0.42 : stale ? 0.76 : 1,
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
            "data-trajectory-selected-indicator": "",
            d: pathData,
            fill: "none",
            stroke: "var(--color-semantic-primary-normal)",
            strokeWidth: "7",
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
            "data-trajectory-path": "",
            d: pathData,
            fill: "none",
            stroke: tone,
            strokeWidth: selected || trajectory?.status === "active" ? 3.5 : 2.5,
            strokeDasharray: dash,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none"
          }
        ),
        pathData && interactive && /* @__PURE__ */ jsx(
          "path",
          {
            "data-trajectory-hit-target": "",
            "data-screen-target-size": "24",
            d: pathData,
            fill: "none",
            stroke: "transparent",
            strokeWidth: "24",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "stroke"
          }
        ),
        pathData && currentSample && /* @__PURE__ */ jsxs(
          "g",
          {
            "data-trajectory-current-marker": "",
            transform: `translate(${markerPoint.x} ${markerPoint.y}) scale(${inverseScale})`,
            "aria-hidden": "true",
            pointerEvents: "none",
            children: [
              /* @__PURE__ */ jsx(
                "circle",
                {
                  r: "8",
                  fill: surface,
                  stroke: tone,
                  strokeWidth: "2",
                  vectorEffect: "non-scaling-stroke"
                }
              ),
              headingDegrees == null ? /* @__PURE__ */ jsx("circle", { r: "3", fill: tone }) : /* @__PURE__ */ jsx(
                "path",
                {
                  "data-trajectory-current-heading": "",
                  d: "M -5 -4 L 5 0 L -5 4 Z",
                  transform: `rotate(${headingDegrees})`,
                  fill: tone,
                  stroke: surface,
                  strokeWidth: "1",
                  strokeLinejoin: "round",
                  vectorEffect: "non-scaling-stroke"
                }
              )
            ]
          }
        ),
        pathData && /* @__PURE__ */ jsxs(
          "g",
          {
            "data-trajectory-status-marker": "",
            "data-trajectory-status-glyph": trajectory?.status,
            transform: `translate(${statePoint.x} ${statePoint.y}) scale(${inverseScale})`,
            "aria-hidden": "true",
            pointerEvents: "none",
            children: [
              /* @__PURE__ */ jsx(
                "circle",
                {
                  r: "7",
                  fill: surface,
                  stroke: tone,
                  strokeWidth: "1.5",
                  vectorEffect: "non-scaling-stroke"
                }
              ),
              /* @__PURE__ */ jsx("text", { x: "0", y: "3", textAnchor: "middle", fill: tone, fontFamily: "var(--font-sans)", fontSize: "9", fontWeight: "var(--fw-bold)", children: STATUS_GLYPH[trajectory?.status] ?? "\u2022" })
            ]
          }
        ),
        showLabel && trajectory?.label && pathData && /* @__PURE__ */ jsx(
          "text",
          {
            "data-trajectory-label": "",
            x: "0",
            y: "-13",
            textAnchor: "middle",
            transform: `translate(${markerPoint.x} ${markerPoint.y}) scale(${inverseScale})`,
            fill: foreground,
            stroke: surface,
            strokeWidth: "3",
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
      ]
    }
  );
}

export {
  TrajectoryOverlay
};
//# sourceMappingURL=chunk-BCKOUSVG.js.map