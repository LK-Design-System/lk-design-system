"use client";

// components/internal/surface.js
import React from "react";
function cx(...values) {
  return values.filter(Boolean).join(" ");
}
function partClassName(classNames, part, ...values) {
  return cx(...values, classNames?.[part]);
}
function partStyle(styles, part) {
  return styles?.[part] ?? void 0;
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
  return React.useMemo(() => mergeRefs(refA, refB, refC), [refA, refB, refC]);
}

export {
  partClassName,
  partStyle,
  componentVars,
  useMergedRefs
};
//# sourceMappingURL=chunk-A2U7YIGP.js.map