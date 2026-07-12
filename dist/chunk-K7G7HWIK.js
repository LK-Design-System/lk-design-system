"use client";
import {
  useRovingToolbar
} from "./chunk-7H4MEBA2.js";
import {
  Divider
} from "./chunk-5V24OP2A.js";
import {
  IconButton
} from "./chunk-ODAJPEYM.js";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/editor/HistoryToolbar.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
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
    { key: "undo", label: "\uC2E4\uD589 \uCDE8\uC18C", icon: /* @__PURE__ */ jsx(Icon, { name: "flip-backward", size: 16, "aria-hidden": "true" }), enabled: undoEnabled, onClick: onUndo, shortcuts: undoKeyShortcuts },
    { key: "redo", label: "\uB2E4\uC2DC \uC2E4\uD589", icon: /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", transform: "scaleX(-1)" }, children: /* @__PURE__ */ jsx(Icon, { name: "flip-backward", size: 16, "aria-hidden": "true" }) }), enabled: redoEnabled, onClick: onRedo, shortcuts: redoKeyShortcuts },
    ...resetVisible ? [{ key: "reset", label: "\uBCC0\uACBD\uC0AC\uD56D \uCD08\uAE30\uD654", icon: /* @__PURE__ */ jsx(Icon, { name: "reset", size: 16, "aria-hidden": "true" }), enabled: true, onClick: onReset }] : []
  ];
  const enabledActions = actions.filter((action) => action.enabled);
  const preferredKey = enabledActions[0]?.key;
  const { toolbarRef, handleFocusCapture, handleKeyDown } = useRovingToolbar({
    itemSelector: "[data-lk-history-toolbar-item]",
    orientation: "horizontal",
    preferredKey,
    onKeyDown,
    onFocusCapture
  });
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: toolbarRef,
      role,
      "aria-label": ariaLabel ?? label,
      "aria-orientation": role === "toolbar" ? "horizontal" : void 0,
      "aria-disabled": enabledActions.length === 0 || void 0,
      tabIndex: enabledActions.length === 0 ? tabIndex ?? 0 : tabIndex,
      onKeyDown: handleKeyDown,
      onFocusCapture: handleFocusCapture,
      style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: actions.map((action, index) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
        action.key === "reset" && /* @__PURE__ */ jsx(Divider, { vertical: true, style: { minHeight: size === "md" ? 24 : 20, marginInline: "var(--space-1)", alignSelf: "center" } }),
        /* @__PURE__ */ jsx(
          IconButton,
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

export {
  HistoryToolbar
};
//# sourceMappingURL=chunk-K7G7HWIK.js.map