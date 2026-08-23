import React from 'react';
import { componentVars, partClassName, partStyle } from '@lk-design-system/lds-core/component-authoring';
import { DataToolbar } from './DataToolbar.jsx';
import { ResourceState } from './ResourceState.jsx';

const DATA_COLLECTION_PANEL_STYLES = `
.lk-data-collection-panel__compact-content{display:none}
.lk-data-collection-panel__footer:empty{display:none!important}
.lk-data-collection-panel[data-layout="narrow"][data-has-compact-content="true"] > .lk-data-collection-panel__state > [data-resource-state] > .lk-data-collection-panel__wide-content{display:none}
.lk-data-collection-panel[data-layout="narrow"][data-has-compact-content="true"] > .lk-data-collection-panel__state > [data-resource-state] > .lk-data-collection-panel__compact-content{display:block}
@container lds-data-collection-panel (max-width:767px){
  .lk-data-collection-panel[data-layout="auto"][data-has-compact-content="true"] > .lk-data-collection-panel__state > [data-resource-state] > .lk-data-collection-panel__wide-content{display:none}
  .lk-data-collection-panel[data-layout="auto"][data-has-compact-content="true"] > .lk-data-collection-panel__state > [data-resource-state] > .lk-data-collection-panel__compact-content{display:block}
}
`;

const RESOURCE_STATES = new Set(['ready', 'loading', 'refreshing', 'empty', 'error', 'stale', 'offline', 'restricted']);
const BLOCKING_STATES = new Set(['empty', 'restricted']);

/**
 * LK Product Extension — DataCollectionPanel
 *
 * A continuous collection surface that composes DataToolbar, ResourceState,
 * wide content, optional compact content, and a footer in one stable reading
 * order. Products retain query state, fetching, row semantics, permissions,
 * pagination state, and the markup used to reinterpret a row on narrow screens.
 */
export const DataCollectionPanel = React.forwardRef(function DataCollectionPanel({
  as = 'section',
  toolbar,
  resourceState,
  compactContent,
  footer,
  layout = 'auto',
  children,
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const Component = as;
  const resolvedLayout = ['auto', 'wide', 'narrow'].includes(layout) ? layout : 'auto';
  const hasCompactContent = compactContent != null;
  const resolvedResourceState = resourceState ?? {};
  const hasWideContent = React.Children.toArray(children).length > 0;
  const hasContent = hasWideContent || hasCompactContent;
  const state = RESOURCE_STATES.has(resolvedResourceState.state) ? resolvedResourceState.state : 'ready';
  const isLoading = state === 'loading' || (state === 'refreshing' && !hasContent);
  const isBlocking = BLOCKING_STATES.has(state)
    || (!hasContent && !isLoading && state !== 'ready');
  const showFooter = footer != null && !isLoading && !isBlocking;

  return (
    <Component
      {...rest}
      ref={forwardedRef}
      data-slot="root"
      data-lds-data-collection-panel=""
      data-layout={resolvedLayout}
      data-has-compact-content={hasCompactContent ? 'true' : 'false'}
      data-state={state}
      className={partClassName(classNames, 'root', 'lk-data-collection-panel', className) || undefined}
      style={{
        ...componentVars(vars, '--lds-data-collection-panel-'),
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        minHeight: 'var(--lds-data-collection-panel-min-height, auto)',
        overflow: 'hidden',
        containerType: 'inline-size',
        containerName: 'lds-data-collection-panel',
        border: 'var(--component-card-border)',
        borderRadius: 'var(--component-card-radius)',
        background: 'var(--component-card-bg)',
        boxShadow: 'var(--component-card-shadow-sm)',
        color: 'var(--component-card-fg)',
        fontFamily: 'var(--font-sans)',
        boxSizing: 'border-box',
        ...partStyle(styles, 'root'),
        ...style,
      }}
    >
      <style>{DATA_COLLECTION_PANEL_STYLES}</style>
      {toolbar != null && (
        <div
          data-slot="toolbar"
          className={partClassName(classNames, 'toolbar') || undefined}
          style={{ minWidth: 0, ...partStyle(styles, 'toolbar') }}
        >
          <DataToolbar {...toolbar} variant="embedded" />
        </div>
      )}
      <div
        data-slot="state"
        className={partClassName(classNames, 'state', 'lk-data-collection-panel__state') || undefined}
        style={{ minWidth: 0, ...partStyle(styles, 'state') }}
      >
        <ResourceState {...resolvedResourceState} state={state} messageVariant="embedded">
          {hasWideContent && (
            <div
              data-slot="wideContent"
              data-collection-content="wide"
              className={partClassName(classNames, 'wideContent', 'lk-data-collection-panel__wide-content') || undefined}
              style={{ minWidth: 0, ...partStyle(styles, 'wideContent') }}
            >
              {children}
            </div>
          )}
          {hasCompactContent && (
            <div
              data-slot="compactContent"
              data-collection-content="compact"
              className={partClassName(classNames, 'compactContent', 'lk-data-collection-panel__compact-content') || undefined}
              style={{ minWidth: 0, ...partStyle(styles, 'compactContent') }}
            >
              {compactContent}
            </div>
          )}
        </ResourceState>
      </div>
      {showFooter && (
        <div
          data-slot="footer"
          className={partClassName(classNames, 'footer', 'lk-data-collection-panel__footer') || undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 0,
            padding: 'var(--lds-data-collection-panel-footer-padding, var(--space-3) var(--space-4))',
            borderTop: '1px solid var(--color-semantic-line-normal-normal)',
            ...partStyle(styles, 'footer'),
          }}
        >
          {footer}
        </div>
      )}
    </Component>
  );
});
