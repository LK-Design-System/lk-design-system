import * as React from 'react';

export type ComponentDensity = 'comfortable' | 'compact';
export type ComponentControlSize = 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';

export interface ComponentDensityScopeProps {
  density?: ComponentDensity;
  children?: React.ReactNode;
}

export function ComponentDensityScope(props: ComponentDensityScopeProps): React.ReactElement;
export function useResolvedDensity(
  explicitDensity?: ComponentDensity,
  fallback?: ComponentDensity,
): ComponentDensity;
export function useResolvedControlSize(
  explicitSize?: ComponentControlSize,
  fallback?: ComponentControlSize,
): ComponentControlSize;
