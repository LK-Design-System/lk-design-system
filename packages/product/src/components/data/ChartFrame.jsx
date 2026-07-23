import React from 'react';
import { ResourceState } from './ResourceState.jsx';

/**
 * LK Product Extension — ChartFrame
 * A single chart surface for title/context/actions, the chart, legend and
 * ResourceState. It does not replace each chart's own accessible name/summary.
 */
export function ChartFrame({
  title,
  description,
  meta,
  actions,
  legend,
  resourceState = 'ready',
  stateTitle,
  stateDescription,
  stateAction,
  lastUpdated,
  loadingContent,
  headingLevel = 3,
  children,
  bodyStyle,
  style,
  ...rest
}) {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const hasContent = React.Children.toArray(children).length > 0;
  const preservesData = hasContent && ['refreshing', 'stale', 'offline', 'error'].includes(resourceState);
  const resolvedHeadingLevel = Math.min(6, Math.max(1, headingLevel));
  const Heading = `h${resolvedHeadingLevel}`;

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={description != null ? descriptionId : undefined}
      data-chart-frame-state={resourceState}
      style={{
        minWidth: 0,
        overflow: 'hidden',
        border: 'var(--component-card-border)',
        borderRadius: 'var(--component-card-radius)',
        background: 'var(--component-card-bg)',
        boxShadow: 'var(--component-card-shadow-sm)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <header style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0, padding: 'var(--space-4) var(--space-5)', borderBottom: preservesData ? 'none' : '1px solid var(--color-semantic-line-normal-normal)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', minWidth: 0, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', flex: '1 1 240px', minWidth: 0, flexWrap: 'wrap' }}>
            <Heading id={titleId} style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--body1-size)', lineHeight: 'var(--body1-line)', fontWeight: 'var(--fw-bold)', overflowWrap: 'anywhere' }}>
              {title}
            </Heading>
            {meta != null && (
              <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 'var(--space-2)', minWidth: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
                <span aria-hidden="true">·</span>
                {meta}
              </div>
            )}
          </div>
          {actions != null && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap', minWidth: 0 }}>
              {actions}
            </div>
          )}
        </div>
        {description != null && (
          <p id={descriptionId} style={{ margin: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', overflowWrap: 'anywhere' }}>
            {description}
          </p>
        )}
      </header>

      <ResourceState
        state={resourceState}
        title={stateTitle}
        description={stateDescription}
        action={stateAction}
        lastUpdated={lastUpdated}
        loadingContent={loadingContent}
        messageVariant="embedded"
        headingLevel={Math.min(6, resolvedHeadingLevel + 1)}
      >
        {hasContent && (
          <div data-chart-frame-body style={{ display: 'grid', gap: 'var(--space-4)', minWidth: 0, padding: 'var(--space-4) var(--space-5)', ...bodyStyle }}>
            <div style={{ minWidth: 0 }}>{children}</div>
            {legend != null && <div data-chart-frame-legend style={{ minWidth: 0 }}>{legend}</div>}
          </div>
        )}
      </ResourceState>
    </section>
  );
}
