"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunk3KG4UK6Ucjs = require('./chunk-3KG4UK6U.cjs');

// components/viz/VideoStreamTile.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function VideoStreamTile({
  children,
  label,
  ariaLabel,
  status,
  state,
  availability,
  connection,
  freshness,
  playback,
  aspectRatio = "16 / 9",
  badges,
  hud,
  toolbar,
  overlay,
  metadata,
  stateLabel,
  stateDescription,
  stateIcon,
  stateAction,
  variant = "standalone",
  chromeVariant = "overlay",
  toolbarVisibility = "interaction",
  style,
  ...rest
}) {
  const usesExplicitAxes = availability != null || connection != null || freshness != null || playback != null;
  const resolvedState = usesExplicitAxes ? state : _nullishCoalesce(_nullishCoalesce(state, () => ( status)), () => ( "idle"));
  const resolvedAriaLabel = _nullishCoalesce(ariaLabel, () => ( (typeof label === "string" && label.trim() ? `${label} \uC601\uC0C1 \uC2A4\uD2B8\uB9BC` : "\uC601\uC0C1 \uC2A4\uD2B8\uB9BC")));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    _chunk3KG4UK6Ucjs.ViewerFrame,
    {
      ...rest,
      label: resolvedAriaLabel,
      source: label,
      variant,
      chromeVariant,
      badges,
      hud,
      toolbar,
      toolbarVisibility,
      toolbarPlacement: "top-right",
      overlay,
      status: metadata,
      state: resolvedState,
      availability,
      connection,
      freshness,
      playback,
      stateLabel,
      stateDescription,
      stateIcon,
      stateAction,
      style: { aspectRatio, ...style },
      children
    }
  );
}



exports.VideoStreamTile = VideoStreamTile;
//# sourceMappingURL=chunk-NU27TKZS.cjs.map