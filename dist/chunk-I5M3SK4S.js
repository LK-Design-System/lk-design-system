"use client";

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
function regionCenter(shape) {
  if (shape.kind === "circle") return shape.center;
  if (shape.points.length === 0) return { x: 0, y: 0 };
  const total = shape.points.reduce(
    (next, point) => ({ x: next.x + point.x, y: next.y + point.y }),
    { x: 0, y: 0 }
  );
  return {
    x: total.x / shape.points.length,
    y: total.y / shape.points.length
  };
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
  if (invalid) return "var(--color-semantic-status-negative-foreground)";
  if (disabled) return "var(--viewer-muted, var(--color-semantic-label-alternative))";
  if (region.category === "behavior") {
    if (region.rule.kind === "keep-out") return "var(--color-semantic-status-negative-foreground)";
    if (region.rule.kind === "speed-limit") return "var(--color-semantic-status-cautionary-foreground)";
    return "var(--color-semantic-primary-normal)";
  }
  if (region.category === "terrain") {
    if (region.traversability === "blocked") return "var(--color-semantic-status-negative-foreground)";
    if (region.traversability === "restricted") return "var(--color-semantic-status-cautionary-foreground)";
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
  onFocus,
  onBlur,
  ...rest
}) {
  const reactId = React.useId();
  const [focusVisible, setFocusVisible] = React.useState(false);
  const kind = regionKind(region);
  const pattern = CATEGORY_PATTERNS[region.category] ?? CATEGORY_PATTERNS.behavior;
  const safeId = `${region.id}-${reactId}`.replace(/[^a-zA-Z0-9_-]/g, "");
  const patternId = `lk-spatial-region-${safeId}`;
  const center = regionCenter(region.shape);
  const inverseScale = 1 / safeScale(viewportScale);
  const interactive = typeof onActivate === "function";
  const activeFocus = focused || focusVisible;
  const computedLabel = [
    semanticLabel(region),
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
    if (disabled || !interactive || event.repeat) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activate(event);
  };
  const patternSize = pattern === "grid" ? 10 : pattern === "contour" ? 12 : 9;
  return /* @__PURE__ */ jsxs(
    "g",
    {
      ...rest,
      role: role ?? (interactive ? "button" : "img"),
      tabIndex: interactive ? disabled ? -1 : tabIndex ?? 0 : tabIndex,
      focusable: interactive && !disabled ? "true" : void 0,
      "aria-label": ariaLabel ?? computedLabel,
      "aria-pressed": interactive ? selected : void 0,
      "aria-disabled": interactive && disabled ? true : void 0,
      "data-lds-spatial-region": "",
      "data-region-id": region.id,
      "data-map-id": region.mapId,
      "data-region-category": region.category,
      "data-region-kind": kind,
      "data-region-pattern": pattern,
      "data-traversability": region.category === "terrain" ? region.traversability : void 0,
      "data-selected": selected || void 0,
      "data-invalid": invalid || void 0,
      "data-stale": stale || void 0,
      "data-disabled": disabled || void 0,
      onClick: activate,
      onKeyDown: handleKeyDown,
      onFocus: (event) => {
        setFocusVisible(true);
        onFocus?.(event);
      },
      onBlur: (event) => {
        setFocusVisible(false);
        onBlur?.(event);
      },
      style: {
        cursor: interactive && !disabled ? "pointer" : disabled ? "not-allowed" : "default",
        opacity: disabled ? 0.52 : 1,
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
            strokeWidth: "5",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none"
          }
        ),
        selected && /* @__PURE__ */ jsx(
          RegionShape,
          {
            shape: region.shape,
            fill: "none",
            stroke: "var(--color-semantic-primary-normal)",
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
        invalid && /* @__PURE__ */ jsx("g", { transform: `translate(${center.x} ${center.y}) scale(${inverseScale})`, pointerEvents: "none", "data-region-invalid-mark": "", children: /* @__PURE__ */ jsx("path", { d: "M-6-6L6 6M6-6L-6 6", fill: "none", stroke: "var(--color-semantic-status-negative-foreground)", strokeWidth: "2", strokeLinecap: "round", vectorEffect: "non-scaling-stroke" }) }),
        showLabel && /* @__PURE__ */ jsx("g", { transform: `translate(${center.x} ${center.y}) scale(${inverseScale})`, pointerEvents: "none", "data-region-label": "", children: /* @__PURE__ */ jsx(
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
        ) })
      ]
    }
  );
}

export {
  SpatialRegion
};
//# sourceMappingURL=chunk-I5M3SK4S.js.map