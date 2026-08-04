"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkHZDUHR7Icjs = require('./chunk-HZDUHR7I.cjs');

// components/viz/Scene3DFrame.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Scene3DFrame({
  children,
  title,
  badges,
  hud,
  toolbar,
  overlay,
  status,
  state,
  availability,
  connection,
  freshness,
  playback,
  stateLabel,
  stateDescription,
  stateIcon,
  stateAction,
  loading = false,
  empty,
  label,
  appearance = "dark",
  variant = "standalone",
  style,
  ...rest
}) {
  const usesExplicitAxes = availability != null || connection != null || freshness != null || playback != null;
  const usesLegacyEmpty = !usesExplicitAxes && state == null && !loading && empty != null;
  const resolvedState = usesExplicitAxes ? state : _nullishCoalesce(state, () => ( (loading ? "loading" : usesLegacyEmpty ? "no-source" : "ready")));
  const resolvedStateLabel = _nullishCoalesce(stateLabel, () => ( (usesLegacyEmpty ? empty : void 0)));
  const resolvedLabel = _nullishCoalesce(label, () => ( (typeof title === "string" && title.trim() ? `${title} 3D \uBDF0\uD3EC\uD2B8` : "3D \uBDF0\uD3EC\uD2B8")));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkHZDUHR7Icjs.ViewerFrame,
    {
      ...rest,
      label: resolvedLabel,
      appearance,
      variant,
      source: title,
      badges,
      hud,
      toolbar,
      toolbarPlacement: "bottom-right",
      overlay,
      status,
      state: resolvedState,
      availability,
      connection,
      freshness,
      playback,
      stateLabel: resolvedStateLabel,
      stateDescription,
      stateIcon,
      stateAction,
      style: { height: "100%", minHeight: 220, ...style },
      children
    }
  );
}



exports.Scene3DFrame = Scene3DFrame;
//# sourceMappingURL=chunk-X27GHHAV.cjs.map