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
  /** Action alignment inside the shared action row. @default "start" */
  align?: 'start' | 'end' | 'center' | 'between';
  children?: React.ReactNode;
}

/**
 * Bottom action container.
 *
 * Renders a plain `div` by default — an unnamed `<section>` is not exposed as a
 * landmark and conveys nothing to assistive tech. Supplying `aria-label` or
 * `aria-labelledby` renders a `<section>` instead, which becomes a named
 * `region` landmark. DOM order of `children` is preserved.
 */
export function ActionArea(props: ActionAreaProps): React.JSX.Element;
