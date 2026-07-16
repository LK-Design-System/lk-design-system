"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";




var _chunkKB5BQWW4cjs = require('./chunk-KB5BQWW4.cjs');

// components/robotics/NavigationAnnotationLayer.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function NavigationAnnotationLayer({
  children,
  maxLabelDisplacementPx = 56,
  labelGapPx = 4,
  ...rest
}) {
  const [store] = _react2.default.useState(_chunkKB5BQWW4cjs.createAnnotationStore);
  const hostRef = _react2.default.useRef(null);
  _chunkKB5BQWW4cjs.useIsomorphicLayoutEffect.call(void 0, () => {
    store.setOptions({ maxLabelDisplacementPx, labelGapPx, host: hostRef.current });
    store.flush();
  });
  _react2.default.useEffect(() => {
    const svg = _optionalChain([hostRef, 'access', _ => _.current, 'optionalAccess', _2 => _2.ownerSVGElement]);
    let observer;
    if (typeof ResizeObserver === "function" && svg) {
      observer = new ResizeObserver(() => store.schedule());
      observer.observe(svg);
    }
    let cancelled = false;
    if (typeof document !== "undefined" && typeof _optionalChain([document, 'access', _3 => _3.fonts, 'optionalAccess', _4 => _4.ready, 'optionalAccess', _5 => _5.then]) === "function") {
      document.fonts.ready.then(() => {
        if (!cancelled) store.schedule();
      });
    }
    return () => {
      cancelled = true;
      _optionalChain([observer, 'optionalAccess', _6 => _6.disconnect, 'call', _7 => _7()]);
    };
  }, [store]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "g", { ...rest, ref: hostRef, "data-lk-navigation-annotation-layer": "", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkKB5BQWW4cjs.NavigationAnnotationContext.Provider, { value: store, children }) });
}



exports.NavigationAnnotationLayer = NavigationAnnotationLayer;
//# sourceMappingURL=chunk-HPG5AMXZ.cjs.map