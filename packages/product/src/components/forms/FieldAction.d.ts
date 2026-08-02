import * as React from 'react';

export interface FieldActionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Root element. Use `form` when the action submits the field. @default "div" */
  as?: keyof React.JSX.IntrinsicElements;
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
}

/** Responsive field + action composition with one shared control height. */
export const FieldAction: React.ForwardRefExoticComponent<
  FieldActionProps & React.RefAttributes<HTMLElement>
>;
