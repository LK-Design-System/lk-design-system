import * as React from 'react';

export interface ToggleIconProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'children'> {
  pressed?: boolean;
  /** @default false */
  defaultPressed?: boolean;
  onChange?: (next: boolean) => void;
  /** Accessible label for the icon-only control. */
  label: string;
  /** @default "md" */
  size?: 'sm' | 'md';
  children?: React.ReactNode;
}

export function ToggleIcon(props: ToggleIconProps): JSX.Element;
