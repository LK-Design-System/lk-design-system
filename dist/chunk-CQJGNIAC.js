"use client";
import {
  Divider,
  HistoryToolbar
} from "./chunk-6KIBU627.js";
import {
  Toolbar
} from "./chunk-ZFB2TNZT.js";
import {
  IconButton
} from "./chunk-E7IJC64H.js";
import {
  Icon
} from "./chunk-KRO3ULVK.js";

// components/editor/CanvasEditorCommandBar.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function actionKey(action, index) {
  return action.key ?? action.value ?? action.label ?? index;
}
function actionIcon(icon) {
  if (typeof icon === "string") return /* @__PURE__ */ jsx(Icon, { name: icon, size: 16, "aria-hidden": "true" });
  return icon;
}
function CommandButton({ action, size, index, tabStopKey }) {
  const disabled = !!action.disabled || typeof action.onClick !== "function";
  const active = !!action.active;
  const key = String(actionKey(action, index));
  return /* @__PURE__ */ jsx(
    IconButton,
    {
      "data-command-index": index,
      "data-lk-command-toolbar-item": "",
      "data-lk-toolbar-key": key,
      variant: active ? "signal" : "ghost",
      round: false,
      size,
      label: action.label,
      title: action.label,
      "aria-pressed": action.active === void 0 ? void 0 : active,
      "aria-keyshortcuts": action.ariaKeyShortcuts,
      disabled,
      tabIndex: !disabled && key === tabStopKey ? 0 : -1,
      onClick: disabled ? void 0 : action.onClick,
      children: actionIcon(action.icon)
    }
  );
}
function ActionToolbar({ actions, label, size }) {
  const enabledActions = actions.filter((action) => !action.disabled && typeof action.onClick === "function");
  const tabStopKey = enabledActions.length > 0 ? String(actionKey(enabledActions[0], actions.indexOf(enabledActions[0]))) : void 0;
  return /* @__PURE__ */ jsx(
    Toolbar,
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
      children: actions.map((action, index) => /* @__PURE__ */ jsx(
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
      node: /* @__PURE__ */ jsx(
        HistoryToolbar,
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
    groups.push({ key: "document", node: /* @__PURE__ */ jsx(ActionToolbar, { actions, label: documentLabel, size }) });
  }
  if (legacyViewActions.length > 0) {
    groups.push({ key: "legacy-view", node: /* @__PURE__ */ jsx(ActionToolbar, { actions: legacyViewActions, label: viewLabel, size }) });
  }
  if (children != null) {
    groups.push({
      key: "extra",
      node: /* @__PURE__ */ jsx("div", { role: "group", "aria-label": extraLabel, style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }, children })
    });
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...rest,
      role: "group",
      "aria-label": ariaLabel ?? label,
      style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", flexShrink: 0, ...style },
      children: groups.map((group, index) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
        index > 0 && /* @__PURE__ */ jsx(
          Divider,
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

export {
  CanvasEditorCommandBar
};
//# sourceMappingURL=chunk-CQJGNIAC.js.map