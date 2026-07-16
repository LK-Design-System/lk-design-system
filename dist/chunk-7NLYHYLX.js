"use client";

// components/robotics/_NavigationFocus.js
function isFocusVisibleTarget(target) {
  if (!target || typeof target.matches !== "function") return true;
  try {
    return target.matches(":focus-visible");
  } catch {
    return true;
  }
}

export {
  isFocusVisibleTarget
};
//# sourceMappingURL=chunk-7NLYHYLX.js.map