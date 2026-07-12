import * as React from 'react';

export type ButtonGroupOption =
  | string
  | {
      value: string;
      label: React.ReactNode;
      icon?: React.ReactNode;
      disabled?: boolean;
      /** Disabled alias retained for compatibility. */
      disable?: boolean;
    };

export interface ButtonGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  options: ButtonGroupOption[];
  /** 제어 값(문자열, `multiple`일 때 string[]). */
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  /** Button family height scale: 32 / 40 / 48. @default "md" */
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
  /** 여러 개의 독립 aria-pressed 토글을 허용합니다. @default false */
  multiple?: boolean;
  /** Disable every option. @default false */
  disabled?: boolean;
  /** Disabled alias retained for compatibility. */
  disable?: boolean;
}

/** Single selection composes SegmentedControl; multiple selection is a toggle-button group. */
export function ButtonGroup(props: ButtonGroupProps): React.JSX.Element;
