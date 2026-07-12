import * as React from 'react';

export type ComboboxOption = string | { value: string; label: React.ReactNode; disabled?: boolean };

export interface ComboboxProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'defaultValue' | 'onChange' | 'size' | 'style' | 'value'
> {
  options: ComboboxOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  label?: React.ReactNode;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  status?: 'normal' | 'positive' | 'negative';
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  /** @default "md" */
  size?: 'sm' | 'md' | 'small' | 'medium';
  style?: React.CSSProperties;
  fieldStyle?: React.CSSProperties;
}

/** 검색이 필요 없는 소규모 목록용 호환 다중 선택 combobox. */
export function Combobox(props: ComboboxProps): React.JSX.Element;
