import * as React from 'react';

export interface ActionAreaProps extends React.HTMLAttributes<HTMLElement> {
  summary?: React.ReactNode;
  caption?: React.ReactNode;
  /** Keep the action area attached to the viewport bottom. @default false */
  sticky?: boolean;
  /** Include mobile bottom safe-area padding. @default false */
  safeArea?: boolean;
  /** Draw the top divider. @default true */
  divider?: boolean;
  /** Use denser vertical padding. @default false */
  compact?: boolean;
  children?: React.ReactNode;
}

export function ActionArea(props: ActionAreaProps): JSX.Element;
