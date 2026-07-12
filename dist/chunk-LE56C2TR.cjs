"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkQRVOKOWYcjs = require('./chunk-QRVOKOWY.cjs');

// components/viz/VideoStreamTile.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function VideoStreamTile({
  children,
  label,
  ariaLabel,
  status,
  state,
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
  style,
  ...rest
}) {
  const resolvedState = _nullishCoalesce(_nullishCoalesce(state, () => ( status)), () => ( "idle"));
  const resolvedAriaLabel = _nullishCoalesce(ariaLabel, () => ( (typeof label === "string" && label.trim() ? `${label} \uC601\uC0C1 \uC2A4\uD2B8\uB9BC` : "\uC601\uC0C1 \uC2A4\uD2B8\uB9BC")));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    _chunkQRVOKOWYcjs.ViewerFrame,
    {
      ...rest,
      label: resolvedAriaLabel,
      source: label,
      badges,
      hud,
      toolbar,
      overlay,
      status: metadata,
      state: resolvedState,
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
//# sourceMappingURL=chunk-LE56C2TR.cjs.map