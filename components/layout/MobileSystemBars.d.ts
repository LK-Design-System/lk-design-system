import * as React from 'react';

export interface MobileSystemBarsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Platform chrome style. @default "ios" */
  platform?: 'ios' | 'android';
  /** Show the status bar row. @default true */
  showStatus?: boolean;
  /** Show the home indicator row. @default true */
  showHome?: boolean;
  /** Status bar time label. @default "9:41" */
  time?: string;
}

export function MobileSystemBars(props: MobileSystemBarsProps): React.JSX.Element;
