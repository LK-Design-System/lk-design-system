import React from 'react';

const toLength = (value) => (typeof value === 'number' ? `${value}px` : value);

/**
 * LK Product — DashboardGrid
 *
 * An opinionated card-flow pattern for dashboard summaries. Unlike the generic
 * Grid primitive, it always uses auto-fit, carries the canonical grid gutter,
 * and protects the narrowest container by capping the minimum track at 100%.
 * Cards own their surface, radius, and internal spacing; this component adds no
 * visual chrome.
 */
export function DashboardGrid({
  children,
  minCardWidth = 220,
  gap = 'var(--grid-gutter)',
  className,
  style,
  ...rest
}) {
  const minimum = toLength(minCardWidth);

  return (
    <div
      className={['lk-dashboard-grid', className].filter(Boolean).join(' ')}
      style={{
        '--dashboard-grid-min-card-width': minimum,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, var(--dashboard-grid-min-card-width)), 1fr))',
        alignItems: 'stretch',
        gap,
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      <style>{`.lk-dashboard-grid > *:not(style){min-width:0}`}</style>
      {children}
    </div>
  );
}
