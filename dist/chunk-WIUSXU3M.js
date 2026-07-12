"use client";

// components/internal/unit-format.js
var ATTACHED_UNIT = /^(?:%|‰|°)$/u;
function normalizeValueText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
  return "";
}
function normalizeUnit(unit) {
  return typeof unit === "string" ? unit.trim() : "";
}
function isAttachedUnit(unit) {
  const normalizedUnit = normalizeUnit(unit);
  return normalizedUnit !== "" && ATTACHED_UNIT.test(normalizedUnit);
}
function getUnitSeparator(unit) {
  const normalizedUnit = normalizeUnit(unit);
  return normalizedUnit === "" || isAttachedUnit(normalizedUnit) ? "" : " ";
}
function formatValueWithUnit(value, unit) {
  const renderedValue = normalizeValueText(value);
  const renderedUnit = normalizeUnit(unit);
  return `${renderedValue}${getUnitSeparator(renderedUnit)}${renderedUnit}`;
}

export {
  normalizeValueText,
  normalizeUnit,
  isAttachedUnit,
  getUnitSeparator,
  formatValueWithUnit
};
//# sourceMappingURL=chunk-WIUSXU3M.js.map