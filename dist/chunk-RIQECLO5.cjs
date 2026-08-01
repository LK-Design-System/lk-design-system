"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk3VE2HGTTcjs = require('./chunk-3VE2HGTT.cjs');


var _chunk63NPKSTXcjs = require('./chunk-63NPKSTX.cjs');


var _chunkVWNQOLARcjs = require('./chunk-VWNQOLAR.cjs');

// components/editor/HistoryToolbar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);

// packages/core/dist/chunk-UI2I2TV5.js

var _jsxruntime = require('react/jsx-runtime');
function Divider({
  vertical = false,
  label,
  inset = 0,
  variant = "normal",
  decorative = false,
  style,
  ...rest
}) {
  const thickness = variant === "thick" ? "var(--component-divider-thickness-thick)" : "var(--component-divider-thickness-normal)";
  const color = variant === "thick" ? "var(--component-divider-color-thick)" : "var(--component-divider-color-normal)";
  const decorativeProps = { role: "none", "aria-hidden": "true" };
  const semantics = decorative ? decorativeProps : null;
  const verticalSemantics = decorative ? decorativeProps : { role: "separator", "aria-orientation": "vertical" };
  if (vertical) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "span",
      {
        ...verticalSemantics,
        style: {
          display: "inline-block",
          width: thickness,
          alignSelf: "stretch",
          minHeight: 32,
          background: color,
          ...style
        },
        ...rest
      }
    );
  }
  if (label != null) {
    const rule = { flex: 1, height: thickness, background: color };
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      "div",
      {
        ...decorative ? decorativeProps : {
          role: "separator",
          /* separator gets no name from its contents — expose the visible
             label explicitly so "또는" is announced, not just a boundary. */
          "aria-label": typeof label === "string" ? label : void 0
        },
        style: { display: "flex", alignItems: "center", gap: "var(--space-3-5)", ...style },
        ...rest,
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: rule }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "span",
            {
              style: {
                fontFamily: "var(--font-sans)",
                fontSize: "var(--label2-size)",
                fontWeight: "var(--fw-semibold)",
                letterSpacing: 0,
                color: "var(--color-semantic-label-alternative)",
                whiteSpace: "nowrap"
              },
              children: label
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: rule })
        ]
      }
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "hr",
    {
      ...semantics,
      style: {
        border: "none",
        height: thickness,
        background: color,
        margin: `0 ${inset}px`,
        ...style
      },
      ...rest
    }
  );
}

// components/editor/HistoryToolbar.jsx

function HistoryToolbar({
  label = "\uD3B8\uC9D1 \uC774\uB825",
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onReset,
  undoKeyShortcuts,
  redoKeyShortcuts,
  size = "sm",
  role = "toolbar",
  tabIndex,
  onKeyDown,
  onFocusCapture,
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  const undoEnabled = canUndo && typeof onUndo === "function";
  const redoEnabled = canRedo && typeof onRedo === "function";
  const resetVisible = typeof onReset === "function";
  const actions = [
    { key: "undo", label: "\uC2E4\uD589 \uCDE8\uC18C", icon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk63NPKSTXcjs.Icon, { name: "flip-backward", size: 16, "aria-hidden": "true" }), enabled: undoEnabled, onClick: onUndo, shortcuts: undoKeyShortcuts },
    { key: "redo", label: "\uB2E4\uC2DC \uC2E4\uD589", icon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", transform: "scaleX(-1)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk63NPKSTXcjs.Icon, { name: "flip-backward", size: 16, "aria-hidden": "true" }) }), enabled: redoEnabled, onClick: onRedo, shortcuts: redoKeyShortcuts },
    ...resetVisible ? [{ key: "reset", label: "\uBCC0\uACBD\uC0AC\uD56D \uCD08\uAE30\uD654", icon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk63NPKSTXcjs.Icon, { name: "reset", size: 16, "aria-hidden": "true" }), enabled: true, onClick: onReset }] : []
  ];
  const enabledActions = actions.filter((action) => action.enabled);
  const preferredKey = _optionalChain([enabledActions, 'access', _ => _[0], 'optionalAccess', _2 => _2.key]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    _chunk3VE2HGTTcjs.Toolbar,
    {
      role,
      "aria-label": ariaLabel,
      label,
      orientation: "horizontal",
      itemSelector: "[data-lk-history-toolbar-item]",
      preferredItemKey: preferredKey,
      "aria-disabled": enabledActions.length === 0 || void 0,
      tabIndex: enabledActions.length === 0 ? _nullishCoalesce(tabIndex, () => ( 0)) : tabIndex,
      onKeyDown,
      onFocusCapture,
      style: {
        gap: "var(--space-1)",
        padding: 0,
        background: "transparent",
        border: 0,
        borderRadius: 0,
        boxShadow: "none",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: actions.map((action, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
        action.key === "reset" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Divider, { vertical: true, style: { minHeight: size === "md" ? 24 : 20, marginInline: "var(--space-1)", alignSelf: "center" } }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkVWNQOLARcjs.IconButton,
          {
            "data-history-index": index,
            "data-lk-history-toolbar-item": "",
            "data-lk-toolbar-key": action.key,
            variant: "ghost",
            round: false,
            size,
            disabled: !action.enabled,
            onClick: action.enabled ? action.onClick : void 0,
            tabIndex: action.enabled && action.key === preferredKey ? 0 : -1,
            title: action.label,
            label: action.label,
            "aria-keyshortcuts": action.shortcuts,
            children: action.icon
          }
        )
      ] }, action.key))
    }
  );
}




exports.Divider = Divider; exports.HistoryToolbar = HistoryToolbar;
//# sourceMappingURL=chunk-RIQECLO5.cjs.map