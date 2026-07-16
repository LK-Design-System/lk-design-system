"use strict";Object.defineProperty(exports, "__esModule", {value: true});"use client";

// components/robotics/_NavigationFocus.js
function isFocusVisibleTarget(target) {
  if (!target || typeof target.matches !== "function") return true;
  try {
    return target.matches(":focus-visible");
  } catch (e) {
    return true;
  }
}



exports.isFocusVisibleTarget = isFocusVisibleTarget;
//# sourceMappingURL=chunk-RP2TJYB7.cjs.map