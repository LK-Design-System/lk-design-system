import React from 'react';

/**
 * Internal, bounded component-density scope.
 *
 * This is intentionally not a public/global application preference. Product
 * containers such as Drawer may provide a local density so eligible Core and
 * Product descendants can resolve their existing finite size axes. Explicit
 * component props always take precedence over the inherited value.
 */
export const ComponentDensityContext = React.createContext(undefined);

export function ComponentDensityScope({ density, children }) {
  return React.createElement(ComponentDensityContext.Provider, { value: density }, children);
}

export function useResolvedDensity(explicitDensity, fallback = 'comfortable') {
  const inheritedDensity = React.useContext(ComponentDensityContext);
  return explicitDensity ?? inheritedDensity ?? fallback;
}

export function useResolvedControlSize(explicitSize, fallback = 'md') {
  const density = useResolvedDensity(undefined, 'comfortable');
  return explicitSize ?? (density === 'compact' ? 'sm' : fallback);
}
