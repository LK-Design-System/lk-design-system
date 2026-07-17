"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkGKSI3QZ5cjs = require('./chunk-GKSI3QZ5.cjs');







var _chunkGCBNKQWDcjs = require('./chunk-GCBNKQWD.cjs');




var _chunk4KWJ7MLTcjs = require('./chunk-4KWJ7MLT.cjs');

// components/robotics/WaypointMarker.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);

// components/robotics/_navigationEncoding.js
var ROLE_CODE = {
  holding: "H",
  passthrough: "T",
  parking: "P",
  charger: "C"
};
var ANNOTATION_CODE = {
  dock: "dock",
  cleaning: "clean",
  dispenser: "disp",
  ingestor: "ing",
  "lift-approach": "lift",
  "door-approach": "door",
  mutex: "mutex",
  custom: "custom"
};

// components/robotics/WaypointMarker.jsx
var _jsxruntime = require('react/jsx-runtime');
var ROLE_LABELS = {
  holding: "\uB300\uAE30 \uC9C0\uC810",
  passthrough: "\uD1B5\uACFC \uC9C0\uC810",
  parking: "\uC8FC\uCC28 \uC9C0\uC810",
  charger: "\uCDA9\uC804 \uC9C0\uC810"
};
var ANNOTATION_LABELS = {
  dock: "\uB3C4\uD0B9",
  cleaning: "\uCCAD\uC18C",
  dispenser: "\uC790\uC7AC \uACF5\uAE09",
  ingestor: "\uC790\uC7AC \uC218\uAC70",
  "lift-approach": "\uC2B9\uAC15\uAE30 \uC811\uADFC",
  "door-approach": "\uBB38 \uC811\uADFC",
  mutex: "\uC0C1\uD638 \uBC30\uC81C",
  custom: "\uC0AC\uC6A9\uC790 \uC815\uC758"
};
var AVAILABILITY_LABELS = {
  available: "\uC0AC\uC6A9 \uAC00\uB2A5",
  unavailable: "\uC0AC\uC6A9 \uBD88\uAC00",
  unknown: "\uC0C1\uD0DC \uBBF8\uD655\uC778"
};
function normalizeViewportScale(value) {
  return Number.isFinite(value) && value > 0 ? value : 1;
}
function semanticSummary(waypoint) {
  const roleCodes = (waypoint.roles || []).map((role) => ROLE_CODE[role]);
  const annotationCodes = (waypoint.annotations || []).map((annotation) => ANNOTATION_CODE[annotation.kind]);
  const codes = [...roleCodes, ...annotationCodes].filter(Boolean);
  if (codes.length <= 3) return codes.join(" \xB7 ");
  return `${codes.slice(0, 3).join(" \xB7 ")} +${codes.length - 3}`;
}
function accessibleName(waypoint, { selected, focused, disabled, invalid, stale }) {
  const roles = (waypoint.roles || []).map((role) => ROLE_LABELS[role] || role);
  const annotations = (waypoint.annotations || []).map((annotation) => {
    const kind = ANNOTATION_LABELS[annotation.kind] || annotation.kind;
    return annotation.label ? `${annotation.label} (${kind})` : kind;
  });
  const availability = waypoint.availability || "unknown";
  const states = [
    `\uAC00\uC6A9\uC131 ${AVAILABILITY_LABELS[availability] || availability}`,
    selected && "\uC120\uD0DD\uB428",
    focused && "\uD3EC\uCEE4\uC2A4\uB428",
    disabled && "\uC120\uD0DD\uD560 \uC218 \uC5C6\uC74C",
    invalid && "\uB370\uC774\uD130 \uC624\uB958",
    stale && "\uC624\uB798\uB41C \uB370\uC774\uD130"
  ].filter(Boolean);
  return [
    waypoint.label,
    `\uC9C0\uB3C4 ${waypoint.mapId}`,
    roles.length > 0 && `\uC5ED\uD560 ${roles.join(", ")}`,
    annotations.length > 0 && `\uC8FC\uC11D ${annotations.join(", ")}`,
    ...states
  ].filter(Boolean).join(", ");
}
function WaypointMarker({
  waypoint,
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
  const [hasDomFocus, setHasDomFocus] = _react2.default.useState(false);
  const obstacle = _chunk4KWJ7MLTcjs.useNavigationObstacles.call(void 0, );
  const scale = normalizeViewportScale(viewportScale);
  const inverseScale = 1 / scale;
  const interactive = typeof onActivate === "function";
  const pointerOnly = ariaHidden === true || ariaHidden === "true";
  const focusVisible = !pointerOnly && (focused || hasDomFocus);
  const availability = waypoint.availability || "unknown";
  const compoundUnknownInvalid = availability === "unknown" && invalid;
  const details = semanticSummary(waypoint);
  const label = _nullishCoalesce(ariaLabel, () => ( accessibleName(waypoint, {
    selected,
    focused: focusVisible,
    disabled,
    invalid,
    stale
  })));
  const foreground = "var(--viewer-foreground, var(--color-semantic-label-strong))";
  const muted = "var(--viewer-muted, var(--color-semantic-label-neutral))";
  const surface = "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))";
  const stateColor = invalid || availability === "unavailable" ? "var(--viewer-danger, var(--color-semantic-status-negative-foreground))" : availability === "unknown" ? "var(--viewer-warning, var(--color-semantic-status-cautionary-foreground))" : foreground;
  const selectedGlyphInk = "var(--color-semantic-static-white)";
  const activate = (event) => {
    if (disabled || !interactive) return;
    onActivate(waypoint.id, event);
  };
  const handleKeyDown = (event) => {
    if (!pointerOnly) setHasDomFocus(true);
    if (pointerOnly || disabled || !interactive || event.repeat) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activate(event);
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "g",
    {
      ...rest,
      "data-waypoint-marker": "",
      "data-waypoint-id": waypoint.id,
      "data-map-id": waypoint.mapId,
      "data-availability": availability,
      "data-selected": selected ? "true" : "false",
      "data-focused": focusVisible ? "true" : "false",
      "data-disabled": disabled ? "true" : "false",
      "data-invalid": invalid ? "true" : "false",
      "data-stale": stale ? "true" : "false",
      "data-role-codes": (waypoint.roles || []).map((role2) => ROLE_CODE[role2]).filter(Boolean).join(""),
      "data-annotation-count": (waypoint.annotations || []).length,
      transform: `translate(${waypoint.position.x} ${waypoint.position.y})`,
      role: pointerOnly ? void 0 : _nullishCoalesce(role, () => ( (interactive ? "button" : "img"))),
      tabIndex: pointerOnly ? void 0 : interactive ? disabled ? -1 : _nullishCoalesce(tabIndex, () => ( 0)) : tabIndex,
      focusable: pointerOnly ? "false" : interactive && !disabled ? "true" : void 0,
      "aria-hidden": pointerOnly || void 0,
      "aria-label": pointerOnly ? void 0 : label,
      "aria-pressed": !pointerOnly && interactive ? selected : void 0,
      "aria-disabled": !pointerOnly && interactive && disabled ? true : void 0,
      "aria-invalid": !pointerOnly && invalid ? true : void 0,
      onClick: activate,
      onKeyDown: handleKeyDown,
      onMouseDown: (event) => {
        if (pointerOnly) event.preventDefault();
        _optionalChain([onMouseDown, 'optionalCall', _ => _(event)]);
      },
      onFocus: (event) => {
        if (!pointerOnly) setHasDomFocus(_chunkGCBNKQWDcjs.isFocusVisibleTarget.call(void 0, event.currentTarget));
        _optionalChain([onFocus, 'optionalCall', _2 => _2(event)]);
      },
      onBlur: (event) => {
        setHasDomFocus(false);
        _optionalChain([onBlur, 'optionalCall', _3 => _3(event)]);
      },
      style: {
        cursor: disabled ? "not-allowed" : interactive ? "pointer" : "default",
        opacity: _chunkGCBNKQWDcjs.navStateOpacity.call(void 0, disabled, stale),
        outline: "none",
        ...style
      },
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
        "g",
        {
          "data-waypoint-screen-space": "",
          "data-viewport-scale": scale,
          transform: `scale(${inverseScale})`,
          children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "polygon",
              {
                "data-waypoint-shadow": "",
                points: "0,-7.5 7.5,0 0,7.5 -7.5,0",
                transform: "translate(0 1.4)",
                fill: "var(--color-semantic-static-black)",
                opacity: "0.16",
                pointerEvents: "none"
              }
            ),
            (invalid || availability === "unavailable") && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "circle",
              {
                "data-waypoint-attention": "",
                r: "10.5",
                fill: "none",
                stroke: stateColor,
                strokeWidth: "2.5",
                opacity: "0.4",
                vectorEffect: "non-scaling-stroke",
                pointerEvents: "none"
              }
            ),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "circle",
              {
                "data-waypoint-hit-area": "",
                "data-screen-target-size": _chunkGCBNKQWDcjs.NAV_HIT.screenTargetSize,
                r: _chunkGCBNKQWDcjs.NAV_HIT.radius,
                fill: "transparent",
                pointerEvents: interactive ? "all" : "none"
              }
            ),
            focusVisible && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "polygon",
              {
                "data-waypoint-focus-indicator": "",
                points: "0,-7 7,0 0,7 -7,0",
                transform: "scale(1.5)",
                fill: "none",
                stroke: "var(--color-semantic-focus-indicator)",
                strokeWidth: "2",
                strokeLinejoin: "round",
                vectorEffect: "non-scaling-stroke"
              }
            ),
            stale && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "circle",
              {
                "data-waypoint-stale-indicator": "",
                r: "9.5",
                fill: "none",
                stroke: muted,
                strokeWidth: "1.5",
                strokeDasharray: _chunkGCBNKQWDcjs.NAV_DASH.staleRing,
                vectorEffect: "non-scaling-stroke"
              }
            ),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "polygon",
              {
                ...obstacle(`waypoint:${waypoint.id}:point`),
                "data-waypoint-point": "",
                "data-waypoint-selected-indicator": selected ? "" : void 0,
                points: "0,-7 7,0 0,7 -7,0",
                fill: selected ? "var(--viewer-accent, var(--color-semantic-primary-normal))" : surface,
                stroke: selected ? "var(--viewer-accent, var(--color-semantic-primary-normal))" : stateColor,
                strokeWidth: "2.25",
                strokeLinejoin: "round",
                vectorEffect: "non-scaling-stroke"
              }
            ),
            availability === "unavailable" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "path",
              {
                "data-waypoint-unavailable-indicator": "",
                d: "M-4.5 4.5 L4.5 -4.5",
                fill: "none",
                stroke: selected ? selectedGlyphInk : "var(--viewer-danger, var(--color-semantic-status-negative-foreground))",
                strokeWidth: "2",
                strokeLinecap: "round",
                vectorEffect: "non-scaling-stroke"
              }
            ),
            availability === "unknown" && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
              "g",
              {
                ...obstacle(`waypoint:${waypoint.id}:unknown`),
                "data-waypoint-unknown-indicator": "",
                "data-waypoint-state-slot": "unknown",
                transform: compoundUnknownInvalid ? "translate(-8 -8)" : void 0,
                "aria-hidden": "true",
                children: [
                  compoundUnknownInvalid && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "circle",
                    {
                      "data-waypoint-state-circle": "unknown",
                      r: _chunkGCBNKQWDcjs.NAV_STATE_BADGE.radius,
                      fill: surface,
                      stroke: "var(--viewer-warning, var(--color-semantic-status-cautionary-foreground))",
                      strokeWidth: _chunkGCBNKQWDcjs.NAV_STATE_BADGE.strokeWidth,
                      vectorEffect: "non-scaling-stroke"
                    }
                  ),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    _chunkGKSI3QZ5cjs.NavigationStateGlyph,
                    {
                      kind: "unknown",
                      size: 10,
                      color: selected && !compoundUnknownInvalid ? selectedGlyphInk : foreground,
                      "data-waypoint-state-glyph-geometry": "unknown"
                    }
                  )
                ]
              }
            ),
            invalid && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
              "g",
              {
                ...obstacle(`waypoint:${waypoint.id}:invalid`),
                "data-waypoint-invalid-indicator": "",
                "data-waypoint-state-slot": "invalid",
                transform: compoundUnknownInvalid ? "translate(-8 8)" : void 0,
                "aria-hidden": "true",
                children: [
                  compoundUnknownInvalid && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "circle",
                    {
                      "data-waypoint-state-circle": "invalid",
                      r: _chunkGCBNKQWDcjs.NAV_STATE_BADGE.radius,
                      fill: surface,
                      stroke: "var(--viewer-danger, var(--color-semantic-status-negative-foreground))",
                      strokeWidth: _chunkGCBNKQWDcjs.NAV_STATE_BADGE.strokeWidth,
                      vectorEffect: "non-scaling-stroke"
                    }
                  ),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    _chunkGKSI3QZ5cjs.NavigationStateGlyph,
                    {
                      kind: "invalid",
                      size: 10,
                      color: selected && !compoundUnknownInvalid ? selectedGlyphInk : foreground,
                      "data-waypoint-state-glyph-geometry": "invalid"
                    }
                  )
                ]
              }
            ),
            showLabel && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              _chunk4KWJ7MLTcjs.NavigationAnnotationBlock,
              {
                id: `waypoint:${waypoint.id}:label`,
                kind: "waypoint-label",
                anchor: waypoint.position,
                priority: _chunk4KWJ7MLTcjs.annotationPriority.call(void 0, {
                  selected,
                  focused: focusVisible,
                  alarm: invalid || availability === "unavailable"
                }),
                children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "g", { "data-waypoint-label": "", "data-waypoint-label-offset-x": "15", pointerEvents: "none", "aria-hidden": "true", children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "text",
                    {
                      "data-waypoint-primary-label": "",
                      x: "15",
                      y: details ? "-1.5" : "3.5",
                      fill: foreground,
                      stroke: surface,
                      strokeWidth: _chunkGCBNKQWDcjs.NAV_LABEL_HALO.primary,
                      strokeLinejoin: "round",
                      paintOrder: "stroke",
                      vectorEffect: "non-scaling-stroke",
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--label2-size)",
                      fontWeight: "var(--fw-bold)",
                      children: waypoint.label
                    }
                  ),
                  details && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "text",
                    {
                      "data-waypoint-details": "",
                      x: "15",
                      y: "10",
                      fill: muted,
                      stroke: surface,
                      strokeWidth: _chunkGCBNKQWDcjs.NAV_LABEL_HALO.secondary,
                      strokeLinejoin: "round",
                      paintOrder: "stroke",
                      vectorEffect: "non-scaling-stroke",
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--caption2-size)",
                      fontWeight: "var(--fw-semibold)",
                      children: details
                    }
                  )
                ] })
              }
            )
          ]
        }
      )
    }
  );
}



exports.WaypointMarker = WaypointMarker;
//# sourceMappingURL=chunk-SJP3NPBK.cjs.map