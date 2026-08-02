import * as React from 'react';
import type { LdsClassNames, LdsStyles, LdsVars } from '@lk-design-system/lds-core/components/internal/surface';

export type FieldActionPart = 'root' | 'fieldStack' | 'row' | 'field' | 'action';
export type FieldActionVariable = '--lds-field-action-gap';

export interface FieldActionOwnProps {
  /** Root element. Use `form` when the action submits the field. @default "div" */
  as?: React.ElementType;
  /** One LDS field control. Put shared label/helper/error content on FieldAction. */
  field: React.ReactElement;
  /** One LDS Button or button-compatible action. */
  action: React.ReactElement;
  /** Shared field density. The composition aligns both controls to 32/48/52px. @default "md" */
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
  label?: React.ReactNode;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  /** Associates the shared label with the field control. */
  htmlFor?: string;
  classNames?: LdsClassNames<FieldActionPart>;
  styles?: LdsStyles<FieldActionPart>;
  vars?: LdsVars<FieldActionVariable>;
}

export type FieldActionProps<Element extends React.ElementType = 'div'> = FieldActionOwnProps &
  Omit<React.ComponentPropsWithoutRef<Element>, keyof FieldActionOwnProps | 'as' | 'children'> & {
    as?: Element;
    ref?: React.ComponentPropsWithRef<Element>['ref'];
  };

/** Responsive field + action composition with one shared control height. */
export function FieldAction<Element extends React.ElementType = 'div'>(props: FieldActionProps<Element>): React.JSX.Element;
