"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunk2NP74HUDcjs = require('./chunk-2NP74HUD.cjs');


var _chunkZHXNBK3Scjs = require('./chunk-ZHXNBK3S.cjs');


var _chunkFVL575B5cjs = require('./chunk-FVL575B5.cjs');


var _chunkP65KUIKJcjs = require('./chunk-P65KUIKJ.cjs');

// components/viz/ViewerToolbar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var ViewerToolbarAppearanceContext = _react2.default.createContext("minimal");
var TOOLBAR_APPEARANCES = {
  surface: {
    gap: 2,
    padding: 2,
    background: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))",
    border: "1px solid var(--viewer-border, var(--color-semantic-line-normal-normal))",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-sm)"
  },
  minimal: {
    gap: 2,
    padding: 0,
    background: "transparent",
    border: "none",
    borderRadius: 0,
    boxShadow: "none"
  },
  // The overlay-surface family module owns this recipe (strong level: the
  // toolbar is chrome the operator reads and clicks, so legibility outranks
  // seeing through it). The old inline copy carried a raw #101b26 fallback the
  // family has since replaced with the static-black token.
  "on-dark": {
    gap: 2,
    padding: 2,
    background: _chunk2NP74HUDcjs.VIEWER_OVERLAY_SURFACE.strong.surface,
    border: _chunk2NP74HUDcjs.VIEWER_OVERLAY_SURFACE.strong.border,
    borderRadius: "var(--radius-md)",
    boxShadow: _chunk2NP74HUDcjs.VIEWER_OVERLAY_SURFACE.strong.shadow,
    backdropFilter: _chunk2NP74HUDcjs.VIEWER_OVERLAY_SURFACE.strong.blur
  }
};
function ViewerToolbar({
  children,
  orientation = "vertical",
  appearance = "minimal",
  label = "\uBDF0\uC5B4 \uCEE8\uD2B8\uB864",
  style,
  onKeyDown,
  onFocusCapture,
  ...rootProps
}) {
  const resolvedAppearance = TOOLBAR_APPEARANCES[appearance] ? appearance : "minimal";
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ViewerToolbarAppearanceContext.Provider, { value: resolvedAppearance, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkZHXNBK3Scjs.Toolbar,
    {
      ...rootProps,
      label,
      orientation,
      itemSelector: "[data-lk-viewer-toolbar-item]",
      "data-viewer-toolbar-appearance": resolvedAppearance,
      stopNavigationPropagation: true,
      onKeyDown,
      onFocusCapture,
      style: {
        width: "fit-content",
        maxWidth: "100%",
        boxSizing: "border-box",
        ...TOOLBAR_APPEARANCES[resolvedAppearance],
        ...resolvedAppearance === "on-dark" ? { "--viewer-foreground": "var(--color-semantic-static-white)" } : null,
        ...style
      },
      children
    }
  ) });
}
function ViewerToolbarButton({
  children,
  kind,
  pressed,
  defaultPressed = false,
  onPressedChange,
  active,
  label,
  style,
  disabled = false,
  type = "button",
  tabIndex,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...buttonProps
}) {
  const inferredToggle = pressed !== void 0 || active !== void 0;
  const resolvedKind = _nullishCoalesce(kind, () => ( (inferredToggle ? "toggle" : "command")));
  const commonProps = {
    ...buttonProps,
    type,
    disabled,
    label,
    title: label,
    size: 28,
    tabIndex: _nullishCoalesce(tabIndex, () => ( 0)),
    "data-lk-viewer-toolbar-item": "",
    "data-lk-toolbar-key": _nullishCoalesce(buttonProps["data-lk-toolbar-key"], () => ( label)),
    className: ["lk-viewer-toolbar__button", className].filter(Boolean).join(" "),
    onClick,
    onMouseEnter,
    onMouseLeave,
    style: { flex: "0 0 auto", width: 28, height: 28, padding: 0, ...style }
  };
  const icon = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { width: 16, height: 16, display: "inline-grid", placeItems: "center", flex: "0 0 auto" }, children });
  if (resolvedKind === "toggle") {
    const controlledPressed = _nullishCoalesce(pressed, () => ( active));
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunkFVL575B5cjs.ToggleIcon,
      {
        ...commonProps,
        variant: "plain",
        pressed: controlledPressed,
        defaultPressed,
        onChange: onPressedChange,
        children: icon
      }
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkP65KUIKJcjs.IconButton,
    {
      ...commonProps,
      round: false,
      variant: "plain",
      children: icon
    }
  );
}




exports.ViewerToolbar = ViewerToolbar; exports.ViewerToolbarButton = ViewerToolbarButton;
//# sourceMappingURL=chunk-OOVWDTQY.cjs.map