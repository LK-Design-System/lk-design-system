"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkU2H6LQXBcjs = require('./chunk-U2H6LQXB.cjs');


var _chunkIPPBHGJPcjs = require('./chunk-IPPBHGJP.cjs');


var _chunkS7GFPUQYcjs = require('./chunk-S7GFPUQY.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/editor/HistoryToolbar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
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
    { key: "undo", label: "\uC2E4\uD589 \uCDE8\uC18C", icon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "flip-backward", size: 16, "aria-hidden": "true" }), enabled: undoEnabled, onClick: onUndo, shortcuts: undoKeyShortcuts },
    { key: "redo", label: "\uB2E4\uC2DC \uC2E4\uD589", icon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", transform: "scaleX(-1)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "flip-backward", size: 16, "aria-hidden": "true" }) }), enabled: redoEnabled, onClick: onRedo, shortcuts: redoKeyShortcuts },
    ...resetVisible ? [{ key: "reset", label: "\uBCC0\uACBD\uC0AC\uD56D \uCD08\uAE30\uD654", icon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "reset", size: 16, "aria-hidden": "true" }), enabled: true, onClick: onReset }] : []
  ];
  const enabledActions = actions.filter((action) => action.enabled);
  const preferredKey = _optionalChain([enabledActions, 'access', _ => _[0], 'optionalAccess', _2 => _2.key]);
  const { toolbarRef, handleFocusCapture, handleKeyDown } = _chunkU2H6LQXBcjs.useRovingToolbar.call(void 0, {
    itemSelector: "[data-lk-history-toolbar-item]",
    orientation: "horizontal",
    preferredKey,
    onKeyDown,
    onFocusCapture
  });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "div",
    {
      ref: toolbarRef,
      role,
      "aria-label": _nullishCoalesce(ariaLabel, () => ( label)),
      "aria-orientation": role === "toolbar" ? "horizontal" : void 0,
      "aria-disabled": enabledActions.length === 0 || void 0,
      tabIndex: enabledActions.length === 0 ? _nullishCoalesce(tabIndex, () => ( 0)) : tabIndex,
      onKeyDown: handleKeyDown,
      onFocusCapture: handleFocusCapture,
      style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: actions.map((action, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
        action.key === "reset" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkIPPBHGJPcjs.Divider, { vertical: true, style: { minHeight: size === "md" ? 24 : 20, marginInline: "var(--space-1)", alignSelf: "center" } }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkS7GFPUQYcjs.IconButton,
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



exports.HistoryToolbar = HistoryToolbar;
//# sourceMappingURL=chunk-OGZ2JVEK.cjs.map