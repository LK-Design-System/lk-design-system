"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkFVL575B5cjs = require('./chunk-FVL575B5.cjs');



<<<<<<<< HEAD:dist/chunk-3JY6XCKO.cjs
<<<<<<<< HEAD:dist/chunk-3JY6XCKO.cjs
var _chunk7WM5AZWScjs = require('./chunk-7WM5AZWS.cjs');


var _chunk3H3EZZTFcjs = require('./chunk-3H3EZZTF.cjs');


var _chunk5H5GEWU5cjs = require('./chunk-5H5GEWU5.cjs');
========
var _chunkSWWCCPCOcjs = require('./chunk-SWWCCPCO.cjs');
>>>>>>>> codex/consolidate-release-check:dist/chunk-7TVRV3CR.cjs
========
var _chunkYQAFCY5Xcjs = require('./chunk-YQAFCY5X.cjs');
>>>>>>>> codex/consolidate-release-ci:dist/chunk-HR37WYG3.cjs


var _chunk3VE2HGTTcjs = require('./chunk-3VE2HGTT.cjs');

<<<<<<<< HEAD:dist/chunk-3JY6XCKO.cjs
========

var _chunk4DG5U4UWcjs = require('./chunk-4DG5U4UW.cjs');


var _chunk63NPKSTXcjs = require('./chunk-63NPKSTX.cjs');

>>>>>>>> codex/consolidate-release-check:dist/chunk-7TVRV3CR.cjs
// components/editor/CanvasEditorCommandBar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function actionKey(action, index) {
  return _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(action.key, () => ( action.value)), () => ( action.label)), () => ( index));
}
function actionIcon(icon) {
<<<<<<<< HEAD:dist/chunk-3JY6XCKO.cjs
<<<<<<<< HEAD:dist/chunk-3JY6XCKO.cjs
  if (typeof icon === "string") return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk5H5GEWU5cjs.Icon, { name: icon, size: 16, "aria-hidden": "true" });
========
  if (typeof icon === "string") return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkLQ7SPTG7cjs.Icon, { name: icon, size: 16, "aria-hidden": "true" });
>>>>>>>> codex/consolidate-release-check:dist/chunk-7TVRV3CR.cjs
========
  if (typeof icon === "string") return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk63NPKSTXcjs.Icon, { name: icon, size: 16, "aria-hidden": "true" });
>>>>>>>> codex/consolidate-release-ci:dist/chunk-HR37WYG3.cjs
  return icon;
}
function CommandButton({ action, size, index, tabStopKey }) {
  const disabled = !!action.disabled || typeof action.onClick !== "function";
  const active = !!action.active;
  const key = String(actionKey(action, index));
  const commonProps = {
    "data-command-index": index,
    "data-lk-command-toolbar-item": "",
    "data-lk-toolbar-key": key,
    variant: "plain",
    size,
    label: action.label,
    title: action.label,
    "aria-keyshortcuts": action.ariaKeyShortcuts,
    disabled,
    tabIndex: !disabled && key === tabStopKey ? 0 : -1
  };
  if (action.active !== void 0) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunkFVL575B5cjs.ToggleIcon,
      {
        ...commonProps,
        pressed: active,
        onChange: disabled ? void 0 : () => _optionalChain([action, 'access', _ => _.onClick, 'optionalCall', _2 => _2()]),
        children: actionIcon(action.icon)
      }
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
<<<<<<<< HEAD:dist/chunk-3JY6XCKO.cjs
<<<<<<<< HEAD:dist/chunk-3JY6XCKO.cjs
    _chunk3H3EZZTFcjs.IconButton,
========
    _chunkQJNQGYQBcjs.IconButton,
>>>>>>>> codex/consolidate-release-check:dist/chunk-7TVRV3CR.cjs
========
    _chunk4DG5U4UWcjs.IconButton,
>>>>>>>> codex/consolidate-release-ci:dist/chunk-HR37WYG3.cjs
    {
      ...commonProps,
      round: false,
      onClick: disabled ? void 0 : action.onClick,
      children: actionIcon(action.icon)
    }
  );
}
function ActionToolbar({ actions, label, size }) {
  const enabledActions = actions.filter((action) => !action.disabled && typeof action.onClick === "function");
  const tabStopKey = enabledActions.length > 0 ? String(actionKey(enabledActions[0], actions.indexOf(enabledActions[0]))) : void 0;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunk3VE2HGTTcjs.Toolbar,
    {
      label,
      orientation: "horizontal",
      itemSelector: "[data-lk-command-toolbar-item]",
      preferredItemKey: tabStopKey,
      "aria-disabled": enabledActions.length === 0 || void 0,
      tabIndex: enabledActions.length === 0 ? 0 : void 0,
      style: {
        gap: "var(--space-1)",
        padding: 0,
        background: "transparent",
        border: 0,
        borderRadius: 0,
        boxShadow: "none"
      },
      children: actions.map((action, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        CommandButton,
        {
          action,
          size,
          index,
          tabStopKey
        },
        actionKey(action, index)
      ))
    }
  );
}
function visibleActions(actions) {
  return actions.filter(
    (action) => action && !action.hidden && (typeof action.onClick === "function" || action.disabled)
  );
}
function CanvasEditorCommandBar({
  label = "\uBB38\uC11C \uD3B8\uC9D1 \uBA85\uB839",
  documentLabel = "\uBB38\uC11C \uBA85\uB839",
  documentActions = [],
  viewLabel = "\uD638\uD658 \uBDF0 \uBA85\uB839",
  viewActions = [],
  size = "sm",
  showHistory = true,
  historyLabel = "\uD3B8\uC9D1 \uC774\uB825",
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onReset,
  undoKeyShortcuts,
  redoKeyShortcuts,
  children,
  extraLabel = "\uBB38\uC11C \uC791\uC5C5",
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  const actions = visibleActions(documentActions);
  const legacyViewActions = visibleActions(viewActions);
  const groups = [];
  if (showHistory) {
    groups.push({
      key: "history",
      node: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
<<<<<<<< HEAD:dist/chunk-3JY6XCKO.cjs
<<<<<<<< HEAD:dist/chunk-3JY6XCKO.cjs
        _chunk7WM5AZWScjs.HistoryToolbar,
========
        _chunkSWWCCPCOcjs.HistoryToolbar,
>>>>>>>> codex/consolidate-release-check:dist/chunk-7TVRV3CR.cjs
========
        _chunkYQAFCY5Xcjs.HistoryToolbar,
>>>>>>>> codex/consolidate-release-ci:dist/chunk-HR37WYG3.cjs
        {
          label: historyLabel,
          canUndo,
          canRedo,
          onUndo,
          onRedo,
          onReset,
          undoKeyShortcuts,
          redoKeyShortcuts,
          size
        }
      )
    });
  }
  if (actions.length > 0) {
    groups.push({ key: "document", node: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ActionToolbar, { actions, label: documentLabel, size }) });
  }
  if (legacyViewActions.length > 0) {
    groups.push({ key: "legacy-view", node: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ActionToolbar, { actions: legacyViewActions, label: viewLabel, size }) });
  }
  if (children != null) {
    groups.push({
      key: "extra",
      node: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "group", "aria-label": extraLabel, style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }, children })
    });
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "div",
    {
      ...rest,
      role: "group",
      "aria-label": _nullishCoalesce(ariaLabel, () => ( label)),
      style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", flexShrink: 0, ...style },
      children: groups.map((group, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
        index > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
<<<<<<<< HEAD:dist/chunk-3JY6XCKO.cjs
<<<<<<<< HEAD:dist/chunk-3JY6XCKO.cjs
          _chunk7WM5AZWScjs.Divider,
========
          _chunkSWWCCPCOcjs.Divider,
>>>>>>>> codex/consolidate-release-check:dist/chunk-7TVRV3CR.cjs
========
          _chunkYQAFCY5Xcjs.Divider,
>>>>>>>> codex/consolidate-release-ci:dist/chunk-HR37WYG3.cjs
          {
            vertical: true,
            style: { minHeight: size === "md" ? 24 : 20, marginInline: "var(--space-1)", alignSelf: "center" }
          }
        ),
        group.node
      ] }, group.key))
    }
  );
}



exports.CanvasEditorCommandBar = CanvasEditorCommandBar;
<<<<<<<< HEAD:dist/chunk-3JY6XCKO.cjs
<<<<<<<< HEAD:dist/chunk-3JY6XCKO.cjs
//# sourceMappingURL=chunk-3JY6XCKO.cjs.map
========
//# sourceMappingURL=chunk-7TVRV3CR.cjs.map
>>>>>>>> codex/consolidate-release-check:dist/chunk-7TVRV3CR.cjs
========
//# sourceMappingURL=chunk-HR37WYG3.cjs.map
>>>>>>>> codex/consolidate-release-ci:dist/chunk-HR37WYG3.cjs
