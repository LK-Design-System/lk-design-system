"use client";
import {
  FacilityGlyph
} from "./chunk-FNB4CNYR.js";
import {
  NavigationStateGlyph
} from "./chunk-54Q6T6L4.js";
import {
  NAV_DASH,
  NAV_HIT,
  NAV_LABEL_HALO,
  NAV_PIN,
  NAV_STATE_BADGE,
  isFocusVisibleTarget,
  navStateOpacity
} from "./chunk-PHNAKRBB.js";
import {
  NavigationAnnotationBlock,
  annotationPriority,
  useNavigationObstacles
} from "./chunk-2VOHTLP5.js";

// components/robotics/FacilityTransition.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var AVAILABILITY_PRESENTATION = {
  available: {
    label: "\uC0AC\uC6A9 \uAC00\uB2A5",
    stroke: "var(--viewer-accent, var(--color-semantic-primary-normal))",
    dash: void 0
  },
  unavailable: {
    label: "\uC0AC\uC6A9 \uBD88\uAC00",
    stroke: "var(--viewer-danger, var(--color-semantic-status-negative-foreground))",
    dash: "6 3"
  },
  unknown: {
    label: "\uAC00\uC6A9\uC131 \uBBF8\uD655\uC778",
    stroke: "var(--viewer-muted, var(--color-semantic-label-alternative))",
    dash: NAV_DASH.unknown
  }
};
var KIND_LABELS = {
  door: "\uBB38 \uC804\uC774",
  lift: "\uC2B9\uAC15\uAE30 \uC804\uC774",
  dock: "\uB3C4\uD0B9 \uC804\uC774",
  ramp: "\uACBD\uC0AC\uB85C \uC804\uC774",
  charging: "\uCDA9\uC804 \uC9C0\uC810",
  gate: "\uBCF4\uC548 \uAC8C\uC774\uD2B8 \uC804\uC774",
  handoff: "\uD578\uB4DC\uC624\uD504 \uC9C0\uC810"
};
var DOOR_STATE_LABELS = {
  closed: "\uBB38 \uB2EB\uD798",
  moving: "\uBB38 \uC774\uB3D9 \uC911",
  open: "\uBB38 \uC5F4\uB9BC",
  offline: "\uBB38 \uC624\uD504\uB77C\uC778",
  unknown: "\uBB38 \uC0C1\uD0DC \uBBF8\uD655\uC778"
};
var DOOR_EVENT_LABELS = {
  open: "\uC5F4\uAE30 \uC774\uBCA4\uD2B8",
  close: "\uB2EB\uAE30 \uC774\uBCA4\uD2B8",
  pass: "\uD1B5\uACFC \uC774\uBCA4\uD2B8"
};
var LIFT_PHASE_LABELS = {
  approach: "\uC811\uADFC \uC911",
  waiting: "\uB300\uAE30 \uC911",
  boarding: "\uD0D1\uC2B9 \uC911",
  moving: "\uCE35\uAC04 \uC774\uB3D9 \uC911",
  arrival: "\uB3C4\uCC29",
  exiting: "\uD558\uCC28 \uC911"
};
var MOTION_LABELS = {
  stopped: "\uC815\uC9C0",
  up: "\uC0C1\uC2B9",
  down: "\uD558\uAC15",
  unknown: "\uC774\uB3D9 \uBBF8\uD655\uC778"
};
var OPERATING_MODE_LABELS = {
  human: "\uC0AC\uB78C \uBAA8\uB4DC",
  agv: "AGV \uBAA8\uB4DC",
  fire: "\uC18C\uBC29 \uBAA8\uB4DC",
  offline: "\uC6B4\uC601 \uC624\uD504\uB77C\uC778",
  emergency: "\uBE44\uC0C1 \uBAA8\uB4DC",
  unknown: "\uC6B4\uC601 \uBAA8\uB4DC \uBBF8\uD655\uC778"
};
var SESSION_LABELS = {
  none: "\uC138\uC158 \uC5C6\uC74C",
  requested: "\uC138\uC158 \uC694\uCCAD\uB428",
  owned: "\uD604\uC7AC fleet \uC138\uC158",
  other: "\uB2E4\uB978 \uC138\uC158 \uC0AC\uC6A9 \uC911",
  unknown: "\uC138\uC158 \uC18C\uC720 \uBBF8\uD655\uC778"
};
var DOCK_PHASE_LABELS = {
  approach: "\uB3C4\uD0B9 \uC811\uADFC \uC911",
  docking: "\uB3C4\uD0B9 \uC911",
  docked: "\uB3C4\uD0B9 \uC644\uB8CC",
  undocking: "\uB3C4\uD0B9 \uD574\uC81C \uC911",
  complete: "\uC804\uC774 \uC644\uB8CC"
};
function safeScale(viewportScale) {
  const scale = Number(viewportScale);
  return Number.isFinite(scale) && scale > 0 ? scale : 1;
}
function midpoint(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  };
}
function endpointForMap(transition, activeMapId) {
  const fromMatches = transition.from.mapId === activeMapId;
  const toMatches = transition.to?.mapId === activeMapId;
  if (fromMatches && toMatches) {
    return {
      position: midpoint(transition.from.position, transition.to.position),
      side: "both"
    };
  }
  if (fromMatches) return { position: transition.from.position, side: "from" };
  if (toMatches) return { position: transition.to.position, side: "to" };
  return null;
}
function detailRows(transition, availabilityLabel) {
  if (transition.kind === "lift") {
    return [
      [
        LIFT_PHASE_LABELS[transition.phase],
        DOOR_STATE_LABELS[transition.doorState],
        MOTION_LABELS[transition.motionState]
      ].filter(Boolean).join(" \xB7 "),
      [
        OPERATING_MODE_LABELS[transition.operatingMode],
        SESSION_LABELS[transition.sessionState],
        availabilityLabel
      ].filter(Boolean).join(" \xB7 ")
    ];
  }
  if (transition.kind === "door") {
    return [[
      DOOR_EVENT_LABELS[transition.event],
      DOOR_STATE_LABELS[transition.doorState],
      availabilityLabel
    ].filter(Boolean).join(" \xB7 ")];
  }
  if (transition.kind === "dock") {
    return [[DOCK_PHASE_LABELS[transition.phase], availabilityLabel].filter(Boolean).join(" \xB7 ")];
  }
  return [availabilityLabel].filter(Boolean);
}
function visibleDetailRows(transition, availabilityLabel) {
  if (transition.kind === "lift") {
    return [
      [LIFT_PHASE_LABELS[transition.phase], availabilityLabel].filter(Boolean).join(" \xB7 "),
      [
        DOOR_STATE_LABELS[transition.doorState],
        MOTION_LABELS[transition.motionState],
        OPERATING_MODE_LABELS[transition.operatingMode]
      ].filter(Boolean).join(" \xB7 ")
    ];
  }
  if (transition.kind === "door") {
    return [[
      DOOR_EVENT_LABELS[transition.event],
      DOOR_STATE_LABELS[transition.doorState],
      availabilityLabel
    ].filter(Boolean).join(" \xB7 ")];
  }
  if (transition.kind === "dock") {
    return [[DOCK_PHASE_LABELS[transition.phase], availabilityLabel].filter(Boolean).join(" \xB7 ")];
  }
  return [availabilityLabel].filter(Boolean);
}
function computedAccessibleLabel(transition, availabilityLabel) {
  const from = transition.from.label ?? transition.from.mapId;
  const endpointDescription = transition.to ? `${from}\uC5D0\uC11C ${transition.to.label ?? transition.to.mapId}\uAE4C\uC9C0` : `${from}\uC5D0\uC11C \uC2DC\uC791`;
  const maps = transition.kind === "lift" ? [
    transition.currentMapId ? `\uD604\uC7AC \uC9C0\uB3C4 ${transition.currentMapId}` : void 0,
    transition.destinationMapId ? `\uBAA9\uC801 \uC9C0\uB3C4 ${transition.destinationMapId}` : void 0
  ] : [];
  return [
    KIND_LABELS[transition.kind],
    transition.label,
    endpointDescription,
    ...maps,
    ...detailRows(transition, availabilityLabel)
  ].filter(Boolean).join(" \xB7 ");
}
var PIN_PATH = NAV_PIN.path;
function FacilityTransition({
  transition,
  activeMapId,
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
  const [focusVisible, setFocusVisible] = React.useState(false);
  const obstacle = useNavigationObstacles();
  const endpoint = endpointForMap(transition, activeMapId);
  const availability = AVAILABILITY_PRESENTATION[transition.availability] ?? AVAILABILITY_PRESENTATION.unknown;
  const interactive = typeof onActivate === "function";
  const pointerOnly = ariaHidden === true || ariaHidden === "true";
  const activeFocus = !pointerOnly && (focused || focusVisible);
  const scale = safeScale(viewportScale);
  const inverseScale = 1 / scale;
  const stroke = invalid ? "var(--viewer-danger, var(--color-semantic-status-negative-foreground))" : disabled ? "var(--viewer-muted, var(--color-semantic-label-alternative))" : availability.stroke;
  const dash = invalid ? NAV_DASH.invalid : stale ? NAV_DASH.staleShape : availability.dash;
  const rows = visibleDetailRows(transition, availability.label);
  const computedLabel = [
    computedAccessibleLabel(transition, availability.label),
    selected ? "\uC120\uD0DD\uB428" : void 0,
    activeFocus ? "\uD3EC\uCEE4\uC2A4\uB428" : void 0,
    invalid ? "\uC798\uBABB\uB41C \uC124\uBE44 \uC804\uC774" : void 0,
    stale ? "\uB370\uC774\uD130 \uC9C0\uC5F0" : void 0,
    disabled ? "\uC120\uD0DD\uD560 \uC218 \uC5C6\uC74C" : void 0
  ].filter(Boolean).join(" \xB7 ");
  const stateBadges = [
    transition.availability === "unknown" ? { kind: "unknown", tone: "var(--viewer-warning, var(--color-semantic-status-cautionary-foreground))" } : null,
    invalid ? { kind: "invalid", tone: "var(--viewer-danger, var(--color-semantic-status-negative-foreground))" } : null,
    stale ? { kind: "stale", tone: "var(--viewer-muted, var(--color-semantic-label-alternative))", dash: NAV_DASH.staleRing } : null
  ].filter(Boolean).map((state, index, states) => ({
    ...state,
    x: (index - (states.length - 1) / 2) * 16
  }));
  if (hidden || !endpoint) return null;
  const endpointLabel = endpoint.side === "from" ? "\uCD9C\uBC1C" : endpoint.side === "to" ? "\uB3C4\uCC29" : "\uC5F0\uACB0";
  const activate = (event) => {
    if (disabled || !interactive) return;
    onActivate(transition.id, event);
  };
  const handleKeyDown = (event) => {
    if (!pointerOnly) setFocusVisible(true);
    if (pointerOnly || disabled || !interactive || event.repeat) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activate(event);
  };
  return /* @__PURE__ */ jsx(
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
      transform: `translate(${endpoint.position.x} ${endpoint.position.y})`,
      "data-lds-facility-transition": "",
      "data-transition-id": transition.id,
      "data-facility-id": transition.facilityId,
      "data-transition-kind": transition.kind,
      "data-transition-availability": transition.availability,
      "data-active-map-id": activeMapId,
      "data-from-map-id": transition.from.mapId,
      "data-to-map-id": transition.to?.mapId,
      "data-visible-endpoint": endpoint.side,
      "data-door-state": transition.doorState,
      "data-door-event": transition.kind === "door" ? transition.event : void 0,
      "data-lift-phase": transition.kind === "lift" ? transition.phase : void 0,
      "data-motion-state": transition.kind === "lift" ? transition.motionState : void 0,
      "data-operating-mode": transition.kind === "lift" ? transition.operatingMode : void 0,
      "data-session-state": transition.kind === "lift" ? transition.sessionState : void 0,
      "data-current-map-id": transition.kind === "lift" ? transition.currentMapId : void 0,
      "data-destination-map-id": transition.kind === "lift" ? transition.destinationMapId : void 0,
      "data-dock-phase": transition.kind === "dock" ? transition.phase : void 0,
      "data-selected": selected || void 0,
      "data-focused": activeFocus || void 0,
      "data-invalid": invalid || void 0,
      "data-stale": stale || void 0,
      "data-disabled": disabled || void 0,
      "data-viewport-scale": scale,
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
        opacity: navStateOpacity(disabled, stale),
        outline: "none",
        ...style
      },
      children: /* @__PURE__ */ jsxs("g", { transform: `scale(${inverseScale})`, "data-transition-screen-space": "", children: [
        /* @__PURE__ */ jsx("path", { d: PIN_PATH, transform: NAV_PIN.shadow.transform, fill: NAV_PIN.shadow.fill, opacity: NAV_PIN.shadow.opacity, pointerEvents: "none", "data-transition-shadow": "" }),
        activeFocus && /* @__PURE__ */ jsx("path", { d: PIN_PATH, transform: `scale(${NAV_PIN.focusRing.scale})`, fill: "none", stroke: "var(--color-semantic-focus-indicator)", strokeWidth: NAV_PIN.focusRing.strokeWidth, strokeLinejoin: "round", vectorEffect: "non-scaling-stroke", pointerEvents: "none", "data-transition-focus-ring": "" }),
        selected && /* @__PURE__ */ jsx("path", { d: PIN_PATH, transform: `scale(${NAV_PIN.selectionRing.scale})`, fill: "none", stroke: "var(--viewer-accent, var(--color-semantic-primary-normal))", strokeWidth: NAV_PIN.selectionRing.strokeWidth, strokeLinejoin: "round", vectorEffect: "non-scaling-stroke", pointerEvents: "none", "data-transition-selection-ring": "" }),
        /* @__PURE__ */ jsx(
          "circle",
          {
            r: NAV_HIT.radius,
            fill: "transparent",
            stroke: "none",
            pointerEvents: interactive ? "all" : "none",
            "data-transition-hit-area": "",
            "data-screen-target-size": NAV_HIT.screenTargetSize
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            ...obstacle(`facility:${transition.id}:pin`),
            d: PIN_PATH,
            fill: stroke,
            vectorEffect: "non-scaling-stroke",
            "data-transition-marker": ""
          }
        ),
        /* @__PURE__ */ jsx(
          FacilityGlyph,
          {
            kind: transition.kind,
            color: "var(--viewer-surface-elevated, var(--color-semantic-static-white))",
            badge: stroke
          }
        ),
        transition.availability === "unavailable" && /* @__PURE__ */ jsxs("g", { pointerEvents: "none", "data-transition-unavailable-mark": "", children: [
          /* @__PURE__ */ jsx("path", { d: "M-6.5 6.5L6.5-6.5", fill: "none", stroke, strokeWidth: "5", strokeLinecap: "round", vectorEffect: "non-scaling-stroke" }),
          /* @__PURE__ */ jsx("path", { d: "M-6.5 6.5L6.5-6.5", fill: "none", stroke: "var(--color-semantic-static-white)", strokeWidth: "2", strokeLinecap: "round", vectorEffect: "non-scaling-stroke" })
        ] }),
        stateBadges.length > 0 && /* @__PURE__ */ jsx("g", { ...obstacle(`facility:${transition.id}:states`), "data-transition-state-slot-layer": "", pointerEvents: "none", children: stateBadges.map((state) => /* @__PURE__ */ jsxs(
          "g",
          {
            transform: `translate(${state.x} -28)`,
            "data-transition-state-slot": state.kind,
            "data-transition-unknown-mark": state.kind === "unknown" ? "" : void 0,
            "data-transition-invalid-mark": state.kind === "invalid" ? "" : void 0,
            "data-transition-stale-mark": state.kind === "stale" ? "" : void 0,
            children: [
              /* @__PURE__ */ jsx(
                "circle",
                {
                  r: NAV_STATE_BADGE.radius,
                  fill: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))",
                  stroke: state.tone,
                  strokeWidth: NAV_STATE_BADGE.strokeWidth,
                  strokeDasharray: state.dash,
                  vectorEffect: "non-scaling-stroke"
                }
              ),
              /* @__PURE__ */ jsx(
                NavigationStateGlyph,
                {
                  kind: state.kind,
                  size: 10,
                  color: "var(--viewer-foreground, var(--color-semantic-label-strong))"
                }
              )
            ]
          },
          state.kind
        )) }),
        showLabel && /* @__PURE__ */ jsx(
          NavigationAnnotationBlock,
          {
            id: `facility:${transition.id}:label`,
            kind: "facility-label",
            anchor: endpoint.position,
            priority: annotationPriority({
              selected,
              focused: activeFocus,
              alarm: invalid || transition.availability === "unavailable"
            }),
            children: /* @__PURE__ */ jsxs(
              "text",
              {
                x: "20",
                y: "-8",
                textAnchor: "start",
                fill: "var(--viewer-foreground, var(--color-semantic-label-strong))",
                stroke: "var(--viewer-surface, var(--color-semantic-background-normal-normal))",
                strokeWidth: NAV_LABEL_HALO.primary,
                paintOrder: "stroke",
                vectorEffect: "non-scaling-stroke",
                pointerEvents: "none",
                "data-transition-label": "",
                style: { fontFamily: "var(--font-sans)", fontSize: "var(--caption1-size)", fontWeight: "var(--fw-bold)" },
                children: [
                  /* @__PURE__ */ jsxs("tspan", { x: "20", dy: "0", children: [
                    endpointLabel,
                    " \xB7 ",
                    transition.label
                  ] }),
                  rows.map((row, index) => /* @__PURE__ */ jsx("tspan", { x: "20", dy: "13", style: { fontSize: "var(--caption2-size)", fontWeight: "var(--fw-semibold)" }, children: row }, `${transition.id}-row-${index}`))
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
  FacilityTransition
};
//# sourceMappingURL=chunk-I5SGRCCQ.js.map