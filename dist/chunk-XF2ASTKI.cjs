"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


<<<<<<<< HEAD:dist/chunk-XF2ASTKI.cjs
<<<<<<<< HEAD:dist/chunk-XF2ASTKI.cjs
var _chunk2G45EBFEcjs = require('./chunk-2G45EBFE.cjs');
========
var _chunkITKHOO7Tcjs = require('./chunk-ITKHOO7T.cjs');
>>>>>>>> codex/consolidate-release-check:dist/chunk-5U7ADBEH.cjs
========
var _chunkRNGZYEXUcjs = require('./chunk-RNGZYEXU.cjs');
>>>>>>>> codex/consolidate-release-ci:dist/chunk-GG6LLGUE.cjs

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
  liveness,
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
  // 영상 컨트롤은 하단이 플레이어 관례이고, 우상단은 상시 표시되는 생존성
  // 신호(라이브)가 화면 끝에 붙을 수 있도록 비워 둔다. 상단에 두면 숨겨진
  // 툴바가 자리를 차지해 라이브가 가장자리에서 밀려난다.
  toolbarPlacement = "bottom-right",
  style,
  ...rest
}) {
  const usesExplicitAxes = availability != null || connection != null || freshness != null || playback != null;
  const resolvedState = usesExplicitAxes ? state : _nullishCoalesce(_nullishCoalesce(state, () => ( status)), () => ( "idle"));
  const resolvedAriaLabel = _nullishCoalesce(ariaLabel, () => ( (typeof label === "string" && label.trim() ? `${label} \uC601\uC0C1 \uC2A4\uD2B8\uB9BC` : "\uC601\uC0C1 \uC2A4\uD2B8\uB9BC")));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
<<<<<<<< HEAD:dist/chunk-XF2ASTKI.cjs
<<<<<<<< HEAD:dist/chunk-XF2ASTKI.cjs
    _chunk2G45EBFEcjs.ViewerFrame,
========
    _chunkITKHOO7Tcjs.ViewerFrame,
>>>>>>>> codex/consolidate-release-check:dist/chunk-5U7ADBEH.cjs
========
    _chunkRNGZYEXUcjs.ViewerFrame,
>>>>>>>> codex/consolidate-release-ci:dist/chunk-GG6LLGUE.cjs
    {
      ...rest,
      label: resolvedAriaLabel,
      source: label,
      variant,
      chromeVariant,
      badges,
      liveness,
      hud,
      toolbar,
      toolbarVisibility,
      toolbarPlacement,
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
<<<<<<<< HEAD:dist/chunk-XF2ASTKI.cjs
<<<<<<<< HEAD:dist/chunk-XF2ASTKI.cjs
//# sourceMappingURL=chunk-XF2ASTKI.cjs.map
========
//# sourceMappingURL=chunk-5U7ADBEH.cjs.map
>>>>>>>> codex/consolidate-release-check:dist/chunk-5U7ADBEH.cjs
========
//# sourceMappingURL=chunk-GG6LLGUE.cjs.map
>>>>>>>> codex/consolidate-release-ci:dist/chunk-GG6LLGUE.cjs
