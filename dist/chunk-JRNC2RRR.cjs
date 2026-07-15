"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkCRJZJFPBcjs = require('./chunk-CRJZJFPB.cjs');

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
  stateLabel,
  stateDescription,
  stateIcon,
  stateAction,
  loading = false,
  empty,
  label,
  appearance = "dark",
  style,
  ...rest
}) {
  const usesLegacyEmpty = state == null && !loading && empty != null;
  const resolvedState = _nullishCoalesce(state, () => ( (loading ? "loading" : usesLegacyEmpty ? "no-source" : "ready")));
  const resolvedStateLabel = _nullishCoalesce(stateLabel, () => ( (usesLegacyEmpty ? empty : void 0)));
  const resolvedLabel = _nullishCoalesce(label, () => ( (typeof title === "string" && title.trim() ? `${title} 3D \uBDF0\uD3EC\uD2B8` : "3D \uBDF0\uD3EC\uD2B8")));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    _chunkCRJZJFPBcjs.ViewerFrame,
    {
      ...rest,
      label: resolvedLabel,
      appearance,
      source: title,
      badges,
      hud,
      toolbar,
      overlay,
      status,
      state: resolvedState,
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
//# sourceMappingURL=chunk-JRNC2RRR.cjs.map