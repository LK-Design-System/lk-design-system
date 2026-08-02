import * as React from 'react';
import type { LdsClassNames, LdsStyles, LdsVars } from '../internal/surface.js';

export type SegmentedControlPart = 'root' | 'segment' | 'icon' | 'label' | 'count';
export type SegmentedControlVariable =
  | '--lds-segmented-control-height'
  | '--lds-segmented-control-padding'
  | '--lds-segmented-control-gap'
  | '--lds-segmented-control-radius'
  | '--lds-segmented-control-segment-radius';

export type SegmentOption = string | {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Result count announced with the option label. */
  count?: number;
  disabled?: boolean;
  /** Disabled alias retained for compatibility; prefer `disabled`. */
  disable?: boolean;
  /** `inactive` is a disabled evidence alias; prefer `disabled`. */
  interaction?: 'normal' | 'inactive' | 'hovered' | 'focused' | 'active' | 'active-focused';
  className?: string;
  style?: React.CSSProperties;
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
  /** @deprecated Use `disabled`. */
  disable?: boolean;
  /** Accessible name for the mutually exclusive option group. */
  'aria-label'?: string;
  classNames?: LdsClassNames<SegmentedControlPart>;
  styles?: LdsStyles<SegmentedControlPart>;
  vars?: LdsVars<SegmentedControlVariable>;
}

/** Roving-keyboard radio group for a compact set of mutually exclusive views or modes. */
export const SegmentedControl: React.ForwardRefExoticComponent<SegmentedControlProps & React.RefAttributes<HTMLDivElement>>;
