"use client";

// components/internal/component-density.js
import React from "react";
var ComponentDensityContext = React.createContext(void 0);
function ComponentDensityScope({ density, children }) {
  return React.createElement(ComponentDensityContext.Provider, { value: density }, children);
}
function useResolvedDensity(explicitDensity, fallback = "comfortable") {
  const inheritedDensity = React.useContext(ComponentDensityContext);
  return explicitDensity ?? inheritedDensity ?? fallback;
}
function useResolvedControlSize(explicitSize, fallback = "md") {
  const density = useResolvedDensity(void 0, "comfortable");
  return explicitSize ?? (density === "compact" ? "sm" : fallback);
}

export {
  ComponentDensityScope,
  useResolvedDensity,
  useResolvedControlSize
};
//# sourceMappingURL=chunk-EEL7ELPX.js.map