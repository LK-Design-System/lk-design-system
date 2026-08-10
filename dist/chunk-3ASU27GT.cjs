"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunk2PQ23RCXcjs = require('./chunk-2PQ23RCX.cjs');


var _chunk3VE2HGTTcjs = require('./chunk-3VE2HGTT.cjs');


var _chunkEEY6VLXUcjs = require('./chunk-EEY6VLXU.cjs');

// components/viz/ViewerToolbar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);

// components/viz/_viewerOverlaySurface.js
var surfaceAt = (opacity) => `color-mix(in srgb, var(--viewer-surface-elevated, var(--color-semantic-static-black)) ${opacity}%, transparent)`;
var SHARED = {
  border: "1px solid color-mix(in srgb, var(--color-semantic-static-white) 20%, transparent)",
  shadow: "0 2px 8px color-mix(in srgb, var(--color-semantic-static-black) 24%, transparent)",
  blur: "blur(8px)",
  ink: "var(--color-semantic-static-white)",
  inkMuted: "color-mix(in srgb, var(--color-semantic-static-white) 76%, transparent)",
  hairline: "color-mix(in srgb, var(--color-semantic-static-white) 28%, transparent)",
  /** Text outside a scrim sits on raw footage; the shadow is its legibility floor. */
  textShadow: "0 1px 2px color-mix(in srgb, var(--color-semantic-static-black) 60%, transparent)"
};
var VIEWER_OVERLAY_SURFACE = {
  strong: { surface: surfaceAt(94), ...SHARED },
  soft: { surface: surfaceAt(72), ...SHARED }
};

// components/viz/ViewerToolbar.jsx
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
    background: VIEWER_OVERLAY_SURFACE.strong.surface,
    border: VIEWER_OVERLAY_SURFACE.strong.border,
    borderRadius: "var(--radius-md)",
    boxShadow: VIEWER_OVERLAY_SURFACE.strong.shadow,
    backdropFilter: VIEWER_OVERLAY_SURFACE.strong.blur
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
    _chunk3VE2HGTTcjs.Toolbar,
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
      _chunk2PQ23RCXcjs.ToggleIcon,
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
    _chunkEEY6VLXUcjs.IconButton,
    {
      ...commonProps,
      round: false,
      variant: "plain",
      children: icon
    }
  );
}




exports.ViewerToolbar = ViewerToolbar; exports.ViewerToolbarButton = ViewerToolbarButton;
//# sourceMappingURL=chunk-3ASU27GT.cjs.map