"use client";
import {
  FACILITY_GLYPH_PATHS
} from "./chunk-FNB4CNYR.js";
import {
  isFocusVisibleTarget
} from "./chunk-7NLYHYLX.js";
import {
  NavigationAnnotationBlock,
  annotationPriority,
  useNavigationObstacles
} from "./chunk-2VOHTLP5.js";

// components/robotics/HazardMarker.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var KIND_LABELS = {
  stairs: "\uACC4\uB2E8",
  ramp: "\uACBD\uC0AC\uB85C"
};
var SEVERITY_PRESENTATION = {
  caution: {
    label: "\uC8FC\uC758",
    fill: "var(--viewer-warning, var(--color-semantic-status-cautionary-foreground))"
  },
  danger: {
    label: "\uC704\uD5D8",
    fill: "var(--viewer-danger, var(--color-semantic-status-negative-foreground))"
  }
};
var HAZARD_GLYPHS = {
  stairs: "M120-200q-17 0-28.5-11.5T80-240q0-17 11.5-28.5T120-280h200v-200q0-17 11.5-28.5T360-520h200v-200q0-17 11.5-28.5T600-760h240q17 0 28.5 11.5T880-720q0 17-11.5 28.5T840-680H640v200q0 17-11.5 28.5T600-440H400v200q0 17-11.5 28.5T360-200H120Z",
  ramp: FACILITY_GLYPH_PATHS.ramp
};
var GLYPH_FIT = "scale(0.016) translate(-480 480)";
var PIN_PATH = "M0 15 Q-6 10 -9.2 5 A10.5 10.5 0 1 1 9.2 5 Q6 10 0 15 Z";
function normalizeViewportScale(value) {
  return Number.isFinite(value) && value > 0 ? value : 1;
}
function accessibleName(hazard, severity, { selected, focused, disabled }) {
  const kind = KIND_LABELS[hazard.kind] || hazard.kind;
  return [
    hazard.label,
    `\uC9C0\uB3C4 ${hazard.mapId}`,
    `${kind} \uC704\uD5D8`,
    `\uC2EC\uAC01\uB3C4 ${severity.label}`,
    selected && "\uC120\uD0DD\uB428",
    focused && "\uD3EC\uCEE4\uC2A4\uB428",
    disabled && "\uC120\uD0DD\uD560 \uC218 \uC5C6\uC74C"
  ].filter(Boolean).join(", ");
}
function HazardMarker({
  hazard,
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
  const severity = SEVERITY_PRESENTATION[hazard.severity] ?? SEVERITY_PRESENTATION.caution;
  const glyph = HAZARD_GLYPHS[hazard.kind] ?? HAZARD_GLYPHS.stairs;
  const surface = "var(--viewer-surface-elevated, var(--color-semantic-static-white))";
  const label = ariaLabel ?? accessibleName(hazard, severity, { selected, focused: focusVisible, disabled });
  const activate = (event) => {
    if (disabled || !interactive) return;
    onActivate(hazard.id, event);
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
      "data-lds-hazard-marker": "",
      "data-hazard-id": hazard.id,
      "data-hazard-kind": hazard.kind,
      "data-hazard-severity": hazard.severity,
      "data-map-id": hazard.mapId,
      "data-selected": selected ? "true" : "false",
      "data-focused": focusVisible ? "true" : "false",
      "data-disabled": disabled ? "true" : "false",
      transform: `translate(${hazard.position.x} ${hazard.position.y})`,
      role: pointerOnly ? void 0 : role ?? (interactive ? "button" : "img"),
      tabIndex: pointerOnly ? void 0 : interactive ? disabled ? -1 : tabIndex ?? 0 : tabIndex,
      focusable: pointerOnly ? "false" : interactive && !disabled ? "true" : void 0,
      "aria-hidden": pointerOnly || void 0,
      "aria-label": pointerOnly ? void 0 : label,
      "aria-pressed": !pointerOnly && interactive ? selected : void 0,
      "aria-disabled": !pointerOnly && interactive && disabled ? true : void 0,
      "aria-invalid": !pointerOnly && invalid ? true : void 0,
      "data-invalid": invalid ? "true" : "false",
      "data-stale": stale ? "true" : "false",
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
        opacity: disabled ? 0.45 : stale ? 0.76 : 1,
        outline: "none",
        ...style
      },
      children: /* @__PURE__ */ jsxs("g", { "data-hazard-screen-space": "", "data-viewport-scale": scale, transform: `scale(${inverseScale})`, children: [
        /* @__PURE__ */ jsx("path", { d: PIN_PATH, transform: "translate(0 0.8)", fill: "var(--color-semantic-static-black)", opacity: "0.16", pointerEvents: "none", "data-hazard-shadow": "" }),
        focusVisible && /* @__PURE__ */ jsx("path", { d: PIN_PATH, transform: "scale(1.34)", fill: "none", stroke: "var(--color-semantic-focus-indicator)", strokeWidth: "2.5", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke", pointerEvents: "none", "data-hazard-focus-ring": "" }),
        selected && /* @__PURE__ */ jsx("path", { d: PIN_PATH, transform: "scale(1.16)", fill: "none", stroke: "var(--viewer-accent, var(--color-semantic-primary-normal))", strokeWidth: "2", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke", pointerEvents: "none", "data-hazard-selection-ring": "" }),
        /* @__PURE__ */ jsx("circle", { r: "17", fill: "transparent", stroke: "none", pointerEvents: interactive ? "all" : "none", "data-hazard-hit-area": "", "data-screen-target-size": "24" }),
        /* @__PURE__ */ jsx(
          "path",
          {
            ...obstacle(`hazard:${hazard.id}:sign`),
            d: PIN_PATH,
            fill: severity.fill,
            vectorEffect: "non-scaling-stroke",
            "data-hazard-sign": ""
          }
        ),
        /* @__PURE__ */ jsx("g", { fill: surface, pointerEvents: "none", transform: GLYPH_FIT, "data-hazard-glyph": "", children: /* @__PURE__ */ jsx("path", { d: glyph }) }),
        showLabel && /* @__PURE__ */ jsx(
          NavigationAnnotationBlock,
          {
            id: `hazard:${hazard.id}:label`,
            kind: "hazard-label",
            anchor: hazard.position,
            priority: annotationPriority({ selected, focused: focusVisible, alarm: hazard.severity === "danger" }),
            children: /* @__PURE__ */ jsxs(
              "text",
              {
                x: "20",
                y: "-8",
                textAnchor: "start",
                fill: "var(--viewer-foreground, var(--color-semantic-label-strong))",
                stroke: "var(--viewer-surface, var(--color-semantic-background-normal-normal))",
                strokeWidth: "4",
                paintOrder: "stroke",
                vectorEffect: "non-scaling-stroke",
                pointerEvents: "none",
                "data-hazard-label": "",
                style: { fontFamily: "var(--font-sans)", fontSize: "var(--caption1-size)", fontWeight: "var(--fw-bold)" },
                children: [
                  hazard.label,
                  " \xB7 ",
                  severity.label
                ]
              }
            )
          }
        )
      ] })
    }
  );
}

export {
  HazardMarker
};
//# sourceMappingURL=chunk-FIXERKRJ.js.map