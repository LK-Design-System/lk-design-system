import * as React from 'react';

export type SegmentOption = string | {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Disabled alias retained for compatibility; prefer `disabled`. */
  disable?: boolean;
  /** `inactive` is a disabled evidence alias; prefer `disabled`. */
  interaction?: 'normal' | 'inactive' | 'hovered' | 'focused' | 'active' | 'active-focused';
};

export interface SegmentedControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: 'solid' | 'outlined';
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
  /** Group evidence state. `inactive` disables every option; prefer `disabled` in product code. */
  interaction?: 'normal' | 'inactive' | 'hovered' | 'focused' | 'active' | 'active-focused';
  full?: boolean;
  resize?: 'fill' | 'hug';
  disabled?: boolean;
  /** Disabled alias retained for compatibility; prefer `disabled`. */
  disable?: boolean;
  /** Accessible name for the mutually exclusive option group. */
  'aria-label'?: string;
}

/** Roving-keyboard radio group for a compact set of mutually exclusive views or modes. */
export function SegmentedControl(props: SegmentedControlProps): React.JSX.Element;
