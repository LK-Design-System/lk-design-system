"use client";

// components/internal/bounded-value.js
function normalizeBoundedValue({
  value,
  min = 0,
  max = 100
} = {}) {
  const resolvedMin = Number.isFinite(min) ? min : 0;
  const resolvedMax = Number.isFinite(max) && max > resolvedMin ? max : resolvedMin + 1;
  const numericValue = Number.isFinite(value) ? value : resolvedMin;
  const resolvedValue = Math.max(resolvedMin, Math.min(resolvedMax, numericValue));
  const ratio = (resolvedValue - resolvedMin) / (resolvedMax - resolvedMin);
  return {
    min: resolvedMin,
    max: resolvedMax,
    value: resolvedValue,
    ratio,
    percent: ratio * 100
  };
}

export {
  normalizeBoundedValue
};
//# sourceMappingURL=chunk-BVUTMUVR.js.map