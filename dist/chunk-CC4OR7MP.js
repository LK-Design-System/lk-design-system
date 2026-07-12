"use client";

// components/robotics/FacilityTransition.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var AVAILABILITY_PRESENTATION = {
  available: {
    label: "\uC0AC\uC6A9 \uAC00\uB2A5",
    stroke: "var(--color-semantic-primary-normal)",
    dash: void 0
  },
  unavailable: {
    label: "\uC0AC\uC6A9 \uBD88\uAC00",
    stroke: "var(--color-semantic-status-negative-foreground)",
    dash: "6 3"
  },
  unknown: {
    label: "\uAC00\uC6A9\uC131 \uBBF8\uD655\uC778",
    stroke: "var(--viewer-muted, var(--color-semantic-label-alternative))",
    dash: "1 3"
  }
};
var KIND_LABELS = {
  door: "\uBB38 \uC804\uC774",
  lift: "\uC2B9\uAC15\uAE30 \uC804\uC774",
  dock: "\uB3C4\uD0B9 \uC804\uC774"
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
  return [[DOCK_PHASE_LABELS[transition.phase], availabilityLabel].filter(Boolean).join(" \xB7 ")];
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
  return [[DOCK_PHASE_LABELS[transition.phase], availabilityLabel].filter(Boolean).join(" \xB7 ")];
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
function FacilityGlyph({ kind, stroke }) {
  if (kind === "door") {
    return /* @__PURE__ */ jsxs("g", { fill: "none", stroke, strokeWidth: "1.7", strokeLinecap: "round", children: [
      /* @__PURE__ */ jsx("path", { d: "M-6-7V7M6-7V7", vectorEffect: "non-scaling-stroke" }),
      /* @__PURE__ */ jsx("path", { d: "M-3 0H3", strokeDasharray: "2 2", vectorEffect: "non-scaling-stroke" })
    ] });
  }
  if (kind === "lift") {
    return /* @__PURE__ */ jsxs("g", { fill: "none", stroke, strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsx("rect", { x: "-7", y: "-7", width: "14", height: "14", rx: "2", vectorEffect: "non-scaling-stroke" }),
      /* @__PURE__ */ jsx("path", { d: "M-3 2V-3M-5-1L-3-3L-1-1M3-2V3M1 1L3 3L5 1", vectorEffect: "non-scaling-stroke" })
    ] });
  }
  return /* @__PURE__ */ jsxs("g", { fill: "none", stroke, strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M-7-6V6H2", vectorEffect: "non-scaling-stroke" }),
    /* @__PURE__ */ jsx("path", { d: "M2-4L7 0L2 4Z", vectorEffect: "non-scaling-stroke" })
  ] });
}
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
  onFocus,
  onBlur,
  ...rest
}) {
  const [focusVisible, setFocusVisible] = React.useState(false);
  const endpoint = endpointForMap(transition, activeMapId);
  const availability = AVAILABILITY_PRESENTATION[transition.availability] ?? AVAILABILITY_PRESENTATION.unknown;
  const interactive = typeof onActivate === "function";
  const activeFocus = focused || focusVisible;
  const inverseScale = 1 / safeScale(viewportScale);
  const stroke = invalid ? "var(--color-semantic-status-negative-foreground)" : disabled ? "var(--viewer-muted, var(--color-semantic-label-alternative))" : availability.stroke;
  const dash = invalid ? "4 3" : stale ? "2 4" : availability.dash;
  const rows = visibleDetailRows(transition, availability.label);
  const computedLabel = [
    computedAccessibleLabel(transition, availability.label),
    invalid ? "\uC798\uBABB\uB41C \uC124\uBE44 \uC804\uC774" : void 0,
    stale ? "\uB370\uC774\uD130 \uC9C0\uC5F0" : void 0,
    disabled ? "\uC120\uD0DD\uD560 \uC218 \uC5C6\uC74C" : void 0
  ].filter(Boolean).join(" \xB7 ");
  if (hidden || !endpoint) return null;
  const endpointLabel = endpoint.side === "from" ? "\uCD9C\uBC1C" : endpoint.side === "to" ? "\uB3C4\uCC29" : "\uC5F0\uACB0";
  const activate = (event) => {
    if (disabled || !interactive) return;
    onActivate(transition.id, event);
  };
  const handleKeyDown = (event) => {
    if (disabled || !interactive || event.repeat) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activate(event);
  };
  return /* @__PURE__ */ jsx(
    "g",
    {
      ...rest,
      role: role ?? (interactive ? "button" : "img"),
      tabIndex: interactive ? disabled ? -1 : tabIndex ?? 0 : tabIndex,
      focusable: interactive && !disabled ? "true" : void 0,
      "aria-label": ariaLabel ?? computedLabel,
      "aria-pressed": interactive ? selected : void 0,
      "aria-disabled": interactive && disabled ? true : void 0,
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
      children: /* @__PURE__ */ jsxs("g", { transform: `scale(${inverseScale})`, children: [
        activeFocus && /* @__PURE__ */ jsx("circle", { r: "16", fill: "none", stroke: "var(--color-semantic-focus-indicator)", strokeWidth: "4", vectorEffect: "non-scaling-stroke", pointerEvents: "none" }),
        selected && /* @__PURE__ */ jsx("circle", { r: "14", fill: "none", stroke: "var(--color-semantic-primary-normal)", strokeWidth: "3", vectorEffect: "non-scaling-stroke", pointerEvents: "none", "data-transition-selection-ring": "" }),
        /* @__PURE__ */ jsx("circle", { r: "16", fill: "transparent", stroke: "none", "data-transition-hit-area": "" }),
        /* @__PURE__ */ jsx(
          "circle",
          {
            r: "11",
            fill: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))",
            stroke,
            strokeWidth: "1.8",
            strokeDasharray: dash,
            vectorEffect: "non-scaling-stroke",
            "data-transition-marker": ""
          }
        ),
        /* @__PURE__ */ jsx(FacilityGlyph, { kind: transition.kind, stroke }),
        transition.availability === "unavailable" && /* @__PURE__ */ jsx("path", { d: "M-8 8L8-8", fill: "none", stroke, strokeWidth: "2", strokeLinecap: "round", vectorEffect: "non-scaling-stroke", pointerEvents: "none", "data-transition-unavailable-mark": "" }),
        transition.availability === "unknown" && /* @__PURE__ */ jsx(
          "text",
          {
            x: "8",
            y: "-8",
            textAnchor: "middle",
            dominantBaseline: "central",
            fill: "var(--viewer-foreground, var(--color-semantic-label-strong))",
            stroke: "var(--viewer-surface, var(--color-semantic-background-normal-normal))",
            strokeWidth: "3",
            paintOrder: "stroke",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none",
            style: { fontFamily: "var(--font-sans)", fontSize: "var(--caption1-size)", fontWeight: "var(--fw-bold)" },
            children: "?"
          }
        ),
        invalid && /* @__PURE__ */ jsx(
          "text",
          {
            x: "0",
            y: "1",
            textAnchor: "middle",
            dominantBaseline: "central",
            fill: "var(--color-semantic-status-negative-foreground)",
            stroke: "var(--viewer-surface, var(--color-semantic-background-normal-normal))",
            strokeWidth: "3",
            paintOrder: "stroke",
            vectorEffect: "non-scaling-stroke",
            pointerEvents: "none",
            "data-transition-invalid-mark": "",
            style: { fontFamily: "var(--font-sans)", fontSize: "var(--label1-size)", fontWeight: "var(--fw-bold)" },
            children: "!"
          }
        ),
        showLabel && /* @__PURE__ */ jsxs(
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
      ] })
    }
  );
}

export {
  FacilityTransition
};
//# sourceMappingURL=chunk-CC4OR7MP.js.map