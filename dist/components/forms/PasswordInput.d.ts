import * as React from 'react';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'size' | 'style' | 'type'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: React.ReactNode;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  status?: 'normal' | 'positive' | 'negative';
  size?: 'sm' | 'md' | 'small' | 'medium';
  revealLabel?: string;
  hideLabel?: string;
  /** Styles for the label/control/message stack. */
  fieldStyle?: React.CSSProperties;
  /** Styles for the input control shell. */
  style?: React.CSSProperties;
}

/** Password field with a contextual show/hide action. */
export function PasswordInput(props: PasswordInputProps): React.JSX.Element;
