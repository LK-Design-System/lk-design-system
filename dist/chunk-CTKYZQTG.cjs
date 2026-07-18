"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk7QTG7XVGcjs = require('./chunk-7QTG7XVG.cjs');






var _chunkAZGN4HJOcjs = require('./chunk-AZGN4HJO.cjs');




var _chunk4KWJ7MLTcjs = require('./chunk-4KWJ7MLT.cjs');

// components/robotics/HazardMarker.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);

// components/robotics/_HazardGlyph.js
var HAZARD_GLYPH_PATHS = {
  stairs: "M120-200q-17 0-28.5-11.5T80-240q0-17 11.5-28.5T120-280h200v-200q0-17 11.5-28.5T360-520h200v-200q0-17 11.5-28.5T600-760h240q17 0 28.5 11.5T880-720q0 17-11.5 28.5T840-680H640v200q0 17-11.5 28.5T600-440H400v200q0 17-11.5 28.5T360-200H120Z",
  dropoff: "M140-660H460V-320H820V-240H380V-580H140Z M620-760H700V-520H780L660-380L540-520H620Z",
  obstacle: "M430-760H530L630-360H330Z M240-320H720V-240H240Z"
};
var HAZARD_GLYPH_FIT = "scale(0.016) translate(-480 480)";

// components/robotics/HazardMarker.jsx
var _jsxruntime = require('react/jsx-runtime');
var KIND_LABELS = {
  stairs: "\uACC4\uB2E8",
  ramp: "\uACBD\uC0AC\uB85C",
  dropoff: "\uB2E8\uCC28\xB7\uB099\uD558",
  // Reads as "충돌 위험" in the `${kind} 위험` accessible-name slot.
  obstacle: "\uCDA9\uB3CC"
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
var HAZARD_GLYPHS = { ...HAZARD_GLYPH_PATHS, ramp: _chunk7QTG7XVGcjs.FACILITY_GLYPH_PATHS.ramp };
var GLYPH_FIT = HAZARD_GLYPH_FIT;
var PIN_PATH = _chunkAZGN4HJOcjs.NAV_PIN.path;
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
  const [hasDomFocus, setHasDomFocus] = _react2.default.useState(false);
  const obstacle = _chunk4KWJ7MLTcjs.useNavigationObstacles.call(void 0, );
  const scale = normalizeViewportScale(viewportScale);
  const inverseScale = 1 / scale;
  const interactive = typeof onActivate === "function";
  const pointerOnly = ariaHidden === true || ariaHidden === "true";
  const focusVisible = !pointerOnly && (focused || hasDomFocus);
  const severity = _nullishCoalesce(SEVERITY_PRESENTATION[hazard.severity], () => ( SEVERITY_PRESENTATION.caution));
  const glyph = _nullishCoalesce(HAZARD_GLYPHS[hazard.kind], () => ( HAZARD_GLYPHS.stairs));
  const surface = "var(--viewer-surface-elevated, var(--color-semantic-static-white))";
  const label = _nullishCoalesce(ariaLabel, () => ( accessibleName(hazard, severity, { selected, focused: focusVisible, disabled })));
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
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
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
      role: pointerOnly ? void 0 : _nullishCoalesce(role, () => ( (interactive ? "button" : "img"))),
      tabIndex: pointerOnly ? void 0 : interactive ? disabled ? -1 : _nullishCoalesce(tabIndex, () => ( 0)) : tabIndex,
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
        _optionalChain([onMouseDown, 'optionalCall', _ => _(event)]);
      },
      onFocus: (event) => {
        if (!pointerOnly) setHasDomFocus(_chunkAZGN4HJOcjs.isFocusVisibleTarget.call(void 0, event.currentTarget));
        _optionalChain([onFocus, 'optionalCall', _2 => _2(event)]);
      },
      onBlur: (event) => {
        setHasDomFocus(false);
        _optionalChain([onBlur, 'optionalCall', _3 => _3(event)]);
      },
      style: {
        cursor: disabled ? "not-allowed" : interactive ? "pointer" : "default",
        opacity: _chunkAZGN4HJOcjs.navStateOpacity.call(void 0, disabled, stale),
        outline: "none",
        ...style
      },
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "g", { "data-hazard-screen-space": "", "data-viewport-scale": scale, transform: `scale(${inverseScale})`, children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: PIN_PATH, transform: _chunkAZGN4HJOcjs.NAV_PIN.shadow.transform, fill: _chunkAZGN4HJOcjs.NAV_PIN.shadow.fill, opacity: _chunkAZGN4HJOcjs.NAV_PIN.shadow.opacity, pointerEvents: "none", "data-hazard-shadow": "" }),
        focusVisible && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: PIN_PATH, transform: `scale(${_chunkAZGN4HJOcjs.NAV_PIN.focusRing.scale})`, fill: "none", stroke: "var(--color-semantic-focus-indicator)", strokeWidth: _chunkAZGN4HJOcjs.NAV_PIN.focusRing.strokeWidth, strokeLinejoin: "round", vectorEffect: "non-scaling-stroke", pointerEvents: "none", "data-hazard-focus-ring": "" }),
        selected && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: PIN_PATH, transform: `scale(${_chunkAZGN4HJOcjs.NAV_PIN.selectionRing.scale})`, fill: "none", stroke: "var(--viewer-accent, var(--color-semantic-primary-normal))", strokeWidth: _chunkAZGN4HJOcjs.NAV_PIN.selectionRing.strokeWidth, strokeLinejoin: "round", vectorEffect: "non-scaling-stroke", pointerEvents: "none", "data-hazard-selection-ring": "" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "circle", { r: _chunkAZGN4HJOcjs.NAV_HIT.radius, fill: "transparent", stroke: "none", pointerEvents: interactive ? "all" : "none", "data-hazard-hit-area": "", "data-screen-target-size": _chunkAZGN4HJOcjs.NAV_HIT.screenTargetSize }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "path",
          {
            ...obstacle(`hazard:${hazard.id}:sign`),
            d: PIN_PATH,
            fill: severity.fill,
            vectorEffect: "non-scaling-stroke",
            "data-hazard-sign": ""
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "g", { fill: surface, pointerEvents: "none", transform: GLYPH_FIT, "data-hazard-glyph": "", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: glyph }) }),
        showLabel && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunk4KWJ7MLTcjs.NavigationAnnotationBlock,
          {
            id: `hazard:${hazard.id}:label`,
            kind: "hazard-label",
            anchor: hazard.position,
            priority: _chunk4KWJ7MLTcjs.annotationPriority.call(void 0, { selected, focused: focusVisible, alarm: hazard.severity === "danger" }),
            children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
              "text",
              {
                x: "20",
                y: "-8",
                textAnchor: "start",
                fill: "var(--viewer-foreground, var(--color-semantic-label-strong))",
                stroke: "var(--viewer-surface, var(--color-semantic-background-normal-normal))",
                strokeWidth: _chunkAZGN4HJOcjs.NAV_LABEL_HALO.primary,
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



exports.HazardMarker = HazardMarker;
//# sourceMappingURL=chunk-CTKYZQTG.cjs.map