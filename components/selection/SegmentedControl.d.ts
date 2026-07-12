import * as React from 'react';

export type SegmentOption = string | {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  interaction?: 'normal' | 'inactive' | 'hovered' | 'focused' | 'active' | 'active-focused';
};

export interface SegmentedControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: 'solid' | 'outlined';
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
  interaction?: 'normal' | 'inactive' | 'hovered' | 'focused' | 'active' | 'active-focused';
  full?: boolean;
  resize?: 'fill' | 'hug';
  disabled?: boolean;
  disable?: boolean;
  /** Accessible name for the mutually exclusive option group. */
  'aria-label'?: string;
}

/** Roving-keyboard radio group for a compact set of mutually exclusive views or modes. */
export function SegmentedControl(props: SegmentedControlProps): React.JSX.Element;
