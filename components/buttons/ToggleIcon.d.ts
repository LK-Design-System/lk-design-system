import * as React from 'react';

export interface ToggleIconProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'children' | 'aria-label' | 'aria-pressed'> {
  pressed?: boolean;
  /** @default false */
  defaultPressed?: boolean;
  onChange?: (next: boolean) => void;
  /** Accessible label for the icon-only control. */
  label: string;
  /** @default "md" */
  size?: 'sm' | 'md';
  /** Visual treatment for standalone, grouped-surface, or dark-viewer use. @default "default" */
  variant?: 'default' | 'plain' | 'on-dark';
  /** Disable alias retained for WDS compatibility. */
  disable?: boolean;
  children?: React.ReactNode;
}

export function ToggleIcon(props: ToggleIconProps): React.JSX.Element;
