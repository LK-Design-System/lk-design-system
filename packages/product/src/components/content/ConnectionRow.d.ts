import * as React from 'react';
import type { LdsClassNames, LdsStyles, LdsVars } from '@lk-design-system/lds-core/component-authoring';

export type ConnectionRowState = 'connected' | 'pending' | 'disconnected';

export type ConnectionRowPart =
  | 'root'
  | 'visual'
  | 'name'
  | 'status'
  | 'detail'
  | 'actions';

export type ConnectionRowVariable =
  | '--lds-connection-row-min-height'
  | '--lds-connection-row-padding'
  | '--lds-connection-row-gap'
  | '--lds-connection-row-action-gap'
  | '--lds-connection-row-visual-size';

export interface ConnectionRowOwnProps {
  /** Root element. Use as="li" when the row belongs to a semantic list. @default "div" */
  as?: React.ElementType;
  /** Decorative identity visual. Avatar, Thumbnail, or a service logo are accepted; interactive content is not. */
  visual?: React.ReactNode;
  /** Visible account, service, or resource name. */
  name: React.ReactNode;
  /** Visible product-authored state label. It must communicate the state without color. */
  status: React.ReactNode;
  /** Supporting identifier, scope, owner, or last-connected information. */
  detail?: React.ReactNode;
  /** Product-owned actions that follow the state-specific action rules. */
  actions?: React.ReactNode;
  /** Presentational connection state. @default "disconnected" */
  state?: ConnectionRowState;
  classNames?: LdsClassNames<ConnectionRowPart>;
  styles?: LdsStyles<ConnectionRowPart>;
  vars?: LdsVars<ConnectionRowVariable>;
}

export type ConnectionRowProps<Element extends React.ElementType = 'div'> = ConnectionRowOwnProps &
  Omit<React.ComponentPropsWithoutRef<Element>, keyof ConnectionRowOwnProps | 'as'> & {
    as?: Element;
    ref?: React.ComponentPropsWithRef<Element>['ref'];
  };

/** Account or resource connection surface with stable identity, status, detail, and action order. */
export function ConnectionRow<Element extends React.ElementType = 'div'>(props: ConnectionRowProps<Element>): React.JSX.Element;
