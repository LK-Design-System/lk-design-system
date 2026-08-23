import React from 'react';
import { componentVars, partClassName, partStyle } from '@lk-design-system/lds-core/component-authoring';
import { StatusIndicator } from '@lk-design-system/lds-core/components/content/StatusIndicator';

const CONNECTION_ROW_STYLES = `
.lk-connection-row__visual{grid-area:visual}
.lk-connection-row__name{grid-area:name}
.lk-connection-row__status{grid-area:status}
.lk-connection-row__detail{grid-area:detail}
.lk-connection-row__actions{grid-area:actions;display:flex;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:var(--lds-connection-row-action-gap,var(--space-2));min-width:0;max-width:100%}
.lk-connection-row__actions>:where(button,a,[role="button"]){min-width:24px;min-height:24px}
@container lds-connection-row (max-width:420px){
  .lk-connection-row__visual{grid-area:auto;grid-column:1;grid-row:1 / span 2}
  .lk-connection-row__name{grid-area:auto;grid-column:2;grid-row:1}
  .lk-connection-row__status{grid-area:auto;grid-column:3 / -1;grid-row:1}
  .lk-connection-row__detail{grid-area:auto;grid-column:2 / -1;grid-row:2}
  .lk-connection-row__actions{grid-area:auto;grid-column:2 / -1;grid-row:3;justify-content:flex-start;margin-top:var(--space-1)}
}
`;

const STATE_TONES = {
  connected: 'positive',
  pending: 'cautionary',
  disconnected: 'offline',
};

/**
 * LK Product Extension — ConnectionRow
 *
 * A stable account or resource connection surface with decorative identity,
 * visible connection status, supporting detail, and product-owned actions.
 * Products retain permissions, mutations, confirmation, routing, and copy.
 */
export const ConnectionRow = React.forwardRef(function ConnectionRow({
  as = 'div',
  visual,
  name,
  status,
  detail,
  actions,
  state = 'disconnected',
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const Component = as;
  const resolvedState = STATE_TONES[state] ? state : 'disconnected';

  return (
    <Component
      {...rest}
      ref={forwardedRef}
      data-slot="root"
      data-lds-connection-row=""
      data-state={resolvedState}
      className={partClassName(classNames, 'root', 'lk-connection-row', className) || undefined}
      style={{
        ...componentVars(vars, '--lds-connection-row-'),
        display: 'grid',
        gridTemplateAreas: '"visual name status actions" "visual detail detail actions"',
        gridTemplateColumns: 'auto minmax(0, 1fr) auto auto',
        alignItems: 'center',
        columnGap: 'var(--lds-connection-row-gap, var(--space-3))',
        rowGap: 'var(--space-1)',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        minHeight: 'var(--lds-connection-row-min-height, 72px)',
        padding: 'var(--lds-connection-row-padding, var(--space-3) var(--space-4))',
        border: 'var(--component-card-border)',
        borderRadius: 'var(--component-card-radius)',
        background: 'var(--component-card-bg)',
        color: 'var(--component-card-fg)',
        fontFamily: 'var(--font-sans)',
        boxSizing: 'border-box',
        containerType: 'inline-size',
        containerName: 'lds-connection-row',
        ...partStyle(styles, 'root'),
        ...style,
      }}
    >
      <style>{CONNECTION_ROW_STYLES}</style>
      {visual != null && (
        <span
          data-slot="visual"
          aria-hidden="true"
          className={partClassName(classNames, 'visual', 'lk-connection-row__visual') || undefined}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'var(--lds-connection-row-visual-size, 40px)',
            height: 'var(--lds-connection-row-visual-size, 40px)',
            flexShrink: 0,
            ...partStyle(styles, 'visual'),
          }}
        >
          {visual}
        </span>
      )}
      <div
        data-slot="name"
        className={partClassName(classNames, 'name', 'lk-connection-row__name') || undefined}
        style={{
          minWidth: 0,
          color: 'var(--color-semantic-label-strong)',
          fontSize: 'var(--body1-size)',
          fontWeight: 'var(--fw-semibold)',
          lineHeight: 'var(--body1-line)',
          overflowWrap: 'anywhere',
          ...partStyle(styles, 'name'),
        }}
      >
        {name}
      </div>
      <div
        data-slot="status"
        className={partClassName(classNames, 'status', 'lk-connection-row__status') || undefined}
        style={{ minWidth: 0, ...partStyle(styles, 'status') }}
      >
        <StatusIndicator
          tone={STATE_TONES[resolvedState]}
          pulse={resolvedState === 'pending'}
          data-connection-state={resolvedState}
        >
          {status}
        </StatusIndicator>
      </div>
      {detail != null && (
        <div
          data-slot="detail"
          className={partClassName(classNames, 'detail', 'lk-connection-row__detail') || undefined}
          style={{
            minWidth: 0,
            color: 'var(--color-semantic-label-alternative)',
            fontSize: 'var(--label2-size)',
            lineHeight: 'var(--label2-line)',
            overflowWrap: 'anywhere',
            wordBreak: 'keep-all',
            ...partStyle(styles, 'detail'),
          }}
        >
          {detail}
        </div>
      )}
      {actions != null && (
        <div
          data-slot="actions"
          className={partClassName(classNames, 'actions', 'lk-connection-row__actions') || undefined}
          style={partStyle(styles, 'actions')}
        >
          {actions}
        </div>
      )}
    </Component>
  );
});
