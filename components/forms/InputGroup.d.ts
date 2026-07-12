import * as React from 'react';

export interface InputGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix' | 'onChange' | 'style'> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: React.ReactNode;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  status?: 'normal' | 'positive' | 'negative';
  required?: boolean;
  placeholder?: string;
  size?: 'sm' | 'md' | 'small' | 'medium';
  disabled?: boolean;
  readOnly?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** Styles for the label/control/message stack. */
  fieldStyle?: React.CSSProperties;
  /** Styles for the grouped control shell. */
  style?: React.CSSProperties;
}

/** Text input with visually connected prefix and suffix addons. */
export function InputGroup(props: InputGroupProps): React.JSX.Element;
