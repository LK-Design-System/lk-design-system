"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";



var _chunkQDSVSP6Ncjs = require('./chunk-QDSVSP6N.cjs');

// components/robotics/FacilityTransition.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);

// components/robotics/_FacilityGlyph.js

var h = _react2.default.createElement;
var PATHS = {
  door: "M393.5-459.5Q404-470 404-484t-10.5-24.5Q383-519 369-519t-24.5 10.5Q334-498 334-484t10.5 24.5Q355-449 369-449t24.5-10.5Zm223 0Q627-470 627-484t-10.5-24.5Q606-519 592-519t-24.5 10.5Q557-498 557-484t10.5 24.5Q578-449 592-449t24.5-10.5ZM150-120q-13 0-21.5-8.5T120-150q0-13 8.5-21.5T150-180h16v-600q0-25 17.5-42.5T226-840h239v660h30v-660h239q25 0 42.5 17.5T794-780v600h16q13 0 21.5 8.5T840-150q0 13-8.5 21.5T810-120H150Z",
  lift: "M280-400v140q0 13 8.5 21.5T310-230h60q13 0 21.5-8.5T400-260v-140h10q13 0 21.5-8.5T440-430v-80q0-33-23.5-56.5T360-590h-40q-33 0-56.5 23.5T240-510v80q0 13 8.5 21.5T270-400h10Zm99.5-240.5Q396-657 396-680t-16.5-39.5Q363-736 340-736t-39.5 16.5Q284-703 284-680t16.5 39.5Q317-624 340-624t39.5-16.5ZM542-530h146q9 0 13.5-7.5T701-553l-73-117q-5-7-13-7t-13 7l-73 117q-5 8-.5 15.5T542-530Zm86 240 73-117q5-8 .5-15.5T688-430H542q-9 0-13.5 7.5t.5 15.5l73 117q5 7 13 7t13-7ZM180-120q-24 0-42-18t-18-42v-600q0-23 18-41.5t42-18.5h600q23 0 41.5 18.5T840-780v600q0 24-18.5 42T780-120H180Z",
  dock: "M160-180v-390q0-14.25 6.38-27 6.37-12.75 17.62-21l260-195q15.68-12 35.84-12Q500-825 516-813l260 195q11.25 8.25 17.63 21 6.37 12.75 6.37 27v390q0 24.75-17.62 42.37Q764.75-120 740-120H590q-12.75 0-21.37-8.63Q560-137.25 560-150v-220q0-12.75-8.62-21.38Q542.75-400 530-400H430q-12.75 0-21.37 8.62Q400-382.75 400-370v220q0 12.75-8.62 21.37Q382.75-120 370-120H220q-24.75 0-42.37-17.63Q160-155.25 160-180Z"
};
var FIT = "scale(0.019) translate(-480 480)";
function FacilityGlyph({ kind, color }) {
  const d = _nullishCoalesce(PATHS[kind], () => ( PATHS.dock));
  return h("g", { fill: color, pointerEvents: "none", transform: FIT }, h("path", { d }));
}

// components/robotics/FacilityTransition.jsx
var _jsxruntime = require('react/jsx-runtime');
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
  const toMatches = _optionalChain([transition, 'access', _ => _.to, 'optionalAccess', _2 => _2.mapId]) === activeMapId;
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
  const from = _nullishCoalesce(transition.from.label, () => ( transition.from.mapId));
  const endpointDescription = transition.to ? `${from}\uC5D0\uC11C ${_nullishCoalesce(transition.to.label, () => ( transition.to.mapId))}\uAE4C\uC9C0` : `${from}\uC5D0\uC11C \uC2DC\uC791`;
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
var PIN_PATH = "M0 15 Q-6 10 -9.2 5 A10.5 10.5 0 1 1 9.2 5 Q6 10 0 15 Z";
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
  const [focusVisible, setFocusVisible] = _react2.default.useState(false);
  const endpoint = endpointForMap(transition, activeMapId);
  const availability = _nullishCoalesce(AVAILABILITY_PRESENTATION[transition.availability], () => ( AVAILABILITY_PRESENTATION.unknown));
  const interactive = typeof onActivate === "function";
  const pointerOnly = ariaHidden === true || ariaHidden === "true";
  const activeFocus = !pointerOnly && (focused || focusVisible);
  const scale = safeScale(viewportScale);
  const inverseScale = 1 / scale;
  const stroke = invalid ? "var(--viewer-danger, var(--color-semantic-status-negative-foreground))" : disabled ? "var(--viewer-muted, var(--color-semantic-label-alternative))" : availability.stroke;
  const dash = invalid ? "4 3" : stale ? "2 4" : availability.dash;
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
    stale ? { kind: "stale", tone: "var(--viewer-muted, var(--color-semantic-label-alternative))", dash: "2 2" } : null
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
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "g",
    {
      ...rest,
      role: pointerOnly ? void 0 : _nullishCoalesce(role, () => ( (interactive ? "button" : "img"))),
      tabIndex: pointerOnly ? void 0 : interactive ? disabled ? -1 : _nullishCoalesce(tabIndex, () => ( 0)) : tabIndex,
      focusable: pointerOnly ? "false" : interactive && !disabled ? "true" : void 0,
      "aria-hidden": pointerOnly || void 0,
      "aria-label": pointerOnly ? void 0 : _nullishCoalesce(ariaLabel, () => ( computedLabel)),
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
      "data-to-map-id": _optionalChain([transition, 'access', _3 => _3.to, 'optionalAccess', _4 => _4.mapId]),
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
        _optionalChain([onMouseDown, 'optionalCall', _5 => _5(event)]);
      },
      onFocus: (event) => {
        if (!pointerOnly) setFocusVisible(_chunkQDSVSP6Ncjs.isFocusVisibleTarget.call(void 0, event.currentTarget));
        _optionalChain([onFocus, 'optionalCall', _6 => _6(event)]);
      },
      onBlur: (event) => {
        setFocusVisible(false);
        _optionalChain([onBlur, 'optionalCall', _7 => _7(event)]);
      },
      style: {
        cursor: interactive && !disabled ? "pointer" : disabled ? "not-allowed" : "default",
        opacity: disabled ? 0.45 : stale ? 0.76 : 1,
        outline: "none",
        ...style
      },
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "g", { transform: `scale(${inverseScale})`, "data-transition-screen-space": "", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: PIN_PATH, transform: "translate(0 0.8)", fill: "var(--color-semantic-static-black)", opacity: "0.16", pointerEvents: "none", "data-transition-shadow": "" }),
        activeFocus && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: PIN_PATH, transform: "scale(1.34)", fill: "none", stroke: "var(--color-semantic-focus-indicator)", strokeWidth: "2.5", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke", pointerEvents: "none", "data-transition-focus-ring": "" }),
        selected && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: PIN_PATH, transform: "scale(1.16)", fill: "none", stroke: "var(--viewer-accent, var(--color-semantic-primary-normal))", strokeWidth: "2", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke", pointerEvents: "none", "data-transition-selection-ring": "" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "circle",
          {
            r: "17",
            fill: "transparent",
            stroke: "none",
            pointerEvents: interactive ? "all" : "none",
            "data-transition-hit-area": "",
            "data-screen-target-size": "24"
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "path",
          {
            d: PIN_PATH,
            fill: stroke,
            vectorEffect: "non-scaling-stroke",
            "data-transition-marker": ""
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          FacilityGlyph,
          {
            kind: transition.kind,
            color: "var(--viewer-surface-elevated, var(--color-semantic-static-white))",
            badge: stroke
          }
        ),
        transition.availability === "unavailable" && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "g", { pointerEvents: "none", "data-transition-unavailable-mark": "", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M-6.5 6.5L6.5-6.5", fill: "none", stroke, strokeWidth: "5", strokeLinecap: "round", vectorEffect: "non-scaling-stroke" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M-6.5 6.5L6.5-6.5", fill: "none", stroke: "var(--color-semantic-static-white)", strokeWidth: "2", strokeLinecap: "round", vectorEffect: "non-scaling-stroke" })
        ] }),
        stateBadges.length > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "g", { "data-transition-state-slot-layer": "", pointerEvents: "none", children: stateBadges.map((state) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "g",
          {
            transform: `translate(${state.x} -28)`,
            "data-transition-state-slot": state.kind,
            "data-transition-unknown-mark": state.kind === "unknown" ? "" : void 0,
            "data-transition-invalid-mark": state.kind === "invalid" ? "" : void 0,
            "data-transition-stale-mark": state.kind === "stale" ? "" : void 0,
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "circle",
                {
                  r: "7",
                  fill: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))",
                  stroke: state.tone,
                  strokeWidth: "1.5",
                  strokeDasharray: state.dash,
                  vectorEffect: "non-scaling-stroke"
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _chunkQDSVSP6Ncjs.NavigationStateGlyph,
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
        showLabel && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
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
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "tspan", { x: "20", dy: "0", children: [
                endpointLabel,
                " \xB7 ",
                transition.label
              ] }),
              rows.map((row, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "tspan", { x: "20", dy: "13", style: { fontSize: "var(--caption2-size)", fontWeight: "var(--fw-semibold)" }, children: row }, `${transition.id}-row-${index}`))
            ]
          }
        )
      ] })
    }
  );
}



exports.FacilityTransition = FacilityTransition;
//# sourceMappingURL=chunk-7TRPNO5S.cjs.map