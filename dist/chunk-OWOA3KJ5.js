"use client";
import {
  NavigationStateGlyph
} from "./chunk-KOZEMOWF.js";
import {
  isFocusVisibleTarget
} from "./chunk-7NLYHYLX.js";
import {
  NavigationAnnotationBlock,
  annotationPriority,
  useNavigationObstacles
} from "./chunk-2VOHTLP5.js";

// components/robotics/SpatialRegion.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var CATEGORY_PATTERNS = {
  behavior: "diagonal",
  facility: "grid",
  terrain: "contour"
};
var BEHAVIOR_LABELS = {
  "keep-out": "\uC9C4\uC785 \uAE08\uC9C0",
  "speed-limit": "\uC18D\uB3C4 \uC81C\uD55C",
  preferred: "\uC6B0\uC120 \uD1B5\uD589",
  "operation-area": "\uC791\uC5C5 \uAD6C\uC5ED"
};
var FACILITY_LABELS = {
  "lift-cabin": "\uC2B9\uAC15\uAE30 \uAC1D\uC2E4",
  "lift-lobby": "\uC2B9\uAC15\uAE30 \uB85C\uBE44",
  "door-area": "\uBB38 \uC8FC\uBCC0",
  "dock-area": "\uB3C4\uD0B9 \uAD6C\uC5ED",
  "charger-area": "\uCDA9\uC804 \uAD6C\uC5ED",
  custom: "\uC0AC\uC6A9\uC790 \uC815\uC758 \uC124\uBE44"
};
var TERRAIN_LABELS = {
  slope: "\uACBD\uC0AC \uAD6C\uC5ED",
  rough: "\uAC70\uCE5C \uB178\uBA74",
  clearance: "\uC5EC\uC720 \uD3ED \uC81C\uD55C",
  custom: "\uC0AC\uC6A9\uC790 \uC815\uC758 \uC9C0\uD615"
};
var TRAVERSABILITY_LABELS = {
  allowed: "\uD1B5\uD589 \uAC00\uB2A5",
  restricted: "\uC81C\uD55C \uD1B5\uD589",
  blocked: "\uD1B5\uD589 \uBD88\uAC00",
  unknown: "\uD1B5\uD589 \uC5EC\uBD80 \uBBF8\uD655\uC778"
};
function safeScale(viewportScale) {
  const scale = Number(viewportScale);
  return Number.isFinite(scale) && scale > 0 ? scale : 1;
}
function polygonPoints(shape) {
  return shape.points.map((point) => `${point.x},${point.y}`).join(" ");
}
function finitePoint(point) {
  return point && Number.isFinite(point.x) && Number.isFinite(point.y);
}
function distanceToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) return Math.hypot(point.x - start.x, point.y - start.y);
  const ratio = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(point.x - (start.x + ratio * dx), point.y - (start.y + ratio * dy));
}
function pointInPolygon(point, points) {
  let inside = false;
  for (let index = 0, previous = points.length - 1; index < points.length; previous = index, index += 1) {
    const start = points[previous];
    const end = points[index];
    if (distanceToSegment(point, start, end) < 1e-4) return true;
    const crosses = end.y > point.y !== start.y > point.y && point.x < (start.x - end.x) * (point.y - end.y) / (start.y - end.y) + end.x;
    if (crosses) inside = !inside;
  }
  return inside;
}
function polygonCentroid(points) {
  let areaTwice = 0;
  let x = 0;
  let y = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    const cross = current.x * next.y - next.x * current.y;
    areaTwice += cross;
    x += (current.x + next.x) * cross;
    y += (current.y + next.y) * cross;
  }
  if (Math.abs(areaTwice) < 1e-4) return void 0;
  return { x: x / (3 * areaTwice), y: y / (3 * areaTwice) };
}
function polygonClearance(point, points) {
  let clearance = Infinity;
  for (let index = 0; index < points.length; index += 1) {
    clearance = Math.min(clearance, distanceToSegment(point, points[index], points[(index + 1) % points.length]));
  }
  return clearance;
}
function scanlineCandidates(points, minY, maxY) {
  const candidates = [];
  const height = maxY - minY;
  for (let sample = 0; sample < 17; sample += 1) {
    const y = height === 0 ? minY : minY + (sample + 0.5) / 17 * height;
    const intersections = [];
    for (let index = 0; index < points.length; index += 1) {
      const start = points[index];
      const end = points[(index + 1) % points.length];
      if (start.y > y === end.y > y) continue;
      intersections.push(start.x + (y - start.y) * (end.x - start.x) / (end.y - start.y));
    }
    intersections.sort((a, b) => a - b);
    for (let index = 0; index + 1 < intersections.length; index += 2) {
      candidates.push({ x: (intersections[index] + intersections[index + 1]) / 2, y });
    }
  }
  return candidates;
}
function pointOnSurface(shape) {
  if (shape.kind === "circle") return shape.center;
  const points = (shape.points ?? []).filter(finitePoint);
  if (points.length === 0) return { x: 0, y: 0 };
  if (points.length < 3) return points[0];
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const average = points.reduce(
    (next, point) => ({ x: next.x + point.x / points.length, y: next.y + point.y / points.length }),
    { x: 0, y: 0 }
  );
  const candidates = [
    polygonCentroid(points),
    { x: (minX + maxX) / 2, y: (minY + maxY) / 2 },
    average,
    ...scanlineCandidates(points, minY, maxY)
  ].filter((point) => point && pointInPolygon(point, points));
  if (candidates.length === 0) return points[0];
  return candidates.reduce((best, candidate) => polygonClearance(candidate, points) > polygonClearance(best, points) ? candidate : best);
}
function RegionShape({ shape, ...props }) {
  if (shape.kind === "circle") {
    return /* @__PURE__ */ jsx(
      "circle",
      {
        cx: shape.center.x,
        cy: shape.center.y,
        r: shape.radius,
        ...props
      }
    );
  }
  return /* @__PURE__ */ jsx("polygon", { points: polygonPoints(shape), ...props });
}
function patternContent(pattern, stroke) {
  if (pattern === "grid") {
    return /* @__PURE__ */ jsx(
      "path",
      {
        d: "M0 0H10M0 0V10",
        fill: "none",
        stroke,
        strokeOpacity: "0.42",
        strokeWidth: "1",
        vectorEffect: "non-scaling-stroke"
      }
    );
  }
  if (pattern === "contour") {
    return /* @__PURE__ */ jsx(
      "path",
      {
        d: "M-2 3C1 1 4 1 7 3S13 5 16 3M-2 9C1 7 4 7 7 9S13 11 16 9",
        fill: "none",
        stroke,
        strokeOpacity: "0.48",
        strokeWidth: "1",
        vectorEffect: "non-scaling-stroke"
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "path",
    {
      d: "M-3 12L12-3M3 15L15 3",
      fill: "none",
      stroke,
      strokeOpacity: "0.5",
      strokeWidth: "1",
      vectorEffect: "non-scaling-stroke"
    }
  );
}
function regionKind(region) {
  return region.category === "behavior" ? region.rule.kind : region.kind;
}
function strokeForRegion(region, { disabled, invalid }) {
  if (invalid) return "var(--viewer-danger, var(--color-semantic-status-negative-foreground))";
  if (disabled) return "var(--viewer-muted, var(--color-semantic-label-alternative))";
  if (region.category === "behavior") {
    if (region.rule.kind === "keep-out") return "var(--viewer-danger, var(--color-semantic-status-negative-foreground))";
    if (region.rule.kind === "speed-limit") return "var(--viewer-warning, var(--color-semantic-status-cautionary-foreground))";
    return "var(--viewer-accent, var(--color-semantic-primary-normal))";
  }
  if (region.category === "terrain") {
    if (region.traversability === "blocked") return "var(--viewer-danger, var(--color-semantic-status-negative-foreground))";
    if (region.traversability === "restricted") return "var(--viewer-warning, var(--color-semantic-status-cautionary-foreground))";
    if (region.traversability === "unknown") return "var(--viewer-muted, var(--color-semantic-label-alternative))";
  }
  return "var(--viewer-foreground, var(--color-semantic-label-neutral))";
}
function gradeLabel(grade) {
  if (!grade) return void 0;
  const unit = grade.unit === "percent" ? "%" : "\xB0";
  const direction = Number.isFinite(grade.directionRad) ? `\uBC29\uD5A5 ${grade.directionRad} rad` : void 0;
  return [`${grade.value}${unit}`, direction].filter(Boolean).join(" \xB7 ");
}
function semanticLabel(region) {
  if (region.category === "behavior") {
    const kind = region.rule.kind === "custom" ? region.rule.label : BEHAVIOR_LABELS[region.rule.kind];
    const detail = region.rule.kind === "speed-limit" ? `${region.rule.speedLimitMps} m/s` : region.rule.kind === "operation-area" ? region.rule.operation : void 0;
    return [kind, detail, region.label].filter(Boolean).join(" \xB7 ");
  }
  if (region.category === "facility") {
    return [FACILITY_LABELS[region.kind], region.label].filter(Boolean).join(" \xB7 ");
  }
  return [
    TERRAIN_LABELS[region.kind],
    gradeLabel(region.grade),
    TRAVERSABILITY_LABELS[region.traversability],
    region.label
  ].filter(Boolean).join(" \xB7 ");
}
function SpatialRegion({
  region,
  hidden = false,
  viewportScale = 1,
  selected = false,
  focused = false,
  disabled = false,
  invalid = false,
  stale = false,
  showLabel = true,
  onActivate,
  style,
  role,
  tabIndex,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  onFocus,
  onBlur,
  onMouseDown,
  ...rest
}) {
  const reactId = React.useId();
  const [focusVisible, setFocusVisible] = React.useState(false);
  const obstacle = useNavigationObstacles();
  const kind = regionKind(region);
  const pattern = CATEGORY_PATTERNS[region.category] ?? CATEGORY_PATTERNS.behavior;
  const safeId = `${region.id}-${reactId}`.replace(/[^a-zA-Z0-9_-]/g, "");
  const patternId = `lk-spatial-region-${safeId}`;
  const anchor = pointOnSurface(region.shape);
  const inverseScale = 1 / safeScale(viewportScale);
  const interactive = typeof onActivate === "function";
  const pointerOnly = ariaHidden === true || ariaHidden === "true";
  const activeFocus = !pointerOnly && (focused || focusVisible);
  const computedLabel = [
    semanticLabel(region),
    selected ? "\uC120\uD0DD\uB428" : void 0,
    activeFocus ? "\uD3EC\uCEE4\uC2A4\uB428" : void 0,
    invalid ? "\uC798\uBABB\uB41C \uC601\uC5ED" : void 0,
    stale ? "\uB370\uC774\uD130 \uC9C0\uC5F0" : void 0,
    disabled ? "\uC120\uD0DD\uD560 \uC218 \uC5C6\uC74C" : void 0
  ].filter(Boolean).join(" \xB7 ");
  const stroke = strokeForRegion(region, { disabled, invalid });
  const unknownTerrain = region.category === "terrain" && region.traversability === "unknown";
  const stateDash = invalid ? "4 3" : stale ? "2 4" : unknownTerrain ? "1 3" : void 0;
  if (hidden) return null;
  const activate = (event) => {
    if (disabled || !interactive) return;
    onActivate(region.id, event);
  };
  const handleKeyDown = (event) => {
    if (!pointerOnly) setFocusVisible(true);
    if (pointerOnly || disabled || !interactive || event.repeat) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activate(event);
  };
  const patternSize = pattern === "grid" ? 10 : pattern === "contour" ? 12 : 9;
  return /* @__PURE__ */ jsxs(
    "g",
    {
      ...rest,
      role: pointerOnly ? void 0 : role ?? (interactive ? "button" : "img"),
      tabIndex: pointerOnly ? void 0 : interactive ? disabled ? -1 : tabIndex ?? 0 : tabIndex,
      focusable: pointerOnly ? "false" : interactive && !disabled ? "true" : void 0,
      "aria-hidden": pointerOnly || void 0,
      "aria-label": pointerOnly ? void 0 : ariaLabel ?? computedLabel,
      "aria-pressed": !pointerOnly && interactive ? selected : void 0,
      "aria-disabled": !pointerOnly && interactive && disabled ? true : void 0,
      "aria-invalid": !pointerOnly && invalid ? true : void 0,
      "data-lds-spatial-region": "",
      "data-region-id": region.id,
      "data-map-id": region.mapId,
      "data-region-category": region.category,
      "data-region-kind": kind,
      "data-region-pattern": pattern,
      "data-traversability": region.category === "terrain" ? region.traversability : void 0,
      "data-selected": selected || void 0,
      "data-focused": activeFocus || void 0,
      "data-invalid": invalid || void 0,
      "data-stale": stale || void 0,
      "data-disabled": disabled || void 0,
      onClick: activate,
      onKeyDown: handleKeyDown,
      onMouseDown: (event) => {
        if (pointerOnly) event.preventDefault();
        onMouseDown?.(event);
      },
      onFocus: (event) => {
        if (!pointerOnly) setFocusVisible(isFocusVisibleTarget(event.currentTarget));
        onFocus?.(event);
      },
      onBlur: (event) => {
        setFocusVisible(false);
        onBlur?.(event);
      },
      style: {
        cursor: interactive && !disabled ? "pointer" : disabled ? "not-allowed" : "default",
        opacity: disabled ? 0.45 : stale ? 0.76 : 1,
        outline: "none",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx(
          "pattern",
          {
            id: patternId,
            width: patternSize,
            height: patternSize,
            patternUnits: "userSpaceOnUse",
            "data-region-pattern-definition": pattern,
            children: patternContent(pattern, stroke)
          }
        ) }),
        activeFocus && /* @__PURE__ */ jsx(
          RegionShape,
          {
            shape: region.shape,
            fill: "none",
            stroke: "var(--color-semantic-focus-indicator)",
            strokeWidth: "6.5",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none",
            "data-region-focus-ring": ""
          }
        ),
        selected && /* @__PURE__ */ jsx(
          RegionShape,
          {
            shape: region.shape,
            fill: "none",
            stroke: "var(--viewer-accent, var(--color-semantic-primary-normal))",
            strokeWidth: "3.5",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none",
            "data-region-selection-ring": ""
          }
        ),
        /* @__PURE__ */ jsx(
          RegionShape,
          {
            shape: region.shape,
            fill: `url(#${patternId})`,
            stroke,
            strokeWidth: "1.5",
            strokeDasharray: stateDash,
            vectorEffect: "non-scaling-stroke",
            "data-region-geometry": region.shape.kind
          }
        ),
        (invalid || stale) && /* @__PURE__ */ jsxs(
          "g",
          {
            ...obstacle(`region:${region.id}:states`),
            transform: `translate(${anchor.x} ${anchor.y}) scale(${inverseScale})`,
            pointerEvents: "none",
            "data-region-state-anchor": "",
            "data-region-anchor-x": anchor.x,
            "data-region-anchor-y": anchor.y,
            children: [
              invalid && /* @__PURE__ */ jsxs("g", { transform: "translate(0 -18)", "data-region-invalid-mark": "", children: [
                /* @__PURE__ */ jsx("circle", { r: "7", fill: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))", stroke: "var(--viewer-danger, var(--color-semantic-status-negative-foreground))", strokeWidth: "1.5", vectorEffect: "non-scaling-stroke" }),
                /* @__PURE__ */ jsx(NavigationStateGlyph, { kind: "invalid", size: 10.5, color: "var(--viewer-foreground, var(--color-semantic-label-strong))" })
              ] }),
              stale && /* @__PURE__ */ jsxs("g", { transform: `translate(0 ${invalid ? 18 : -18})`, "data-region-stale-mark": "", children: [
                /* @__PURE__ */ jsx("circle", { r: "7", fill: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))", stroke: "var(--viewer-muted, var(--color-semantic-label-alternative))", strokeWidth: "1.5", strokeDasharray: "2 2", vectorEffect: "non-scaling-stroke" }),
                /* @__PURE__ */ jsx(NavigationStateGlyph, { kind: "stale", size: 10.5, color: "var(--viewer-foreground, var(--color-semantic-label-strong))" })
              ] })
            ]
          }
        ),
        showLabel && /* @__PURE__ */ jsx(
          NavigationAnnotationBlock,
          {
            id: `region:${region.id}:label`,
            kind: "region-label",
            anchor,
            priority: annotationPriority({
              selected,
              focused: activeFocus,
              alarm: invalid
            }),
            children: /* @__PURE__ */ jsx(
              "g",
              {
                transform: `translate(${anchor.x} ${anchor.y}) scale(${inverseScale})`,
                pointerEvents: "none",
                "data-region-label": "",
                "data-region-anchor-x": anchor.x,
                "data-region-anchor-y": anchor.y,
                children: /* @__PURE__ */ jsx(
                  "text",
                  {
                    x: "0",
                    y: "0",
                    textAnchor: "middle",
                    dominantBaseline: "central",
                    fill: "var(--viewer-foreground, var(--color-semantic-label-strong))",
                    stroke: "var(--viewer-surface, var(--color-semantic-background-normal-normal))",
                    strokeWidth: "4",
                    paintOrder: "stroke",
                    vectorEffect: "non-scaling-stroke",
                    style: { fontFamily: "var(--font-sans)", fontSize: "var(--caption1-size)", fontWeight: "var(--fw-bold)" },
                    children: region.label?.trim() || semanticLabel(region)
                  }
                )
              }
            )
          }
        )
      ]
    }
  );
}

export {
  SpatialRegion
};
//# sourceMappingURL=chunk-OWOA3KJ5.js.map