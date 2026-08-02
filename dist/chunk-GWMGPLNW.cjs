"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/internal/surface.js
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
function cx(...values) {
  return values.filter(Boolean).join(" ");
}
function partClassName(classNames, part, ...values) {
  return cx(...values, _optionalChain([classNames, 'optionalAccess', _ => _[part]]));
}
function partStyle(styles, part) {
  return _nullishCoalesce(_optionalChain([styles, 'optionalAccess', _2 => _2[part]]), () => ( void 0));
}
function componentVars(vars, prefix) {
  if (!vars) return void 0;
  return Object.fromEntries(
    Object.entries(vars).filter(([name, value]) => name.startsWith(prefix) && value != null)
  );
}
function assignRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && typeof ref === "object") {
    ref.current = value;
  }
}
function mergeRefs(...refs) {
  return (value) => refs.forEach((ref) => assignRef(ref, value));
}
function useMergedRefs(refA, refB, refC) {
  return _react2.default.useMemo(() => mergeRefs(refA, refB, refC), [refA, refB, refC]);
}






exports.partClassName = partClassName; exports.partStyle = partStyle; exports.componentVars = componentVars; exports.useMergedRefs = useMergedRefs;
//# sourceMappingURL=chunk-GWMGPLNW.cjs.map